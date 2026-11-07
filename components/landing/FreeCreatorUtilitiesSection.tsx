'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileAudio,
  Subtitles,
  Volume2,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export function FreeCreatorUtilitiesSection() {
  const tools = [
    {
      title: 'Free WAV to MP3 Converter',
      description: 'Convert heavy WAV audio files to high-quality 320kbps MP3s directly in your browser. Fast, private, and 100% free.',
      badge: 'NO LOGIN REQUIRED',
      href: '/wav-to-mp3',
      Icon: FileAudio,
      color: 'from-orange-500 to-amber-600',
    },
    {
      title: 'YouTube Subtitle Generator',
      description: 'Burn clear, readable timed captions into your 16:9 YouTube videos automatically with Groq Whisper AI precision.',
      badge: '16:9 WIDESCREEN',
      href: '/video-types/youtube-subtitle-generator',
      Icon: Subtitles,
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'AI Studio Audio Cleaner',
      description: 'Clean background noise, trim quiet pauses, and remove retake mistakes from your spoken audio recordings.',
      badge: 'AUDIO UTILITY',
      href: '/dashboard/audio-cleaner',
      Icon: Volume2,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Image to Video AI Generator',
      description: 'Transform static photo scenes and story images into 16:9 widescreen animated videos with voiceover sync.',
      badge: '16:9 ANIMATED',
      href: '/tools/image-to-video-ai',
      Icon: ImageIcon,
      color: 'from-sky-500 to-indigo-600',
    },
  ];

  return (
    <section className="relative border-t border-slate-100 bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl font-sans">
            Free Audio &amp; Video{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              Tools for Creators
            </span>
          </h2>
          <p className="mt-3 text-base font-medium text-zinc-600">
            Need to convert audio, clean background noise, or generate YouTube subtitles? Use our quick creator utilities anytime.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.Icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-400 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.1)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-md shadow-zinc-950/10 group-hover:scale-105 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-zinc-700">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-zinc-950 group-hover:text-orange-600 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-600">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-zinc-950 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-200">
                  <span>Try Free Tool</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* See All Tools Link */}
        <div className="mt-10 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-zinc-950 transition"
          >
            <span>View All Creator Tools</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
