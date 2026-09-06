'use client';

import React, { useState } from 'react';
import { X, Link as LinkIcon, ExternalLink, FileText, Sparkles, ShoppingBag, Wrench, LayoutDashboard } from 'lucide-react';

interface CmsInternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertLink: (url: string, text?: string, openInNewTab?: boolean) => void;
}

const PRESET_INTERNAL_LINKS = [
  { label: 'Homepage', url: '/', category: 'Core', icon: FileText },
  { label: 'Pricing Plans', url: '/pricing', category: 'Core', icon: ShoppingBag },
  { label: 'All AI Video Templates', url: '/video-types', category: 'Product', icon: Sparkles },
  { label: 'Studio Dashboard', url: '/dashboard', category: 'Product', icon: LayoutDashboard },
  { label: 'Auto Caption Reel Generator', url: '/auto-caption-reel', category: 'Templates', icon: Sparkles },
  { label: 'Typography Video Studio', url: '/dashboard?videoType=typography-video', category: 'Templates', icon: Sparkles },
  { label: 'Faceless Video Maker', url: '/dashboard?videoType=faceless-video', category: 'Templates', icon: Sparkles },
  { label: 'Compare & Versus Explainer', url: '/dashboard?videoType=compare-explainer', category: 'Templates', icon: Sparkles },
  { label: 'Whiteboard Video Studio', url: '/dashboard?videoType=whiteboard-video', category: 'Templates', icon: Sparkles },
  { label: 'Free AI Audio Cleaner Tool', url: '/tools/ai-audio-cleaner', category: 'Tools', icon: Wrench },
  { label: 'Documentation & Guides', url: '/docs', category: 'Core', icon: FileText },
  { label: 'All Blog Posts', url: '/blog', category: 'Blog', icon: FileText },
];

export default function CmsInternalLinkModal({ isOpen, onClose, onInsertLink }: CmsInternalLinkModalProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  if (!isOpen) return null;

  const handleSelectPreset = (url: string, label: string) => {
    onInsertLink(url, linkText || label, openInNewTab);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl) return;
    onInsertLink(customUrl, linkText, openInNewTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold tracking-wide text-zinc-100">Insert Link (Internal & External)</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-zinc-800/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preset')}
            className={`pb-2 transition border-b-2 ${
              activeTab === 'preset' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Internal Itnavideo Pages
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2 transition border-b-2 ${
              activeTab === 'custom' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Custom External URL
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-400">Link Display Text (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Try Auto Caption Reel Generator"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
            />
            <span>Open in new window / tab (`target="_blank"`)</span>
          </label>

          {activeTab === 'preset' ? (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Quick Select Internal Target</span>
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1" style={{ scrollbarWidth: 'thin' }}>
                {PRESET_INTERNAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => handleSelectPreset(item.url, item.label)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-emerald-500/50 transition text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon size={15} className="text-zinc-400 group-hover:text-emerald-400 flex-shrink-0" />
                        <span className="text-xs font-semibold text-zinc-200 truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-md flex-shrink-0">
                        {item.url}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Destination URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/guide"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
              >
                <ExternalLink size={14} /> Insert External Link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

