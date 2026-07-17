'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

const CLOUD = 'dhouh9idx';
const BASE = `https://res.cloudinary.com/${CLOUD}/video/upload`;

const SECTIONS: Array<{
  title: string;
  description: string;
  outcome: string;
  accent: string;
  href: string;
  videos: string[];
  labels?: string[];
}> = [
  {
    title: 'Auto Captions',
    description: 'Add clean, animated captions to any talking video. Words pop on screen in perfect sync with speech.',
    outcome: 'Ready-to-post 9:16 reel with captions',
    accent: '#22D3EE',
    href: '/video-types/auto-caption-reel',
    videos: [
      'You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu',
      'content-creator-after',
      'professional-creator-after',
      'OpenAl_just_dropped_GPT_5.6_with_three_models_Sol_Terra_and_Luna._Sol_outperforms_Mythos_5_on_vyzfy8',
    ],
  },
  {
    title: 'Typography Video',
    description: 'Turn a talking video into a bold creator reel with dynamic typography. Key phrases appear the moment you say them.',
    outcome: 'Creator-style typography reel',
    accent: '#8B5CF6',
    href: '/video-types/typography-video',
    videos: [
      'Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb',
      'The_different_between_dreaming_and_building_ain_t_talent._It_s_taking-_action_consistency_and_uk6mov',
      'Slow_down_to_be_taken_seriously.When_you_rush_people_struggle_to_keep_up.And_when_others_have_t_c2zbay',
      'Most_of_what_we_call_luck_is_the_visible_outcome_of_someone_staying_in_the_game_longer_than_ot_xy8vgx',
    ],
  },
  {
    title: 'Compare Explainer',
    description: 'Explain two ideas side by side with your voiceover, two images, and a sticker presenter. Great for education, finance, and product topics.',
    outcome: 'Clear side-by-side comparison reel',
    accent: '#F59E0B',
    href: '/video-types/compare-explainer',
    videos: [
      'Whats_The_Difference_Between_Coding_And_Programming._coding_programming_software_development_uf7fvf',
      'UPSC_vs_PCS_Kaun_Hai_Asli_Boss....._upsc_ssc_knowledge_exploremore_fypage_adecyc',
      'Indian_Government_Departments_Explained_in_Simple_Words....._indiafacts_education_viralree_hciuyx',
      'Fixed_account_vs_Current_account_..._instagood_fd_viral_savings_finance_egsc7j',
    ],
  },
  {
    title: 'Long Video Clips',
    description: 'Turn one long podcast, interview, or lecture into short viral clips. AI picks the best moments and adds captions automatically.',
    outcome: 'Up to 10 short clips from one long video',
    accent: '#06B6D4',
    href: '/video-types/long-video-clips',
    videos: [
      'uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/clip-01-opening-hook',
      'uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/clip-04-founder-mindset',
      'uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/clip-06-growth-strategy',
      'uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/uploads/DEMO%20VIDEOS/LONG%20VIDEO%20CLIPS/clip-09-market-timing',
    ],
    labels: ['Clip 1', 'Clip 2', 'Clip 3', 'Clip 4'],
  },
];

export default function HomepageDemoGrid() {
  // Track which video is currently unmuted (only one at a time)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const allVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  const registerVideo = useCallback((id: string, el: HTMLVideoElement | null) => {
    if (el) {
      allVideosRef.current.set(id, el);
    } else {
      allVideosRef.current.delete(id);
    }
  }, []);

  const handleVideoClick = useCallback((id: string) => {
    const clickedVideo = allVideosRef.current.get(id);
    if (!clickedVideo) return;

    if (activeVideoId === id) {
      // Already active — mute + pause it (toggle off)
      clickedVideo.muted = true;
      clickedVideo.pause();
      setActiveVideoId(null);
    } else {
      // Mute all others, unmute this one
      allVideosRef.current.forEach((video, videoId) => {
        if (videoId !== id) {
          video.muted = true;
        }
      });
      clickedVideo.muted = false;
      clickedVideo.play();
      setActiveVideoId(id);
    }
  }, [activeVideoId]);

  return (
    <section className="px-4 py-20 sm:px-6" style={{ background: '#070A12' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">See real results</p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">What creators are making right now</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">Every video below was made with Itnavideo. Tap any thumbnail to play with sound.</p>
        </div>

        <div className="space-y-16">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0 max-w-2xl">
                  <h3 className="text-xl font-black tracking-tight text-white sm:text-2xl">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{section.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: section.accent }}>
                    <span className="inline-block h-1 w-1 rounded-full" style={{ background: section.accent }} />
                    {section.outcome}
                  </p>
                </div>
                <Link
                  href={section.href}
                  className="inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap text-xs font-bold transition hover:opacity-80"
                  style={{ color: section.accent }}
                >
                  See all <ArrowRight size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {section.videos.map((id, idx) => (
                  <VideoCard
                    key={id}
                    publicId={id}
                    accent={section.accent}
                    isActive={activeVideoId === id}
                    onClickSound={() => handleVideoClick(id)}
                    registerRef={(el) => registerVideo(id, el)}
                    label={section.labels?.[idx]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({
  publicId,
  accent,
  isActive,
  onClickSound,
  registerRef,
  label,
}: {
  publicId: string;
  accent: string;
  isActive: boolean;
  onClickSound: () => void;
  registerRef: (el: HTMLVideoElement | null) => void;
  label?: string;
}) {
  return (
    <div
      className="group relative aspect-[9/16] overflow-hidden rounded-xl border bg-black shadow-lg transition hover:shadow-xl"
      style={{ borderColor: isActive ? accent : `${accent}20` }}
    >
      <video
        ref={registerRef}
        src={`${BASE}/${publicId}.mp4`}
        poster={`${BASE}/so_0/${publicId}.jpg`}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        muted
        playsInline
        loop
        preload="none"
        onClick={(e) => {
          e.preventDefault();
          const v = e.target as HTMLVideoElement;
          if (v.paused) v.play();
          onClickSound();
        }}
      />

      {/* Play icon — hidden on hover/active */}
      <div className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity ${isActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <div className="ml-0.5 h-0 w-0 border-l-[8px] border-t-[5px] border-b-[5px] border-l-white border-t-transparent border-b-transparent" />
        </div>
      </div>

      {/* Label badge (for Long Video Clips) */}
      {label && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
          <p className="text-[11px] font-bold text-white leading-tight">{label}</p>
          <p className="text-[9px] mt-0.5" style={{ color: `${accent}cc` }}>AI-picked clip</p>
        </div>
      )}

      {/* Sound indicator */}
      <div className="pointer-events-none absolute right-2 top-2">
        {isActive ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
            <Volume2 size={12} className="text-white" />
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <VolumeX size={12} className="text-white/60" />
          </div>
        )}
      </div>

      {/* Active glow border */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-inset" style={{ '--tw-ring-color': accent } as React.CSSProperties} />
      )}
    </div>
  );
}
