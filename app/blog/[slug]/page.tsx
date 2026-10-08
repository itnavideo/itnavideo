import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Youtube } from 'lucide-react';
import { blogPosts, getDbBlogPost } from '@/lib/blogPosts';
import { getPublicTopicLink, BlogInternalLinks } from '@/components/blog/BlogInternalLinks';

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

function renderRichParagraph(text: string, topicHref: string) {
  const replacements: Array<{ phrase: string; href: string }> = [
    { phrase: 'Itnavideo AI Audio Cleaner', href: '/tools/ai-audio-cleaner' },
    { phrase: 'Itnavideo Studio Dashboard', href: topicHref },
    { phrase: 'Itnavideo homepage', href: '/' },
    { phrase: 'pricing plans', href: '/pricing' },
    { phrase: 'video creation tools', href: '/video-types' },
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
            className="font-medium text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-[#FF6D00] hover:text-[#FF6D00] transition-colors"
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
  const topicLink = getPublicTopicLink(post.dashboardType, post.category, post.title);

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
    <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#FF6D00]/20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqSchema) }} /> : null}

      {/* Top Editorial Nav Header */}
      <div className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-[680px] items-center justify-between px-5 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft size={14} />
            <span>All Articles</span>
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#FF6D00] transition">
            ItnaVideo
          </Link>
        </div>
      </div>

      {/* Main Reading Column */}
      <article className="mx-auto max-w-[680px] px-5 sm:px-6 pb-20 pt-10 sm:pt-14">
        {/* Category & Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          <span className="font-bold text-slate-700">{post.category}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        {/* Title (Clean Sans Display) */}
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[42px] leading-[1.18]">
          {post.title}
        </h1>

        {/* Intro Subtitle (Editorial Serif) */}
        <p className="mt-6 font-editorial text-[20px] sm:text-[22px] leading-[1.6] text-slate-600 font-normal">
          {post.intro}
        </p>

        {/* Featured Hero Visual */}
        {post.featuredImage && (
          <figure className="my-10">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-sm">
              <img
                src={post.featuredImage}
                alt={`${post.title} - Visual Example`}
                className="w-full h-auto object-cover max-h-[420px]"
              />
            </div>
            <figcaption className="mt-2.5 text-center text-xs font-sans text-slate-400">
              Featured Visual: {post.title}
            </figcaption>
          </figure>
        )}

        {/* Subtle Divider */}
        <div className="my-10 h-px bg-slate-100" />

        {/* Excerpt Lead Paragraph */}
        <p className="font-editorial text-[19px] sm:text-[20px] leading-[1.75] text-slate-900 font-normal tracking-[-0.003em] mb-8">
          {post.excerpt}
        </p>

        {/* Article Body Content */}
        <div className="space-y-8">
          {post.contentHtml ? (
            <div
              className="prose-editorial"
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(post.contentHtml) }}
            />
          ) : post.sections ? (
            post.sections.map((section: any, index: number) => (
              <section key={section.heading} className="mt-10 first:mt-0">
                <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-6">
                  {section.body.map((paragraph: string) => (
                    <p key={paragraph} className="font-editorial text-[18px] sm:text-[19px] leading-[1.8] text-slate-800 tracking-[-0.003em]">
                      {renderRichParagraph(paragraph, topicLink.href)}
                    </p>
                  ))}
                </div>

                {/* Optional Clean Video Embed */}
                {index === 1 && post.youtubeId && (
                  <div className="my-10 rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-sm">
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${post.youtubeId}`}
                        title={post.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                    </div>
                  </div>
                )}
              </section>
            ))
          ) : null}
        </div>

        {/* FAQs Section */}
        {post.faqs?.length ? (
          <section className="mt-16 border-t border-slate-100 pt-12">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {post.faqs.map((faq: { question: string; answer: string }) => (
                <div key={faq.question}>
                  <h3 className="font-sans text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="font-editorial text-[18px] leading-[1.8] text-slate-700 tracking-[-0.003em]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Universal Minimal 2-Link System */}
        <BlogInternalLinks topicLink={topicLink} />
      </article>

      {/* Related Posts Navigation */}
      <section className="border-t border-slate-100 bg-slate-50/60 px-5 py-14">
        <div className="mx-auto max-w-[680px]">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">More Articles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="group block rounded-xl border border-slate-200/80 bg-white p-5 transition hover:border-[#FF6D00]/50 hover:shadow-sm"
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{item.category}</p>
                <h3 className="font-sans text-base font-bold leading-snug text-slate-900 group-hover:text-[#FF6D00] transition-colors line-clamp-2">
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
