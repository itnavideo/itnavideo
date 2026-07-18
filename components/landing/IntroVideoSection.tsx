'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CL = 'https://res.cloudinary.com/dhouh9idx/video/upload';

const SHOWCASE = [
  { id: 'You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu', label: 'Auto Captions' },
  { id: 'Whats_The_Difference_Between_Coding_And_Programming._coding_programming_software_development_uf7fvf', label: 'Compare Explainer' },
  { id: 'Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb', label: 'Typography Video' },
  { id: 'UPSC_vs_PCS_Kaun_Hai_Asli_Boss....._upsc_ssc_knowledge_exploremore_fypage_adecyc', label: 'Compare (Hindi)' },
  { id: 'content-creator-after', label: 'Creator Reel' },
  { id: 'professional-creator-after', label: 'Caption Studio' },
  { id: 'Slow_down_to_be_taken_seriously.When_you_rush_people_struggle_to_keep_up.And_when_others_have_t_c2zbay', label: 'Long Video Clips' },
  { id: 'Most_of_what_we_call_luck_is_the_visible_outcome_of_someone_staying_in_the_game_longer_than_ot_xy8vgx', label: 'Multi Images' },
];

/**
 * Hero-style video showcase carousel.
 * Center video autoplays (muted). Side videos show static posters.
 * User can click any card to bring it to center. Auto-rotates every 3.5s.
 * Shows the breadth of Itnavideo's output within the first fold.
 */
export default function IntroVideoSection() {
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SHOWCASE.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [active]);

  const goTo = useCallback((i: number) => setActive(i), []);

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20" style={{ background: '#0B1120' }}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/[0.08] px-4 py-1.5 text-xs font-bold text-cyan-100">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
            See Itnavideo in action
          </div>
          <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            Watch how Itnavideo turns your uploads<br className="hidden sm:block" />
            <span className="text-cyan-300"> into ready-to-post videos.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
            Create reels, explainers, caption videos, and more — all from one upload.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mx-auto" style={{ height: 420, maxWidth: 900 }}>
          {SHOWCASE.map((item, i) => {
            const isCenter = i === active;
            const offset = i - active;
            const adjusted = offset > 2 ? offset - SHOWCASE.length : offset < -2 ? offset + SHOWCASE.length : offset;
            const translateX = adjusted * 190;
            const scale = isCenter ? 1 : 0.75;
            const opacity = Math.abs(adjusted) > 2 ? 0 : isCenter ? 1 : 0.45;
            const z = isCenter ? 10 : 5 - Math.abs(adjusted);

            return (
              <div
                key={item.id}
                onClick={() => goTo(i)}
                className="cursor-pointer"
                style={{
                  position: 'absolute', left: '50%', top: '50%',
                  width: 200, aspectRatio: '9/16', borderRadius: 18,
                  overflow: 'hidden',
                  transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                  opacity, zIndex: z,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isCenter ? '2px solid rgba(34,211,238,0.45)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isCenter ? '0 28px 64px rgba(0,0,0,0.5), 0 0 50px rgba(34,211,238,0.1)' : '0 12px 28px rgba(0,0,0,0.3)',
                }}
              >
                {isCenter ? (
                  <video
                    ref={videoRef}
                    key={item.id}
                    src={`${CL}/${item.id}.mp4`}
                    poster={`${CL}/so_1/${item.id}.jpg`}
                    muted
                    playsInline
                    autoPlay
                    loop
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={`${CL}/so_1/${item.id}.jpg`}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Label + dots */}
        <div className="mt-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-cyan">
            {SHOWCASE[active].label}
          </span>
          <div className="mt-3 flex items-center justify-center gap-2">
            {SHOWCASE.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="transition-all"
                style={{
                  width: i === active ? 22 : 7,
                  height: 7,
                  borderRadius: 99,
                  border: 'none',
                  background: i === active ? '#22D3EE' : 'rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={`Show ${SHOWCASE[i].label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
