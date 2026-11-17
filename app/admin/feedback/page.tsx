'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquareHeart,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  Play,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Video,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  user_id: string;
  user_email?: string;
  feedback_type: string;
  rating: 'excellent' | 'good' | 'average' | 'poor';
  improvement_categories: string[];
  comment?: string;
  video_id?: string;
  video_type?: string;
  aspect_ratio?: string;
  duration_seconds?: number;
  template_style?: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'archived';
  created_at: string;
}

interface Metrics {
  totalSubmissions: number;
  averageScore: number;
  ratingDistribution: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  topImprovementCategories: { category: string; count: number }[];
  byVideoType: { videoType: string; count: number }[];
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVideoType, setSelectedVideoType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Inspection modal
  const [activeItem, setActiveItem] = useState<FeedbackItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchFeedback() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedRating !== 'all') params.set('rating', selectedRating);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (selectedVideoType !== 'all') params.set('videoType', selectedVideoType);
      if (searchQuery.trim()) params.set('searchQuery', searchQuery.trim());
      params.set('limit', '100');

      const res = await fetch(`/api/admin/feedback?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to fetch feedback.');
      }

      setFeedback(data.feedback || []);
      setMetrics(data.metrics || null);
    } catch (err: any) {
      setError(err?.message || 'Error fetching user feedback.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedback();
  }, [selectedRating, selectedStatus, selectedVideoType]);

  const handleStatusChange = async (id: string, newStatus: FeedbackItem['status']) => {
    try {
      setUpdatingId(id);
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to update status.');
      }

      // Update local state
      setFeedback((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (activeItem?.id === id) {
        setActiveItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRatingBadge = (rating: FeedbackItem['rating']) => {
    switch (rating) {
      case 'excellent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            ★ Excellent
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
            ★ Good
          </span>
        );
      case 'average':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            ★ Average
          </span>
        );
      case 'poor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
            ★ Needs Work
          </span>
        );
    }
  };

  const getStatusBadge = (status: FeedbackItem['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">New</span>;
      case 'reviewed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Reviewed</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">In Progress</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Resolved</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Archived</span>;
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquareHeart size={14} className="text-orange-600" />
            <span>Community Voice &amp; Video Quality</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            User Feedback &amp; Video Ratings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real user insights from daily free downloads and studio generations during temporary free access.
          </p>
        </div>

        <button
          onClick={fetchFeedback}
          disabled={loading}
          className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Total Submissions</span>
              <MessageSquareHeart className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {metrics.totalSubmissions}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              From post-download &amp; studio prompts
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Average Score</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {metrics.averageScore > 0 ? `${metrics.averageScore} / 4.0` : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              4=Exc, 3=Good, 2=Avg, 1=Poor
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Positive Ratings</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {metrics.totalSubmissions > 0
                ? `${Math.round(
                    ((metrics.ratingDistribution.excellent + metrics.ratingDistribution.good) /
                      metrics.totalSubmissions) *
                      100
                  )}%`
                : '—'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {metrics.ratingDistribution.excellent} Excellent, {metrics.ratingDistribution.good} Good
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Top Problem Area</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-sm font-black text-slate-900 mt-2 truncate">
              {metrics.topImprovementCategories[0]?.category || 'None Reported'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {metrics.topImprovementCategories[0]?.count
                ? `${metrics.topImprovementCategories[0].count} mentions`
                : 'Zero reported issues'}
            </div>
          </div>
        </div>
      )}

      {/* Problem Ranking Bar Graph */}
      {metrics && metrics.topImprovementCategories.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-orange-600" />
            <span>Problem Frequency Ranking (Most Requested Improvements)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.topImprovementCategories.slice(0, 8).map((cat, idx) => {
              const maxCount = metrics.topImprovementCategories[0]?.count || 1;
              const percentage = Math.round((cat.count / maxCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{cat.category}</span>
                    <span className="font-bold text-slate-900">{cat.count} votes</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchFeedback();
            }}
            className="relative"
          >
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comments, emails..."
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 w-48 sm:w-64"
            />
          </form>

          {/* Rating Filter */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white cursor-pointer focus:outline-none"
          >
            <option value="all">All Ratings</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Needs Work</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white cursor-pointer focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing {feedback.length} entries
        </div>
      </div>

      {/* Feedback Table / List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-orange-600 mx-auto" />
            <p>Loading user submissions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-xs space-y-2">
            <AlertTriangle className="mx-auto" size={24} />
            <p>{error}</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <MessageSquareHeart size={32} className="mx-auto text-slate-300" />
            <p className="font-bold text-slate-700">No feedback submissions found</p>
            <p>Feedback submitted by creators will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Studio / Video Type</th>
                  <th className="py-3 px-4">Issues &amp; Improvement Tags</th>
                  <th className="py-3 px-4">User Comment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedback.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Rating */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getRatingBadge(item.rating)}
                    </td>

                    {/* Studio / Video Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 capitalize">
                        {item.video_type || item.feedback_type || 'General'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.aspect_ratio || '16:9'} • {item.duration_seconds ? `${item.duration_seconds}s` : 'Full'}
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.improvement_categories && item.improvement_categories.length > 0 ? (
                          item.improvement_categories.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                            >
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None tagged</span>
                        )}
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="py-3 px-4 max-w-sm">
                      {item.comment ? (
                        <p className="line-clamp-2 text-slate-700 font-medium">{item.comment}</p>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No written comment</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as FeedbackItem['status'])
                        }
                        className="text-[11px] font-semibold border border-slate-200 rounded-lg px-2 py-1 bg-white cursor-pointer focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveItem(item)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Inspection Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Feedback Inspection</h3>
                <p className="text-xs text-slate-500">ID: {activeItem.id}</p>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Rating</span>
                  <div className="mt-1">{getRatingBadge(activeItem.rating)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Status</span>
                  <div className="mt-1">{getStatusBadge(activeItem.status)}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Video Context</span>
                <p className="text-slate-900 font-semibold">
                  Studio: <span className="capitalize">{activeItem.video_type || 'General'}</span> • {activeItem.aspect_ratio || '16:9'}
                </p>
                {activeItem.video_id && (
                  <p className="text-slate-500 font-mono text-[10px] truncate">
                    Video ID: {activeItem.video_id}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">
                  Tagged Improvement Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.improvement_categories && activeItem.improvement_categories.length > 0 ? (
                    activeItem.improvement_categories.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 font-medium">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No specific categories tagged</span>
                  )}
                </div>
              </div>

              {activeItem.comment && (
                <div className="space-y-1.5">
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">User Written Comment</span>
                  <div className="p-4 rounded-xl bg-slate-100 text-slate-900 font-medium leading-relaxed">
                    &ldquo;{activeItem.comment}&rdquo;
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Update Status</span>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'reviewed', 'in_progress', 'resolved', 'archived'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(activeItem.id, st)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs capitalize transition ${
                        activeItem.status === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
