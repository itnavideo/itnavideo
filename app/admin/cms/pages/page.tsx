'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface CmsPageItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: 'draft' | 'published';
  updated_at?: string;
}

export default function AdminCmsPagesList() {
  const [pages, setPages] = useState<CmsPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cms/pages');
      const data = await res.json();
      if (data.ok && Array.isArray(data.pages)) {
        setPages(data.pages);
      }
    } catch {
      toast.error('Failed to load custom pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom page?')) return;
    try {
      const res = await fetch(`/api/admin/cms/pages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        toast.success('Page deleted successfully');
        fetchPages();
      } else {
        toast.error('Failed to delete page');
      }
    } catch {
      toast.error('Error deleting page');
    }
  };

  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              WordPress CMS Pages
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Custom Pages Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Manage custom landing pages, policy documents, documentation pages, and static views.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPages}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/cms/pages/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition shadow-xs"
          >
            <Plus size={14} />
            <span>Add New Page</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Loading custom pages...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileText className="text-slate-300 mx-auto" size={40} />
            <h3 className="text-sm font-bold text-slate-700">No Custom Pages Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Create your first custom landing page or policy document.
            </p>
            <Link
              href="/admin/cms/pages/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a73e8] text-white text-xs font-bold shadow-xs hover:bg-[#1967d2] transition"
            >
              <Plus size={14} /> Create New Page
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Title & Permalink</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Last Modified</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((pg) => (
                  <tr key={pg.id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/admin/cms/pages/edit/${pg.id}`}
                          className="font-bold text-slate-900 group-hover:text-[#1a73e8] transition"
                        >
                          {pg.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 font-mono">
                          /{pg.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          pg.status === 'published'
                            ? 'bg-emerald-50 text-[#34a853] border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {pg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                      {pg.updated_at ? new Date(pg.updated_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/cms/pages/edit/${pg.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
                          title="Edit Page"
                        >
                          <Edit size={13} />
                        </Link>
                        <button
                          onClick={() => handleDelete(pg.id)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[#ea4335] transition"
                          title="Delete Page"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
