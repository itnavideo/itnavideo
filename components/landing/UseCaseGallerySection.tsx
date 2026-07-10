import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const outputShowcase = [
  {
    title: 'Custom AI Reel',
    body: 'Best for custom prompts where users want text, screenshots, images, and a logo arranged into one premium reel.',
    src: '/preview/Custom AI Reel.png',
    href: '/custom-ai-reel',
  },
  {
    title: 'Auto Caption Reel',
    body: 'Best for existing reels that need clean, readable, social-ready captions without changing the original video.',
    src: '/preview/Auto Caption Reel.png',
    href: '/video-types/auto-caption-reel',
  },
  {
    title: 'Compare Explainer',
    body: 'Best for education and product comparisons where two options must be understood quickly.',
    src: '/preview/Compare Explainer.png',
    href: '/video-types/compare-explainer',
  },
  {
    title: 'Long Video Promo',
    body: 'Best for turning a longer video into a short vertical teaser with a clear reason to watch.',
    src: '/preview/Long Video Promo.png',
    href: '/video-types/long-video-promo',
  },
];

export default function UseCaseGallerySection() {
  return (
    <section className="bg-[#0B1120] px-4 py-16 text-white sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 sm:mb-12 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Output proof</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal sm:text-4xl md:text-6xl">
              The video type preview is the product pitch.
            </h2>
          </div>
          <p className="text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Instead of asking users to read long explanations, Itnavideo now leads with focused outputs. Each card shows the kind of reel the video type is designed to create.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:max-w-6xl xl:mx-auto">
          {outputShowcase.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-lg border border-white/10 bg-slate-950 transition duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div className="relative aspect-[9/16] bg-black">
                <Image
                  src={item.src}
                  alt={`${item.title} output preview`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.035]"
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-base font-black text-white">{item.title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wide text-brand-mint transition group-hover:gap-2">
                    View output <ArrowRight size={12} />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-6 text-slate-400">{item.body}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
