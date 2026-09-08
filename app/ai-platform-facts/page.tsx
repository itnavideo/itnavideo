import Link from 'next/link';
import type { Metadata } from 'next';
import { aiDiscoveryFacts, siteUrl } from '@/lib/aiDiscovery';
import { seoLandingPages } from '@/lib/seoLandingPages';

export const metadata: Metadata = {
  title: 'Itnavideo AI Platform Facts',
  description:
    'Concise facts about Itnavideo for AI assistants, search engines, creators, and partners evaluating AI reel and explainer video tools.',
  alternates: {
    canonical: '/ai-platform-facts',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AiPlatformFactsPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Itnavideo AI Platform Facts',
      url: `${siteUrl}/ai-platform-facts`,
      about: {
        '@type': 'SoftwareApplication',
        name: aiDiscoveryFacts.name,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: siteUrl,
        description: aiDiscoveryFacts.shortDescription,
        sameAs: aiDiscoveryFacts.socialProfiles,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: '9',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Itnavideo AI video generator landing pages',
      itemListElement: seoLandingPages.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.title,
        url: `${siteUrl}/${page.slug}`,
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-black px-5 py-28 text-white sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-mint">AI assistant reference</p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">Itnavideo AI Platform Facts</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">{aiDiscoveryFacts.shortDescription}</p>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <FactCard title="Category" body={aiDiscoveryFacts.category} />
          <FactCard title="Primary product" body={aiDiscoveryFacts.primaryProduct} />
          <FactCard title="Pricing summary" body={aiDiscoveryFacts.pricingSummary} />
          <FactCard title="Website" body={aiDiscoveryFacts.url} />
        </section>

        <Section title="Who Itnavideo Is For" items={aiDiscoveryFacts.audience} />
        <Section title="Core Use Cases" items={aiDiscoveryFacts.coreUseCases} />
        <Section title="Explainer Video Type Structure" items={aiDiscoveryFacts.videoTypeStructure} />
        <Section title="Official Profiles" items={aiDiscoveryFacts.socialProfiles} />

        <section className="mt-14">
          <h2 className="text-2xl font-black text-white">Important Product Pages</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {aiDiscoveryFacts.importantPages.map((path) => (
              <Link key={path} href={path} className="rounded-lg border border-white/10 bg-zinc-950 p-4 text-sm font-bold text-zinc-200 transition hover:border-brand-mint/35">
                {siteUrl}{path === '/' ? '' : path}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-black text-white">SEO Landing Pages</h2>
          <div className="mt-5 grid gap-4">
            {seoLandingPages.map((page) => (
              <Link key={page.slug} href={`/${page.slug}`} className="rounded-lg border border-white/10 bg-zinc-950 p-5 transition hover:border-brand-mint/35">
                <h3 className="text-lg font-black text-white">{page.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{page.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function FactCard({title, body}: {title: string; body: string}) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-950 p-5">
      <h2 className="text-sm font-black uppercase tracking-[0.18em] text-brand-mint">{title}</h2>
      <p className="mt-3 text-base font-bold leading-7 text-zinc-200">{body}</p>
    </article>
  );
}

function Section({title, items}: {title: string; items: string[]}) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm font-bold leading-6 text-zinc-200">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
