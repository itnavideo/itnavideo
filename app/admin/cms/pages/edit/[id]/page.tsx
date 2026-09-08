'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import CmsTiptapEditor from '@/components/admin/cms/CmsTiptapEditor';

export default function EditCustomPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    if (id) fetchPage();
  }, [id]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cms/pages/${id}`);
      const data = await res.json();
      if (data.ok && data.page) {
        const pg = data.page;
        setTitle(pg.title || '');
        setSlug(pg.slug || '');
        setExcerpt(pg.excerpt || '');
        setContent(pg.content || '');
        setStatus(pg.status || 'draft');
        setSeoTitle(pg.seo_title || pg.title || '');
        setMetaDescription(pg.meta_description || pg.excerpt || '');
      } else {
        toast.error('Page not found');
        router.push('/admin/cms');
      }
    } catch (e) {
      toast.error('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePage = async (targetStatus?: 'draft' | 'published') => {
    if (!title) {
      toast.error('Title is required.');
      return;
    }
    const finalStatus = targetStatus || status;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cms/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          status: finalStatus,
          seoTitle: seoTitle || title,
          metaDescription: metaDescription || excerpt,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(`Custom Page updated! Status: ${finalStatus.toUpperCase()}`);
        setStatus(finalStatus);
      } else {
        toast.error(data.error || 'Failed to update page');
      }
    } catch (e) {
      toast.error('Error updating page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a73e8]" />
      </div>
    );
  }

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
          <h1 className="text-sm font-bold text-slate-900">Edit Custom Page ({title || 'Untitled'})</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdatePage('draft')}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save size={14} />} Save Draft
          </button>
          <button
            onClick={() => handleUpdatePage('published')}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send size={14} />} Update & Publish
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <input
            type="text"
            placeholder="Page Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
