'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InteractiveRenderEngine, { type JobStatus } from '@/components/render/InteractiveRenderEngine';

type PreviewPreset = 'ingesting' | 'composing' | 'finishing' | 'ready169' | 'ready916' | 'error';

const PRESET_MAP: Record<PreviewPreset, { mode: string; status: JobStatus; title: string }> = {
  ingesting: {
    mode: 'facelessVideo',
    title: 'How Top Creators Scale Faceless Channels',
    status: {
      state: 'uploading',
      progress: 18,
      message: 'Analyzing narration & building visual scenes...',
      estimatedSeconds: 240,
    },
  },
  composing: {
    mode: 'facelessVideo',
    title: 'How Top Creators Scale Faceless Channels',
    status: {
      state: 'rendering',
      progress: 58,
      message: 'Composing motion graphics & kinetic typography...',
      estimatedSeconds: 240,
    },
  },
  finishing: {
    mode: 'facelessVideo',
    title: 'How Top Creators Scale Faceless Channels',
    status: {
      state: 'rendering',
      progress: 88,
      message: 'Finalizing your video export...',
      estimatedSeconds: 180,
    },
  },
  ready169: {
    mode: 'facelessVideo',
    title: 'How Top Creators Scale Faceless Channels',
    status: {
      state: 'ready',
      progress: 100,
      outputFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      jobId: 'preview-169',
    },
  },
  ready916: {
    mode: 'facelessShorts',
    title: '3 Habits That Double Focus',
    status: {
      state: 'ready',
      progress: 100,
      outputFile: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      jobId: 'preview-916',
    },
  },
  error: {
    mode: 'facelessVideo',
    title: 'How Top Creators Scale Faceless Channels',
    status: {
      state: 'error',
      error: 'Connection to the render worker was interrupted. Your project and credits are safe.',
    },
  },
};

export default function RenderPreviewPage() {
  const [preset, setPreset] = useState<PreviewPreset>('ingesting');
  const active = PRESET_MAP[preset];

  return (
    <div className="min-h-screen bg-[#07080C] text-white px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Preview Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/90 border border-white/10">
            {(
              [
                ['ingesting', 'Stage 1 (18%)'],
                ['composing', 'Stage 2 (58%)'],
                ['finishing', 'Stage 3 (88%)'],
                ['ready169', 'Ready (16:9)'],
                ['ready916', 'Ready (9:16)'],
                ['error', 'Interrupted'],
              ] as [PreviewPreset, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  preset === key
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Render Engine */}
        <InteractiveRenderEngine
          mode={active.mode}
          status={active.status}
          title={active.title}
          onRetry={() => setPreset('ingesting')}
          onReset={() => setPreset('ingesting')}
          onCancel={() => setPreset('error')}
        />
      </div>
    </div>
  );
}

