'use client';

import { useEffect, useState } from "react";
import { getAdminVideos, type AdminVideo } from "../actions";
import {
  ListOrdered,
  RefreshCw,
  Loader2,
  Cpu,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Play,
  Terminal,
  X,
  ChevronRight,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export default function AdminQueuePage() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const res = await getAdminVideos();
      setVideos(res);
    } catch {
      // fail gracefully
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const pending = 0;
  const running = videos.filter(v => !v.outputFile && v.status === "rendering").length;
  const completed = videos.filter(v => v.outputFile).length;
  const failed = videos.filter(v => !v.outputFile && v.status === "failed").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Title block */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Lambda Render Engine
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Render Queue & Cluster Workers
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Monitor active Lambda worker thread loads, inspect failed job stacks, and trigger retries.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Worker Pools</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Querying AWS Lambda capacities...
          </p>
        </div>
      ) : (
        <>
          {/* Worker load indicators */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QueueCard
              title="Active Lambda Threads"
              value={running}
              desc="Parallel render streams"
              icon={Cpu}
              iconColor="text-[#1a73e8]"
              bgColor="bg-blue-50 border-blue-200"
            />
            <QueueCard
              title="Pending Queue"
              value={pending}
              desc="Jobs awaiting slot"
              icon={ListOrdered}
              iconColor="text-amber-600"
              bgColor="bg-amber-50 border-amber-200"
            />
            <QueueCard
              title="Render Completed"
              value={completed}
              desc="Finished exports"
              icon={CheckCircle}
              iconColor="text-[#34a853]"
              bgColor="bg-emerald-50 border-emerald-200"
            />
            <QueueCard
              title="Exceptions / Failed"
              value={failed}
              desc="Terminated with errors"
              icon={XCircle}
              iconColor="text-[#ea4335]"
              bgColor="bg-red-50 border-red-200"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Render jobs ledger */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active & Historical Render Jobs
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Job / Render ID</th>
                      <th className="px-6 py-3.5">Template / Title</th>
                      <th className="px-6 py-3.5">State</th>
                      <th className="px-6 py-3.5 text-right">Debug</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {videos.map((v) => (
                      <tr key={v.renderId} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4 font-semibold text-slate-500 truncate max-w-[120px]">
                          {v.renderId}
                        </td>
                        <td className="px-6 py-4 font-sans text-slate-900 font-medium truncate max-w-[160px]">
                          {v.title}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                              v.outputFile
                                ? "bg-emerald-50 border-emerald-200 text-[#34a853]"
                                : "bg-red-50 border-red-200 text-[#ea4335]"
                            }`}
                          >
                            {v.outputFile ? "Done" : "Failed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-sans">
                          <button
                            onClick={() => setSelectedVideo(v)}
                            className="text-[#1a73e8] hover:underline text-xs font-semibold"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Debug inspector panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Terminal size={15} className="text-[#1a73e8]" />
                <span>Job Inspector</span>
              </h3>

              {selectedVideo ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Render ID</span>
                      <p className="font-mono text-slate-900 font-bold">{selectedVideo.renderId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Template Mode</span>
                      <p className="text-slate-900">{selectedVideo.mode}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">User</span>
                      <p className="text-slate-900">{selectedVideo.userEmail}</p>
                    </div>
                  </div>

                  {selectedVideo.outputFile && (
                    <a
                      href={selectedVideo.outputFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2 bg-[#1a73e8] text-white rounded-xl font-bold hover:bg-[#1967d2] transition shadow-xs"
                    >
                      Open S3 Binary Video
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Select a render job from the table to inspect details and payloads.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QueueCard({
  title,
  value,
  desc,
  icon: Icon,
  iconColor,
  bgColor,
}: {
  title: string;
  value: number;
  desc: string;
  icon: any;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${bgColor} ${iconColor}`}>
          <Icon size={16} />
        </div>
      </div>
      <h2 className="text-2xl font-black text-slate-900 font-mono">{value}</h2>
      <p className="text-[11px] text-slate-400">{desc}</p>
    </div>
  );
}
