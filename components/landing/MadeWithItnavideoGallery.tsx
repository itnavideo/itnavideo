'use client';

import { useState } from 'react';
import { Sparkles, Play, Pause, X, ExternalLink, Mic, Volume2 } from 'lucide-react';
import Link from 'next/link';

type ShowcaseVideo = {
  id: string;
  title: string;
  category: 'Short Videos' | 'Long Videos' | 'Explainers' | 'Visual Videos' | 'Audio';
  aspectRatio: '9:16' | '16:9' | 'Audio';
  videoSrc?: string;
  videoType: string;
  description: string;
  href: string;
  isAudioCleaner?: boolean;
  comingSoon?: boolean;
};

const SHOWCASE_ITEMS: ShowcaseVideo[] = [
  {
    id: 'compare-explainer-1',
    title: 'Product Side-by-Side Comparison',
    category: 'Explainers',
    aspectRatio: '9:16',
    videoSrc: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4',
    videoType: 'Compare Explainer',
    description: 'Visual side-by-side product comparison with animated presenter character.',
    href: '/dashboard?videoType=compare-explainer',
  },
  {
    id: 'whiteboard-2',
    title: 'Educational Whiteboard Lesson',
    category: 'Explainers',
    aspectRatio: '9:16',
    videoSrc: '/videos/demo-captions/demo-2.mp4',
    videoType: 'Whiteboard Video',
    description: 'Corporate whiteboard canvas with progressive handwritten key points.',
    href: '/dashboard?videoType=whiteboard-video',
  },
  {
    id: 'typography-3',
    title: 'Kinetic Typography Promo',
    category: 'Visual Videos',
    aspectRatio: '9:16',
    videoSrc: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4',
    videoType: 'Typography Video',
    description: 'High-impact motion text popups synchronized to speech intent.',
    href: '/dashboard?videoType=typography-video',
  },
  {
    id: 'multi-images-4',
    title: 'Animated Image Story',
    category: 'Visual Videos',
    aspectRatio: '9:16',
    videoSrc: '/videos/demo-captions/demo-4.mp4',
    videoType: 'Multi Images Video',
    description: 'Turns multiple photos and graphics into a smooth narrated video.',
    href: '/dashboard?videoType=multi-images-video',
  },
  {
    id: 'long-caption-pro-5',
    title: 'Widescreen Course Video (10 Min)',
    category: 'Long Videos',
    aspectRatio: '16:9',
    videoSrc: '/videos/demo-captions/demo-6.mp4',
    videoType: 'Long Caption Pro',
    description: 'Preserves 16:9 landscape format with timed multi-line subtitles.',
    href: '/dashboard?videoType=long-caption-pro',
  },
  {
    id: 'ai-video-generator-6',
    title: 'Full Long-Form Video Production',
    category: 'Long Videos',
    aspectRatio: '16:9',
    videoSrc: '/videos/demo-captions/demo-8.mp4',
    videoType: 'AI Video Generator',
    description: 'Complete widescreen production with automatic scenes, b-roll, and music.',
    href: '/dashboard?videoType=ai-video-generator',
  },
  {
    id: 'auto-caption-7',
    title: 'Talking Head Content Reel',
    category: 'Short Videos',
    aspectRatio: '9:16',
    videoSrc: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4',
    videoType: 'Auto Caption Reel',
    description: 'Word-by-word active word highlighted captions for talking reels.',
    href: '/dashboard?videoType=auto-caption-reel',
  },
  {
    id: 'bg-replace-8',
    title: 'Presenter Background Cutout',
    category: 'Visual Videos',
    aspectRatio: '9:16',
    videoSrc: '/videos/demo-captions/demo-11.mp4',
    videoType: 'Background Replace',
    description: 'Replaces presenter video background automatically without a green screen.',
    href: '',
    comingSoon: true,
  },
  {
    id: 'audio-cleaner-9',
    title: 'Studio Voice Isolation & Noise Removal',
    category: 'Audio',
    aspectRatio: 'Audio',
    videoType: 'AI Audio Cleaner',
    description: 'Removes background hum, wind, and fan noise while enhancing voice clarity.',
    href: '/dashboard?videoType=ai-audio-cleaner',
    isAudioCleaner: true,
  },
];

export default function MadeWithItnavideoGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeVideoModal, setActiveVideoModal] = useState<ShowcaseVideo | null>(null);

  const categories = ['All', 'Short Videos', 'Long Videos', 'Explainers', 'Visual Videos', 'Audio'];

  const filteredItems = SHOWCASE_ITEMS.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="relative px-4 py-20 sm:px-6 sm:py-28 bg-white border-b border-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>AI Video Maker Showcase &amp; Real Outputs</span>
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl font-sans tracking-tight">
            See What You Can <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Create with AI</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            Itnavideo is the complete AI video generator. Filter through real generated outputs across short reels, long-form widescreen videos, explainers, and audio cleanup.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition duration-150 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const isWidescreen = item.aspectRatio === '16:9';

            if (item.isAudioCleaner) {
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-xs transition duration-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-purple-100 text-purple-700 px-2.5 py-1 text-[10px] font-bold">
                        Audio Tool
                      </span>
                      <span className="rounded-md bg-blue-600 text-white px-2.5 py-1 text-[10px] font-bold">
                        Studio Noise Removal
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-4 border border-slate-200 text-center space-y-3">
                      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                        <Mic size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-900 font-sans">{item.title}</p>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>Raw Recording:</span>
                          <span className="text-red-500 font-mono">Background Hum</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-700 font-bold">
                          <span>Cleaned Audio:</span>
                          <span className="text-emerald-600 font-mono">Studio Voice Only</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-600">{item.videoType}</span>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition"
                    >
                      <span>Try Cleaner →</span>
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-500 hover:scale-105"
              >
                <div className="flex flex-col h-full justify-between">
                  {/* Uniform 9:16 Aspect Ratio Frame */}
                  <div className="relative w-full aspect-[9/16] overflow-hidden rounded-xl bg-slate-100 group/video shadow-inner">
                    <video
                      src={item.videoSrc}
                      poster={
                        item.videoType === 'Compare Explainer' ? '/preview/Compare Explainer.png' :
                        item.videoType === 'Whiteboard Video' ? '/preview/file_0000000018cc82079ca3ca5c29058919.png' :
                        item.videoType === 'Typography Video' ? '/preview/Typography Video.png' :
                        item.videoType === 'Multi Images Video' ? '/preview/Multi Images Video.png' :
                        item.videoType === 'Long Caption Pro' ? '/visuals/previews/long-caption-pro.png' :
                        item.videoType === 'Long Video Pro' ? '/visuals/previews/ai-director-reel-preview.png' :
                        '/preview/Auto Caption Reel.png'
                      }
                      preload="auto"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className={`h-full w-full ${isWidescreen ? 'object-contain bg-slate-900 p-1' : 'object-cover'}`}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="rounded-md bg-muted/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs border border-white/20">
                        {item.aspectRatio}
                      </span>
                      <span className="rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Prominent Hover Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-background/40 backdrop-blur-[2px]">
                      <button
                        onClick={() => setActiveVideoModal(item)}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/50 scale-90 transition-transform duration-300 group-hover:scale-110 hover:bg-blue-500"
                        aria-label={`Play ${item.title}`}
                      >
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Card Information */}
                  <div className="mt-4 space-y-1.5 flex-1">
                    <h3 className="text-base font-extrabold text-slate-900 font-sans leading-snug line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-amber-600 font-bold">{item.videoType}</p>
                    <p className="text-xs text-slate-600 font-normal line-clamp-2 pt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{item.aspectRatio} Output</span>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-amber-700 hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all duration-200 border border-amber-200/60"
                  >
                    <span>Create This</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Video Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">{activeVideoModal.title}</h3>
                <p className="text-xs text-amber-600 font-semibold">{activeVideoModal.videoType} • {activeVideoModal.aspectRatio}</p>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative aspect-[9/16] max-h-[65vh] mx-auto overflow-hidden rounded-xl bg-black border border-slate-200">
              <video
                src={activeVideoModal.videoSrc}
                autoPlay
                controls
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">Rendered with Itnavideo AI</span>
              <Link
                href={activeVideoModal.href}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow transition"
              >
                <span>Create Video with This Type →</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

