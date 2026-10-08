'use client';

import React from 'react';
import {
  ChevronRight,
  Sparkles,
  Upload,
  Wand2,
  Palette,
  Eye,
  Download,
  Zap,
  Sliders,
  CheckCircle2,
  FileVideo,
  Layers,
  LucideIcon
} from 'lucide-react';

export interface WorkflowStep {
  number: number;
  label: string;
  accentText?: string;
  badge?: string;
  icon?: LucideIcon;
}

interface StudioWorkflowRoadmapProps {
  mode?: string;
  customSteps?: WorkflowStep[];
  className?: string;
}

// ── COLOR & ICON PALETTES FOR EACH STEP ─────────────────────────────────────
const STEP_THEMES = [
  {
    badgeBg: 'bg-gradient-to-br from-[#FF6D00] to-[#FF8F00]',
    badgeText: 'text-black',
    cardBg: 'bg-[#151E30] hover:bg-[#1C2840]',
    border: 'border-white/10 hover:border-[#FF6D00]/40',
    label: 'text-white',
    accentText: 'text-[#FFA726]',
    shadow: 'shadow-sm shadow-black/40 hover:shadow-md hover:shadow-[#FF6D00]/10',
    iconBg: 'bg-[#FF6D00]/15 text-[#FFA726]',
    icon: Upload,
  },
  {
    badgeBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    badgeText: 'text-white',
    cardBg: 'bg-[#151E30] hover:bg-[#1C2840]',
    border: 'border-white/10 hover:border-purple-500/40',
    label: 'text-white',
    accentText: 'text-purple-400',
    shadow: 'shadow-sm shadow-black/40 hover:shadow-md hover:shadow-purple-500/10',
    iconBg: 'bg-purple-500/15 text-purple-400',
    icon: Wand2,
  },
  {
    badgeBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    badgeText: 'text-black',
    cardBg: 'bg-[#151E30] hover:bg-[#1C2840]',
    border: 'border-white/10 hover:border-emerald-500/40',
    label: 'text-white',
    accentText: 'text-emerald-400',
    shadow: 'shadow-sm shadow-black/40 hover:shadow-md hover:shadow-emerald-500/10',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    icon: Palette,
  },
  {
    badgeBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    badgeText: 'text-black',
    cardBg: 'bg-[#151E30] hover:bg-[#1C2840]',
    border: 'border-white/10 hover:border-amber-500/40',
    label: 'text-white',
    accentText: 'text-amber-400',
    shadow: 'shadow-sm shadow-black/40 hover:shadow-md hover:shadow-amber-500/10',
    iconBg: 'bg-amber-500/15 text-amber-400',
    icon: Eye,
  },
  {
    badgeBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    badgeText: 'text-white',
    cardBg: 'bg-[#151E30] hover:bg-[#1C2840]',
    border: 'border-white/10 hover:border-rose-500/40',
    label: 'text-white',
    accentText: 'text-rose-400',
    shadow: 'shadow-sm shadow-black/40 hover:shadow-md hover:shadow-rose-500/10',
    iconBg: 'bg-rose-500/15 text-rose-400',
    icon: Download,
  },
];

// ── MODE-SPECIFIC WORKFLOW ROADMAP DEFINITIONS ─────────────────────────────
function getWorkflowStepsForMode(mode?: string): WorkflowStep[] {
  switch (mode) {
    case 'autoCaption':
    case 'AUTO_CAPTION_GENERATOR':
    case 'AUTO_CAPTION_REEL':
      return [
        { number: 1, label: 'Upload Media', accentText: 'Shorts / Reels', icon: Upload },
        { number: 2, label: 'Speech-to-Text', accentText: 'Word-Accurate', icon: Wand2 },
        { number: 3, label: 'Style Captions', accentText: 'Kinetic Highlights', icon: Palette },
        { number: 4, label: 'Review & Edit', accentText: 'Live Preview', icon: Eye },
      ];

    case 'imageToVideoAi':
    case 'IMAGE_TO_VIDEO_AI':
      return [
        { number: 1, label: 'Your Audio', accentText: 'Voiceover / Narration', icon: Upload },
        { number: 2, label: 'Visual Style & Source', accentText: '2D/3D & Custom', icon: Wand2 },
        { number: 3, label: 'Captions & Music', accentText: 'Subtitles & BGM', icon: Palette },
        { number: 4, label: '1080p Cinema Render', accentText: '16:9 Full HD MP4', icon: Download },
      ];

    case 'youtubeSubtitles':
    case 'YOUTUBE_SUBTITLES':
      return [
        { number: 1, label: 'Upload Widescreen', accentText: 'YouTube / Cinema', icon: Upload },
        { number: 2, label: 'Speech Alignment', accentText: 'Auto Timestamps', icon: Wand2 },
        { number: 3, label: 'Choose Preset', accentText: 'Clean Lower-Third', icon: Sliders },
        { number: 4, label: 'Export 1080p', accentText: 'Full HD Ready', icon: Download },
      ];

    case 'facelessVideo':
    case 'FACELESS_VIDEO':
      return [
        { number: 1, label: 'Your Narration', accentText: 'Script / Audio', icon: Upload },
        { number: 2, label: 'Visual Style & Pacing', accentText: '2D/3D & Pacing', icon: Wand2 },
        { number: 3, label: 'Widescreen Captions', accentText: 'Kinetic Subtitles', icon: Palette },
        { number: 4, label: 'Audio Score & SFX', accentText: 'BGM & Timed SFX', icon: Download },
      ];

    case 'compare':
    case 'COMPARE_EXPLAINER':
      return [
        { number: 1, label: 'Upload Files', accentText: 'Voiceover + 2 Images', icon: Upload },
        { number: 2, label: 'Align Comparison', accentText: 'Speech Synced', icon: Wand2 },
        { number: 3, label: 'Motion Captions', accentText: 'Kinetic Highlights', icon: Palette },
        { number: 4, label: 'Export Comparison', accentText: '1080p MP4', icon: Download },
      ];

    case 'typographyVideo':
    case 'TYPOGRAPHY_VIDEO':
      return [
        { number: 1, label: 'Upload Voiceover', accentText: 'Explainer Speech', icon: Upload },
        { number: 2, label: 'Speech Cadence', accentText: 'Rhythm Sync', icon: Wand2 },
        { number: 3, label: 'Kinetic Motion FX', accentText: 'Camera Pulses', icon: Zap },
        { number: 4, label: 'Render Reel', accentText: '1080p MP4', icon: Download },
      ];

    case 'whiteboard':
    case 'whiteboardVideo':
    case 'WHITEBOARD_VIDEO':
      return [
        { number: 1, label: 'Upload Voiceover', accentText: 'Explainer Voice', icon: Upload },
        { number: 2, label: 'AI Story Director', accentText: 'Board Layout', icon: Wand2 },
        { number: 3, label: 'Sketch Illustrations', accentText: 'Vector Drawings', icon: Palette },
        { number: 4, label: 'Review & Render', accentText: '1080p Whiteboard', icon: Download },
      ];

    case 'longVideoPromo':
    case 'LONG_VIDEO_PROMO':
      return [
        { number: 1, label: 'Upload Teaser Clip', accentText: 'Video Teaser', icon: Upload },
        { number: 2, label: 'Upload Thumbnail', accentText: 'Visual Topper', icon: FileVideo },
        { number: 3, label: 'Set Prompts', accentText: 'Viral Callouts', icon: Sliders },
        { number: 4, label: 'Render Teaser', accentText: '1080p Promo', icon: Download },
      ];

    case 'longVideoClips':
    case 'LONG_VIDEO_CLIPS':
      return [
        { number: 1, label: 'Upload Source', accentText: 'Up to 3 Hours', icon: Upload },
        { number: 2, label: 'AI Hook Detector', accentText: 'Retention Scoring', icon: Wand2 },
        { number: 3, label: 'Select Shorts', accentText: '30s–60s Clips', icon: Eye },
        { number: 4, label: 'Export Shorts', accentText: '1080p MP4s', icon: Download },
      ];

    case 'audioClean':
    case 'AI_AUDIO_CLEANER':
      return [
        { number: 1, label: 'Upload Speech', accentText: 'Voiceover / Video', icon: Upload },
        { number: 2, label: 'Transcribe & Scan', accentText: 'Word Timestamps', icon: Wand2 },
        { number: 3, label: 'Smart Pause Cut', accentText: 'Compress Dead Air', icon: Sliders },
        { number: 4, label: 'Download Master', accentText: 'Clean 320kbps MP3', icon: Download },
      ];

    case 'bookSummary':
    case 'BOOK_SUMMARY':
    default:
      return [
        { number: 1, label: 'Upload Audio/Script', accentText: 'Narrative Input', icon: Upload },
        { number: 2, label: 'AI Scene Structure', accentText: 'Key Concepts', icon: Wand2 },
        { number: 3, label: 'Style Typography', accentText: 'High Contrast', icon: Palette },
        { number: 4, label: 'Render Final Video', accentText: '1080p Full HD', icon: Download },
      ];
  }
}

export function StudioWorkflowRoadmap({
  mode,
  customSteps,
  className = '',
}: StudioWorkflowRoadmapProps) {
  const steps = customSteps || getWorkflowStepsForMode(mode);

  return (
    <div
      className={`relative w-full rounded-2xl border border-white/10 bg-[#0E1526]/95 p-3.5 sm:p-4 text-white shadow-xl shadow-black/40 backdrop-blur-xl overflow-hidden select-none transition-all duration-300 ${className}`}
    >
      {/* Subtle top animated color bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6D00] via-purple-500 via-emerald-500 via-amber-500 to-rose-500 animate-pulse" />

      {/* Top Header Section */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6D00]/15 text-[#FFA726] border border-[#FF6D00]/30 shadow-xs">
            <Sparkles size={13} className="animate-spin" style={{ animationDuration: '8s' }} />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
            Process Roadmap
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#151E30] border border-white/10 text-[10px] font-extrabold text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{steps.length} Simple Steps</span>
        </div>
      </div>

      {/* Responsive Steps Grid Container — Fits 100% without horizontal cut-off */}
      <div
        className={`grid gap-2 sm:gap-2.5 w-full ${
          steps.length === 5
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {steps.map((s, idx) => {
          const theme = STEP_THEMES[idx % STEP_THEMES.length];
          const StepIcon = s.icon || theme.icon || CheckCircle2;
          const isLast = idx === steps.length - 1;

          return (
            <div
              key={s.number}
              className={`group relative flex items-center gap-2.5 w-full ${theme.cardBg} ${theme.border} ${theme.shadow} border rounded-xl p-2.5 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 min-w-0`}
            >
              {/* Clean Number Badge */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${theme.badgeBg} ${theme.badgeText} text-xs font-black shadow-md shadow-black/30 transition-transform duration-300 group-hover:scale-105`}
              >
                {s.number}
              </div>

              {/* Step Text, Icon & Handwritten Accent */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <StepIcon size={12} className={`${theme.accentText} shrink-0`} />
                  <span className="text-[11.5px] sm:text-xs font-black text-white tracking-tight leading-none group-hover:text-[#FFA726] transition-colors truncate">
                    {s.label}
                  </span>
                </div>
                {s.accentText && (
                  <span
                    className={`text-[12px] sm:text-[13px] ${theme.accentText} leading-tight font-bold mt-1 tracking-wide truncate`}
                    style={{ fontFamily: 'var(--font-caveat), Caveat, cursive, sans-serif' }}
                  >
                    {s.accentText}
                  </span>
                )}
              </div>

              {/* Subtle Directional Chevron on larger screens */}
              {!isLast && (
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-10 hidden xl:flex h-4 w-4 items-center justify-center rounded-full bg-[#0E1526] border border-white/10 text-slate-400 text-[10px] pointer-events-none">
                  ›
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
