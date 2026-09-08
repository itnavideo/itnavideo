'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Globe,
  Clock,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Layers,
  Settings,
  Search,
  ChevronRight,
  Eye,
  FileCode,
  Copy,
  Plus,
  Loader2,
  Trash2,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import CmsTiptapEditor from '@/components/admin/cms/CmsTiptapEditor';
import CmsSeoPanel from '@/components/admin/cms/CmsSeoPanel';
import CmsMediaPickerModal from '@/components/admin/cms/CmsMediaPickerModal';

export default function EditCmsPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('auto-caption-reel');
  const [author, setAuthor] = useState('Founder @ Itnavideo');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('published');
  const [scheduledAt, setScheduledAt] = useState('');
  const [promotedTool, setPromotedTool] = useState('auto-caption-reel');

  // SEO states
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Gutenberg UI states
  const [saving, setSaving] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'settings' | 'seo' | 'static_code'>('settings');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    if (!postId) return;
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cms/posts/${postId}`);
      const data = await res.json();
      if (data.ok && data.post) {
        const p = data.post;
        setTitle(p.title || '');
        setSlug(p.slug || '');
        setContent(p.content || '');
        setExcerpt(p.excerpt || '');
        setCategory(p.category || 'auto-caption-reel');
        setAuthor(p.author || 'Founder @ Itnavideo');
        setFeaturedImage(p.featured_image || '');
        setStatus(p.status || 'draft');
        setScheduledAt(p.scheduled_at || '');
        setFocusKeyword(p.focus_keyword || '');
        setMetaTitle(p.seo_title || '');
        setMetaDescription(p.seo_description || '');
        setPromotedTool(p.promoted_tool || 'auto-caption-reel');
      } else {
        toast.error('Post not found');
        router.push('/admin/cms');
      }
    } catch (e) {
      toast.error('Failed to load post data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (targetStatus?: 'draft' | 'scheduled' | 'published') => {
    const finalStatus = targetStatus || status;
    if (!title.trim()) {
      toast.error('Post title is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('URL Slug is required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cms/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          category,
          author,
          featured_image: featuredImage,
          status: finalStatus,
          scheduled_at: finalStatus === 'scheduled' ? scheduledAt : null,
          seo_title: metaTitle || title,
          seo_description: metaDescription || excerpt,
          focus_keyword: focusKeyword,
          promoted_tool: promotedTool,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(`Post successfully updated (${finalStatus.toUpperCase()})!`);
      } else {
        toast.error(data.error || 'Failed to update post');
      }
    } catch (e) {
      toast.error('An error occurred while updating');
    } finally {
      setSaving(false);
    }
  };

  const generateStaticCodeSnippet = () => {
    return `  {
    slug: '${slug || 'article-slug'}',
    title: '${title.replace(/'/g, "\\'")}',
    excerpt: '${(excerpt || '').replace(/'/g, "\\'")}',
    date: '${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}',
    readTime: '5 min read',
    category: '${category}',
    intro: '${(excerpt || '').replace(/'/g, "\\'")}',
    dashboardType: '${promotedTool}',
    keywords: ['${focusKeyword || category}', 'itnavideo', 'ai-video'],
    sections: [
      {
        heading: '${title.replace(/'/g, "\\'")}',
        body: [
          '${(excerpt || '').replace(/'/g, "\\'")}'
        ]
      }
    ]
  },`;
  };

  const handleCopyStaticCode = () => {
    navigator.clipboard.writeText(generateStaticCodeSnippet());
    toast.success('Static TypeScript snippet copied for lib/blogPosts.ts!');
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Article Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                WordPress Block Editor
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-[#1a73e8]">Edit Article</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              itnavideo.com/blog/{slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/blog/${slug}`}
            target="_blank"
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition flex items-center gap-1"
          >
            <Eye size={13} /> View Live
          </Link>
          <button
            onClick={() => handleSave(status === 'published' ? 'published' : 'draft')}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            {saving ? 'Saving...' : 'Update Article'}
          </button>
        </div>
      </div>

      {/* Gutenberg 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Content Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Document Title & Permalink Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <input
              type="text"
              placeholder="Add title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder-slate-300 bg-transparent border-0 focus:outline-none focus:ring-0 px-0"
            />

            {/* Live Permalink */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-400">Permalink:</span>
              <span className="text-slate-400 font-mono">https://itnavideo.com/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
                className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs font-mono text-[#1a73e8] focus:border-[#1a73e8] focus:outline-none"
              />
            </div>

            {/* Summary / Excerpt */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-600 block mb-1 uppercase tracking-wider text-[10px]">
                Summary / Intro Hook
              </label>
              <textarea
                rows={2}
                placeholder="Short 2-sentence summary for search engines and social cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
              />
            </div>
          </div>

          {/* Tiptap Rich Text Editor */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <CmsTiptapEditor
              content={content}
              onChange={(html) => setContent(html)}
              placeholder="Write your article here, add headings, lists, tables, callout boxes, or insert media..."
            />
          </div>
        </div>

        {/* Right: Gutenberg Inspector Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Sidebar Tabs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs flex items-center gap-1">
            <button
              onClick={() => setSidebarTab('settings')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                sidebarTab === 'settings'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Post Settings
            </button>
            <button
              onClick={() => setSidebarTab('seo')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                sidebarTab === 'seo'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#34a853]" />
              RankMath SEO
            </button>
            <button
              onClick={() => setSidebarTab('static_code')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                sidebarTab === 'static_code'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Static Code
            </button>
          </div>

          {/* Tab 1: Post Settings */}
          {sidebarTab === 'settings' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Publish Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none font-semibold"
                >
                  <option value="published">Published (Live to Google)</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft (Work in progress)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
                >
                  <option value="auto-caption-reel">Auto Caption Reel</option>
                  <option value="compare-explainer">Compare Explainer</option>
                  <option value="typography-video">Typography Video</option>
                  <option value="whiteboard-video">Whiteboard Video</option>
                  <option value="long-video-promo">Long Video Promo</option>
                  <option value="long-video-clips">Long Video Clips</option>
                  <option value="general">General AI & Video</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Promoted Studio Tool</label>
                <select
                  value={promotedTool}
                  onChange={(e) => setPromotedTool(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
                >
                  <option value="auto-caption-reel">Auto Caption Reel (/dashboard?videoType=auto-caption-reel)</option>
                  <option value="compare-explainer">Compare Explainer (/dashboard?videoType=compare-explainer)</option>
                  <option value="typography-video">Typography Video (/dashboard?videoType=typography-video)</option>
                  <option value="long-video-clips">Long Video Clips (/dashboard?videoType=long-video-clips)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Author Byline</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Featured Image</label>
                {featuredImage ? (
                  <div className="space-y-2">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-36 object-cover rounded-xl border border-slate-200"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsMediaModalOpen(true)}
                        className="flex-1 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Replace Image
                      </button>
                      <button
                        onClick={() => setFeaturedImage('')}
                        className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsMediaModalOpen(true)}
                    className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#1a73e8] hover:bg-blue-50/20 transition group"
                  >
                    <ImageIcon size={24} className="text-slate-400 group-hover:text-[#1a73e8]" />
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-[#1a73e8]">
                      Select from Cloudinary CDN
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: RankMath SEO Panel */}
          {sidebarTab === 'seo' && (
            <CmsSeoPanel
              title={title}
              slug={slug}
              excerpt={excerpt}
              content={content}
              focusKeyword={focusKeyword}
              onFocusKeywordChange={setFocusKeyword}
              metaTitle={metaTitle}
              onMetaTitleChange={setMetaTitle}
              metaDescription={metaDescription}
              onMetaDescriptionChange={setMetaDescription}
            />
          )}

          {/* Tab 3: Static Code Exporter */}
          {sidebarTab === 'static_code' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">lib/blogPosts.ts Export</h4>
                  <p className="text-[11px] text-slate-500">Instant static in-code snippet</p>
                </div>
                <button
                  onClick={handleCopyStaticCode}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1967d2] text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Copy size={12} /> Copy Code
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800 custom-scrollbar leading-relaxed">
                <pre>{generateStaticCodeSnippet()}</pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cloudinary Media Modal */}
      {isMediaModalOpen && (
        <CmsMediaPickerModal
          onSelect={(url) => {
            setFeaturedImage(url);
            setIsMediaModalOpen(false);
          }}
          onClose={() => setIsMediaModalOpen(false)}
        />
      )}
    </div>
  );
}
