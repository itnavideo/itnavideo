'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Check, Loader2, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CmsMediaPickerModalProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function CmsMediaPickerModal({ onSelect, onClose }: CmsMediaPickerModalProps) {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cms/media');
      const data = await res.json();
      if (data.ok && data.media) {
        setMediaItems(data.media);
        if (data.media.length > 0 && !selectedUrl) {
          setSelectedUrl(data.media[0].secure_url);
        }
      }
    } catch (e) {
      toast.error('Failed to load media items');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    const url = activeTab === 'custom' ? customUrl : selectedUrl;
    if (!url) {
      toast.error('Please select an image');
      return;
    }
    onSelect(url);
    onClose();
  };

  const filteredMedia = mediaItems.filter((m) =>
    (m.filename || m.public_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Select Media from Cloudinary CDN</h2>
            <p className="text-xs text-slate-500">Pick an indexed asset or input a direct URL</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toolbar & Search */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'library'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cloudinary Library ({mediaItems.length})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'custom'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Direct HTTPS URL
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-48 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 min-h-[300px]">
          {activeTab === 'library' ? (
            loading ? (
              <div className="py-20 text-center space-y-2">
                <Loader2 size={28} className="animate-spin text-[#1a73e8] mx-auto" />
                <p className="text-xs text-slate-500">Loading Cloudinary assets...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <ImageIcon size={36} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No media found matching search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredMedia.map((item) => {
                  const isSelected = selectedUrl === item.secure_url;
                  return (
                    <div
                      key={item.public_id}
                      onClick={() => setSelectedUrl(item.secure_url)}
                      className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition ${
                        isSelected
                          ? 'border-[#1a73e8] ring-2 ring-[#1a73e8]/20 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="aspect-video w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.secure_url}
                          alt={item.public_id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 bg-white flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-700 truncate">
                          {item.filename || item.public_id}
                        </span>
                        {isSelected && (
                          <div className="h-4 w-4 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shrink-0">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="max-w-md mx-auto py-8 space-y-4">
              <label className="text-xs font-bold text-slate-700 block">External HTTPS Image URL</label>
              <input
                type="text"
                placeholder="https://res.cloudinary.com/... or https://..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-[#1a73e8] focus:outline-none"
              />
              {customUrl && (
                <div className="p-2 rounded-xl border border-slate-200 bg-white">
                  <img src={customUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500 truncate max-w-sm font-mono">
            {activeTab === 'custom' ? customUrl : selectedUrl}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition shadow-sm"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
