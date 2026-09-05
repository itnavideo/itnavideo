'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DemoVideoItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
}

// ==================== 1. AUTO CAPTION & CAPTION STUDIO (9 VIDEOS) ====================
export const AUTO_CAPTION_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'ac-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783945650/professional-creator-after.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783945650/professional-creator-after.jpg',
  },
  {
    id: 'ac-2',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783945648/doctor-after.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783945648/doctor-after.jpg',
  },
  {
    id: 'ac-3',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942635/You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942635/You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu.jpg',
  },
  {
    id: 'ac-4',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942634/When_the_convenience_fee_starts_feeling_less_convenient.___%EF%B8%8F_acting_newera_relatableree_hz60i3.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942634/When_the_convenience_fee_starts_feeling_less_convenient.___%EF%B8%8F_acting_newera_relatableree_hz60i3.jpg',
  },
  {
    id: 'ac-5',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942631/I_filed_for_divorce_closed_a_billion-dollar_company_and_moved_to_a_country_where_I_didn_t_spea_tm9yqa.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942631/I_filed_for_divorce_closed_a_billion-dollar_company_and_moved_to_a_country_where_I_didn_t_spea_tm9yqa.jpg',
  },
  {
    id: 'ac-6',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942630/Are_you_in_the_right_rooms_fppoam.jpg',
  },
  {
    id: 'ac-7',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Comment_ADVANTAGE_to_get_the_4_skills_that_give_you_the_upper_hand_on_wealth_while_everyone_el_nqbpyj.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942630/Comment_ADVANTAGE_to_get_the_4_skills_that_give_you_the_upper_hand_on_wealth_while_everyone_el_nqbpyj.jpg',
  },
  {
    id: 'ac-8',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942630/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.jpg',
  },
  {
    id: 'ac-9',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942629/affirmationsong_affirmations_womenssecretway_dailyreminders_loveyourselfquotes_hquhqx.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942629/affirmationsong_affirmations_womenssecretway_dailyreminders_loveyourselfquotes_hquhqx.jpg',
  },
];

// ==================== 2. COMPARE EXPLAINER (9 VIDEOS) ====================
export const COMPARE_EXPLAINER_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'ce-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942289/Whats_the_difference_coupon_voucher_difference_englishtips_englishlesson_qw4kve.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942289/Whats_the_difference_coupon_voucher_difference_englishtips_englishlesson_qw4kve.jpg',
  },
  {
    id: 'ce-2',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942287/Indian_Government_Departments_Explained_in_Simple_Words....._indiafacts_education_viralree_hciuyx.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942287/Indian_Government_Departments_Explained_in_Simple_Words....._indiafacts_education_viralree_hciuyx.jpg',
  },
  {
    id: 'ce-3',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942286/Fixed_account_vs_Current_account_..._instagood_fd_viral_savings_finance_egsc7j.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942286/Fixed_account_vs_Current_account_..._instagood_fd_viral_savings_finance_egsc7j.jpg',
  },
  {
    id: 'ce-4',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942286/Did_you_know_difference_Between_Coaches_g3rabm.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942286/Did_you_know_difference_Between_Coaches_g3rabm.jpg',
  },
  {
    id: 'ce-5',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942286/Defference_between_Passport_And_Visa_viral_education_stickman_viralreels_passport_lpegjb.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942286/Defference_between_Passport_And_Visa_viral_education_stickman_viralreels_passport_lpegjb.jpg',
  },
  {
    id: 'ce-6',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942285/Dajjal_aur_Yajooj_Majooj_ka_Khauf_%EF%B8%8F_Rajesh_Machis_aur_Kaka_par_sabse_bada_imtihan_Is_Stickm_urc27o.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942285/Dajjal_aur_Yajooj_Majooj_ka_Khauf_%EF%B8%8F_Rajesh_Machis_aur_Kaka_par_sabse_bada_imtihan_Is_Stickm_urc27o.jpg',
  },
  {
    id: 'ce-7',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942285/What_should_I_explain_next_Comment_below_Follow_stickboyexplains_for_daily_tech_content._T_lkhjyn.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942285/What_should_I_explain_next_Comment_below_Follow_stickboyexplains_for_daily_tech_content._T_lkhjyn.jpg',
  },
  {
    id: 'ce-8',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942284/Bilkul_Agar_aap_Windows_vs_MacBook_reel_ke_liye_isi_style_ka_caption_chahte_hain_to_ye_use_kar_jz5y8g.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942284/Bilkul_Agar_aap_Windows_vs_MacBook_reel_ke_liye_isi_style_ka_caption_chahte_hain_to_ye_use_kar_jz5y8g.jpg',
  },
  {
    id: 'ce-9',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942284/%E0%A4%B8%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80_Bank_%E0%A4%94%E0%A4%B0_Private_Bank_%E0%A4%AE%E0%A5%87%E0%A4%82_%E0%A4%95%E0%A5%8D%E0%A4%AF%E0%A4%BE_%E0%A4%AB%E0%A4%B0%E0%A5%8D%E0%A4%95_%E0%A4%B9%E0%A5%88_%E0%A4%95%E0%A5%8D%E0%A4%AF%E0%A4%BE_Government_Bank_%E0%A4%94%E0%A4%B0_Private_Bank_%E0%A4%8F%E0%A4%95_%E0%A4%9C%E0%A5%88%E0%A4%B8%E0%A5%87_%E0%A4%B9_jexa9v.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942284/%E0%A4%B8%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80_Bank_%E0%A4%94%E0%A4%B0_Private_Bank_%E0%A4%AE%E0%A5%87%E0%A4%82_%E0%A4%95%E0%A5%8D%E0%A4%AF%E0%A4%BE_%E0%A4%AB%E0%A4%B0%E0%A5%8D%E0%A4%95_%E0%A4%B9%E0%A5%88_%E0%A4%95%E0%A5%8D%E0%A4%AF%E0%A4%BE_Government_Bank_%E0%A4%94%E0%A4%B0_Private_Bank_%E0%A4%8F%E0%A4%95_%E0%A4%9C%E0%A5%88%E0%A4%B8%E0%A5%87_%E0%A4%B9_jexa9v.jpg',
  },
];

// ==================== 3. KINETIC TYPOGRAPHY (9 VIDEOS) ====================
export const TYPOGRAPHY_DEMO_VIDEOS: DemoVideoItem[] = [
  {
    id: 'ty-1',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-76814_cpmpp1.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788193725/Video-76814_cpmpp1.jpg',
  },
  {
    id: 'ty-2',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.jpg',
  },
  {
    id: 'ty-3',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-30713_i60mvm.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788193725/Video-30713_i60mvm.jpg',
  },
  {
    id: 'ty-4',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-1475_vqqclf.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788193725/Video-1475_vqqclf.jpg',
  },
  {
    id: 'ty-5',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193724/Video-99061_r2lfcy.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788193724/Video-99061_r2lfcy.jpg',
  },
  {
    id: 'ty-6',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-14143_j4mkzn.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788193723/Video-14143_j4mkzn.jpg',
  },
  {
    id: 'ty-7',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-98200_id7qk8.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788193723/Video-98200_id7qk8.jpg',
  },
  {
    id: 'ty-8',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-80725_aiv5eg.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788193723/Video-80725_aiv5eg.jpg',
  },
  {
    id: 'ty-9',
    videoUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788025909/gemini_generated_video_043dd47c_ejnlad.mp4',
    posterUrl: 'https://res.cloudinary.com/dhouh9idx/video/upload/so_1,w_600,q_auto,f_jpg/v1788025909/gemini_generated_video_043dd47c_ejnlad.jpg',
  },
];

// ==================== CLEAN VIDEO CARD (NO TEXT OVERLAY) ====================
interface CleanVideoCardProps {
  video: DemoVideoItem;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onEnded: () => void;
}

function CleanVideoCard({ video, isPlaying, onPlay, onEnded }: CleanVideoCardProps) {
  return (
    <div className="group relative flex-none w-[220px] sm:w-[250px] md:w-[270px] snap-start rounded-2xl overflow-hidden bg-black shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-slate-800">
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
        {isPlaying ? (
          <video
            src={video.videoUrl}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
            onEnded={onEnded}
          />
        ) : (
          <>
            {/* Clean Instant JPG Poster */}
            <img
              src={video.posterUrl}
              alt="Demo Video"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Play Button Overlay (Click to Play) */}
            <button
              onClick={() => onPlay(video.id)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/25 transition"
              aria-label="Play video"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#00FF9D] group-hover:text-black">
                <Play size={24} className="ml-1 fill-current" />
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== SEPARATE VIDEO TYPE ROW COMPONENT ====================
export interface VideoTypeRowProps {
  badge: string;
  heading: string;
  explanation: string;
  videos: DemoVideoItem[];
  createHref: string;
  createLabel: string;
  activePlayingId: string | null;
  onPlay: (id: string) => void;
  onEnded: () => void;
}

export function VideoTypeRow({
  badge,
  heading,
  explanation,
  videos,
  createHref,
  createLabel,
  activePlayingId,
  onPlay,
  onEnded,
}: VideoTypeRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-14 border-b border-slate-100 last:border-b-0">
      {/* Header Info & Desktop Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2">
            <Sparkles size={13} className="text-amber-500" />
            <span>{badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            {heading}
          </h3>

          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {explanation}
          </p>
        </div>

        {/* Action Button & Desktop Arrows */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={createHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <span>{createLabel}</span>
            <ArrowRight size={14} />
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Clean Horizontal Scrollable Video Row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <CleanVideoCard
            key={video.id}
            video={video}
            isPlaying={activePlayingId === video.id}
            onPlay={onPlay}
            onEnded={onEnded}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== DEDICATED STANDALONE COMPONENTS ====================

export function AutoCaptionDemoSection() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  return (
    <VideoTypeRow
      badge="Auto Caption Generator"
      heading="Auto Caption Generator Demos"
      explanation="Generate viral talking reels with sub-second accurate subtitles, dynamic active-word highlighting, and customizable typography themes."
      videos={AUTO_CAPTION_DEMO_VIDEOS}
      createHref="/dashboard?videoType=auto-caption-generator"
      createLabel="Generate Auto Captions"
      activePlayingId={activePlayingId}
      onPlay={(id) => setActivePlayingId((prev) => (prev === id ? null : id))}
      onEnded={() => setActivePlayingId(null)}
    />
  );
}

export function CompareExplainerDemoSection() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  return (
    <VideoTypeRow
      badge="Compare Explainer Video"
      heading="Compare Explainer Video Demos"
      explanation="Explain side-by-side differences between two products, concepts, or rules with animated stickman avatars, split layouts, and voiceover subtitles."
      videos={COMPARE_EXPLAINER_DEMO_VIDEOS}
      createHref="/dashboard?videoType=compare-explainer"
      createLabel="Create Compare Explainer"
      activePlayingId={activePlayingId}
      onPlay={(id) => setActivePlayingId((prev) => (prev === id ? null : id))}
      onEnded={() => setActivePlayingId(null)}
    />
  );
}

export function TypographyDemoSection() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  return (
    <VideoTypeRow
      badge="Kinetic Typography Video"
      heading="Kinetic Typography Video Demos"
      explanation="Transform speech, quotes, and voiceovers into high-energy kinetic text animations synced dynamically to every spoken word."
      videos={TYPOGRAPHY_DEMO_VIDEOS}
      createHref="/dashboard?videoType=typography-video"
      createLabel="Create Typography Video"
      activePlayingId={activePlayingId}
      onPlay={(id) => setActivePlayingId((prev) => (prev === id ? null : id))}
      onEnded={() => setActivePlayingId(null)}
    />
  );
}

// ==================== MASTER DEMO VIDEOS SHOWCASE ====================
export default function DemoVideosShowcase() {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const handlePlay = (id: string) => {
    setActivePlayingId((prev) => (prev === id ? null : id));
  };

  const handleEnded = () => {
    setActivePlayingId(null);
  };

  return (
    <section id="demo-videos" className="relative overflow-hidden bg-white py-20 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 shadow-2xs">
            <Sparkles size={14} className="text-amber-500" />
            <span>REAL CLOUD RENDERED DEMOS</span>
          </div>

          <h2 className="mt-4 font-sans text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Watch Live <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">AI Video Output Demos</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Real short-form reels and explainers rendered with Itnavideo. Tap any video to play instantly.
          </p>
        </div>

        {/* 1. Auto Caption Generator Row (9 Videos) */}
        <VideoTypeRow
          badge="Auto Caption Generator"
          heading="Auto Caption Generator Demos"
          explanation="Generate viral talking reels with sub-second accurate subtitles, dynamic active-word highlighting, and customizable typography themes."
          videos={AUTO_CAPTION_DEMO_VIDEOS}
          createHref="/dashboard?videoType=auto-caption-generator"
          createLabel="Generate Auto Captions"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* 2. Compare Explainer Video Row (9 Videos) */}
        <VideoTypeRow
          badge="Compare Explainer Video"
          heading="Compare Explainer Video Demos"
          explanation="Explain side-by-side differences between two products, concepts, or rules with animated stickman avatars, split layouts, and voiceover subtitles."
          videos={COMPARE_EXPLAINER_DEMO_VIDEOS}
          createHref="/dashboard?videoType=compare-explainer"
          createLabel="Create Compare Explainer"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* 3. Kinetic Typography Video Row (9 Videos) */}
        <VideoTypeRow
          badge="Kinetic Typography Video"
          heading="Kinetic Typography Video Demos"
          explanation="Transform speech, quotes, and voiceovers into high-energy kinetic text animations synced dynamically to every spoken word."
          videos={TYPOGRAPHY_DEMO_VIDEOS}
          createHref="/dashboard?videoType=typography-video"
          createLabel="Create Typography Video"
          activePlayingId={activePlayingId}
          onPlay={handlePlay}
          onEnded={handleEnded}
        />

        {/* Bottom Banner CTA */}
        <div className="mt-14 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Ready to generate your own high-retention videos in seconds?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Upload your audio, video, or script and let Itnavideo handle captions, animations, and rendering.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:scale-[1.02] active:scale-100 shrink-0"
          >
            <span>Launch Studio Free</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
