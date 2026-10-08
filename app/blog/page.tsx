import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllPublishedBlogPostsAsync } from '@/lib/blogPosts';

export const metadata: Metadata = {
  title: "ItnaVideo Journal & Articles | AI Video Creation",
  description: "Editorial guides and deep dives into AI video generators, auto-caption workflows, YouTube Shorts automation, faceless videos, and short-form video algorithms.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const publishedPosts = await getAllPublishedBlogPostsAsync();

  return (
    <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-[#FF6D00]/20">
      {/* Editorial Header */}
      <div className="border-b border-slate-100 bg-white">
        <section className="mx-auto max-w-[760px] px-6 pb-12 pt-16 sm:pt-20">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FF6D00] mb-3">
            ItnaVideo Journal
          </div>
          <h1 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Articles & Insights
          </h1>
          <p className="mt-4 max-w-2xl font-editorial text-xl sm:text-[22px] leading-[1.6] text-slate-600 font-normal">
            Deep dives into AI video creation, automated captions, short-form retention mechanics, and modern media workflows.
          </p>
        </section>
      </div>

      {/* Posts List */}
      <section className="mx-auto max-w-[760px] px-6 py-12">
        <div className="divide-y divide-slate-100">
          {publishedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-10 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                <span className="font-bold text-slate-700">{post.category}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-sans text-2xl sm:text-[28px] font-bold leading-snug text-slate-900 group-hover:text-[#FF6D00] transition-colors">
                {post.title}
              </h2>
              <p className="mt-3 font-editorial text-[18px] leading-[1.75] text-slate-600 line-clamp-3">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 group-hover:text-[#FF6D00] transition-colors">
                <span>Read article</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
