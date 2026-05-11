'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Activity,
  AlertTriangle,
  Server,
  Cpu,
  Globe,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  category: string;
  level: string;
  message: string;
  metadata: { ip: string; duration: string };
}

const MOCK_LOGS: LogEntry[] = Array.from({ length: 40 }, (_, i) => ({
  id: `log-${5000 + i}`,
  timestamp: new Date(Date.now() - i * 1000 * 60 * 15).toISOString(),
  category: i % 4 === 0 ? 'API' : i % 5 === 0 ? 'Render' : i % 7 === 0 ? 'Auth' : 'System',
  level: i % 8 === 0 ? 'Error' : i % 12 === 0 ? 'Warning' : 'Info',
  message:
    i % 8 === 0
      ? 'OpenAI API Timeout: Request timed out after 30s'
      : i % 4 === 0
      ? 'Canva API: Rate limit reached for asset fetching'
      : i % 5 === 0
      ? 'FFmpeg Error: Failed to stitch scene 4 (Memory overflow)'
      : 'System health check passed',
  metadata: { ip: '192.168.1.1', duration: '240ms' },
}));

export default function AdminHomePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = MOCK_LOGS.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    const matchesLevel = levelFilter === 'All' || log.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400">Admin Portal</p>
            <h1 className="mt-4 text-4xl font-bold text-white">itnavideo Admin</h1>
            <p className="mt-3 text-zinc-400">Manage users, monitor analytics, and inspect system status from here.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/dashboard"
              className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:border-purple-500 hover:text-purple-300"
            >
              Dashboard
            </a>
            <a
              href="/admin/settings"
              className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:border-purple-500 hover:text-purple-300"
            >
              Settings
            </a>
          </div>
        </div>
      </div>

      <div className="bg-purple-600/10 border border-purple-500/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Server className="text-purple-400" size={20} />
          <p className="text-sm font-medium">
            <span className="text-white">In-app admin tools:</span> this page is the /admin landing route for authenticated admins.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={process.env.NEXT_PUBLIC_VERCEL_DASHBOARD_URL || "https://vercel.com/dashboard"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
          >
            Vercel Dashboard <ExternalLink size={12} />
          </a>
          <a
            href="https://dashboard.render.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
          >
            Render Dashboard <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-4 text-purple-500">
            <Cpu size={20} />
            <h3 className="font-semibold">Pipeline Health</h3>
          </div>
          <p className="text-3xl font-bold">94.2%</p>
          <p className="text-sm text-zinc-500 mt-1">Render success rate (Last 24h)</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-4 text-orange-500">
            <Globe size={20} />
            <h3 className="font-semibold">API Latency</h3>
          </div>
          <p className="text-3xl font-bold">320ms</p>
          <p className="text-sm text-zinc-500 mt-1">Average OpenAI response time</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-4 text-red-500">
            <AlertTriangle size={20} />
            <h3 className="font-semibold">Active Errors</h3>
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-zinc-500 mt-1">Unresolved critical exceptions</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-4 text-cyan-500">
            <RefreshCw size={20} />
            <h3 className="font-semibold">Sync Status</h3>
          </div>
          <p className="text-3xl font-bold">Up-to-date</p>
          <p className="text-sm text-zinc-500 mt-1">All services are currently synced</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="text-zinc-500" size={24} />
          <h2 className="text-2xl font-bold">System Logs</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-purple-500 outline-none w-full md:w-64"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:border-purple-500 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="API">API Errors</option>
            <option value="Render">Render Fails</option>
            <option value="Auth">Security/Auth</option>
            <option value="System">System</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:border-purple-500 outline-none cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Timestamp</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Level</th>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-400">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {paginated.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition group">
                  <td className="px-6 py-4 text-xs font-mono text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-zinc-300 px-2 py-1 bg-zinc-800 rounded-md">{log.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        log.level === 'Error' ? 'text-red-500' : log.level === 'Warning' ? 'text-orange-500' : 'text-blue-500'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-xs text-zinc-500 font-medium">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-zinc-800 rounded-xl hover:bg-zinc-800 disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-2 border border-zinc-800 rounded-xl hover:bg-zinc-800 disabled:opacity-20 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
