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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <section className="mx-auto max-w-[900px] px-6 pb-10 pt-20">
          <h1 className="font-serif text-[42px] font-bold leading-tight tracking-tight text-gray-900 md:text-[52px]">
            Blog
          </h1>
          <p className="mt-4 max-w-xl font-serif text-xl leading-relaxed text-gray-500">
            Guides for voiceovers, text-to-video, creator assets, captions, and batch short-form video creation.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2">
            <Link href="/" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Home</Link>
            <Link href="/features" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Features</Link>
            <Link href="/pricing" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Pricing</Link>
            <Link href="/docs" className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Docs</Link>
          </nav>
        </section>
      </div>

      {/* Posts */}
      <section className="mx-auto max-w-[900px] px-6 py-12">
        <div className="divide-y divide-gray-100">
          {publishedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-8 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="font-medium text-gray-600">{post.category}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-sans text-[22px] font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition md:text-[26px]">
                {post.title}
              </h2>
              <p className="mt-2 font-serif text-[17px] leading-relaxed text-gray-500 line-clamp-2">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 group-hover:text-gray-600 transition">
                Read more
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
