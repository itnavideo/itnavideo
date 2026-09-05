'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Captions, 
  Layers3, 
  Maximize2, 
  Clock 
} from 'lucide-react';

export default function FeaturesVisualDemo() {
  const [activeAspect, setActiveAspect] = useState<'9:16' | '16:9'>('9:16');

  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28 bg-slate-50 border-b border-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>AI Video Generator Engine</span>
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl font-sans tracking-tight">
            AI Video Generation Features <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">You Can See &amp; Control</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            See how our AI video creator engine directs scenes, generates word-level subtitles, auto-places visuals, and renders crisp 1080p MP4 videos in seconds.
          </p>
        </div>

        {/* Feature Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* FEATURE 1: AI Scene Detection */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Clock size={16} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">AI Scene Detection</h3>
              </div>
              <p className="text-xs text-slate-600">
                AI breaks your audio into non-overlapping scenes, assigning density, intent, and pose rules automatically.
              </p>
            </div>

            {/* Visual Timeline Diagram */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>00:00 (Hook)</span>
                <span>00:08 (Explain)</span>
                <span>00:20 (Proof)</span>
                <span>00:30 (CTA)</span>
              </div>

              {/* Timeline Blocks */}
              <div className="grid grid-cols-4 gap-1.5">
                <div className="p-2 rounded bg-amber-100 border border-amber-300 text-[10px] font-bold text-amber-800">
                  Scene 1: Hook
                  <span className="block text-[9px] font-normal text-slate-500">0.0s – 7.5s</span>
                </div>
                <div className="p-2 rounded bg-orange-100 border border-orange-300 text-[10px] font-bold text-orange-800">
                  Scene 2: Explain
                  <span className="block text-[9px] font-normal text-slate-500">7.5s – 18.0s</span>
                </div>
                <div className="p-2 rounded bg-emerald-100 border border-emerald-300 text-[10px] font-bold text-emerald-800">
                  Scene 3: Proof
                  <span className="block text-[9px] font-normal text-slate-500">18.0s – 25.0s</span>
                </div>
                <div className="p-2 rounded bg-purple-100 border border-purple-300 text-[10px] font-bold text-purple-800">
                  Scene 4: Outro
                  <span className="block text-[9px] font-normal text-slate-500">25.0s – 30.0s</span>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 2: Automatic Word-Synced Captions */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Captions size={16} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">Automatic Captions</h3>
              </div>
              <p className="text-xs text-slate-600">
                Word-level Whisper timing ensures active words highlight the exact millisecond they are spoken.
              </p>
            </div>

            {/* Live Caption Word Preview */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-500">Turn your</span>
                <span className="text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 rounded shadow-xs">script</span>
                <span className="text-sm font-bold text-slate-500">into</span>
                <span className="text-sm font-extrabold text-amber-600">polished</span>
                <span className="text-sm font-bold text-slate-500">content</span>
              </div>
              <p className="text-[10px] font-mono text-emerald-600 font-bold">Max 5 words per chunk • 0.3s word sync</p>
            </div>
          </div>

          {/* FEATURE 3: AI Visual & Presenter Matching */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Layers3 size={16} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">AI Presenter & Sticker Matching</h3>
              </div>
              <p className="text-xs text-slate-600">
                Compare Explainers automatically map 6 presenter poses (welcome, pointing left, pointing right, thinking, warning, success) to speech.
              </p>
            </div>

            {/* Pose badges */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-[10px] font-bold text-slate-700">
              <span className="p-2 rounded bg-white border border-slate-200 shadow-2xs">👋 Welcome Intro</span>
              <span className="p-2 rounded bg-white border border-slate-200 shadow-2xs">👈 Pointing Left</span>
              <span className="p-2 rounded bg-white border border-slate-200 shadow-2xs">👉 Pointing Right</span>
              <span className="p-2 rounded bg-white border border-slate-200 shadow-2xs">🤔 Thinking Pose</span>
              <span className="p-2 rounded bg-white border border-slate-200 shadow-2xs">⚠️ Warning Note</span>
              <span className="p-2 rounded bg-white border border-slate-200 shadow-2xs">✅ Conclusion</span>
            </div>
          </div>

          {/* FEATURE 4: Multi Aspect Ratio Engine */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <Maximize2 size={16} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">Multiple Formats Supported</h3>
              </div>
              <p className="text-xs text-slate-600">
                Switch between 9:16 vertical reels for Instagram/TikTok, and 16:9 widescreen for YouTube.
              </p>
            </div>

            {/* Aspect Ratio Selector Controls */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-center gap-2">
                {[
                  { id: '9:16', label: '9:16 Vertical (Reels/Shorts)' },
                  { id: '16:9', label: '16:9 Widescreen (YouTube)' },
                  
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setActiveAspect(fmt.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeAspect === fmt.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {fmt.id}
                  </button>
                ))}
              </div>

              <div className="p-2 rounded bg-white text-center text-xs font-mono text-amber-600 font-bold border border-slate-200">
                Active Canvas: {activeAspect === '9:16' ? '1080 x 1920 px' : activeAspect === '16:9' ? '1920 x 1080 px' : '1080 x 1080 px'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
