import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itnavideo.com').replace(/\/$/, '');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabase();
  if (!supabase) return {};

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!page) return {};

  return {
    title: page.seo_title || page.title,
    description: page.meta_description || page.excerpt,
    alternates: {
      canonical: page.canonical_url || `/p/${page.slug}`,
    },
    openGraph: {
      title: page.og_title || page.seo_title || page.title,
      description: page.og_description || page.meta_description || page.excerpt,
      url: `${siteUrl}/p/${page.slug}`,
      images: [page.og_image || page.featured_image || `${siteUrl}/preview/Auto Caption Reel.png`],
    },
  };
}

export default async function PublicCustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabase();
  if (!supabase) notFound();

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="border-b border-gray-100 bg-gray-50/50 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition mb-6"
          >
            <ArrowLeft size={14} /> Back to Itnavideo Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 font-sans leading-tight">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="mt-4 text-xl text-gray-600 font-serif leading-relaxed italic">
              {page.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <article
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-sans"
          dangerouslySetInnerHTML={{ __html: page.content || '' }}
        />
      </div>
    </main>
  );
}

