'use client';

import Image from 'next/image';
import { Sparkles, Star, CheckCircle2 } from 'lucide-react';

interface Review {
  name: string;
  role: string;
  image: string;
  quote: string;
  platform?: string;
  rating?: number;
}

const REVIEWS: Review[] = [
  {
    name: 'Liam Brooks',
    role: 'Short-Form Video Agency Lead · Austin, TX',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096402/ChatGPT_Image_Aug_30_2026_06_52_06_PM_sbypby.png',
    quote: 'It reduces hours of editing down to seconds. No complex keyframing headache — just instant, viral-ready video outputs for our client roster across the US.',
    platform: 'Agency Lead',
    rating: 5,
  },
  {
    name: 'Emma Harrison',
    role: 'Podcast Producer & Content Strategist · London, UK',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096402/ChatGPT_Image_Aug_30_2026_06_51_59_PM_g9m2yn.png',
    quote: 'The Long Video Clips and Kinetic Typography templates save our team 10+ hours every week. Viewer retention and completion rates across Reels and Shorts have doubled!',
    platform: 'Podcast Studio',
    rating: 5,
  },
  {
    name: 'Marcus Vance',
    role: 'Tech Creator & Course Instructor · Toronto, Canada',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096401/ChatGPT_Image_Aug_30_2026_06_54_21_PM_jn8q5c.png',
    quote: 'I produce weekly coding breakdowns and explainer reels. Itnavideo handles speech sync and animated caption styling flawlessly — I just record, render, and publish.',
    platform: 'YouTube 120k+',
    rating: 5,
  },
  {
    name: 'Chloe Campbell',
    role: 'DTC Brand Founder · Vancouver, Canada',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096400/ChatGPT_Image_Aug_30_2026_06_55_28_PM_b5rhkh.png',
    quote: 'We don’t have a full in-house editing department, but Itnavideo makes our product reels look like they were produced by a top-tier creative studio in New York or London.',
    platform: 'DTC Brand',
    rating: 5,
  },
  {
    name: 'Alex Rivera',
    role: 'Commercial Video Director · Miami, FL',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096402/ChatGPT_Image_Aug_30_2026_06_52_06_PM_sbypby.png',
    quote: 'The auto scene cuts and animated subtitle pacing feel hand-edited. It renders 1080p full HD without lag. It has become our primary daily publishing tool.',
    platform: 'Creative Director',
    rating: 5,
  },
  {
    name: 'Sophia Chen',
    role: 'EdTech Educator & YouTuber · San Francisco, CA',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096402/ChatGPT_Image_Aug_30_2026_06_51_59_PM_g9m2yn.png',
    quote: 'The Compare Explainer and Whiteboard workflows make complex topics so visually engaging. My watch-time has grown over 40% in just two months.',
    platform: 'Course Creator',
    rating: 5,
  },
  {
    name: 'David Miller',
    role: 'SaaS Growth & Video Marketing · Chicago, IL',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096401/ChatGPT_Image_Aug_30_2026_06_54_21_PM_jn8q5c.png',
    quote: 'We turn our CEO webinars into 15 high-converting Reels in 5 minutes. The return on investment with Itnavideo is practically unmatched.',
    platform: 'Growth Lead',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Lifestyle & Tech Creator · London, UK',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096400/ChatGPT_Image_Aug_30_2026_06_55_28_PM_b5rhkh.png',
    quote: 'The Hinglish transcription accuracy with Groq Whisper is phenomenal. No manual subtitle fixing needed — it catches slang and accents effortlessly.',
    platform: 'Instagram 280k+',
    rating: 5,
  },
];

export default function TestimonialSection() {
  // Seamless loop with two duplicate sets
  const marqueeItems = [...REVIEWS, ...REVIEWS];

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 bg-[#050407] border-t border-white/10 text-white">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_700px_at_50%_0px,rgba(249,115,22,0.06),transparent_100%)]" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header — Material Design 3 Typography & Badge */}
        <div className="mb-12 sm:mb-16 text-center space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-400 backdrop-blur-md">
            <Sparkles size={13} className="text-orange-400 animate-pulse" />
            <span>Trusted By Creators Worldwide</span>
          </div>

          <h2 className="text-3xl font-black text-white sm:text-5xl font-sans tracking-tight">
            Real creators.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Real results.
            </span>
          </h2>

          <p className="mx-auto max-w-xl text-xs sm:text-sm text-zinc-400 font-normal">
            See how short-form creators, podcasters, and brand founders scale their video production effortlessly with Itnavideo.
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Marquee Container with Left & Right Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Left Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-[#050407] via-[#050407]/80 to-transparent z-20" />

        {/* Right Gradient Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-[#050407] via-[#050407]/80 to-transparent z-20" />

        {/* Marquee Track */}
        <div className="animate-m3-marquee flex gap-5 sm:gap-6 py-2 px-4 cursor-grab active:cursor-grabbing">
          {marqueeItems.map((review, idx) => (
            <div
              key={`${review.name}-${idx}`}
              className="group relative flex flex-col justify-between w-[310px] sm:w-[390px] shrink-0 rounded-3xl border border-white/10 bg-[#131218] p-6 sm:p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 hover:shadow-2xl hover:-translate-y-1 select-none"
            >
              {/* Top Accent Gradient Bar on Hover */}
              <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/80 transition-all duration-500 rounded-full" />

              {/* Decorative quotation indicator */}
              <div className="absolute top-4 right-5 text-4xl font-serif text-orange-500/10 leading-none select-none group-hover:text-orange-500/25 transition duration-300">
                “
              </div>

              {/* Creator Info & Avatar */}
              <div>
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 group-hover:border-orange-500/40 transition duration-300 shadow-xs">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                        {review.name}
                      </p>
                      <CheckCircle2 size={13} className="text-orange-400 shrink-0" />
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">
                      {review.role}
                    </p>
                  </div>
                </div>

                {/* Rating Stars & Platform Pill */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-orange-400 text-orange-400" />
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-white">5.0</span>
                  </div>

                  {review.platform && (
                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300">
                      {review.platform}
                    </span>
                  )}
                </div>

                {/* Testimonial Quote */}
                <p className="mt-4 text-xs sm:text-[13px] leading-relaxed text-zinc-300 font-normal relative z-10">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Verified Video Creator
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Helper Caption */}
      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-medium">
        <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span>Hover or touch cards to pause scrolling</span>
        <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40" />
      </div>
    </section>
  );
}


