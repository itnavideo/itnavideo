'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import CmsTiptapEditor from '@/components/admin/cms/CmsTiptapEditor';

export default function NewCustomPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const autoSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(val));
    }
  };

  const handleSavePage = async (status: 'draft' | 'published') => {
    if (!title || !slug) {
      toast.error('Title and Slug are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          status,
          seoTitle: seoTitle || title,
          metaDescription: metaDescription || excerpt,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(`Custom Page saved as ${status.toUpperCase()}!`);
        router.push('/admin/cms');
      } else {
        toast.error(data.error || 'Failed to save custom page');
      }
    } catch (e) {
      toast.error('Network error saving page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-sm font-bold text-slate-900">New Custom Landing Page ({title || 'Untitled'})</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSavePage('draft')}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save size={14} />} Save Draft
          </button>
          <button
            onClick={() => handleSavePage('published')}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send size={14} />} Publish Page
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <input
            type="text"
            placeholder="Page Title (e.g. Terms of Service, Privacy Policy, Pricing Guide)..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-2xl font-black bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-mono">
            <span>Permalink: https://itnavideo.com/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-transparent border-b border-dashed border-slate-300 text-slate-800 focus:outline-none focus:border-[#1a73e8]"
            />
          </div>

          <textarea
            placeholder="Short description / page excerpt..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a73e8]"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
            Page Body Content
          </label>
          <CmsTiptapEditor
            content={content}
            onChange={(html) => setContent(html)}
            placeholder="Design and structure your custom landing page here..."
          />
        </div>

        {/* SEO Metadata Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Meta Information</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">SEO Title</label>
              <input
                type="text"
                placeholder={title || 'Page Meta Title'}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Meta Description</label>
              <textarea
                placeholder={excerpt || 'Meta description for Google SERP...'}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
