import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

type TemplateCard = {
  n: number;
  title: string;
  input: string;
  desc: string;
  image: string;
  proof: string;
  accent: string;
  href: string;
};

// Short-form (9:16) templates — same card language as the Video Types page.
const SHORT_TEMPLATES: TemplateCard[] = [
  {
    n: 1,
    title: 'Auto Caption Video',
    input: 'Video',
    desc: 'Clean, word-synced captions for any talking reel. Pick a style and post.',
    image: '/preview/Auto Caption Reel.png',
    proof: 'Most used',
    accent: '#22C55E',
    href: '/dashboard?videoType=auto-caption-reel',
  },
  {
    n: 2,
    title: 'Compare Explainer',
    input: 'Audio + 2 images',
    desc: 'Left vs right comparison with a narration and a sticker presenter.',
    image: '/preview/Compare Explainer.png',
    proof: 'Clear decision',
    accent: '#F59E0B',
    href: '/dashboard?videoType=compare-explainer',
  },
  {
    n: 3,
    title: 'Whiteboard Video',
    input: 'Audio or Video',
    desc: 'AI writes your key points on a whiteboard, synced to your speech.',
    image: '/preview/Whiteboard Video.png',
    proof: 'Educational',
    accent: '#10B981',
    href: '/dashboard?videoType=whiteboard-video',
  },
  {
    n: 4,
    title: 'Typography Video',
    input: 'Video',
    desc: 'Bold keywords pop on your talking video the moment you say them.',
    image: '/preview/Typography Video.png',
    proof: 'Engaging',
    accent: '#8B5CF6',
    href: '/dashboard?videoType=typography-video',
  },
  {
    n: 5,
    title: 'Long Video Promo',
    input: 'Video + thumbnail',
    desc: 'Turn a long video into a short vertical teaser that drives the full watch.',
    image: '/preview/Long Video Promo.png',
    proof: 'Promo ready',
    accent: '#A3E635',
    href: '/dashboard?videoType=long-video-promo',
  },
  {
    n: 6,
    title: 'Multi Images Video',
    input: 'Video + images',
    desc: 'Your images animate in sync with the narration — great for stories.',
    image: '/preview/Multi Images Video.png',
    proof: 'Story format',
    accent: '#F472B6',
    href: '/dashboard?videoType=multi-images-video',
  },
];

// Long-form (16:9) templates.
const LONG_TEMPLATES: TemplateCard[] = [
  {
    n: 1,
    title: 'Long Video Captions',
    input: '16:9 · up to 10 min',
    desc: 'Preserve your full landscape video and original audio with timed captions.',
    image: '/visuals/previews/long-form-captioned-video.png',
    proof: 'Long-form',
    accent: '#22D3EE',
    href: '/dashboard?videoType=long-form-captioned-video',
  },
  {
    n: 2,
    title: 'Long Video Clips',
    input: 'Long video input',
    desc: 'AI picks the best moments from a long video and renders captioned short clips.',
    image: '/preview/Long Video Clips.png',
    proof: 'Repurpose',
    accent: '#06B6D4',
    href: '/dashboard?videoType=long-video-clips',
  },
];

function TemplateGrid({ items, ratio, cols }: { items: TemplateCard[]; ratio: string; cols: string }) {
  return (
    <div className={`grid grid-cols-1 gap-10 sm:grid-cols-2 ${cols}`}>
      {items.map((t) => (
        <div key={t.title}>
          {/* Big step number — prominently visible above the card */}
          <div className="mb-3 flex items-baseline gap-3">
            <span
              className="font-black leading-none text-cyan-300/40"
              style={{ fontSize: 64 }}
            >
              {String(t.n).padStart(2, '0')}
            </span>
            <span className="text-sm font-bold text-slate-400">{t.title}</span>
          </div>

          <Link
            href={t.href}
            className="group block overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            {/* Image — clean, no text overlay */}
            <div className={`relative ${ratio} overflow-hidden bg-black`}>
              <Image
                src={t.image}
                alt={`${t.title} preview`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
              />
              {/* Proof badge */}
              <span
                className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950"
                style={{ backgroundColor: t.accent }}
              >
                {t.proof}
              </span>
            </div>

            {/* Text below the image — styled card area */}
            <div className="border-t border-white/5 p-5">
              <h3 className="text-base font-black text-white">{t.title}</h3>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">{t.input}</p>
              <p className="mt-2.5 text-sm leading-6 text-slate-400">{t.desc}</p>
              <span
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide transition group-hover:gap-2.5"
                style={{ color: t.accent }}
              >
                <Play size={12} fill="currentColor" /> Use this template <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function HomepageDemoGrid() {
  return (
    <section className="px-4 py-20 sm:px-6" style={{ background: '#070A12' }}>
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl">
            Pick a template. <span className="text-brand-cyan">Upload. Done.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Each template has its own upload flow, AI pipeline, and output style — no generic one-size-fits-all.
          </p>
        </div>

        {/* Short videos */}
        <div className="mb-16">
          <div className="mb-8">
            <h3 className="text-3xl font-black text-white sm:text-4xl">Short Videos</h3>
            <p className="mt-2 text-base text-slate-400">9:16 reels for Instagram, TikTok &amp; YouTube Shorts</p>
          </div>
          <TemplateGrid items={SHORT_TEMPLATES} ratio="aspect-[9/16]" cols="lg:grid-cols-4" />
        </div>

        {/* Long videos — YouTube-style landscape cards */}
        <div>
          <div className="mb-8">
            <h3 className="text-3xl font-black text-white sm:text-4xl">Long Videos</h3>
            <p className="mt-2 text-base text-slate-400">16:9 tools for YouTube, podcasts &amp; lectures</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {LONG_TEMPLATES.map((t) => (
              <div key={t.title}>
                {/* Number + name */}
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="font-black leading-none text-cyan-300/40" style={{ fontSize: 64 }}>
                    {String(t.n).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-bold text-slate-400">{t.title}</span>
                </div>

                <Link
                  href={t.href}
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  {/* YouTube-style 16:9 thumbnail — big, landscape, cinematic */}
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <Image
                      src={t.image}
                      alt={`${t.title} preview`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* YouTube-style play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 transition group-hover:opacity-100">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                        <span className="ml-1 border-l-[14px] border-t-[8px] border-b-[8px] border-l-white border-t-transparent border-b-transparent" />
                      </div>
                    </div>

                    {/* Badge */}
                    <span
                      className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950"
                      style={{ backgroundColor: t.accent }}
                    >
                      {t.proof}
                    </span>

                    {/* Bottom info bar — YouTube thumbnail style */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-black text-white drop-shadow-lg">{t.title}</h3>
                      <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-300">{t.input}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm leading-6 text-slate-400">{t.desc}</p>
                    <span
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide transition group-hover:gap-2.5"
                      style={{ color: t.accent }}
                    >
                      <Play size={12} fill="currentColor" /> Use this template <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
