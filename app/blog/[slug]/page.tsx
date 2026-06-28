import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { blogPosts, getBlogPost } from '@/lib/blogPosts';

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
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      url: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-[#0B1120] px-6 pb-24 pt-32 text-white">
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

        <div className="mt-14 rounded-lg border p-7" style={{ borderColor: 'rgba(37, 99, 235, 0.2)', background: 'rgba(37, 99, 235, 0.06)' }}>
          <h2 className="text-2xl font-black">Ready to create your next short?</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Upload a voiceover, add your media, choose a style, and generate a ready-to-post video. You can also
            compare plans on the <Link href="/pricing" className="font-bold underline-offset-4 hover:underline" style={{ color: 'var(--color-primary-hover)' }}>pricing page</Link> or
            read the <Link href="/docs" className="font-bold underline-offset-4 hover:underline" style={{ color: 'var(--color-primary-hover)' }}>quick docs</Link>.
          </p>
          <Link
            href="/signup"
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
