'use client';

import { Sparkles, Mic, Video, Image as ImageIcon, FileText, Volume2, Wand2, Download } from 'lucide-react';

export default function UploadPipelineSection() {
  return (
    <section id="workflow" className="relative px-4 py-20 sm:px-6 sm:py-24 bg-[#070B14] border-b border-white/10 overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-purple-400" />
            <span>Universal AI Video Generation Pipeline</span>
          </p>
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl font-sans tracking-tight">
            Text to Video &amp; <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Automated AI Video Creator</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Upload audio, raw video clips, photos, or text scripts — our AI video generator automatically transcribes, plans scenes, matches visuals, syncs captions, and renders publish-ready 1080p Full HD videos.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* LEFT: Input Types */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Inputs You Provide</p>

            {[
              { label: 'Voiceover / Audio', detail: '.mp3, .wav, speech recording', icon: Mic, color: 'text-purple-300 bg-purple-500/10 border-purple-500/30' },
              { label: 'Talking Video', detail: 'raw camera footage, .mp4, .mov', icon: Video, color: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30' },
              { label: 'Images & Assets', detail: '.jpg, .png, logos, graphics', icon: ImageIcon, color: 'text-pink-300 bg-pink-500/10 border-pink-500/30' },
              { label: 'Scripts & Text', detail: 'written outline or article prompt', icon: FileText, color: 'text-purple-300 bg-purple-500/10 border-purple-500/30' },
              { label: 'Voice Notes', detail: 'podcast audio or voice memo', icon: Volume2, color: 'text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/30' },
            ].map((input) => {
              const Icon = input?.icon || Sparkles;
              return (
                <div
                  key={input.label}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-[#0E1526] shadow-xs hover:border-purple-500/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${input.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans">{input.label}</h4>
                      <p className="text-[10px] text-zinc-400">{input.detail}</p>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                </div>
              );
            })}
          </div>

          {/* CENTER: Central AI Processing Hub */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-purple-500/30 bg-[#0E1526] shadow-2xl relative">
            <div className="absolute -top-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider shadow-sm">
              ITNAVIDEO AI HUB
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 mb-3">
              <Wand2 size={32} />
            </div>

            <h3 className="text-lg font-bold text-white font-sans">Automated Video Production</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Precision Speech AI + Cloud Render Engine + AI Visual Director
            </p>

            {/* Checklist */}
            <div className="mt-5 w-full space-y-2 bg-[#151E30] p-3 rounded-xl border border-white/10 text-left text-[11px]">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Speech AI Sync</span>
                <span className="text-emerald-400 font-mono font-bold">✓ Synced</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Scene &amp; Sticker Match</span>
                <span className="text-emerald-400 font-mono font-bold">✓ Matched</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Caption Motion &amp; Fonts</span>
                <span className="text-emerald-400 font-mono font-bold">✓ Formatted</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Output Video Preview */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 self-start">Publish-Ready Output</p>

            <div className="relative w-full max-w-[280px] rounded-2xl border border-white/15 bg-black overflow-hidden shadow-2xl aspect-[9/16]">
              <video
                src="https://res.cloudinary.com/dhouh9idx/video/upload/v1789982713/km_20260916-3_1080p_30f_20260916_232040_qtcjtv.3gp"
                poster="/preview/Auto Caption Reel.png"
                preload="auto"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white font-sans">1080x1920 MP4 Video</p>
                  <p className="text-[10px] text-purple-300 font-mono font-bold">Ready to publish</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow">
                  <Download size={16} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

