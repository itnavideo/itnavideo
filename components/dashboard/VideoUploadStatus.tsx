"use client";

import React, { useEffect, useState, useRef } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
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
  // Refs ka use karenge taaki polling loop dependency array se disturb na ho
  const errorCountRef = useRef(0);
  const isFinished = useRef(false);

  useEffect(() => {
    if (!userId || !jobId) return;

    let intervalId: NodeJS.Timeout;

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
        setJob(data);
        errorCountRef.current = 0; // Reset errors on success

        if (data.status === 'ready' && data.videoUrl) {
          isFinished.current = true;
          clearInterval(intervalId);
          onReady(data.videoUrl);
        } else if (data.status === 'error') {
          isFinished.current = true;
          clearInterval(intervalId);
          onError(data.error || data.message || 'Render process failed');
        }
      } catch (error: any) {
        console.error('Polling error:', error);
        errorCountRef.current++;
        
        if (errorCountRef.current > 60) { // 60 retries approx 3 mins
          isFinished.current = true;
          clearInterval(intervalId);
          onError('Your video is taking longer than usual. Please check your videos page in a moment.');
        }
      }
    };

    // Polling interval: 3 seconds
    intervalId = setInterval(pollStatus, 3000);
    pollStatus(); // Immediate first call

    return () => clearInterval(intervalId);
    // REMOVED 'consecutiveErrors' from dependency array to prevent interval thrashing
  }, [userId, jobId, onReady, onError]);

  if (!job) {
    return (
      <WaitingForVideoCard
        title="Your video is getting ready"
        message="We are preparing captions, graphics, and the final export. This can take a little while on mobile."
        progress={18}
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
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              You can close this after it starts. We will keep checking.
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
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${job.progress}%` }} 
            transition={{ duration: 0.5 }}
            className="h-full bg-emerald-300" 
          />
        </div>
      )}
    </div>
  );
}

function WaitingForVideoCard({
  title,
  message,
  progress,
}: {
  title: string;
  message: string;
  progress: number;
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
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200/80">
        Please wait, your video is being made
      </p>
    </div>
  );
}

function getFriendlyRenderMessage(job: FfmpegJobRecord) {
  if (job.status === 'ready') return 'Your video is ready';
  if (job.status === 'error') return 'We could not finish this video';

  const raw = String(job.message || '').toLowerCase();

  if (raw.includes('accepted') || raw.includes('queued') || job.progress < 20) {
    return 'Your video is in the queue';
  }
  if (raw.includes('render') || raw.includes('ffmpeg') || job.progress >= 50) {
    return 'Your video is being exported';
  }
  if (raw.includes('timeline') || raw.includes('groq') || raw.includes('ai')) {
    return 'Adding captions and graphics';
  }

  return 'Your video is getting ready';
}
