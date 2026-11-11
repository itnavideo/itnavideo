'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import StudioHeader from "@/components/dashboard/shared/StudioHeader";
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/brand/BrandLogo';
import AiVideoGeneratorStudio from '@/components/dashboard/AiVideoGeneratorStudio';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Download,
  History,
  Clock,
  Film,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import InteractiveRenderEngine from '@/components/render/InteractiveRenderEngine';
import { isFeatureLockedForUser } from '@/lib/billing/freeTierAccess';
import { FeaturePaywall } from '@/components/dashboard/FeaturePaywall';

type BillingEntitlement = {
  active: boolean;
  planId: string;
  planName: string;
  monthlyVideoLimit: number;
  expiresAt?: string | number;
  usage?: {
    used: number;
    limit: number;
    remaining: number;
  };
};

type JobStatus = {
  state: 'idle' | 'uploading' | 'starting' | 'rendering' | 'ready' | 'error';
  message?: string;
  progress?: number;
  outputFile?: string;
  renderId?: string;
  bucketName?: string;
  title?: string;
  diagnostics?: string[];
};

type RecentRender = {
  id: string;
  title: string;
  mode: string;
  outputFile: string;
  createdAt: number;
  expiresAt: number;
};

export default function AiVideoGeneratorPageClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [jobStatus, setJobStatus] = useState<JobStatus>({ state: 'idle' });
  const [renderStartedAt, setRenderStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [recentRenders, setRecentRenders] = useState<RecentRender[]>([]);
  const [billingEntitlement, setBillingEntitlement] = useState<BillingEntitlement | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const renderRequestInFlightRef = useRef(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?returnUrl=/dashboard/ai-video-generator');
    }
  }, [user, authLoading, router]);

  // Load billing entitlement
  useEffect(() => {
    if (!user) return;
    async function fetchBilling() {
      try {
        const res = await fetch(
          `/api/billing/entitlement?userId=${encodeURIComponent(user?.id || '')}&email=${encodeURIComponent(user?.email || '')}`
        );
        const payload = await res.json().catch(() => ({}));
        if (res.ok && payload.ok && payload.entitlement) {
          const ent = payload.entitlement;
          const limit = Math.max(0, Math.round(Number(payload.usage?.limit || ent.monthlyVideoLimit || 0)));
          const used = Math.max(0, Math.round(Number(payload.usage?.used || 0)));
          const remaining = Math.max(0, Math.round(Number(payload.usage?.remaining ?? (limit - used))));
          setBillingEntitlement({
            active: Boolean(ent.active),
            planId: ent.planId || 'paid',
            planName: ent.planName || 'Creator',
            monthlyVideoLimit: limit,
            usage: { used, limit, remaining },
          });
        }
      } catch (err) {
        console.warn('Could not load billing entitlement:', err);
      }
    }
    fetchBilling();
  }, [user]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('itnavideo_aivideo_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentRenders(parsed);
        }
      }
    } catch {}
  }, []);

  // Timer tick during render
  useEffect(() => {
    const isActive =
      jobStatus.state === 'uploading' ||
      jobStatus.state === 'starting' ||
      jobStatus.state === 'rendering';
    if (!isActive || !renderStartedAt) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - renderStartedAt) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [jobStatus.state, renderStartedAt]);

  const handleStartRender = async (payload: any) => {
    if (!user) {
      router.push('/login?returnUrl=/dashboard/ai-video-generator');
      return;
    }
    if (renderRequestInFlightRef.current) return;
    renderRequestInFlightRef.current = true;
    abortControllerRef.current = new AbortController();

    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setRenderStartedAt(Date.now());
      setElapsedSeconds(0);
      setJobStatus({
        state: 'starting',
        message: 'Submitting project to AWS Lambda 1080p cloud pipeline...',
        progress: 0.1,
      });

      const res = await fetch('/api/reels/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current?.signal,
        body: JSON.stringify({
          ...payload,
          userId: user?.id,
          userEmail: user?.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to start cloud rendering job.');
      }

      setJobStatus({
        state: 'rendering',
        message: 'Rendering 1080p frames on Remotion Cloud...',
        progress: 0.25,
        renderId: data.renderId,
        bucketName: data.bucketName,
        title: payload.topicTitle || payload.prompt || 'AI Video',
      });

      // Poll status
      pollRenderStatus(data.renderId, data.bucketName, payload.topicTitle || payload.prompt || 'AI Video');
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setJobStatus({
        state: 'error',
        message: err.message || 'Rendering failed.',
      });
    } finally {
      renderRequestInFlightRef.current = false;
    }
  };

  const pollRenderStatus = async (renderId: string, bucketName: string, title: string) => {
    const startTime = Date.now();
    const interval = setInterval(async () => {
      if (Date.now() - startTime > 10 * 60 * 1000) {
        clearInterval(interval);
        setJobStatus({
          state: 'error',
          message: 'Render timed out after 10 minutes. Please try again.',
        });
        return;
      }

      try {
        const res = await fetch(
          `/api/reels/jobs/status?renderId=${encodeURIComponent(renderId)}&bucketName=${encodeURIComponent(bucketName)}`
        );
        const data = await res.json();

        if (data.status === 'done' && data.outputUrl) {
          clearInterval(interval);
          setJobStatus({
            state: 'ready',
            progress: 1,
            outputFile: data.outputUrl,
            message: 'Your 1080p AI Video is ready!',
            title,
          });

          // Save to local history
          const newRender: RecentRender = {
            id: renderId,
            title,
            mode: 'aiVideoGenerator',
            outputFile: data.outputUrl,
            createdAt: Date.now(),
            expiresAt: Date.now() + 48 * 60 * 60 * 1000,
          };
          setRecentRenders((prev) => {
            const updated = [newRender, ...prev.filter((r) => r.id !== renderId)].slice(0, 30);
            try {
              localStorage.setItem('itnavideo_aivideo_projects', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setJobStatus({
            state: 'error',
            message: data.error || 'Cloud rendering failed. Please try again.',
          });
        } else {
          setJobStatus((prev) => ({
            ...prev,
            progress: Math.max(prev.progress || 0.25, data.progress || 0.4),
            message: data.message || 'Generating video frames in AWS cloud...',
          }));
        }
      } catch (err) {
        console.warn('Polling error:', err);
      }
    }, 4000);
  };

  const handleReset = () => {
    setJobStatus({ state: 'idle' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        <p className="text-sm font-semibold text-slate-800">Loading AI Video Generator Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white text-slate-900 flex flex-col selection:bg-orange-500/20 selection:text-orange-600 overflow-hidden font-sans">
      {/* Top Navigation Bar - Unified Full Bleed Canvas */}
      <StudioHeader
        studioName="AI Video Generator"
        aspectRatioLabel="16:9 Cinema"
        badgeLabel="Full Production"
        userRemainingCredits={billingEntitlement?.usage?.remaining ?? 0}
        isWorking={Boolean(jobStatus.state !== 'idle' && jobStatus.state !== 'ready')}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {billingEntitlement && isFeatureLockedForUser("aiVideoGenerator", billingEntitlement) ? (
          <FeaturePaywall featureName="AI Video Generator" description="Generate full 16:9 cinematic videos from audio + images. Free accounts can use Auto Captions and YouTube Subtitles — upgrade to access AI Video Generator." />
        ) : jobStatus.state !== 'idle' ? (
          <div className="max-w-4xl mx-auto py-6 px-4 overflow-y-auto w-full">
            <InteractiveRenderEngine
              mode="aiVideoGenerator"
              status={{
                state: jobStatus.state as any,
                message: jobStatus.message || 'Composing 16:9 widescreen video with multi-scene AI pacing...',
                progress: jobStatus.progress,
                outputFile: jobStatus.outputFile,
                title: jobStatus.title || 'AI Video Project',
              }}
              title={jobStatus.title || 'AI Video Project'}
              onRetry={() => setJobStatus({ state: 'idle' })}
              onReset={handleReset}
            />
          </div>
        ) : (
          <AiVideoGeneratorStudio
            onStartRender={handleStartRender}
            isRendering={jobStatus.state === 'starting' || jobStatus.state === 'rendering'}
          />
        )}
      </main>
    </div>
  );
}
