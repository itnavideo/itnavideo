"use client";

import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, CheckCircle2, Download, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FfmpegJobRecord } from '@/services/rendering/ffmpegJobStore';

interface VideoUploadStatusProps {
  userId: string;
  jobId: string;
  onReady: (videoUrl: string) => void;
  onError: (message: string) => void;
}

export default function VideoUploadStatus({
  userId,
  jobId,
  onReady,
  onError,
}: VideoUploadStatusProps) {
  const [job, setJob] = useState<FfmpegJobRecord | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
const [liveMode, setLiveMode] = useState<'connecting' | 'live' | 'polling'>('connecting');
  // Refs ka use karenge taaki polling loop dependency array se disturb na ho
  const errorCountRef = useRef(0);
  const isFinished = useRef(false);
  const streamFailedRef = useRef(false);

  useEffect(() => {
    if (!userId || !jobId) return;

    isFinished.current = false;
    streamFailedRef.current = false;
    setLiveMode('connecting');

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let eventSource: EventSource | null = null;

    const handleJobUpdate = (data: FfmpegJobRecord) => {
      setJob(data);
      errorCountRef.current = 0;

      if (data.status === 'ready' && data.videoUrl) {
        isFinished.current = true;
        setFinalVideoUrl(data.videoUrl);
        if (intervalId) clearInterval(intervalId);
        eventSource?.close();
        onReady(data.videoUrl);
      } else if (data.status === 'error') {
        isFinished.current = true;
        if (intervalId) clearInterval(intervalId);
        eventSource?.close();
        onError(data.error || data.message || 'Render process failed');
      }
    };

    const pollStatus = async () => {
      // Agar video pehle hi ready ya error ho chuki hai, toh request na karein
      if (isFinished.current) return;

      try {
        const response = await fetch(`/api/ffmpeg/status?userId=${userId}&jobId=${jobId}`);
        
        if (!response.ok) {
          if (response.status === 404 && errorCountRef.current < 20) {
            errorCountRef.current++;
            return;
          }
          throw new Error(`Server error: ${response.status}`);
        }

        const data: FfmpegJobRecord = await response.json();
        handleJobUpdate(data);
      } catch (error: any) {
        console.error('Polling error:', error);
        errorCountRef.current++;
        
        if (errorCountRef.current > 100) { // Approx 5 mins limit
          isFinished.current = true;
          if (intervalId) clearInterval(intervalId);
          onError('Your video is taking longer than usual. Please check your videos page in a moment.');
        }
      }
    };

    const startPolling = () => {
      if (intervalId || isFinished.current) return;
      setLiveMode('polling');
      intervalId = setInterval(pollStatus, 3000);
      void pollStatus();
    };

    if ('EventSource' in window) {
      eventSource = new EventSource(`/api/ffmpeg/status/stream?userId=${encodeURIComponent(userId)}&jobId=${encodeURIComponent(jobId)}`);
      eventSource.addEventListener('open', () => setLiveMode('live'));
      eventSource.addEventListener('status', (event) => {
        setLiveMode('live');
        const data = JSON.parse((event as MessageEvent).data);
        if (data.status !== 'not_found') handleJobUpdate(data);
      });
      eventSource.addEventListener('error', () => {
        if (streamFailedRef.current) return;
        streamFailedRef.current = true;
        eventSource?.close();
        startPolling();
      });
    } else {
      startPolling();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      eventSource?.close();
    };
    // REMOVED 'consecutiveErrors' from dependency array to prevent interval thrashing
  }, [userId, jobId, onReady, onError]);

  if (!job) {
    return (
      <WaitingForVideoCard
        title="Your video is getting ready"
        message="We are preparing captions, graphics, and the final export. This can take a little while on mobile."
        progress={18}
        imageSrc={getWaitStateImage(jobId)}
      />
    );
  }

  const isError = job.status === 'error';
  const isReady = job.status === 'ready';

  return (
    <div className={`mt-4 rounded-lg border p-4 ${isError ? 'border-red-500/30 bg-red-500/5' : 'border-emerald-300/20 bg-emerald-300/5'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          {isError ? (
            <AlertCircle className="text-red-400" size={20} />
          ) : isReady ? (
            <CheckCircle2 className="text-emerald-400" size={20} />
          ) : (
            <Loader2 className="animate-spin text-emerald-300" size={20} />
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{getFriendlyRenderMessage(job)}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {getFriendlyRenderDetail(job)}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
              {liveMode === 'live' ? 'Live pulse connected' : liveMode === 'polling' ? 'Live fallback polling' : 'Connecting live pulse'}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-sm font-black ${isError ? 'text-red-300' : 'text-emerald-300'}`}>
            {job.progress}%
          </p>
        </div>
      </div>
      
      {!isReady && !isError && (
        <>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${job.progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-emerald-300"
            />
          </div>
          <WaitStateVisual imageSrc={getWaitStateImage(jobId)} />
        </>
      )}

      {isReady && finalVideoUrl && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => window.open(finalVideoUrl, '_blank', 'noopener,noreferrer')}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-emerald-200"
          >
            <ExternalLink size={16} />
            Watch video
          </button>
          <a
            href={finalVideoUrl}
            target="_blank"
            rel="noreferrer"
            download="itnavideo-render.mp4"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      )}
    </div>
  );
}

function WaitingForVideoCard({
  title,
  message,
  progress,
  imageSrc,
}: {
  title: string;
  message: string;
  progress: number;
  imageSrc: string;
}) {
  return (
    <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/[0.055] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-black/35">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
            className="absolute inset-3 rounded-full border-2 border-emerald-300/20 border-t-emerald-200"
          />
          <Sparkles className="text-emerald-200" size={26} />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-black text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{message}</p>
        </div>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: '8%' }}
          animate={{ width: `${Math.max(8, Math.min(95, progress))}%` }}
          transition={{ duration: 0.6 }}
          className="h-full rounded-full bg-emerald-300"
        />
      </div>
      <WaitStateVisual imageSrc={imageSrc} />
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200/80">
        Please wait, your video is being made
      </p>
    </div>
  );
}

function WaitStateVisual({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <div className="relative aspect-[16/9] w-full">
        <img
          src={imageSrc}
          alt="Relax while Itnavideo prepares your video"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <span className="rounded-md bg-black/55 px-3 py-2 text-xs font-black text-emerald-100 backdrop-blur">
            We are rendering your 720p MP4
          </span>
          <span className="hidden rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-100 backdrop-blur sm:inline">
            Safe to wait here
          </span>
        </div>
      </div>
    </div>
  );
}

function getWaitStateImage(seed: string) {
  const value = Array.from(seed || 'itnavideo').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return value % 2 === 0
    ? '/visuals/dashboard-wait-coffee-primary.png'
    : '/visuals/dashboard-wait-coffee-calm.png';
}

function getFriendlyRenderMessage(job: FfmpegJobRecord) {
  if (job.status === 'ready') return 'Your video is ready';
  if (job.status === 'error') return 'We could not finish this video';

  const raw = String(job.message || '').toLowerCase();

  if (raw.includes('accepted') || raw.includes('queued') || job.progress < 20) {
    return 'Your video is in the queue';
  }
  if (raw.includes('transcrib')) {
    return 'Transcribing your audio';
  }
  if (raw.includes('asset')) {
    return 'Assembling visuals and assets';
  }
  if (raw.includes('render') || raw.includes('ffmpeg') || job.progress >= 50) {
    return `Rendering video: ${job.progress}%`;
  }
  if (raw.includes('timeline') || raw.includes('groq') || raw.includes('ai')) {
    return 'Adding captions and graphics';
  }

  return 'Your video is getting ready';
}

function getFriendlyRenderDetail(job: FfmpegJobRecord) {
  if (job.status === 'ready') return 'Playable MP4 created and saved to your video library.';
  if (job.status === 'error') return job.message || 'Please retry with the same file or a shorter upload.';

  const raw = String(job.message || '').toLowerCase();

  if (raw.includes('queued') || job.progress < 20) {
    return 'Upload accepted. Waiting for a render slot.';
  }
  if (raw.includes('transcrib')) {
    return 'Speech is being converted into captions and timing.';
  }
  if (raw.includes('timeline') || raw.includes('groq') || raw.includes('ai')) {
    return 'Captions and scene timing are being prepared.';
  }
  if (raw.includes('asset')) {
    return 'Visual fallbacks and uploaded assets are being checked.';
  }
  if (raw.includes('render') || raw.includes('ffmpeg') || job.progress >= 50) {
    return 'Exporting the final 720p MP4.';
  }

  return 'You can keep this open or check Your videos in a moment.';
}
