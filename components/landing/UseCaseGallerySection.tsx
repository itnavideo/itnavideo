import Image from 'next/image';

const useCases = [
  {
    title: 'Career explainers',
    body: 'Job updates, interview tips, salary choices, and professional stories.',
    src: '/visuals/site-scenes/ai-engineer-night-work.png',
  },
  {
    title: 'Education reels',
    body: 'College, exams, MBA, BCom, admissions, and learning content.',
    src: '/visuals/site-scenes/students-campus-walk.png',
  },
  {
    title: 'Health careers',
    body: 'Doctor, nursing, medical education, and healthcare career videos.',
    src: '/visuals/site-scenes/doctor-career-portrait.png',
  },
  {
    title: 'Creator videos',
    body: 'Voiceovers, creator clips, founder updates, and social explainers.',
    src: '/visuals/site-scenes/creator-recording-reel.png',
  },
];

export default function UseCaseGallerySection() {
  return (
    <section className="bg-[#07080a] px-4 py-16 text-white sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 sm:mb-12 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Real reel topics</p>
            <h2 className="text-3xl font-black leading-tight tracking-normal sm:text-4xl md:text-6xl">
              Built for videos people actually watch.
            </h2>
          </div>
          <p className="text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            ItnaVideo works best when the source idea maps to a clear human situation: a student studying, a creator recording, a professional deciding, or a career story unfolding.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {useCases.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
              <div className="relative aspect-[5/4] bg-black sm:aspect-[4/5]">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/5 to-transparent" />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
