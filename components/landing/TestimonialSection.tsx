import Image from 'next/image';

const REVIEWS = [
  {
    name: 'Akram',
    role: 'Founder, Akram Editor Studio · Videography Business',
    image: '/visuals/reviews/akram.jpg',
    quote: 'It reduces time for making videos. No headache — just easy and fast output. I use it for creating reels for my clients.',
  },
  {
    name: 'Afzal',
    role: 'Gemstone Business · India, Iran & Bangkok',
    image: '/visuals/reviews/afzal.jpg',
    quote: 'I don\'t know editing at all. This helps me a lot — I make reels about my gemstones and post directly. So simple.',
  },
  {
    name: 'Akhtar',
    role: 'Construction Business',
    image: '/visuals/reviews/akhtar.jpg',
    quote: 'I just record my site videos and upload. Itnavideo adds captions and makes it look professional. Very useful for my business.',
  },
  {
    name: 'Sayeed',
    role: 'Oracle ACE Pro · Course Creator',
    image: '/visuals/reviews/sayeed.jpg',
    quote: 'I create both reels and long videos for my Oracle courses. Itnavideo handles captions and formatting — I just focus on teaching.',
  },
];

export default function TestimonialSection() {
  return (
    <section className="px-4 py-20 sm:px-6" style={{ background: '#0B1120' }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Trusted by creators</p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Real creators. Real results.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            See what people are saying about Itnavideo.
          </p>
        </div>

        {/* Testimonial cards — side by side */}
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-cyan-300/20">
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{review.name}</p>
                  <p className="text-[11px] text-slate-500">{review.role}</p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-slate-300 italic">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
