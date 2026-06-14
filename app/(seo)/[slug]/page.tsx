import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clapperboard, FileText, Sparkles } from "lucide-react";
import { getSeoLandingPage, seoLandingPages } from "@/lib/seo-pages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itnavideo.com";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);

  if (!page) {
    return {};
  }

  const canonical = `/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteUrl}${canonical}`,
      siteName: "Itnavideo",
      type: "website",
      images: [
        {
          url: `${siteUrl}/visuals/previews/video-explainer-homepage.png`,
          width: 1080,
          height: 1920,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [`${siteUrl}/visuals/previews/video-explainer-homepage.png`],
    },
  };
}

export default async function SeoLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);

  if (!page) {
    notFound();
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Itnavideo",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description: page.description,
    url: `${siteUrl}/${page.slug}`,
    offers: {
      "@type": "Offer",
      price: "9",
      priceCurrency: "INR",
    },
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_35%),linear-gradient(180deg,#020617,#000)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-brand-mint">
              {page.eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {page.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl bg-brand-mint px-6 py-4 text-sm font-black text-black transition hover:bg-white"
              >
                Create your reel
              </Link>
              <Link
                href="/features"
                className="rounded-xl border border-white/15 px-6 py-4 text-sm font-black text-white transition hover:border-brand-mint"
              >
                See features
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-400">
              Built for {page.audience}.
            </p>
          </div>

          <div className="rounded-[2rem] border border-brand-mint/30 bg-white/5 p-3 shadow-2xl shadow-cyan-500/10">
            <div className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-slate-950">
              <img
                src="/visuals/previews/video-explainer-homepage.png"
                alt={page.h1}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <Clapperboard className="mb-4 h-7 w-7 text-brand-mint" />
          <h2 className="text-xl font-black">Creator video first</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Keep the original speaking video visible while subtitles and a support image explain the topic.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <FileText className="mb-4 h-7 w-7 text-brand-mint" />
          <h2 className="text-xl font-black">Transcript subtitles</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Speech-based reels use the transcript to make the output easier to follow.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <Sparkles className="mb-4 h-7 w-7 text-brand-mint" />
          <h2 className="text-xl font-black">Short-form layout</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Designed for mobile-first platforms like Instagram Reels, YouTube Shorts, and TikTok.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-black">Use cases</h2>
            <div className="mt-6 space-y-4">
              {page.useCases.map((item) => (
                <div key={item} className="flex gap-3 text-slate-200">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-mint" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-3xl font-black">Why it helps</h2>
            <div className="mt-6 space-y-4">
              {page.benefits.map((item) => (
                <div key={item} className="flex gap-3 text-slate-200">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-mint" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-black">FAQ</h2>
        <div className="mt-6 space-y-4">
          {page.faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="font-black text-white">{faq.question}</h3>
              <p className="mt-3 leading-7 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
