import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllPublishedBlogPostsAsync } from '@/lib/blogPosts';

export const metadata: Metadata = {
  title: "AI Video Blog",
  description: "Guides for AI video generator tools, AI reel generator workflows, YouTube Shorts generator ideas, script to video, video to reel, faceless videos, and AI captions/subtitles.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const publishedPosts = await getAllPublishedBlogPostsAsync();


  return (
    <main className="min-h-screen bg-[#08070B] text-slate-100 pt-16">
      {/* Header */}
      <div className="border-b border-white/10">
        <section className="mx-auto max-w-[900px] px-6 pb-12 pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400 mb-4">
            <span>Video AI Guides & Tutorials</span>
          </div>
          <h1 className="font-sans text-[38px] font-black leading-tight tracking-tight text-white md:text-[50px]">
            AI Video Blog &amp; Guides
          </h1>
          <p className="mt-4 max-w-xl font-sans text-base sm:text-lg leading-relaxed text-slate-400">
            Guides for voiceovers, text-to-video, creator assets, captions, and batch short-form video creation.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Home</Link>
            <Link href="/features" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Features</Link>
            <Link href="/pricing" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Pricing</Link>
            <Link href="/docs" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-orange-500/40 hover:text-orange-400">Docs</Link>
          </nav>
        </section>
      </div>

      {/* Posts */}
      <section className="mx-auto max-w-[900px] px-6 py-12">
        <div className="divide-y divide-white/10">
          {publishedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-8 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="font-bold text-orange-400">{post.category}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-sans text-[22px] font-bold leading-snug text-white group-hover:text-orange-400 transition md:text-[26px]">
                {post.title}
              </h2>
              <p className="mt-2 font-sans text-[15px] leading-relaxed text-slate-400 line-clamp-2">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:text-orange-300 transition">
                Read guide
                <ArrowRight size={14} className="transition group-hover:translate-x-1 text-orange-400" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
