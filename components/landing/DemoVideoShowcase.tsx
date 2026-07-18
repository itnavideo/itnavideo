'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

const CL = 'https://res.cloudinary.com/dhouh9idx/video/upload';

const DEMOS = [
  { id: 'You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu', label: 'Auto Captions', accent: '#22C55E' },
  { id: 'Whats_The_Difference_Between_Coding_And_Programming._coding_programming_software_development_uf7fvf', label: 'Compare Explainer', accent: '#F59E0B' },
  { id: 'Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb', label: 'Typography Video', accent: '#8B5CF6' },
  { id: 'UPSC_vs_PCS_Kaun_Hai_Asli_Boss....._upsc_ssc_knowledge_exploremore_fypage_adecyc', label: 'Whiteboard / Compare', accent: '#10B981' },
  { id: 'content-creator-after', label: 'Caption Studio', accent: '#A78BFA' },
  { id: 'professional-creator-after', label: 'Multi Images / Story', accent: '#F472B6' },
  { id: 'Slow_down_to_be_taken_seriously.When_you_rush_people_struggle_to_keep_up.And_when_others_have_t_c2zbay', label: 'Long Video Promo', accent: '#A3E635' },
  { id: 'Most_of_what_we_call_luck_is_the_visible_outcome_of_someone_staying_in_the_game_longer_than_ot_xy8vgx', label: 'Long Video Clips', accent: '#06B6D4' },
];

export default function DemoVideoShowcase() {
  return (
    <section className="px-4 py-20 sm:px-6" style={{ background: '#060A14' }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Real outputs from every template
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
            Tap any video to play with sound. Every video below was created with Itnavideo — no manual editing.
          </p>
        </div>

        {/* Video grid — 4 columns desktop, 2 mobile */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {DEMOS.map((demo) => (
            <DemoCard key={demo.id} {...demo} />
          ))}
        </div>

        {/* CTA link to full videos */}
        <div className="mt-10 text-center">
          <Link
            href="/video-types"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/[0.08] px-6 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-400/15 hover:gap-3"
          >
            See all templates &amp; demo videos <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DemoCard({ id, label, accent }: { id: string; label: string; accent: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      v.muted = false;
      setPlaying(true);
    } else {
      v.pause();
      v.muted = true;
      setPlaying(false);
    }
  };

  return (
    <div className="group flex flex-col">
      <div
        className="relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl border border-white/8 bg-black transition hover:border-white/20"
        onClick={toggle}
      >
        <video
          ref={ref}
          src={`${CL}/${id}.mp4`}
          poster={`${CL}/so_1/${id}.jpg`}
          muted
          playsInline
          loop
          preload="none"
          className="h-full w-full object-cover"
        />
        {/* Play/sound indicator */}
        <div className="absolute right-2 top-2">
          {playing ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
              <Volume2 size={12} className="text-white" />
            </div>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
              <VolumeX size={12} className="text-white/60" />
            </div>
          )}
        </div>
        {/* Play overlay when not playing */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/15">
              <span className="ml-0.5 border-l-[9px] border-t-[5px] border-b-[5px] border-l-white border-t-transparent border-b-transparent" />
            </div>
          </div>
        )}
      </div>
      {/* Label */}
      <p className="mt-2 text-center text-[11px] font-bold" style={{ color: accent }}>
        {label}
      </p>
    </div>
  );
}
