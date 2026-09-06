'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  FolderOpen, 
  PlusCircle, 
  LayoutGrid, 
  Upload, 
  Captions, 
  Download, 
  Play, 
  Pause, 
  CheckCircle2, 
  Coins 
} from 'lucide-react';
import Link from 'next/link';

const SUBTITLE_PRESETS_MOCK = [
  { name: 'Studio Clean', color: '#2563eb', bg: '#1E293B' },
  { name: 'Karaoke Fill', color: '#eab308', bg: '#172554' },
  { name: 'Bold Fire', color: '#ef4444', bg: '#1C1017' },
  { name: 'Neon Pulse', color: '#06b6d4', bg: '#020617' },
  { name: 'Gold Pill', color: '#f59e0b', bg: '#1C1917' },
];

export default function RealDashboardPreview() {
  const [selectedPreset, setSelectedPreset] = useState(SUBTITLE_PRESETS_MOCK[0]);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28 bg-slate-50 text-slate-900 overflow-hidden border-b border-slate-200">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(245,158,11,0.08),transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="animate-pulse" />
            <span>DASHBOARD PREVIEW</span>
          </p>
          <h2 className="text-3xl font-black text-slate-900 sm:text-5xl font-sans tracking-tight leading-tight">
            Everything You Need to <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Create Videos</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
            No bloated video timeline tools or complex keyframes. Upload your content, choose your style, and let AI render publish-ready videos.
          </p>
        </div>

        {/* Dashboard Frame (Embedded dark UI inside clean white/gray container) */}
        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden ring-1 ring-slate-900/5">
          
          {/* Dashboard Window Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-100 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-bold tracking-wider text-slate-800 font-mono">
                ITNAVIDEO STUDIO • DASHBOARD INTERFACE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                <Coins size={13} />
                <span>20 Credits Available</span>
              </div>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition"
              >
                <span>Open Live Dashboard →</span>
              </Link>
            </div>
          </div>

          {/* Actual Dark Dashboard Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] bg-background text-white">
            
            {/* Sidebar Navigation */}
            <div className="hidden lg:col-span-3 lg:flex flex-col justify-between p-4 bg-muted/80 border-r border-border">
              <div className="space-y-6">
                
                {/* Main Menu */}
                <div className="space-y-1">
                  <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Workspace</p>
                  
                  <div className="flex items-center gap-2.5 rounded-xl bg-amber-500/20 px-3 py-2.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                    <PlusCircle size={15} />
                    <span>Create New Video</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-muted/60 transition">
                    <FolderOpen size={15} />
                    <span>My Video Projects</span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-muted/60 transition">
                    <LayoutGrid size={15} />
                    <span>Templates Library</span>
                  </div>
                </div>

                {/* Video Types List */}
                <div className="space-y-1 pt-2">
                  <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Creation Engines</p>
                  
                  {[
                    { name: 'Auto Caption Reel', active: true, badge: '1 Cr' },
                    { name: 'Compare Explainer', active: false, badge: '1 Cr' },
                    { name: 'Whiteboard Video', active: false, badge: '1 Cr' },
                    { name: 'Typography Video', active: false, badge: '1 Cr' },
                    { name: 'AI Audio Cleaner', active: false, badge: '1 Cr' },
                    { name: 'Faceless Video', active: false, badge: '2 Cr' },
                  ].map((v) => (
                    <div
                      key={v.name}
                      className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        v.active ? 'bg-muted text-white border border-border' : 'text-muted-foreground hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{v.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">{v.badge}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Sidebar Footer */}
              <div className="p-3 bg-muted rounded-xl border border-border">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Itnavideo Pro Plan</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">AWS Remotion Lambda Engine Enabled</p>
              </div>
            </div>

            {/* Center Controls */}
            <div className="lg:col-span-5 p-5 space-y-5 bg-muted/60 border-r border-border">
              
              {/* Selected Mode Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Captions size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-sans">Auto Caption Reel</h3>
                    <p className="text-[10px] text-muted-foreground">Word-synced animated captions for talking reels</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-500/20 text-amber-300 px-2.5 py-1 text-[10px] font-bold">
                  1 Credit / Render
                </span>
              </div>

              {/* Upload Slot */}
              <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-center space-y-2">
                <div className="flex h-10 w-12 mx-auto items-center justify-center rounded-full bg-amber-600/20 text-amber-400">
                  <Upload size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">talking-creator-narration.mp4</p>
                  <p className="text-[10px] text-muted-foreground">MP4 • 1080x1920 • 24.5s • Upload Complete</p>
                </div>
              </div>

              {/* Subtitle Style Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Select Caption Style Preset</span>
                  <span className="text-[10px] text-amber-400 font-bold">5 Presets</span>
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {SUBTITLE_PRESETS_MOCK.map((preset) => {
                    const isSelected = selectedPreset.name === preset.name;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => setSelectedPreset(preset)}
                        className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold border transition ${
                          isSelected
                            ? 'border-amber-500 bg-muted text-white shadow-md'
                            : 'border-border bg-muted/40 text-muted-foreground hover:border-border'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ background: preset.color }}
                          />
                          <span>{preset.name}</span>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                          style={{ background: preset.bg, color: preset.color }}
                        >
                          PREVIEW
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Details */}
              <div className="p-3 rounded-xl bg-muted border border-border space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-primary" /> Speech Engine</span>
                  <span className="font-mono text-muted-foreground text-[11px]">Groq Whisper</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-primary" /> Active Highlight</span>
                  <span className="font-mono text-muted-foreground text-[11px]">Word-by-word</span>
                </div>
              </div>

            </div>

            {/* Right Remotion Live Player & Timeline */}
            <div className="lg:col-span-4 p-5 flex flex-col items-center justify-between bg-background">
              
              <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-xl bg-black border border-border overflow-hidden shadow-2xl">
                <video
                  src="https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783945648/doctor-after.mp4"
                  autoPlay={isPlaying}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent flex items-center justify-between">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow"
                  >
                    {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <span className="text-[10px] font-mono text-muted-foreground">00:12 / 00:24</span>
                </div>
              </div>

              <div className="w-full mt-4 space-y-1.5 bg-muted p-2.5 rounded-xl border border-border">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase">
                  <span>Timeline Tracks</span>
                  <span>24.5s</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                  <div className="h-full w-1/3 bg-amber-500" />
                  <div className="h-full w-1/3 bg-orange-400" />
                  <div className="h-full w-1/3 bg-emerald-400" />
                </div>
              </div>

              <div className="w-full mt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 px-5 py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition"
                >
                  <Download size={14} />
                  <span>Start Render MP4 (1 Credit)</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

