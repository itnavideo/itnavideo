'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Search, Image as ImageIcon, Check, Loader2, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  alt_text?: string;
  caption?: string;
  created_at?: string;
};

interface CmsMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: { url: string; altText: string; caption: string }) => void;
}

export default function CmsMediaModal({ isOpen, onClose, onSelect }: CmsMediaModalProps) {
  const [mediaItems, setMediaItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cms/media');
      const data = await res.json();
      if (data.ok && data.media) {
        setMediaItems(data.media);
      }
    } catch (e) {
      console.error('Failed to load media items');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async () => {
    if (!customUrl) {
      toast.error('Please enter an image URL');
      return;
    }
    setUploading(true);
    try {
      const res = await fetch('/api/admin/cms/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: customUrl,
          altText,
          caption,
          filename: customUrl.split('/').pop() || 'custom_image',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Media asset registered');
        onSelect({ url: customUrl, altText, caption });
        onClose();
      } else {
        toast.error(data.error || 'Failed to register image');
      }
    } catch (e) {
      toast.error('Failed to submit image');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectConfirm = () => {
    const activeUrl = activeTab === 'custom' ? customUrl : selectedUrl;
    if (!activeUrl) {
      toast.error('Please select or enter an image URL');
      return;
    }
    onSelect({ url: activeUrl, altText, caption });
    onClose();
  };

  if (!isOpen) return null;

  const filteredMedia = mediaItems.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase()) ||
    (m.alt_text && m.alt_text.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold tracking-wide text-zinc-100">Media Library & Cloudinary Assets</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 px-6 pt-4 border-b border-zinc-800/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-2 transition border-b-2 ${
              activeTab === 'library'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Media Library ({mediaItems.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2 transition border-b-2 ${
              activeTab === 'custom'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Add Image URL / Cloudinary CDN
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'library' ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search media by filename or alt text..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">
                  No images in media library yet. Switch to "Add Image URL" to insert one.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedUrl(item.url);
                          setAltText(item.alt_text || '');
                          setCaption(item.caption || '');
                        }}
                        className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition ${
                          isSelected
                            ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-[1.02]'
                            : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <Image
                          src={item.url}
                          alt={item.alt_text || item.filename}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1.5 text-[10px] text-zinc-300 truncate">
                          {item.filename}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto py-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-emerald-400" /> Image URL (Cloudinary / HTTPS)
                </label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/dhouh0idx/image/upload/..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {customUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black/50">
                  <Image src={customUrl} alt="Preview" fill className="object-contain" unoptimized />
                </div>
              )}
            </div>
          )}

          {/* Alt Text & Caption Controls */}
          {(selectedUrl || customUrl) && (
            <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Alt Text (Accessibility & SEO)</label>
                <input
                  type="text"
                  placeholder="e.g. AI kinetic typography motion overlay"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400">Image Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Figure 1.1: Kinetic typography rendering pipeline"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={activeTab === 'custom' && customUrl ? handleCustomSubmit : handleSelectConfirm}
            disabled={uploading}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Use Selected Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

