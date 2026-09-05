import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Liam Brooks',
    role: 'Short-Form Video Agency Lead · Austin, TX, USA',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096402/ChatGPT_Image_Aug_30_2026_06_52_06_PM_sbypby.png',
    quote: 'It reduces hours of editing down to seconds. No complex keyframing headache — just instant, viral-ready video outputs for our client roster across the US.',
  },
  {
    name: 'Emma Harrison',
    role: 'Podcast Producer & Content Strategist · London, UK',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096402/ChatGPT_Image_Aug_30_2026_06_51_59_PM_g9m2yn.png',
    quote: 'The Long Video Clips and Kinetic Typography templates save our team 10+ hours every week. Viewer retention and completion rates across Reels and Shorts have doubled!',
  },
  {
    name: 'Marcus Vance',
    role: 'Tech Creator & Course Instructor · Toronto, Canada',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096401/ChatGPT_Image_Aug_30_2026_06_54_21_PM_jn8q5c.png',
    quote: 'I produce weekly coding breakdowns and explainer reels. Itnavideo handles speech sync and animated caption styling flawlessly — I just record, render, and publish.',
  },
  {
    name: 'Chloe Campbell',
    role: 'DTC Brand Founder · Vancouver, Canada',
    image: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788096400/ChatGPT_Image_Aug_30_2026_06_55_28_PM_b5rhkh.png',
    quote: 'We don’t have a full in-house editing department, but Itnavideo makes our product reels look like they were produced by a top-tier creative studio in New York or London.',
  },
];

export default function TestimonialSection() {
  return (
    <section className="px-4 py-24 sm:px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
            <Sparkles size={12} />
            <span>TRUSTED BY CREATORS</span>
          </p>
          <h2 className="text-3xl font-black text-foreground sm:text-4xl font-sans tracking-tight">
            Real creators. <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Real results.</span>
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            See what video creators, podcasters, and brand founders across the US, UK, and Canada are saying about Itnavideo.
          </p>
        </div>

        {/* Testimonial cards — side by side */}
        <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="group relative rounded-3xl border border-border bg-card p-7 shadow-sm backdrop-blur-md hover:border-amber-500/20 hover:bg-accent dark:border-border dark:bg-muted/20 dark:hover:bg-muted/40 transition duration-300"
            >
              {/* Decorative quotation indicator */}
              <div className="absolute top-4 right-5 text-4xl font-serif text-amber-500/10 leading-none select-none group-hover:text-amber-500/20 dark:group-hover:text-amber-400/20 transition duration-300">“</div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border group-hover:border-amber-500/20 transition duration-300">
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-card-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition duration-300">{review.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{review.role}</p>
                </div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground italic relative z-10">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

