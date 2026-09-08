'use client';

import React, { useState } from 'react';
import { Search, Globe, Share2, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface CmsSeoPanelProps {
  title: string;
  slug: string;
  excerpt?: string;
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
  excerpt = '',
  content,
  focusKeyword,
  onFocusKeywordChange,
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
}: CmsSeoPanelProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'social'>('search');

  const wordCount = content ? content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length : 0;
  const currentTitle = metaTitle || title || '';
  const currentDesc = metaDescription || excerpt || '';

  // SEO Quality Checks
  const checks = [
    {
      label: 'SEO Title length (40–65 characters)',
      passed: currentTitle.length >= 40 && currentTitle.length <= 65,
      note: `${currentTitle.length} chars`,
    },
    {
      label: 'Meta Description length (120–165 characters)',
      passed: currentDesc.length >= 100 && currentDesc.length <= 165,
      note: `${currentDesc.length} chars`,
    },
    {
      label: 'Focus keyword specified',
      passed: focusKeyword.trim().length > 0,
      note: focusKeyword ? `"${focusKeyword}"` : 'Missing',
    },
    {
      label: 'Focus keyword in SEO Title',
      passed: focusKeyword ? currentTitle.toLowerCase().includes(focusKeyword.toLowerCase()) : false,
      note: focusKeyword ? (currentTitle.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'Found' : 'Missing') : 'N/A',
    },
    {
      label: 'Article word count (>500 words)',
      passed: wordCount >= 500,
      note: `${wordCount} words`,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
      {/* Header & Score Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[#1a73e8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            RankMath SEO Audit
          </h3>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono">
          <span
            className={`h-2 w-2 rounded-full ${
              scorePercent >= 80 ? 'bg-[#34a853] shadow-[0_0_6px_#34a853]' : scorePercent >= 60 ? 'bg-[#fbbc04]' : 'bg-[#ea4335]'
            }`}
          />
          <span className="font-bold text-slate-800">{scorePercent}/100 Score</span>
        </div>
      </div>

      {/* Focus Keyword */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1.5">Focus Keyword</label>
        <input
          type="text"
          placeholder="e.g. kinetic typography video maker"
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
        />
      </div>

      {/* Google SERP Snippet Preview */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Google SERP Preview
        </span>
        <div className="text-[11px] text-slate-500 font-mono truncate">
          https://itnavideo.com › blog › {slug || 'article-slug'}
        </div>
        <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
          {currentTitle || 'Your Post Title Here | Itnavideo AI'}
        </div>
        <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {currentDesc || 'Add a compelling meta description to improve click-through rates from Google search results...'}
        </div>
      </div>

      {/* SEO Title Input */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-slate-700">SEO Meta Title</label>
          <span className={`text-[10px] font-mono ${currentTitle.length >= 40 && currentTitle.length <= 65 ? 'text-[#34a853]' : 'text-slate-400'}`}>
            {currentTitle.length}/60 chars
          </span>
        </div>
        <input
          type="text"
          placeholder={title || 'Custom search engine title...'}
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
        />
      </div>

      {/* Meta Description Input */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-slate-700">SEO Meta Description</label>
          <span className={`text-[10px] font-mono ${currentDesc.length >= 100 && currentDesc.length <= 165 ? 'text-[#34a853]' : 'text-slate-400'}`}>
            {currentDesc.length}/160 chars
          </span>
        </div>
        <textarea
          rows={3}
          placeholder={excerpt || 'Meta description for Google index...'}
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
        />
      </div>

      {/* Checklist */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          RankMath Quality Checks
        </span>
        <div className="space-y-1.5">
          {checks.map((chk, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-0.5">
              <div className="flex items-center gap-2">
                {chk.passed ? (
                  <CheckCircle2 size={13} className="text-[#34a853] shrink-0" />
                ) : (
                  <AlertCircle size={13} className="text-amber-500 shrink-0" />
                )}
                <span className={chk.passed ? 'text-slate-700 font-medium' : 'text-slate-500'}>
                  {chk.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{chk.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
