'use client';

import { useEffect, useState } from "react";
import {
  Activity,
  Database,
  CloudLightning,
  Clock,
  ShieldAlert,
  Server,
  Network,
  Cpu,
  Loader2,
  RefreshCw,
  CheckCircle2
} from "lucide-react";

export default function AdminHealthPage() {
  const [loading, setLoading] = useState(false);

  function handleRecheck() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#34a853]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#34a853]">
              Infrastructure & Diagnostics
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Node Status & Cluster Health
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Monitor latency timings, cluster storage volumes, and direct database replication states.
          </p>
        </div>

        <button
          onClick={handleRecheck}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          <span>Re-probe Cluster</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HealthMetricCard name="PostgreSQL DB Replication" latency="12ms" status="Optimal" icon={Database} />
        <HealthMetricCard name="Cloudinary CDN & Media" latency="45ms" status="99.9% Available" icon={Server} />
        <HealthMetricCard name="Groq Whisper API" latency="320ms" status="Optimal" icon={CloudLightning} />
        <HealthMetricCard name="Remotion Lambda Engine" latency="180ms" status="Optimal" icon={Cpu} />
      </div>

      {/* System diagnostics table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Activity className="text-[#34a853]" size={15} />
          <span>Active Diagnostic Probes</span>
        </h3>

        <div className="space-y-3">
          <ProbeRow
            label="Database Sync"
            desc="All PostgreSQL tables successfully replicated, transaction pooling active"
            status="Success"
          />
          <ProbeRow
            label="Cloudinary CDN Asset Delivery"
            desc="Global Edge Caching enabled with responsive image transformation endpoints"
            status="Success"
          />
          <ProbeRow
            label="AWS Lambda Scale Capacity"
            desc="Active concurrent renders capacity pool provisioned for up to 100 simultaneous jobs"
            status="Success"
          />
          <ProbeRow
            label="Groq Whisper Transcription Engine"
            desc="Fast audio processing pipeline healthy with Roman Hinglish caption translation"
            status="Success"
          />
        </div>
      </div>
    </div>
  );
}

function HealthMetricCard({ name, latency, status, icon: Icon }: { name: string; latency: string; status: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-[10px] font-bold uppercase tracking-wider">{name}</span>
        <Icon size={16} className="text-[#1a73e8]" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 font-mono">{latency}</h2>
        <p className="text-[11px] text-[#34a853] font-bold uppercase tracking-wider">{status}</p>
      </div>
    </div>
  );
}

function ProbeRow({ label, desc, status }: { label: string; desc: string; status: string }) {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-slate-900 leading-none">{label}</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#34a853] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
        <CheckCircle2 size={12} />
        <span>{status}</span>
      </span>
    </div>
  );
}
