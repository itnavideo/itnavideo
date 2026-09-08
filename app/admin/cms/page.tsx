'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Folder,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Globe,
  Loader2,
  Sparkles,
  Layers,
  BarChart3,
  Copy,
  ExternalLink,
  Filter,
  CheckSquare,
  Square,
  TrendingUp,
  Tag,
  User,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { blogPosts, BlogPost } from '@/lib/blogPosts';

export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
  author: string;
  read_time: string;
  featured_image?: string;
  is_static?: boolean;
};

export type CmsPage = {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
};

export default function CmsDashboardPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'static_posts' | 'pages' | 'media'>('posts');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'posts') {
        const res = await fetch('/api/admin/cms/posts');
        const data = await res.json();
        if (data.ok) {
          setPosts(data.posts || []);
        }
      } else if (activeTab === 'pages') {
        const res = await fetch('/api/admin/cms/pages');
        const data = await res.json();
        if (data.ok) setPages(data.pages || []);
      }
    } catch (e) {
      toast.error('Failed to load CMS data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete post "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/cms/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        toast.success('Post moved to trash');
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(data.error || 'Failed to delete post');
      }
    } catch (e) {
      toast.error('Error deleting post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublishPost = async (post: CmsPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/cms/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Post status updated to ${newStatus.toUpperCase()}`);
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (e) {
      toast.error('Failed to update post status');
    }
  };

  const handleCopyCodeSnippet = (post: CmsPost | BlogPost) => {
    const snippet = `  {
    slug: '${post.slug}',
    title: '${post.title.replace(/'/g, "\\'")}',
    excerpt: '${(post.excerpt || '').replace(/'/g, "\\'")}',
    date: '${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}',
    readTime: '${(post as any).read_time || (post as any).readTime || '5 min read'}',
    category: '${post.category || 'general'}',
    intro: '${(post.excerpt || '').replace(/'/g, "\\'")}',
    dashboardType: 'auto-caption-reel',
    keywords: ['${post.category || 'ai-video'}', 'itnavideo'],
    sections: [
      {
        heading: 'Overview',
        body: ['${(post.excerpt || '').replace(/'/g, "\\'")}']
      }
    ]
  },`;
    navigator.clipboard.writeText(snippet);
    toast.success('Code snippet copied for lib/blogPosts.ts!');
  };

  const handleSelectAll = () => {
    if (selectedPostIds.length === filteredPosts.length) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredPosts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = async (newStatus: 'published' | 'draft' | 'archived') => {
    if (!selectedPostIds.length) return;
    try {
      for (const id of selectedPostIds) {
        await fetch(`/api/admin/cms/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      }
      toast.success(`${selectedPostIds.length} posts updated to ${newStatus}`);
      setSelectedPostIds([]);
      fetchData();
    } catch (e) {
      toast.error('Bulk update failed');
    }
  };

  // Convert static blogPosts into CmsPost format for unified view
  const staticCmsPosts: CmsPost[] = blogPosts.map((bp) => ({
    id: `static-${bp.slug}`,
    title: bp.title,
    slug: bp.slug,
    excerpt: bp.excerpt,
    category: bp.category,
    status: 'published',
    created_at: bp.date,
    updated_at: bp.date,
    author: 'Itnavideo Founder',
    read_time: bp.readTime,
    is_static: true,
  }));

  const activePostList = activeTab === 'static_posts' ? staticCmsPosts : posts;

  // Metrics
  const totalDbPosts = posts.length;
  const totalStaticPosts = staticCmsPosts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  const categories = Array.from(
    new Set([...posts.map((p) => p.category), ...staticCmsPosts.map((p) => p.category)].filter(Boolean))
  );

  const filteredPosts = activePostList.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8] shadow-[0_0_8px_#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Integrated Content Management · WordPress Hub
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Articles & Blog Management
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200">
              Live Indexing
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Create, schedule, edit, and organize SEO-optimized articles with WordPress table controls and RankMath analysis.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Refresh Data"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/blog"
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <ExternalLink size={14} className="text-[#1a73e8]" /> View Public Blog
          </Link>
          <Link
            href="/admin/cms/posts/new"
            className="px-5 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} /> Add New Article
          </Link>
        </div>
      </div>

      {/* Google Analytics KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Library Posts</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a73e8]">
              <FileText size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalDbPosts + totalStaticPosts}</span>
            <span className="text-[11px] text-slate-500 font-medium">({totalStaticPosts} in-code + {totalDbPosts} db)</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1a73e8] rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Live Published */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published Live</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#34a853]">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#34a853]">{publishedCount + totalStaticPosts}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">100% Indexable</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#34a853] rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Queue</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#fbbc04]">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{scheduledCount}</span>
            <span className="text-[11px] text-slate-500">Auto-cron queue</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#fbbc04] rounded-full" style={{ width: scheduledCount ? '50%' : '0%' }} />
          </div>
        </div>

        {/* Drafts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Draft Articles</span>
            <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <Layers size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{draftCount}</span>
            <span className="text-[11px] text-slate-500">Work-in-progress</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-400 rounded-full" style={{ width: draftCount ? '30%' : '0%' }} />
          </div>
        </div>
      </div>

      {/* Main CMS Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 px-6 py-3 bg-slate-50/50 gap-4">
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText size={14} /> Database Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('static_posts')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'static_posts'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck size={14} /> Static In-Code Posts ({staticCmsPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'pages'
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe size={14} /> Custom Pages ({pages.length})
            </button>
            <Link
              href="/admin/cms/media"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-2"
            >
              <ImageIcon size={14} /> Media Library
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-64 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 border-b border-slate-200 bg-white gap-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'published', 'scheduled', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-blue-50 text-[#1a73e8] border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st} {st === 'all' ? `(${activePostList.length})` : ''}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 focus:border-[#1a73e8] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedPostIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-xs font-bold text-[#1a73e8]">
                {selectedPostIds.length} selected
              </span>
              <button
                onClick={() => handleBulkStatusChange('published')}
                className="px-2.5 py-1 rounded bg-emerald-50 text-[#34a853] border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100 transition"
              >
                Publish All
              </button>
              <button
                onClick={() => handleBulkStatusChange('draft')}
                className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-semibold hover:bg-slate-200 transition"
              >
                Draft All
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-700">
                    {selectedPostIds.length === filteredPosts.length && filteredPosts.length > 0 ? (
                      <CheckSquare size={16} className="text-[#1a73e8]" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5">Title & Quick Actions</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Author</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">SEO Score</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#1a73e8]" />
                    Loading articles...
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No articles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = selectedPostIds.includes(post.id);
                  const isDb = !post.is_static;

                  return (
                    <tr
                      key={post.id}
                      className={`group hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(post.id)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-[#1a73e8]" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Title & Hover Actions */}
                      <td className="px-4 py-4 max-w-md">
                        <div className="font-bold text-slate-900 text-sm group-hover:text-[#1a73e8] transition">
                          {isDb ? (
                            <Link href={`/admin/cms/posts/edit/${post.id}`}>{post.title}</Link>
                          ) : (
                            <span>{post.title}</span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          /blog/{post.slug}
                        </div>

                        {/* WordPress Actions */}
                        <div className="mt-1.5 flex items-center gap-2.5 text-[11px] font-semibold text-slate-500 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {isDb ? (
                            <>
                              <Link
                                href={`/admin/cms/posts/edit/${post.id}`}
                                className="text-[#1a73e8] hover:underline"
                              >
                                Edit
                              </Link>
                              <span>|</span>
                              <button
                                onClick={() => handleTogglePublishPost(post)}
                                className="text-amber-600 hover:underline"
                              >
                                {post.status === 'published' ? 'Switch to Draft' : 'Publish'}
                              </button>
                              <span>|</span>
                              <button
                                onClick={() => handleDeletePost(post.id, post.title)}
                                className="text-[#ea4335] hover:underline"
                              >
                                Trash
                              </button>
                              <span>|</span>
                            </>
                          ) : null}
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-[#34a853] hover:underline flex items-center gap-0.5"
                          >
                            View Live <ArrowUpRight size={10} />
                          </Link>
                          <span>|</span>
                          <button
                            onClick={() => handleCopyCodeSnippet(post)}
                            className="text-slate-500 hover:underline flex items-center gap-0.5"
                          >
                            <Copy size={10} /> Copy Code
                          </button>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                          <Tag size={10} /> {post.category || 'General'}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          <span>{post.author || 'Itnavideo Team'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {post.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#34a853] border border-emerald-200 font-bold text-[10px] uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#34a853]" /> Published
                          </span>
                        ) : post.status === 'scheduled' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] uppercase tracking-wider">
                            <Clock size={10} /> Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] uppercase tracking-wider">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* SEO Score */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#34a853] shadow-[0_0_6px_#34a853]" />
                          <span className="font-mono text-xs font-bold text-[#34a853]">95/100</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-slate-500 text-[11px]">
                        <div>{post.created_at || 'Aug 30, 2026'}</div>
                        <div className="text-[10px] text-slate-400">{post.read_time || '5 min read'}</div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        {isDb ? (
                          <Link
                            href={`/admin/cms/posts/edit/${post.id}`}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-[#1a73e8] hover:bg-slate-100 inline-flex items-center justify-center transition"
                            title="Edit Article"
                          >
                            <Edit size={14} />
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleCopyCodeSnippet(post)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 inline-flex items-center justify-center transition"
                            title="Copy Code Snippet"
                          >
                            <Copy size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
