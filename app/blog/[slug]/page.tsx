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
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqSchema) }} /> : null}

      {/* Top nav bar */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[700px] items-center justify-between px-6 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900">
            <ArrowLeft size={16} />
            All posts
          </Link>
          <Link href="/dashboard" className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800">
            Create video
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-[700px] px-6 pb-24 pt-12">
        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{post.category}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="font-sans text-[32px] font-bold leading-[1.2] tracking-tight text-[#242424] md:text-[42px]">
          {post.title}
        </h1>

        {/* Subtitle / Intro */}
        <p className="mt-8 font-serif text-[20px] leading-[32px] text-[#242424]">
          {post.intro}
        </p>

        {/* Featured Hero Visual Banner (Matching Itnavideo Visual Brand Identity) */}
        <div className="my-10 overflow-hidden rounded-2xl border border-slate-800 bg-[#09090b] p-3 shadow-2xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-900 group">
            <img
              src={post.featuredImage || `/preview/${productFeature.previewImage}`}
              alt={`${post.title} - Itnavideo AI Video Creation Studio Feature Visual`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00FF9D]/20 border border-[#00FF9D]/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#00FF9D] backdrop-blur-md">
                  <Sparkles size={12} />
                  ITNAVIDEO {(productFeature?.name || 'Auto Caption Reel').toUpperCase()} STUDIO
                </span>
                <Link
                  href={productFeature.dashboardUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#00FF9D] px-4 py-2 text-xs font-black text-black shadow-md hover:bg-white transition hover:scale-105"
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
        <div className="my-10 h-px bg-gray-200" />

        {/* Excerpt as lead paragraph */}
        <p className="font-serif text-[18px] leading-[32px] text-[#242424] tracking-[-0.003em]">
          {post.excerpt}
        </p>

        {/* Key Takeaways & Executive Summary Card */}
        <div className="my-8 rounded-2xl border border-amber-200/90 bg-amber-50/70 p-6 text-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-amber-600 fill-amber-600/20" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-amber-900">
              KEY TAKEAWAYS & EXECUTIVE SUMMARY
            </span>
          </div>
          <ul className="space-y-2.5 text-xs leading-relaxed text-slate-700 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Strategic Alignment:</strong> High retention social video creation requires clear visual hooks and automated word-level captions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Productivity Accelerator:</strong> Itnavideo cloud Remotion rendering replaces 3+ hours of manual keyframing with 60-second automation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Accessibility & Retention:</strong> Hardcoded burned-in subtitles ensure 100% viewer retention on muted mobile feeds.</span>
            </li>
          </ul>
        </div>

        {/* Sections / HTML Body */}
        {/* Sections / HTML Body */}
        <div className="mt-12 space-y-12">
          {post.contentHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(post.contentHtml) }}
            />
          ) : post.sections ? (
            post.sections.map((section: any, index: number) => (
              <div key={section.heading} className="space-y-10">
                <section>
                  <h2 className="font-sans text-[22px] font-bold leading-snug tracking-tight text-gray-900 md:text-[24px]">
                    {section.heading}
                  </h2>
                  <div className="mt-6 space-y-7">
                    {section.body.map((paragraph: string) => (
                      <p key={paragraph} className="font-serif text-[18px] leading-[32px] text-[#242424] tracking-[-0.003em]">
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
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
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
          <section className="mt-14 border-t border-gray-100 pt-10">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-6">
              {post.faqs.map((faq: { question: string; answer: string }) => (
                <div key={faq.question}>
                  <h3 className="font-sans text-[17px] font-bold text-[#242424]">{faq.question}</h3>
                  <p className="mt-2 font-serif text-[18px] leading-[32px] text-[#242424] tracking-[-0.003em]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Contextual Related Product Links */}
        {productFeature.relatedLinks?.length ? (
          <section className="mt-14 rounded-2xl border border-slate-200 bg-slate-50/70 p-7">
            <h2 className="font-sans text-lg font-bold text-slate-900">Contextual Itnavideo Tools & Features</h2>
            <p className="mt-1 text-xs text-slate-500">Direct studio links for {productFeature.name}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {productFeature.relatedLinks.map((link: { href: string; label: string; description?: string }) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                    <CheckCircle2 className="shrink-0 text-blue-600" size={16} />
                    <span>{link.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">{link.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Authoritative External Research & Standards */}
        <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} className="text-blue-600" />
            <h2 className="font-sans text-lg font-bold text-slate-900">Authoritative Industry Standards & Research</h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Verified external technical documentation, official accessibility guidelines, and platform specification portals:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <a
              href="https://www.w3.org/TR/WCAG21/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:border-blue-400 hover:bg-blue-50/30 transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block group-hover:text-blue-700">W3C Web Content Accessibility (WCAG 2.1)</span>
                <span className="text-slate-500 block text-[11px]">Official W3C subtitle & contrast compliance rules</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-blue-600" />
            </a>

            <a
              href="https://groq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:border-blue-400 hover:bg-blue-50/30 transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block group-hover:text-blue-700">Groq Speech AI Engine Architecture</span>
                <span className="text-slate-500 block text-[11px]">Ultra-fast Whisper speech-to-text benchmark specs</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-blue-600" />
            </a>

            <a
              href="https://creators.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:border-blue-400 hover:bg-blue-50/30 transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block group-hover:text-blue-700">Instagram Creator Portal Guidelines</span>
                <span className="text-slate-500 block text-[11px]">Official Reels safe zones & algorithm specifications</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-blue-600" />
            </a>

            <a
              href="https://www.youtube.com/creators/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:border-blue-400 hover:bg-blue-50/30 transition group"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block group-hover:text-blue-700">YouTube Creator Academy Specifications</span>
                <span className="text-slate-500 block text-[11px]">Shorts retention benchmarks & audio policies</span>
              </div>
              <ExternalLink size={14} className="text-slate-400 shrink-0 group-hover:text-blue-600" />
            </a>
          </div>
        </section>

        {/* Product Feature Spotlight Card */}
        <div className="mt-14 rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
              <Sparkles size={13} className="text-blue-600" />
              ITNAVIDEO {(productFeature?.category || 'Captions & Subtitles').toUpperCase()}
            </span>
            <span className="text-xs font-medium text-slate-500">• {productFeature.name}</span>
          </div>

          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {productFeature.ctaHeadline}
          </h2>

          <p className="mt-3 font-serif text-base leading-relaxed text-slate-600">
            {productFeature.ctaDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {productFeature.keyBenefits.map((benefit) => (
              <span key={benefit} className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs">
                <Check size={13} className="text-emerald-500" />
                {benefit}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href={productFeature.dashboardUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:translate-y-0"
            >
              <span>{productFeature.ctaButtonText}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href={productFeature.landingUrl}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span>View Feature Specs</span>
            </Link>
          </div>
        </div>

        {/* Quick links row */}
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Related Itnavideo pages">
          <Link href="/" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Home</Link>
          <Link href="/features" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Features</Link>
          <Link href="/pricing" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Pricing</Link>
          <Link href="/docs" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Docs</Link>
        </nav>
      </article>

      {/* More posts section */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-[700px]">
          <h2 className="font-sans text-xl font-bold text-gray-900">More from Itnavideo</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-md">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{item.category}</p>
                <h3 className="mt-3 font-sans text-lg font-bold leading-snug text-gray-900 group-hover:text-gray-700">
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
