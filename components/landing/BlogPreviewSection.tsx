'use client';

import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { blogPosts } from '@/lib/blogPosts';

export default function BlogPreviewSection() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="bg-[#021a0a] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-primary">Creator guides</p>
            <h2 className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl">
              Learn AI video creation.
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            View all guides
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border border-white/10 bg-zinc-950 p-6 transition hover:border-emerald-400/40 hover:bg-zinc-900"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400/10 text-primary">
                <Newspaper size={20} />
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{post.category}</p>
              <h3 className="text-xl font-black leading-tight text-white">{post.title}</h3>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{post.excerpt}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
                Read guide
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

