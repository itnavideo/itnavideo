'use client';

import { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

type VideoSlide = {
  label: string;
  videos: {
    src: string;
    alt: string;
  }[];
};

const SLIDES: VideoSlide[] = [
  {
    label: 'AUTO CAPTION REELS',
    videos: [
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4', alt: 'Auto caption reel 1' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4', alt: 'Auto caption reel 2' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4', alt: 'Auto caption reel 3' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4', alt: 'Auto caption reel 4' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4', alt: 'Auto caption reel 5' },
    ],
  },
  {
    label: 'COMPARE EXPLAINERS',
    videos: [
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4', alt: 'Compare explainer 1' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4', alt: 'Compare explainer 2' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4', alt: 'Compare explainer 3' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4', alt: 'Compare explainer 4' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4', alt: 'Compare explainer 5' },
    ],
  },
  {
    label: 'TYPOGRAPHY VIDEOS',
    videos: [
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4', alt: 'Typography video 1' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4', alt: 'Typography video 2' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4', alt: 'Typography video 3' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4', alt: 'Typography video 4' },
      { src: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4', alt: 'Typography video 5' },
    ],
  },
  {
    label: 'WHITEBOARD VIDEOS',
    videos: [
      { src: '/videos/demo-captions/demo-2.mp4', alt: 'Whiteboard video 1' },
      { src: '/videos/demo-captions/demo-2.mp4', alt: 'Whiteboard video 2' },
      { src: '/videos/demo-captions/demo-2.mp4', alt: 'Whiteboard video 3' },
      { src: '/videos/demo-captions/demo-2.mp4', alt: 'Whiteboard video 4' },
      { src: '/videos/demo-captions/demo-2.mp4', alt: 'Whiteboard video 5' },
    ],
  },
  {
    label: 'LONG VIDEO CLIPS',
    videos: [
      { src: '/videos/demo-captions/demo-6.mp4', alt: 'Long video 1' },
      { src: '/videos/demo-captions/demo-6.mp4', alt: 'Long video 2' },
      { src: '/videos/demo-captions/demo-6.mp4', alt: 'Long video 3' },
      { src: '/videos/demo-captions/demo-6.mp4', alt: 'Long video 4' },
      { src: '/videos/demo-captions/demo-6.mp4', alt: 'Long video 5' },
    ],
  },
];

// Fan layout config: index 0=far-left, 1=left, 2=center, 3=right, 4=far-right
const FAN_CONFIG = [
  { rotate: '-12deg', translateY: '32px', scale: 0.78, zIndex: 1, opacity: 0.6 },
  { rotate: '-6deg',  translateY: '14px', scale: 0.88, zIndex: 2, opacity: 0.8 },
  { rotate: '0deg',   translateY: '0px',  scale: 1,    zIndex: 5, opacity: 1   },
  { rotate: '6deg',   translateY: '14px', scale: 0.88, zIndex: 2, opacity: 0.8 },
  { rotate: '12deg',  translateY: '32px', scale: 0.78, zIndex: 1, opacity: 0.6 },
];

export default function MultiVideoShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slide = SLIDES[activeSlide];

  const goNext = () => setActiveSlide((p) => (p + 1) % SLIDES.length);
  const goPrev = () => setActiveSlide((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28 bg-white border-b border-slate-200 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center justify-center gap-1.5">
            <Sparkles size={13} />
            <span>See Itnavideo in action</span>
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sans tracking-tight leading-tight">
            Watch how Itnavideo turns your uploads
            <br />
            <span className="text-blue-600">into ready-to-post videos.</span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-slate-500">
            Create reels, explainers, caption videos, and more — all from one upload.
          </p>
        </div>

        {/* Fan of videos */}
        <div className="relative flex items-end justify-center" style={{ height: '420px' }}>
          {slide.videos.map((vid, i) => {
            const cfg = FAN_CONFIG[i];
            return (
              <div
                key={`${activeSlide}-${i}`}
                className="absolute transition-all duration-500"
                style={{
                  zIndex: cfg.zIndex,
                  transform: `rotate(${cfg.rotate}) translateY(${cfg.translateY}) scale(${cfg.scale})`,
                  opacity: cfg.opacity,
                  left: `calc(50% + ${(i - 2) * 58}px - 45px)`,
                  bottom: 0,
                  width: '90px',
                }}
              >
                <div
                  className="rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl"
                  style={{ aspectRatio: '9/16', width: '90px' }}
                >
                  <video
                    src={vid.src}
                    poster="/preview/Auto Caption Reel.png"
                    preload="auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Label + navigation */}
        <div className="mt-10 flex flex-col items-center gap-5">
          {/* Active label */}
          <p className="text-xs font-extrabold tracking-[0.2em] text-blue-600 uppercase">
            {slide.label}
          </p>

          {/* Dot pagination */}
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-blue-300 hover:text-blue-600 transition"
            >
              <ChevronLeft size={15} />
            </button>

            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  idx === activeSlide
                    ? 'w-6 h-2 bg-blue-600'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}

            <button
              onClick={goNext}
              aria-label="Next"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-blue-300 hover:text-blue-600 transition"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

