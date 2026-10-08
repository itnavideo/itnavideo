'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Image as ImageIcon, Search, Copy, Check, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function StandaloneMediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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
      }
    } catch (e) {
      toast.error('Failed to load media items');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      toast.success('Media CDN URL copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredMedia = mediaItems.filter((item) =>
    (item.public_id || item.filename || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cloudinary Media Library</h1>
            <p className="text-xs text-slate-500">
              High-performance CDN images, featured visual banners, and sticker assets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Refresh Media"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-56 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Fetching Cloudinary CDN Assets...
          </p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 shadow-xs">
          <ImageIcon size={40} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No media assets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.public_id}
              className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="aspect-video w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.secure_url}
                  alt={item.public_id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3 bg-white space-y-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-800 truncate" title={item.public_id}>
                  {item.filename || item.public_id}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {item.format || 'PNG'} · {item.width ? `${item.width}x${item.height}` : 'CDN'}
                  </span>
                  <button
                    onClick={() => copyUrl(item.secure_url, item.public_id)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                    title="Copy CDN URL"
                  >
                    {copiedId === item.public_id ? (
                      <Check size={12} className="text-[#34a853]" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
