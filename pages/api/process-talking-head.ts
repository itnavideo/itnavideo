import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import formidable, { type Fields, type File as FormidableFile, type Files } from 'formidable';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { processShortsVideo } from '@/services/rendering/processShortsVideo';
import { upsertFfmpegJob } from '@/services/rendering/ffmpegJobStore';
import { upsertUserProjectFromServer } from '@/services/supabase/projectStore';
import { VIDEO_MODE_INSTRUCTIONS } from '@/services/ai/videoModeInstructions';

type ProcessResponse = {
  success: boolean;
  accepted?: boolean;
  jobId?: string;
  videoUrl?: string;
  duration?: number;
  error?: string;
  details?: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 300,
};

const workspaceRoot = process.env.RENDER_WORKSPACE_DIR || path.join(os.tmpdir(), 'itnavideo-render-workspace');
const uploadDir = path.join(workspaceRoot, 'raw_assets', 'user_videos');
const outputDir = path.join(workspaceRoot, 'final_output');
const overlayDir = path.join(workspaceRoot, 'processed_assets', 'overlays');

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProcessResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let inputPath = '';
  let outputPath = '';

  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(overlayDir, { recursive: true });

    const { fields, files } = await parseForm(req);
    const video = getFirstFile(files.video);
    const userId = getField(fields.userId);
    const jobId = getField(fields.jobId) || `face_${Date.now()}`;
    const style = getField(fields.style) || 'classic';

    if (!video?.filepath) {
      return res.status(400).json({ success: false, error: 'video is required' });
    }

    if (!userId || !jobId) {
      return res.status(400).json({ success: false, error: 'userId and jobId are required' });
    }

    inputPath = video.filepath;
    outputPath = path.join(outputDir, `${safeFileName(jobId)}.mp4`);

    await updateStatus(userId, jobId, {
      status: 'processing',
      progress: 12,
      message: 'Face camera video uploaded. Using face-camera edit instructions.',
      project: {
        title: video.originalFilename || `Face video ${jobId}`,
        status: 'Processing face video',
        progress: 12,
        style: `face_${style}`,
        quality: '1080p',
        timelineScenes: 1,
        userAssets: [{
          type: 'video',
          filename: video.originalFilename || 'camera-video',
          mode: VIDEO_MODE_INSTRUCTIONS.face_camera.mode,
          instruction: VIDEO_MODE_INSTRUCTIONS.face_camera.label,
          focus: VIDEO_MODE_INSTRUCTIONS.face_camera.planningFocus,
        }],
      },
    });

    const result = await processShortsVideo(inputPath, outputPath, {
      style,
      autoJumpCuts: process.env.FACE_VIDEO_JUMP_CUTS !== '0',
      autoZoomEffects: process.env.FACE_VIDEO_ZOOM_EFFECTS !== '0',
      autoCaptionEffects: process.env.FACE_VIDEO_CAPTION_EFFECTS !== '0',
      jumpCutWorkspaceDir: workspaceRoot,
      jobId,
      timeoutMs: Number(process.env.FACE_VIDEO_RENDER_TIMEOUT_MS || 15 * 60 * 1000),
      onJumpCut: (jumpCut) => {
        const removed = Number(jumpCut.removedSeconds || 0);
        void updateStatus(userId, jobId, {
          status: 'processing',
          progress: 18,
          message: removed > 0
            ? `Jump cuts ready. Removed ${removed.toFixed(1)}s of silence/mistakes.`
            : 'Jump cut scan complete. No long silence found.',
          project: {
            status: 'Jump cuts ready',
            progress: 18,
            jumpCuts: jumpCut,
          },
        });
      },
      onProgress: ({ percent }) => {
        const progress = Math.max(18, Math.min(94, Math.round(18 + percent * 0.76)));
        void updateStatus(userId, jobId, {
          status: 'rendering',
          progress,
          message: progress > 85 ? 'Finalizing face camera edit...' : 'Adding crop, motion, audio polish, and effects...',
          project: {
            status: progress > 85 ? 'Finalizing face video' : 'Rendering face video',
            progress,
          },
        });
      },
    });

    await updateStatus(userId, jobId, {
      status: 'uploading',
      progress: 96,
      message: 'Uploading edited video...',
      project: {
        status: 'Saving final face video',
        progress: 96,
        durationSeconds: result.duration,
        zoomEvents: result.zoomEvents,
        captionEvents: result.captionEvents,
        iconEvents: result.iconEvents,
        swooshSound: Boolean(result.swooshPath),
      },
    });

    const videoUrl = await uploadToCloudinary(outputPath, jobId);

    await updateStatus(userId, jobId, {
      status: 'ready',
      progress: 100,
      message: 'Face camera video ready.',
      videoUrl,
      project: {
        status: 'Video ready',
        progress: 100,
        videoUrl,
        renderUrl: videoUrl,
        durationSeconds: result.duration,
        completedAt: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      success: true,
      accepted: false,
      jobId,
      videoUrl,
      duration: result.duration,
    });
  } catch (error: any) {
    console.error('Face camera render failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Face camera render failed',
      details: error.message || 'Unknown error',
    });
  } finally {
    cleanupFile(inputPath);
    cleanupFile(outputPath);
  }
}

function parseForm(req: NextApiRequest) {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: Number(process.env.FACE_VIDEO_MAX_FILE_SIZE || 350 * 1024 * 1024),
    multiples: false,
    filter: (part) => part.name !== 'video' || String(part.mimetype || '').startsWith('video/'),
  });

  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

async function updateStatus(
  userId: string,
  jobId: string,
  input: {
    status: 'queued' | 'uploading' | 'processing' | 'rendering' | 'ready' | 'error';
    progress: number;
    message: string;
    videoUrl?: string;
    error?: string;
    project?: Record<string, unknown>;
  },
) {
  const writes = [
    upsertFfmpegJob({
      userId,
      jobId,
      status: input.status,
      progress: input.progress,
      message: input.message,
      videoUrl: input.videoUrl,
      error: input.error,
    }),
  ];

  if (input.project) {
    writes.push(upsertUserProjectFromServer(userId, jobId, {
      ...input.project,
      ownerId: userId,
      updatedAt: new Date().toISOString(),
    }) as any);
  }

  const results = await Promise.allSettled(writes);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.warn(`Face video status write failed for ${jobId}:`, result.reason);
    }
  });
}

async function uploadToCloudinary(filePath: string, jobId: string) {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.');
  }

  const folder = process.env.CLOUDINARY_RENDERS_FOLDER || 'itnavideo/renders';
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `face_${safeFileName(jobId)}_${timestamp}`;
  const signature = signCloudinaryParams({ folder, public_id: publicId, timestamp }, config.apiSecret);

  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync(filePath)]), `${publicId}.mp4`);
  formData.append('api_key', config.apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/video/upload`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || `Cloudinary upload failed: ${response.status}`);
  }

  return result.secure_url as string;
}

function getCloudinaryConfig() {
  if (process.env.CLOUDINARY_URL) {
    const parsed = new URL(process.env.CLOUDINARY_URL);
    return {
      cloudName: parsed.hostname,
      apiKey: parsed.username,
      apiSecret: parsed.password,
    };
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return null;
  }

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return crypto.createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

function getFirstFile(file: FormidableFile | FormidableFile[] | undefined) {
  return Array.isArray(file) ? file[0] : file;
}

function getField(value: string | string[] | undefined) {
  return Array.isArray(value) ? String(value[0] || '').trim() : String(value || '').trim();
}

function cleanupFile(filePath: string) {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.warn(`Cleanup failed for ${filePath}:`, error);
  }
}

function safeFileName(value: string) {
  return String(value || 'render').replace(/[^a-z0-9_-]/gi, '_').slice(0, 120);
}
