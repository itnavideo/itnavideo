'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Captions,
  Columns,
  FileText,
  Film,
  FileImage,
  Mic,
  MonitorPlay,
  PenTool,
  Play,
  Scissors,
  Smartphone,
  Sparkles,
  Tv,
} from 'lucide-react';
import {
  HOMEPAGE_WORKFLOW_GROUPS,
  HOMEPAGE_WORKFLOWS,
  type HomepageWorkflow,
  type HomepageWorkflowCategory,
} from '@/constants/homepageWorkflows';

const WORKFLOW_ICONS = {
  'auto-caption': Captions,
  'compare-explainer': Columns,
  'whiteboard-video': PenTool,
  'typography-video': FileText,
  'long-video-promo': Tv,
  'long-video-clips': Scissors,
  'youtube-subtitles': Captions,
  'image-to-video': FileImage,
  'faceless-video': MonitorPlay,
  'audio-cleaner': Mic,
  'book-summary': Film,
} as const;

export default function WhatCanYouCreate() {
  const [activeCategory, setActiveCategory] = useState<HomepageWorkflowCategory>('shorts');

  const filteredWorkflows = HOMEPAGE_WORKFLOWS.filter((wf) => wf.category === activeCategory);
  const activeGroup = HOMEPAGE_WORKFLOW_GROUPS.find((g) => g.id === activeCategory);

  return (
    <section id="workflow" className="relative border-b border-white/10 bg-[#050505] px-4 py-16 text-zinc-100 sm:px-6 sm:py-24 overflow-hidden">
      {/* Ambient background gradients */}
      <div className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[#FF6D00]/5 blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-[#FFA726]/5 blur-[160px]" />
      
      <div id="video-types" className="relative z-10 mx-auto max-w-7xl scroll-mt-24">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#FF9100]">
            <Sparkles size={14} className="text-[#FF8F00] animate-pulse" />
            <span>11 Dedicated AI Video Studios</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl font-sans">
            Choose the studio built for{' '}
            <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
              your exact format
            </span>
          </h2>
          <p className="mx-auto text-sm leading-relaxed text-zinc-400 sm:text-base max-w-2xl font-normal">
            Every studio has its own dedicated AI pipeline, controls, and 1080p Full HD cloud rendering. Pick your format to explore the studios.
          </p>

          {/* 3-Tab Segment Filter */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full border border-white/[0.08] bg-[#0F1117] p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveCategory('shorts')}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition-all cursor-pointer ${
                  activeCategory === 'shorts'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/30 scale-[1.02]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone size={14} className={activeCategory === 'shorts' ? 'text-black' : 'text-[#FF9100]'} />
                <span>Shorts &amp; Reels (9:16)</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                  activeCategory === 'shorts' ? 'bg-black/25 text-black' : 'bg-[#151821] text-zinc-400'
                }`}>
                  5
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('youtube')}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition-all cursor-pointer ${
                  activeCategory === 'youtube'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/30 scale-[1.02]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MonitorPlay size={14} className={activeCategory === 'youtube' ? 'text-black' : 'text-[#FF9100]'} />
                <span>Widescreen (16:9)</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                  activeCategory === 'youtube' ? 'bg-black/25 text-black' : 'bg-[#151821] text-zinc-400'
                }`}>
                  5
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('audio')}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition-all cursor-pointer ${
                  activeCategory === 'audio'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-md shadow-[#FF6D00]/30 scale-[1.02]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Mic size={14} className={activeCategory === 'audio' ? 'text-black' : 'text-[#FF9100]'} />
                <span>Audio Utilities</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                  activeCategory === 'audio' ? 'bg-black/25 text-black' : 'bg-[#151821] text-zinc-400'
                }`}>
                  1
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Subtitle / Description */}
        {activeGroup && (
          <div className="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9100]">
                {activeCategory === 'shorts' ? '9:16 VERTICAL SOCIAL ENGINES' : activeCategory === 'youtube' ? '16:9 WIDESCREEN YOUTUBE ENGINES' : 'STUDIO AUDIO MASTERING'}
              </p>
              <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
                {activeGroup.label}
              </h3>
            </div>
            <p className="hidden md:block max-w-md text-xs leading-relaxed text-zinc-400 text-right">
              {activeGroup.description}
            </p>
          </div>
        )}

        {/* Consolidated Grid Render for the Selected Tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className={`grid gap-6 ${
              activeCategory === 'audio'
                ? 'grid-cols-1 max-w-2xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function WorkflowCard({ workflow }: { workflow: HomepageWorkflow }) {
  const Icon = WORKFLOW_ICONS[workflow.id as keyof typeof WORKFLOW_ICONS] || Film;
  const isShort = workflow.category === 'shorts';
  const isAudio = workflow.category === 'audio';

  return (
    <Link
      href={workflow.dashboardHref}
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0F1117] shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-[#FF6D00]/60 hover:shadow-2xl hover:shadow-[#FF6D00]/20 cursor-pointer ${
        isAudio ? 'sm:grid sm:grid-cols-[minmax(280px,0.9fr)_1.1fr]' : ''
      }`}
    >
      <WorkflowMedia workflow={workflow} isShort={isShort} isAudio={isAudio} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#FF6D00]/40 bg-gradient-to-br from-[#FF6D00]/25 via-[#FF8F00]/10 to-transparent text-[#FFA726] shadow-md shadow-[#FF6D00]/10 group-hover:border-[#FF6D00] group-hover:scale-105 transition-all">
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#FF9100]">
                {workflow.category === 'shorts' ? '9:16 Full HD' : workflow.category === 'youtube' ? '16:9 Full HD' : 'Studio Master'}
              </p>
              <h4 className="truncate text-base font-black tracking-tight text-white group-hover:text-[#FFA726] transition-colors">
                {workflow.name}
              </h4>
            </div>
          </div>
          {workflow.popular && (
            <span className="shrink-0 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-black shadow-sm">
              Popular
            </span>
          )}
        </div>

        <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-normal line-clamp-2">
          {workflow.description}
        </p>

        {/* Clean Studio Action Bar */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors">
            {workflow.limit}
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-[#FFA726] group-hover:translate-x-1 transition-transform">
            <span>Open Studio</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function WorkflowMedia({
  workflow,
  isShort,
  isAudio,
}: {
  workflow: HomepageWorkflow;
  isShort: boolean;
  isAudio: boolean;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaClass = isShort ? 'aspect-[9/11]' : 'aspect-video';

  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[#070B14] group ${mediaClass} ${isAudio ? 'sm:h-full sm:aspect-auto' : ''}`}>
      {workflow.mediaKind === 'video' && !videoFailed ? (
        <>
          <video
            src={workflow.mediaSrc}
            poster={workflow.posterSrc}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="h-full w-full object-contain"
            aria-label={`${workflow.name} output preview`}
          />
          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black shadow-xl shadow-[#FF6D00]/40 transition-transform duration-200 group-hover:scale-110">
                <Play size={20} className="fill-black ml-1" />
              </div>
            </div>
          )}
        </>
      ) : null}

      {workflow.mediaKind === 'image' && !posterFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={workflow.images && workflow.images.length > 0 ? workflow.images[0] : workflow.mediaSrc}
          alt={`${workflow.name} preview`}
          loading="lazy"
          decoding="async"
          onError={() => setPosterFailed(true)}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        />
      ) : null}

      {(workflow.mediaKind === 'image' && posterFailed) || (workflow.mediaKind === 'video' && videoFailed) ? (
        <MediaPlaceholder workflow={workflow} />
      ) : null}
    </div>
  );
}

function MediaPlaceholder({ workflow }: { workflow: HomepageWorkflow }) {
  const Icon = WORKFLOW_ICONS[workflow.id as keyof typeof WORKFLOW_ICONS] || Film;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,rgba(255,109,0,0.22),transparent_55%),#0F1117] p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6D00] to-[#FF8F00] text-black shadow-lg shadow-orange-500/20">
        <Icon size={22} />
      </span>
      <p className="max-w-[200px] text-xs font-bold text-slate-200">{workflow.shortName}</p>
    </div>
  );
}
