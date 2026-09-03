'use client';

import { Sparkles, Mic, Video, Image as ImageIcon, FileText, Volume2, Wand2, Download } from 'lucide-react';

export default function UploadPipelineSection() {
  return (
    <section id="workflow" className="relative px-4 py-20 sm:px-6 sm:py-24 bg-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Universal AI Video Generation Pipeline</span>
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl font-sans tracking-tight">
            Text to Video &amp; Automated AI Video Creator
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            Upload audio, raw video clips, photos, or text scripts — our AI video generator automatically transcribes, plans scenes, matches visuals, syncs captions, and renders publish-ready videos.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* LEFT: Input Types */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Inputs You Provide</p>

            {[
              { label: 'Voiceover / Audio', detail: '.mp3, .wav, speech recording', icon: Mic, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { label: 'Talking Video', detail: 'raw camera footage, .mp4, .mov', icon: Video, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: 'Images & Assets', detail: '.jpg, .png, logos, graphics', icon: ImageIcon, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { label: 'Scripts & Text', detail: 'written outline or article prompt', icon: FileText, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
              { label: 'Voice Notes', detail: 'podcast audio or voice memo', icon: Volume2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
            ].map((input) => {
              const Icon = input.icon;
              return (
                <div
                  key={input.label}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${input.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-sans">{input.label}</h4>
                      <p className="text-[10px] text-slate-500">{input.detail}</p>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                </div>
              );
            })}
          </div>

          {/* CENTER: Central AI Processing Hub */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-blue-200 bg-white shadow-lg relative">
            <div className="absolute -top-3 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider shadow-sm">
              ITNAVIDEO AI HUB
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30 mb-3">
              <Wand2 size={32} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-sans">Automated Video Production</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Groq Whisper Transcription + Remotion Lambda Render Engine + Local Scene Director
            </p>

            {/* Checklist */}
            <div className="mt-5 w-full space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-[11px]">
              <div className="flex items-center justify-between text-slate-700">
                <span>Groq Transcription</span>
                <span className="text-emerald-600 font-mono font-bold">✓ Synced</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Scene & Sticker Match</span>
                <span className="text-emerald-600 font-mono font-bold">✓ Matched</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Caption Motion & Fonts</span>
                <span className="text-emerald-600 font-mono font-bold">✓ Formatted</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Output Video Preview */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 self-start">Publish-Ready Output</p>

            <div className="relative w-full max-w-[280px] rounded-2xl border border-slate-200 bg-black overflow-hidden shadow-xl aspect-[9/16]">
              <video
                src="https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783945650/professional-creator-after.mp4"
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
                  <p className="text-[10px] text-primary font-mono font-bold">Ready to publish</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow">
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

