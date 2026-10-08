'use client';

import React from 'react';
import { Search, Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface CmsSeoPanelProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  focusKeyword: string;
  onFocusKeywordChange: (val: string) => void;
  metaTitle: string;
  onMetaTitleChange: (val: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (val: string) => void;
}

export default function CmsSeoPanel({
  title,
  slug,
  excerpt,
  content,
  focusKeyword,
  onFocusKeywordChange,
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
}: CmsSeoPanelProps) {
  const displayTitle = metaTitle || title || 'Post Title Preview | Itnavideo';
  const displaySlug = slug || 'post-slug-preview';
  const displayDesc =
    metaDescription ||
    excerpt ||
    (content ? content.replace(/<[^>]*>/g, '').slice(0, 160) : 'Learn how to create viral AI videos with Itnavideo...');

  const kwInTitle = focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase());
  const kwInSlug = focusKeyword && slug.toLowerCase().includes(focusKeyword.toLowerCase());
  const kwInDesc = focusKeyword && displayDesc.toLowerCase().includes(focusKeyword.toLowerCase());

  let seoScore = 40;
  if (focusKeyword) seoScore += 15;
  if (kwInTitle) seoScore += 15;
  if (kwInSlug) seoScore += 15;
  if (kwInDesc) seoScore += 15;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-[#1a73e8]" />
          <h3 className="text-sm font-bold text-slate-800">SEO & SERP Optimization</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Sparkles size={13} />
          <span>Score: {seoScore}/100</span>
        </div>
      </div>

      {/* Focus Keyword */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">Focus Keyword</label>
        <input
          type="text"
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          placeholder="e.g. auto caption generator AI"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
        />
      </div>

      {/* Meta Title */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <label className="font-bold text-slate-700">Meta Title</label>
          <span className={metaTitle.length > 60 ? 'text-amber-600 font-semibold' : 'text-slate-400'}>
            {metaTitle.length}/60 chars
          </span>
        </div>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder={title || 'Custom SEO Meta Title'}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
        />
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <label className="font-bold text-slate-700">Meta Description</label>
          <span className={metaDescription.length > 160 ? 'text-amber-600 font-semibold' : 'text-slate-400'}>
            {metaDescription.length}/160 chars
          </span>
        </div>
        <textarea
          rows={3}
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder={excerpt || 'Custom SEO Meta Description'}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none resize-none"
        />
      </div>

      {/* Google SERP Snippet Preview */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Google Search Snippet Preview
        </span>
        <div className="text-xs text-emerald-800 truncate font-mono">
          https://www.itnavideo.com/blog/{displaySlug}
        </div>
        <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
          {displayTitle}
        </div>
        <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {displayDesc}
        </div>
      </div>

      {/* Quick Checklist */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          {kwInTitle ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <AlertCircle size={14} className="text-slate-400" />
          )}
          <span className={kwInTitle ? 'text-slate-800 font-medium' : 'text-slate-500'}>
            Focus keyword in title
          </span>
        </div>
        <div className="flex items-center gap-2">
          {kwInSlug ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <AlertCircle size={14} className="text-slate-400" />
          )}
          <span className={kwInSlug ? 'text-slate-800 font-medium' : 'text-slate-500'}>
            Focus keyword in URL slug
          </span>
        </div>
        <div className="flex items-center gap-2">
          {kwInDesc ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <AlertCircle size={14} className="text-slate-400" />
          )}
          <span className={kwInDesc ? 'text-slate-800 font-medium' : 'text-slate-500'}>
            Focus keyword in meta description
          </span>
        </div>
      </div>
    </div>
  );
}
