/**
 * Cloud-based GCS media streaming helper.
 * 
 * Flow:
 * Since Groq Whisper and Gemini handle direct video streams flawlessly,
 * we cleanly return the direct GCS signed URL of the uploaded video object.
 * This completely avoids heavy local compute and AWS S3/Lambda dependencies.
 */

import { createReadUrl } from '@/lib/gcs/mediaStorage';

type AudioExtractionResult = {
  audioUrl: string;
  audioFileName: string;
  audioKey?: string;
  durationSeconds?: number;
  error?: string;
};

/**
 * Streams media from a video on GCS for transcription.
 * Bypasses AWS Lambda by cleanly returning the GCS signed read URL of the video file.
 * Groq Whisper and Gemini transcribe from MP4/WebM directly (under 25MB).
 */
export async function extractAudioFromGcsVideo(
  mediaKey: string,
  fileName: string,
): Promise<AudioExtractionResult> {
  try {
    console.log('[AUDIO_EXTRACT_GCS] Generating direct GCS signed stream URL for:', mediaKey);
    // Generate signed GET URL for GCS object
    const audioUrl = await createReadUrl(mediaKey);

    return {
      audioUrl,
      audioFileName: fileName,
      audioKey: mediaKey,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[AUDIO_EXTRACT_GCS] Failed to get stream URL:', msg);
    return { audioUrl: '', audioFileName: '', error: msg };
  }
}
