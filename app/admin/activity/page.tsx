'use client';

import { useState } from "react";
import {
  FileText,
  Search,
  SlidersHorizontal,
  Terminal,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Info
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  category: "Auth" | "Videos" | "Billings" | "System" | "Errors";
  level: "Info" | "Warning" | "Error";
  message: string;
  user: string;
  metadata: { ip: string; duration: string; details?: string };
}

const MOCK_AUDIT_LOGS: LogEntry[] = [
  {
    id: "act-9011",
    timestamp: new Date().toISOString(),
    category: "Auth",
    level: "Info",
    message: "User login completed successfully via Google SSO",
    user: "founder@itnavideo.com",
    metadata: { ip: "103.240.231.14", duration: "120ms" }
  },
  {
    id: "act-9012",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    category: "Videos",
    level: "Info",
    message: "Video render started for Long Video Clips",
    user: "akram@itnavideo.com",
    metadata: { ip: "103.240.231.15", duration: "45000ms" }
  },
  {
    id: "act-9013",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    category: "Billings",
    level: "Info",
    message: "Manual credit adjustment: +50 credits granted by admin",
    user: "support@itnavideo.com",
    metadata: { ip: "192.168.1.1", duration: "80ms" }
  },
  {
    id: "act-9014",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    category: "Errors",
    level: "Error",
    message: "Audio extraction retry succeeded on Whisper transcription pipeline",
    user: "anonymous@itnavideo.com",
    metadata: { ip: "103.240.231.18", duration: "320ms" }
  },
  {
    id: "act-9015",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    category: "System",
    level: "Info",
    message: "Cloudinary CDN asset index sync verified",
    user: "system-daemon",
    metadata: { ip: "127.0.0.1", duration: "12ms" }
  }
];

export default function AdminActivityPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = MOCK_AUDIT_LOGS.filter(log => {
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || log.category === categoryFilter;
    const matchesLevel = levelFilter === "All" || log.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Security & Operations
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Audit Logs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Track user registrations, logins, video exports, payments, and system events.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 300);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search log messages or actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#1a73e8] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-36 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#1a73e8] focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Auth">Auth</option>
            <option value="Videos">Videos</option>
            <option value="Billings">Billings</option>
            <option value="System">System</option>
            <option value="Errors">Errors</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full sm:w-32 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#1a73e8] focus:outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Level</th>
                <th className="px-6 py-3.5">Message</th>
                <th className="px-6 py-3.5">Actor</th>
                <th className="px-6 py-3.5 text-right">IP / Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition font-sans">
                  <td className="px-6 py-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 uppercase">
                      {log.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.level === 'Info'
                          ? 'bg-blue-50 text-[#1a73e8] border border-blue-200'
                          : log.level === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-[#ea4335] border border-red-200'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 max-w-md">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400 font-mono text-[11px]">
                    {log.metadata.ip} · {log.metadata.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
