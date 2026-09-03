'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, CheckCircle2, BookOpen, Loader2, Sparkles, Target, Zap, Link as LinkIcon, Video, AlertOctagon, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { planStrategicArticle } from '@/lib/blogPlanner';
import { auditArticleQuality } from '@/lib/blogQualityAuditor';

export default function AdminNewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('captions');
  const [dashboardType, setDashboardType] = useState('auto-caption-reel');
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
    dashboardType: '${dashboardType}',
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
    if (wordCount < 1500) {
      toast.error(`Minimum 1,500 words required to publish. Current: ${wordCount} words.`);
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, content, category, dashboardType }),
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
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Promoted Product Feature</span>
            <select
              value={dashboardType}
              onChange={(e) => setDashboardType(e.target.value)}
              className="mt-3 block w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-xs font-bold text-brand-mint focus:border-brand-mint focus:outline-none"
            >
              <option value="auto-caption-reel">Auto Caption Reel & 3D Subtitles</option>
              <option value="compare-explainer">Compare Explainer (IIT vs ITI)</option>
              <option value="whiteboard-video">Whiteboard AI Sketch Explainer</option>
              <option value="typography-video">Kinetic Typography Video</option>
              <option value="long-video-promo">Long Video Teaser & Promo</option>
              <option value="long-caption-pro">Long-Form Video Caption Pro</option>
              <option value="long-video-clips">Multi-Clip AI Highlight Extractor</option>
              <option value="multi-images-video">Image Story & Photo Slideshow</option>
              <option value="caption-studio">Custom Subtitle & Font Studio</option>
              <option value="faceless-long-video">AI Faceless Video & Narration</option>
              <option value="ai-audio-cleaner">AI Voice Cleaner & Noise Remover</option>
            </select>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Word Count & SEO Status</span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className={`rounded-lg p-3 text-center border ${wordCount >= 1500 ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-amber-500/30 bg-amber-950/20'}`}>
                <p className={`text-lg font-black ${wordCount >= 1500 ? 'text-emerald-400' : 'text-amber-400'}`}>{wordCount}</p>
                <p className="text-[10px] font-bold text-zinc-400">{wordCount >= 1500 ? '✓ PASSED (1,500+)' : 'Min 1,500 Words'}</p>
              </div>
              <div className="rounded-lg bg-zinc-950 p-3 text-center border border-zinc-800">
                <p className="text-lg font-black text-white">{readTime} min</p>
                <p className="text-[10px] text-zinc-500">Est. Read Time</p>
              </div>
            </div>
          </div>

          {/* Strategic Content Blueprint Card */}
          {(() => {
            const plan = planStrategicArticle(title || 'How to create viral social reels with AI captions', dashboardType);
            return (
              <div className="rounded-lg border-2 border-brand-mint/30 bg-zinc-950 p-5 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-brand-mint font-black text-xs uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>STRATEGIC CONTENT BLUEPRINT</span>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div>
                    <strong className="text-white block font-bold">1. Search Intent & Target Query:</strong>
                    <span className="text-zinc-400">{plan.targetSearchQuery}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-bold">2. Identified Creator Problem:</strong>
                    <span className="text-zinc-400">{plan.userProblem}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-bold">3. Promoted Itnavideo Solution:</strong>
                    <span className="text-brand-mint font-bold">{plan.featureSolution}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-bold">4. Studio URL & Feature Link:</strong>
                    <span className="text-zinc-400 font-mono text-[11px]">{plan.targetDashboardUrl}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-bold">5. Video Demo Case Study:</strong>
                    <span className="text-zinc-400">{plan.relevantVideoExample.title}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-bold">6. Conversion CTA Text:</strong>
                    <span className="text-emerald-400 font-bold">{plan.ctaButtonText}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 24-Point Quality Audit Gatekeeper Card */}
          {(() => {
            const audit = auditArticleQuality({ title, slug, excerpt, content, category, dashboardType });
            return (
              <div className={`rounded-lg border-2 p-5 space-y-3 shadow-lg ${audit.passed ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-amber-500/40 bg-zinc-950'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-white">
                    <CheckSquare size={15} className={audit.passed ? 'text-emerald-400' : 'text-amber-400'} />
                    <span>AUTOMATED QUALITY AUDIT ({audit.score}%)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${audit.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {audit.passed ? '✓ GATEKEEPER PASSED' : `${audit.criticalFailures.length} CRITICAL BLOCKS`}
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 text-[11px] pr-1 scrollbar-thin">
                  {audit.checks.map((chk) => (
                    <div key={chk.id} className="flex items-start gap-2 py-0.5 border-b border-zinc-800/60 last:border-0">
                      <span className={`shrink-0 font-bold ${chk.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {chk.passed ? '✓' : '✕'}
                      </span>
                      <div className="leading-tight">
                        <span className={chk.passed ? 'text-zinc-300 font-medium' : 'text-red-300 font-bold'}>{chk.label}</span>
                        <p className="text-[10px] text-zinc-500">{chk.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

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
