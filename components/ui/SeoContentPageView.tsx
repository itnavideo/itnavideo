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
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(buildBreadcrumb(page)) }} />

      <section className="border-b border-border bg-card px-5 pb-16 pt-28 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
              <Sparkles size={16} />
              {page.eyebrow}
            </div>
            <h1 className="max-w-5xl text-4xl font-black leading-tight sm:text-6xl text-foreground font-sans">{page.h1}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{page.hero}</p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">{page.shortExplanation}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/dashboard?type=${page.dashboardType}`} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 font-black text-primary-foreground shadow-md transition duration-300 hover:bg-primary/90 hover:-translate-y-0.5">
                Try Itnavideo
                <ArrowRight size={17} />
              </Link>
              <Link href={`/dashboard?type=${page.dashboardType}`} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-6 py-4 font-black text-secondary-foreground shadow-sm transition hover:bg-secondary/80">
                Create video now
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {page.relatedKeywords.map((keyword) => (
                <span key={keyword} className="rounded-xl border border-border bg-accent px-3 py-2 text-xs font-bold text-foreground">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-3 shadow-lg">
            <div className="aspect-[9/16] overflow-hidden rounded-xl bg-muted">
              <Image src={page.previewImage} alt={page.h1} width={1080} height={1920} className="h-full w-full object-cover object-top" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
              <Layers3 size={16} />
              How it works
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-5xl text-foreground">From idea or upload to finished short video.</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              This workflow naturally supports short keywords like AI video generator, AI reel generator, reel maker, video generator, and AI shorts generator while staying useful for real creators.
            </p>
          </div>
          <div className="space-y-3">
            {page.howItWorks.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-card-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-3xl font-black text-foreground">Benefits</h2>
            <div className="mt-6 space-y-4">
              {page.benefits.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-3xl font-black text-foreground">Use cases</h2>
            <div className="mt-6 space-y-4">
              {page.useCases.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black text-foreground">Why Itnavideo</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {page.whyItnavideo.map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-card-foreground shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="text-primary" size={24} />
            <h2 className="text-3xl font-black text-foreground">FAQ</h2>
          </div>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="font-black text-foreground">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Link2 className="text-primary" size={22} />
            <h2 className="text-2xl font-black text-card-foreground">Related pages</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {page.internalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl border border-border bg-accent p-4 text-sm font-bold text-foreground transition hover:border-slate-400 dark:hover:border-slate-700">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/dashboard?type=${page.dashboardType}`} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 font-black text-primary-foreground shadow-md transition duration-300 hover:bg-primary/90 hover:-translate-y-0.5">
              Create video now
              <ArrowRight size={17} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-6 py-4 font-black text-secondary-foreground shadow-sm transition hover:bg-secondary/80">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
