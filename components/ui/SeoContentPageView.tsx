import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, HelpCircle, Layers3, Link2, Sparkles } from "lucide-react";
import type { SeoContentPage } from "@/lib/seoContent";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com").replace(/\/$/, "");

type Props = {
  page: SeoContentPage;
};

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function buildBreadcrumb(page: SeoContentPage) {
  const sectionName = page.kind === "tool" ? "Tools" : page.kind === "useCase" ? "Use Cases" : "Compare";
  const sectionPath = page.kind === "tool" ? "/tools" : page.kind === "useCase" ? "/use-cases" : "/compare";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: sectionName, item: `${siteUrl}${sectionPath}` },
      { "@type": "ListItem", position: 3, name: page.h1, item: `${siteUrl}${page.path}` },
    ],
  };
}

export default function SeoContentPageView({ page }: Props) {
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
    url: `${siteUrl}${page.path}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(buildBreadcrumb(page)) }} />

      <section className="border-b border-white/10 bg-[#101827] px-5 pb-16 pt-28 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-mint/25 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
              <Sparkles size={16} />
              {page.eyebrow}
            </div>
            <h1 className="max-w-5xl text-4xl font-black leading-tight sm:text-6xl">{page.h1}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{page.hero}</p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">{page.shortExplanation}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/dashboard?type=${page.dashboardType}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white">
                Try Itnavideo
                <ArrowRight size={17} />
              </Link>
              <Link href={`/dashboard?type=${page.dashboardType}`} className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-4 font-black text-white transition hover:border-white/35 hover:bg-white/10">
                Create video now
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {page.relatedKeywords.map((keyword) => (
                <span key={keyword} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-lg border border-white/10 bg-black/25 p-3 shadow-2xl shadow-blue-950/30">
            <div className="aspect-[9/16] overflow-hidden rounded-md bg-slate-950">
              <Image src={page.previewImage} alt={page.h1} width={1080} height={1920} className="h-full w-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">
              <Layers3 size={16} />
              How it works
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">From idea or upload to finished short video.</h2>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              This workflow naturally supports short keywords like AI video generator, AI reel generator, reel maker, video generator, and AI shorts generator while staying useful for real creators.
            </p>
          </div>
          <div className="space-y-3">
            {page.howItWorks.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-[#111b2d] p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-mint text-sm font-black text-black">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#111827] px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black/20 p-6">
            <h2 className="text-3xl font-black">Benefits</h2>
            <div className="mt-6 space-y-4">
              {page.benefits.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-mint" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-6">
            <h2 className="text-3xl font-black">Use cases</h2>
            <div className="mt-6 space-y-4">
              {page.useCases.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-cyan-200" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black">Why Itnavideo</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {page.whyItnavideo.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-[#111b2d] p-5 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101827] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="text-brand-mint" size={24} />
            <h2 className="text-3xl font-black">FAQ</h2>
          </div>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-white/10 bg-black/25 p-5">
                <h3 className="font-black text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/10 bg-[#111b2d] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Link2 className="text-cyan-200" size={22} />
            <h2 className="text-2xl font-black">Related pages</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {page.internalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-white/10 bg-black/25 p-4 text-sm font-bold text-slate-200 transition hover:border-brand-mint/40 hover:bg-white/10">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/dashboard?type=${page.dashboardType}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white">
              Create video now
              <ArrowRight size={17} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-4 font-black text-white transition hover:border-white/35 hover:bg-white/10">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
