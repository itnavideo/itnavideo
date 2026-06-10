import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';
import { blogPosts } from '@/lib/blogPosts';

export const metadata: Metadata = {
  title: "AI Video Blog",
  description: "Guides for AI video generator tools, AI reel generator workflows, YouTube Shorts generator ideas, script to video, video to reel, faceless videos, and AI captions/subtitles.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
          <Newspaper size={16} />
          AI Blog
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">AI video tips for creators.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          Guides for voiceovers, text-to-video, creator assets, captions, and batch short-form video creation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            Home
          </Link>
          <Link href="/features" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            Features
          </Link>
          <Link href="/pricing" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            Pricing
          </Link>
          <Link href="/docs" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
            Docs
          </Link>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border border-white/10 bg-zinc-950 p-6 transition hover:border-brand-mint/40 hover:bg-zinc-900"
            >
              <div className="mb-5 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-black leading-tight text-white">{post.title}</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{post.excerpt}</p>
              <div className="mt-7 inline-flex items-center gap-2 text-sm font-black text-brand-mint">
                Read guide
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
