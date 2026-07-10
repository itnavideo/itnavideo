'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, CheckCircle2, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('captions');
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const autoSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(value));
    }
  };

  const generateCodeSnippet = () => {
    const snippet = `  {
    slug: '${slug}',
    title: '${title.replace(/'/g, "\\'")}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    date: '${new Date().toISOString().split('T')[0]}',
    category: '${category}',
    readTime: '${Math.max(3, Math.ceil(content.split(/\s+/).length / 200))} min read',
    content: \`${content.replace(/`/g, '\\`')}\`,
  },`;

    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      toast.success('Blog post code copied! Paste it into lib/blogPosts.ts');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const publishPost = async () => {
    if (!title || !slug || !content) {
      toast.error('Title, slug, and content are required.');
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, content, category }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Blog post published!');
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent('');
      } else {
        toast.error(data.error || 'Failed to publish');
        if (data.hint) {
          console.log('[BLOG] SQL hint:', data.hint);
        }
      }
    } catch (e) {
      toast.error('Network error. Try again.');
    } finally {
      setPublishing(false);
    }
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:text-white transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Write Blog Post</h1>
            <p className="text-xs text-zinc-500">SEO content for organic traffic</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={publishPost}
            disabled={!title || !slug || !content || publishing}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-mint px-5 py-2.5 text-sm font-black text-black transition hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {publishing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            {publishing ? 'Publishing...' : 'Publish Post'}
          </button>
          <button
            onClick={generateCodeSnippet}
            disabled={!title || !slug || !content}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 xl:grid-cols-[1fr_0.6fr]">
        {/* Left: Editor */}
        <div className="space-y-5">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="How to Add Captions to Instagram Reels in 2025"
                className="mt-2 block w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm font-bold text-white placeholder:text-zinc-700 focus:border-brand-mint focus:outline-none"
              />
            </label>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">URL Slug</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="add-captions-instagram-reels"
                className="mt-2 block w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 font-mono text-sm text-zinc-300 placeholder:text-zinc-700 focus:border-brand-mint focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-zinc-600">/blog/{slug || 'your-slug-here'}</p>
            </label>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Excerpt (1-2 lines for SEO)</span>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Learn how to add professional word-level captions to your Instagram Reels using AI..."
                rows={2}
                className="mt-2 block w-full resize-none rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-brand-mint focus:outline-none"
              />
            </label>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Content (Markdown supported)</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"Write your blog post here...\n\n## Introduction\n\nStart with a hook that addresses the reader's problem...\n\n## Step 1: Upload Your Video\n\n..."}
                rows={18}
                className="mt-2 block w-full resize-y rounded-lg border border-zinc-700 bg-black px-4 py-3 font-mono text-sm leading-6 text-white placeholder:text-zinc-700 focus:border-brand-mint focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Right: Settings + Preview */}
        <div className="space-y-5">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Category</span>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {['captions', 'ai-video', 'creators', 'tutorials', 'seo', 'product'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    category === cat
                      ? 'border-brand-mint/50 bg-brand-mint/10 text-brand-mint'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stats</span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-zinc-950 p-3 text-center">
                <p className="text-lg font-black text-white">{wordCount}</p>
                <p className="text-[10px] text-zinc-500">Words</p>
              </div>
              <div className="rounded-lg bg-zinc-950 p-3 text-center">
                <p className="text-lg font-black text-white">{readTime} min</p>
                <p className="text-[10px] text-zinc-500">Read time</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">How to publish</span>
            </div>
            <ol className="space-y-2 text-xs leading-5 text-zinc-400">
              <li>1. Write your post above</li>
              <li>2. Click <strong className="text-brand-mint">"Copy Code"</strong></li>
              <li>3. Open <code className="rounded bg-zinc-950 px-1 py-0.5 text-zinc-300">lib/blogPosts.ts</code></li>
              <li>4. Paste the code at the top of the blogPosts array</li>
              <li>5. Deploy to Vercel</li>
            </ol>
          </div>

          <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4">
            <p className="text-xs font-bold text-amber-200">💡 Tip</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Target 800-1500 words. Use H2 headings for sections. Include the target keyword in title, first paragraph, and one H2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
