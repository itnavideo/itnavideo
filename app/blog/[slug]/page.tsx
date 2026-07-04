import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { blogPosts, getBlogPost } from '@/lib/blogPosts';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itnavideo.com').replace(/\/$/, '');

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return {};

  return {
    title: post.title,
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);
  const dashboardType = post.dashboardType || 'dynamic-creator-reel';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Itnavideo',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Itnavideo',
    },
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
        mainEntity: post.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <main className="min-h-screen bg-[#0B1120] px-6 pb-24 pt-32 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(faqSchema) }} /> : null}

      <article className="mx-auto max-w-4xl">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-white">
          <ArrowLeft size={16} />
          Back to blog
        </Link>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-mint">
          <span>{post.category}</span>
          <span className="text-zinc-700">/</span>
          <span>{post.date}</span>
          <span className="text-zinc-700">/</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">{post.title}</h1>
        <p className="mt-7 text-xl font-semibold leading-9 text-zinc-200">{post.intro}</p>
        <p className="mt-7 text-xl leading-8 text-zinc-400">{post.excerpt}</p>

        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Related Itnavideo pages">
          <Link href="/" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            Itnavideo home
          </Link>
          <Link href={`/dashboard?type=${dashboardType}`} className="rounded-lg border border-brand-mint/25 bg-brand-mint/10 px-4 py-2 text-sm font-bold text-brand-mint transition hover:bg-brand-mint hover:text-black">
            Create video now
          </Link>
          <Link href="/features" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            AI video features
          </Link>
          <Link href="/docs" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            Documentation
          </Link>
          <Link href="/pricing" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            Pricing
          </Link>
        </nav>

        <div className="mt-14 space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl font-black">{section.heading}</h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-zinc-300">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {post.faqs?.length ? (
          <section className="mt-14">
            <h2 className="text-3xl font-black">FAQ</h2>
            <div className="mt-6 space-y-4">
              {post.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="font-black text-white">{faq.question}</h3>
                  <p className="mt-3 leading-7 text-zinc-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {post.internalLinks?.length ? (
          <section className="mt-14 rounded-lg border border-white/10 bg-zinc-950 p-7">
            <h2 className="text-2xl font-black">Related pages</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {post.internalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-zinc-200 transition hover:border-brand-mint/40 hover:bg-white/10">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-mint" size={17} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-14 rounded-lg border p-7" style={{ borderColor: 'rgba(37, 99, 235, 0.2)', background: 'rgba(37, 99, 235, 0.06)' }}>
          <h2 className="text-2xl font-black">Ready to create your next short?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Upload a voiceover, add your media, choose a style, and generate a ready-to-post video. You can also
            compare plans on the <Link href="/pricing" className="font-bold underline-offset-4 hover:underline" style={{ color: 'var(--color-primary-hover)' }}>pricing page</Link> or
            read the <Link href="/docs" className="font-bold underline-offset-4 hover:underline" style={{ color: 'var(--color-primary-hover)' }}>quick docs</Link>.
          </p>
          <Link
            href={`/dashboard?type=${dashboardType}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-3 font-black text-white transition hover:-translate-y-[1px]"
            style={{ background: 'var(--color-primary-hover)' }}
          >
            Start creating
            <ArrowRight size={16} />
          </Link>
        </div>
      </article>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-2xl font-black">More guides</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {related.map((item) => (
            <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-lg border border-white/10 bg-zinc-950 p-5 transition hover:border-brand-mint/40">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{item.category}</p>
              <h3 className="mt-3 text-lg font-black leading-tight">{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
