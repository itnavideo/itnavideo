import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Zap, Check, Play, Youtube, ExternalLink, Globe, BookOpen, Lightbulb, AlertTriangle } from 'lucide-react';
import { blogPosts, getBlogPost, getDbBlogPost } from '@/lib/blogPosts';
import { FeatureCTA, ProductBenefitCTA, ExampleCTA } from '@/components/blog/BlogCTAComponents';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itnavideo.com').replace(/\/$/, '');

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function sanitizeCmsHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getDbBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Itnavideo Blog',
    };
  }

  return {
    title: `${post.title} | Itnavideo`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      url: `${siteUrl}/blog/${post.slug}`,
      images: [`${siteUrl}/preview/Auto Caption Reel.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`${siteUrl}/preview/Auto Caption Reel.png`],
    },
  };
}

function renderRichParagraph(text: string) {
  const replacements: Array<{ phrase: string; href: string }> = [
    { phrase: 'Itnavideo AI Audio Cleaner', href: '/tools/ai-audio-cleaner' },
    { phrase: 'Itnavideo Studio Dashboard', href: '/dashboard' },
    { phrase: 'Itnavideo homepage', href: '/' },
    { phrase: 'pricing plans', href: '/pricing' },
    { phrase: 'video creation tools', href: '/tools' },
    { phrase: 'video templates', href: '/video-types' },
    { phrase: 'Remotion animation templates', href: '/video-types' },
  ];

  for (const { phrase, href } of replacements) {
    const idx = text.indexOf(phrase);
    if (idx !== -1) {
      const before = text.slice(0, idx);
      const after = text.slice(idx + phrase.length);
      return (
        <>
          {before}
          <Link
            href={href}
            className="font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-400"
          >
            {phrase}
          </Link>
          {after}
        </>
      );
    }
  }

  return text;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await getDbBlogPost(slug)) as any;

  if (!post) notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);
  const dashboardType = post.dashboardType || 'auto-caption-reel';

  const productFeature = {
    name: dashboardType === 'typography-video' ? 'Typography Video' : dashboardType === 'compare-explainer' ? 'Compare Explainer' : dashboardType === 'whiteboard-video' ? 'Whiteboard Video' : 'Auto Caption Reel',
    category: 'AI Video Studio',
    previewImage: 'Auto Caption Reel.png',
    dashboardUrl: `/dashboard?videoType=${dashboardType}`,
    landingUrl: `/video-types/${dashboardType}`,
    ctaHeadline: 'Ready to Transform Your Video Workflow with AI?',
    ctaDescription: 'Generate animated captions, dynamic typography, and AI-assisted viral reels in seconds.',
    ctaButtonText: 'Try Studio Free',
    keyBenefits: [
      'Zero complex keyframing or timeline headache',
      'Accurate speech timestamps and word-level animations',
      'Fast cloud rendering and zero watermarks',
    ],
    relatedLinks: (post.internalLinks || []).map((l: any) => ({ label: l.label, href: l.href })),
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    author: { '@type': 'Organization', name: 'Itnavideo' },
    publisher: { '@type': 'Organization', name: 'Itnavideo' },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };
  const faqSchema = post.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((faq: { question: string; answer: string }) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }
    : null;

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqSchema) }} /> : null}

      {/* Top nav bar */}
      <div className="border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[760px] items-center justify-between px-6 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-orange-400">
            <ArrowLeft size={16} />
            All posts
          </Link>
          <Link href="/dashboard" className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition">
            Create video
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-[760px] px-6 pb-24 pt-12">
        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="font-bold text-orange-400">{post.category}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="font-sans text-[32px] font-black leading-[1.2] tracking-tight text-white md:text-[42px]">
          {post.title}
        </h1>

        {/* Subtitle / Intro */}
        <p className="mt-6 font-sans text-[18px] leading-[30px] text-slate-300">
          {post.intro}
        </p>

        {/* Featured Hero Visual Banner (Matching Itnavideo Visual Brand Identity) */}
        <div className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-2xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950 group">
            <img
              src={post.featuredImage || `/preview/${productFeature.previewImage}`}
              alt={`${post.title} - Itnavideo AI Video Creation Studio Feature Visual`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400 backdrop-blur-md">
                  <Sparkles size={12} />
                  ITNAVIDEO {(productFeature?.name || 'Auto Caption Reel').toUpperCase()} STUDIO
                </span>
                <Link
                  href={productFeature.dashboardUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-2 text-xs font-black text-white shadow-md hover:scale-105 transition"
                >
                  <span>Try {productFeature.name} →</span>
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] font-semibold text-slate-400">
            Featured Studio Visual: {post.title} (Itnavideo Production Engine)
          </p>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Excerpt as lead paragraph */}
        <p className="font-sans text-[17px] leading-[30px] text-slate-300">
          {post.excerpt}
        </p>

        {/* Key Takeaways & Executive Summary Card */}
        <div className="my-8 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 text-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-orange-400 fill-orange-400/20" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-orange-400">
              KEY TAKEAWAYS & EXECUTIVE SUMMARY
            </span>
          </div>
          <ul className="space-y-2.5 text-xs leading-relaxed text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span><strong>Strategic Alignment:</strong> High retention social video creation requires clear visual hooks and automated word-level captions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span><strong>Productivity Accelerator:</strong> Itnavideo cloud Remotion rendering replaces 3+ hours of manual keyframing with 60-second automation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span><strong>Accessibility & Retention:</strong> Hardcoded burned-in subtitles ensure 100% viewer retention on muted mobile feeds.</span>
            </li>
          </ul>
        </div>

        {/* Sections / HTML Body */}
        <div className="mt-12 space-y-12">
          {post.contentHtml ? (
            <div
              className="prose prose-invert max-w-none text-slate-300"
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(post.contentHtml) }}
            />
          ) : post.sections ? (
            post.sections.map((section: any, index: number) => (
              <div key={section.heading} className="space-y-10">
                <section>
                  <h2 className="font-sans text-[22px] font-bold leading-snug tracking-tight text-white md:text-[24px]">
                    {section.heading}
                  </h2>
                  <div className="mt-6 space-y-7">
                    {section.body.map((paragraph: string) => (
                      <p key={paragraph} className="font-sans text-[16px] leading-[28px] text-slate-300">
                        {renderRichParagraph(paragraph)}
                      </p>
                    ))}
                  </div>
                </section>

                {/* YouTube Video Embed & Case Study */}
                {index === 1 && post.youtubeId && (
                  <section className="my-10 rounded-2xl border border-red-500/20 bg-slate-950 p-6 shadow-xl text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Youtube className="text-red-500 fill-red-500" size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                        FEATURED VIDEO CASE STUDY & CREATOR TUTORIAL
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Watch Real Creator Breakdown & Visual Example</h3>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      See how creators structure their video timelines, caption typography, and audio narration to achieve high watch retention.
                    </p>
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}`}
                        title={post.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                    </div>
                  </section>
                )}
              </div>
            ))
          ) : null}
        </div>

        {/* FAQ */}
        {post.faqs?.length ? (
          <section className="mt-14 border-t border-white/10 pt-10">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-6">
              {post.faqs.map((faq: { question: string; answer: string }) => (
                <div key={faq.question} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-sans text-[16px] font-bold text-white">{faq.question}</h3>
                  <p className="mt-2 font-sans text-[15px] leading-[26px] text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Contextual Related Product Links */}
        {productFeature.relatedLinks?.length ? (
          <section className="mt-14 rounded-2xl border border-white/10 bg-[#111827] p-7">
            <h2 className="font-sans text-lg font-bold text-white">Contextual Itnavideo Tools & Features</h2>
            <p className="mt-1 text-xs text-slate-400">Direct studio links for {productFeature.name}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {productFeature.relatedLinks.map((link: { href: string; label: string; description?: string }) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-orange-500/40 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <CheckCircle2 className="shrink-0 text-orange-400" size={16} />
                    <span>{link.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">{link.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Authoritative External Research & Standards */}
        <section className="mt-14 rounded-2xl border border-white/10 bg-[#111827] p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} className="text-orange-400" />
            <h2 className="font-sans text-lg font-bold text-white">Authoritative Industry Standards & Research</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Verified external technical documentation, official accessibility guidelines, and platform specification portals:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <a
              href="https://www.w3.org/TR/WCAG21/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white block group-hover:text-orange-400">W3C WCAG 2.1 Standard</span>
                <span className="text-slate-400 block text-[11px]">Video captions & audio contrast guidelines</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-orange-400" />
            </a>

            <a
              href="https://developers.google.com/search/docs/appearance/video"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white block group-hover:text-orange-400">Google Search Central Video SEO</span>
                <span className="text-slate-400 block text-[11px]">Structured data & indexing requirements</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-orange-400" />
            </a>

            <a
              href="https://business.instagram.com/creators"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white block group-hover:text-orange-400">Instagram Creator Best Practices</span>
                <span className="text-slate-400 block text-[11px]">Official Reels safe zones & algorithm specifications</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-orange-400" />
            </a>

            <a
              href="https://www.youtube.com/creators/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-orange-500/40 hover:bg-white/[0.06] transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-white block group-hover:text-orange-400">YouTube Creator Academy</span>
                <span className="text-slate-400 block text-[11px]">Shorts retention benchmarks & audio policies</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-orange-400" />
            </a>
          </div>
        </section>

        {/* Product Feature Spotlight Card */}
        <div className="mt-14 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-[#111827] to-[#0B0F19] p-8 shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Sparkles size={13} className="text-orange-400" />
              ITNAVIDEO {(productFeature?.category || 'Captions & Subtitles').toUpperCase()}
            </span>
            <span className="text-xs font-medium text-slate-400">• {productFeature.name}</span>
          </div>

          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-white md:text-3xl">
            {productFeature.ctaHeadline}
          </h2>

          <p className="mt-3 font-sans text-base leading-relaxed text-slate-300">
            {productFeature.ctaDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {productFeature.keyBenefits.map((benefit: string) => (
              <span key={benefit} className="inline-flex items-center gap-1 rounded-full bg-white/[0.05] border border-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <Check size={13} className="text-orange-400" />
                {benefit}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href={productFeature.dashboardUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition active:scale-98"
            >
              <span>{productFeature.ctaButtonText}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href={productFeature.landingUrl}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
            >
              <span>View Feature Specs</span>
            </Link>
          </div>
        </div>

        {/* Quick links row */}
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Related Itnavideo pages">
          <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Home</Link>
          <Link href="/features" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Features</Link>
          <Link href="/pricing" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Pricing</Link>
          <Link href="/docs" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Docs</Link>
        </nav>
      </article>

      {/* More posts section */}
      <section className="border-t border-white/10 bg-[#070A11] px-6 py-16">
        <div className="mx-auto max-w-[760px]">
          <h2 className="font-sans text-xl font-bold text-white">More from Itnavideo</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="group rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-orange-500/40 hover:shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-400">{item.category}</p>
                <h3 className="mt-2 font-sans text-lg font-bold leading-snug text-white group-hover:text-orange-400 transition">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
