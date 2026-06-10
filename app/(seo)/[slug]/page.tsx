import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight, CheckCircle2, Film, Layers3, Sparkles} from 'lucide-react';
import type {Metadata} from 'next';
import {getSeoLandingPage, seoLandingPages} from '@/lib/seoLandingPages';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itnavideo.com';

type PageProps = {
  params: Promise<{slug: string}>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({slug: page.slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  const page = getSeoLandingPage(slug);
  if (!page) {
    return {
      title: 'Itnavideo',
      robots: {index: false, follow: false},
    };
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteUrl}/${page.slug}`,
      siteName: 'Itnavideo',
      type: 'website',
      images: [
        {
          url: '/visuals/template-video-explainer.png',
          width: 1080,
          height: 1920,
          alt: `${page.keyword} preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/visuals/template-video-explainer.png'],
    },
  };
}

export default async function SeoLandingPage({params}: PageProps) {
  const {slug} = await params;
  const page = getSeoLandingPage(slug);
  if (!page) return null;
  const relatedPages = seoLandingPages
    .filter((item) => item.slug !== page.slug)
    .slice(0, 6);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Itnavideo',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      url: `${siteUrl}/${page.slug}`,
      description: page.description,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: '9',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.title,
          item: `${siteUrl}/${page.slug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />

      <section className="relative flex min-h-[760px] items-end overflow-hidden px-5 pb-16 pt-32 sm:px-6 lg:min-h-[820px]">
        <Image
          src="/visuals/template-video-explainer.png"
          alt={`${page.keyword} generated reel preview`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-44"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.78)_62%,#000_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_32%,rgba(92,232,213,0.22),transparent_34%)]" />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-brand-mint/30 bg-black/45 px-3 py-2 text-sm font-black uppercase tracking-[0.16em] text-brand-mint backdrop-blur">
              <Sparkles size={15} />
              {page.keyword}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl md:text-7xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200 md:text-xl md:leading-9">
              {page.hero}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              {page.proof}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 text-base font-black text-black transition hover:bg-white"
              >
                Create your first video
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-white/14 bg-black/42 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                See ₹9 test video
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <FeatureCard
            icon={Film}
            title="Top video stays visible"
            body="The source video remains in the top 16:9 layer so the viewer can still see the creator or original clip."
          />
          <FeatureCard
            icon={Layers3}
            title="Three-layer explainer"
            body="Every render uses top media, premium subtitles, and bottom scene visuals for a clean reel structure."
          />
          <FeatureCard
            icon={Sparkles}
            title="Scene-aware visuals"
            body="The planner uses English transcript and asset briefs to pick images that match each scene."
          />
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-mint">Best for</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Use {page.keyword} when the message needs to be understood fast.
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400">
              Itnavideo is focused on one strong Explainer Video template first, so the output stays consistent and easy to test.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {page.audience.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-mint">Use cases</p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">What you can create</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {page.useCases.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <p className="text-base font-black text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-mint">Workflow</p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">From upload to MP4</h2>
          </div>
          <div className="grid gap-4">
            {page.workflow.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border border-white/10 bg-black/30 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-mint text-sm font-black text-black">
                  {index + 1}
                </span>
                <p className="pt-1 text-base font-bold leading-7 text-zinc-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-black text-white sm:text-4xl">Questions about {page.keyword}</h2>
          <div className="mt-8 grid gap-4">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-white/10 bg-zinc-950 p-5">
                <h3 className="text-lg font-black text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-mint">Related AI tools</p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">Explore more Itnavideo workflows</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPages.map((related) => (
              <Link
                key={related.slug}
                href={`/${related.slug}`}
                className="rounded-lg border border-white/10 bg-zinc-950 p-5 transition hover:border-brand-mint/35"
              >
                <h3 className="text-lg font-black text-white">{related.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{related.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({icon: Icon, title, body}: {icon: typeof Film; title: string; body: string}) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-950 p-6">
      <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
        <Icon size={20} />
      </span>
      <h2 className="text-xl font-black text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{body}</p>
    </article>
  );
}

function CheckItem({children}: {children: string}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/30 p-4">
      <CheckCircle2 className="mt-0.5 shrink-0 text-brand-mint" size={18} />
      <p className="text-sm font-bold leading-6 text-zinc-200">{children}</p>
    </div>
  );
}
