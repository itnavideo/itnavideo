'use client';

import React from 'react';
import { getOptimizedAvatarUrl } from '@/lib/utils';
import Link from 'next/link';
import { Sparkles, Star, CheckCircle2, ArrowRight } from 'lucide-react';

interface CreatorReview {
  id: string;
  name: string;
  handle: string;
  channelType: string;
  avatarUrl: string;
  avatarInitials: string;
  avatarBg: string;
  quote: string;
  highlightTag: string;
}

const CREATOR_REVIEWS: CreatorReview[] = [
  {
    id: '1',
    name: 'Alex Miller',
    handle: '@alexmiller',
    channelType: 'YouTube Explainer • 180k subs, USA',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018755/USA_Male_YouTube_Creator_axj5rd.jpg',
    avatarInitials: 'AM',
    avatarBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
    quote:
      'I record a 3-minute voiceover on my phone, upload it, and get a complete 16:9 YouTube explainer with relevant B-roll and kinetic subtitles. My production time dropped from 6 hours to 4 minutes.',
    highlightTag: '16:9 Faceless Video',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    handle: '@sarahclips',
    channelType: 'Short-Form Video Agency Lead, UK',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018755/UK_Female_Video_Agency_Owner_adhqor.jpg',
    avatarInitials: 'SJ',
    avatarBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    quote:
      'The cloud render speed is unbelievable. Zero laptop freezing, no overheating fans. We process 30+ client reels every single day entirely on AWS Lambda without a single hiccup.',
    highlightTag: 'Zero Laptop Lag',
  },
  {
    id: '3',
    name: 'Layla Al-Mansoor',
    handle: '@laylacreates',
    channelType: 'Lifestyle & Tech Creator, Riyadh',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/Saudi_Arabia_Female_Content_Creator_wycpcd.jpg',
    avatarInitials: 'LA',
    avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    quote:
      'The subtitle transcription accuracy is phenomenal. It handles spoken expressions, slang, and bilingual speech effortlessly without awkward translations or manual fixes.',
    highlightTag: 'Global Dialects & Accents',
  },
  {
    id: '4',
    name: 'Tariq Al-Hashimi',
    handle: '@tariqdigital',
    channelType: 'Digital Entrepreneur & Podcaster, Dubai',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/Dubai_Male_Digital_Entrepreneur_zqsgit.jpg',
    avatarInitials: 'TA',
    avatarBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
    quote:
      'The AI Studio Audio Cleaner is pure magic. It stripped out all the echo from my office and normalized the loudness in seconds. Sounds like a $2,000 studio booth.',
    highlightTag: 'Studio Audio Cleaner',
  },
  {
    id: '5',
    name: 'Dr. Emily Watson',
    handle: '@emilywatson',
    channelType: 'Tech Educator & Shorts Creator, USA',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/USA_Female_Technology_Educator_rxlo0i.jpg',
    avatarInitials: 'EW',
    avatarBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    quote:
      'The Long Video to Shorts tool extracted 5 high-hook vertical clips from our 45-minute workshop. One clip already crossed 350k views on Instagram Reels.',
    highlightTag: 'Viral Hook Clips',
  },
  {
    id: '6',
    name: 'Lukas Weber',
    handle: '@lukasfinance',
    channelType: 'Finance & Investing Creator, Germany',
    avatarUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1793018756/Germany_Male_Finance_Creator_ey7wnb.jpg',
    avatarInitials: 'LW',
    avatarBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    quote:
      'The credit model is completely honest. 1 minute equals 1 credit. No hidden fees, no complicated compute math. It is refreshing to use an AI tool with zero tricks.',
    highlightTag: 'Transparent Pricing',
  },
];

export default function TestimonialSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFFBF9] to-white pt-14 pb-12 sm:pt-16 sm:pb-16 px-4 sm:px-6 lg:px-8 border-t border-stone-200/80">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SOFT AMBIENT MESH AURA (LIINKS-STYLE LIVING HALO)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[950px] max-w-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(255, 138, 101, 0.14) 0%, rgba(255, 183, 77, 0.08) 45%, rgba(168, 85, 247, 0.04) 70%, transparent 85%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-[420px] w-[500px] rounded-full opacity-45 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255, 112, 67, 0.10) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-1/4 h-[420px] w-[500px] rounded-full opacity-45 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 shadow-xs">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>Built for Creators • Loved by Channels</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-sans">
            Created in minutes,{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
              loved for years
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-medium">
            Real video creators, podcasters, and YouTube channels scaling their content effortlessly without timeline fatigue or hardware freezes.
          </p>
        </div>

        {/* 6-Card Review Grid (Liinks-style floating cards on light halo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CREATOR_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-orange-500/40 hover:shadow-[0_20px_35px_-10px_rgba(255,87,34,0.12)] hover:-translate-y-1.5 transition-all duration-300 select-none"
            >
              <div>
                {/* 5 Glowing Gold Stars & Feature Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-800 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                    {review.highlightTag}
                  </span>
                </div>

                {/* Punchy Review Quote */}
                <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-slate-700 group-hover:text-slate-900 transition-colors">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Creator Attribution with Real Avatar Image */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-orange-300/60 shadow-xs ring-2 ring-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedAvatarUrl(review.avatarUrl, 96)}
                    alt={review.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    width={44}
                    height={44}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900 truncate">{review.name}</p>
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{review.channelType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Summary & Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 rounded-2xl bg-stone-50 border border-stone-200/80 px-6 py-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {CREATOR_REVIEWS.slice(0, 4).map((review) => (
                  <div
                    key={review.id}
                    className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden shadow-2xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={review.avatarUrl}
                      alt={review.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Over 5,000+ creators creating weekly
              </span>
            </div>

            <span className="hidden sm:inline text-stone-300">•</span>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <span>Join them on Itnavideo</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
