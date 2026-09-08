import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clapperboard, FileText, PlayCircle } from "lucide-react";
import { getSeoLandingPage, seoLandingPages } from "@/lib/seo-pages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://itnavideo.com";
const seoPreviewImage = "/preview/Dynamic Creator Reel.png";

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
          url: `${siteUrl}${seoPreviewImage}`,
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
      images: [`${siteUrl}${seoPreviewImage}`],
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
    <main className="min-h-screen bg-[#07090E] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,197,66,0.12),transparent_40%),linear-gradient(180deg,#090D16,#07090E)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              {page.eyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl text-white">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              {page.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/dashboard?videoType=${page.slug.includes("caption") || page.slug.includes("subtitle") ? "auto-caption-reel" : page.slug.includes("compare") ? "compare-explainer" : page.slug.includes("whiteboard") ? "auto-draw-explainer" : page.slug.includes("promo") ? "long-video-promo" : page.slug.includes("background") ? "creator-background-replace" : "dynamic-creator-reel"}`}
                className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:scale-95"
              >
                Create your reel
              </Link>
              <Link
                href="/features"
                className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-4 text-sm font-bold text-white transition hover:border-amber-400/50 hover:bg-white/[0.06]"
              >
                See features
              </Link>
            </div>

            <p className="mt-5 text-sm text-zinc-400">
              Built for {page.audience}.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/[0.03] p-3 shadow-2xl shadow-black/60">
            <div className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-zinc-950">
              <img
                src={seoPreviewImage}
                alt={page.h1}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-sm">
          <Clapperboard className="mb-4 h-7 w-7 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Focused video types</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Choose a production workflow built for one clear output instead of a crowded format library.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-sm">
          <FileText className="mb-4 h-7 w-7 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Speech timing</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Speech-based video types use transcripts for captions, scene timing, and text overlays.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-sm">
          <PlayCircle className="mb-4 h-7 w-7 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Preview to export</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Review supported previews before spending credits on the final rendered MP4.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-black text-white">Use cases</h2>
            <div className="mt-6 space-y-4">
              {page.useCases.map((item) => (
                <div key={item} className="flex gap-3 text-zinc-300">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-black text-white">Why it helps</h2>
            <div className="mt-6 space-y-4">
              {page.benefits.map((item) => (
                <div key={item} className="flex gap-3 text-zinc-300">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-black text-white">FAQ</h2>
        <div className="mt-6 space-y-4">
          {page.faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-sm">
              <h3 className="font-bold text-white">{faq.question}</h3>
              <p className="mt-3 leading-7 text-zinc-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
