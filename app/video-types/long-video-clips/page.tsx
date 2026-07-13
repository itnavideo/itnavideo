import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Scissors, Sparkles, Clock, Zap } from "lucide-react";
import { DemoClipsGrid } from "@/components/long-video-clips/DemoClipsGrid";

export const metadata: Metadata = {
  title: "Long Video Clips — Turn Long Videos Into Viral Short Clips | Itnavideo",
  description: "Upload your long podcast, interview, or lecture video. AI picks the best high-energy moments and creates captioned short clips ready for Reels, Shorts & TikTok.",
  alternates: { canonical: "/long-video-clips" },
  openGraph: {
    title: "Long Video Clips — AI Short Clip Generator | Itnavideo",
    description: "Upload a long video, get 1-10 viral-worthy clips with captions. Perfect for repurposing podcasts, interviews, and lectures.",
    images: ["/preview/Long Video Clips.png"],
  },
};

const DEMO_CLIPS = [
  { title: "Opening hook — the grab", time: "0:00 – 0:30", description: "Strong emotional opener that hooks viewers in the first 3 seconds" },
  { title: "The unexpected insight", time: "2:15 – 2:45", description: "Contrarian take that stops the scroll and makes people share" },
  { title: "Story climax moment", time: "5:10 – 5:40", description: "Peak energy moment with natural vocal emphasis and gestures" },
  { title: "Quotable wisdom drop", time: "8:22 – 8:52", description: "Punchy one-liner that works as a standalone motivational clip" },
  { title: "Data/number reveal", time: "11:00 – 11:30", description: "Surprising statistic that creates curiosity and engagement" },
  { title: "Actionable advice", time: "14:35 – 15:05", description: "Clear step-by-step tip viewers can immediately implement" },
  { title: "Controversial opinion", time: "17:45 – 18:15", description: "Bold statement that sparks debate and drives comments" },
  { title: "Personal story", time: "21:10 – 21:40", description: "Authentic vulnerability moment that builds connection" },
  { title: "Pattern interrupt", time: "24:55 – 25:25", description: "Sudden shift in energy or topic that re-engages wandering attention" },
  { title: "Powerful closing CTA", time: "28:30 – 29:00", description: "Strong call-to-action that drives followers to your longer content" },
];

export default function LongVideoClipsPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#0F172A' }}>
      {/* Hero */}
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(6,182,212,0.25)', background: 'rgba(6,182,212,0.08)', color: '#06B6D4' }}>
            <Scissors size={14} />
            AI Clip Generator
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
            Turn Long Videos Into<br />
            <span style={{ color: '#06B6D4' }}>Viral Short Clips</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload your podcast, interview, lecture, or any long-form video. AI analyzes the transcript, picks the best high-energy moments, and renders them as captioned short clips ready for Instagram Reels, YouTube Shorts, and TikTok.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard?videoType=long-video-clips" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
              Try Long Video Clips
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • 1 credit per clip • 1080p MP4 export</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: "📹", step: "1", title: "Upload long video", desc: "Any length — podcast, interview, vlog, lecture" },
              { icon: "🤖", step: "2", title: "AI picks best moments", desc: "Transcript analysis finds high-energy, viral-worthy segments" },
              { icon: "✂️", step: "3", title: "Get captioned clips", desc: "Download 1-10 ready-to-post short clips with captions" },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="mb-3 text-3xl">{item.icon}</div>
                <p className="text-sm font-black text-white">{item.title}</p>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "AI picks the most engaging moments",
              "Word-level captions on every clip",
              "Choose 15s, 30s, or 60s clips",
              "Up to 10 clips from one video",
              "Captions match your chosen style",
              "Full-screen 9:16 vertical format",
              "Each clip is scored for virality",
              "Non-overlapping, spread across the video",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)', borderRadius: '10px' }}>
                <Check size={16} className="mt-0.5 shrink-0" style={{ color: '#06B6D4' }} />
                <span className="text-sm leading-6" style={{ color: 'var(--text-dark-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best clips AI can find */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-black">Best clips AI picks from your video</h2>
          <p className="mb-8 text-center text-sm" style={{ color: 'var(--text-dark-muted)' }}>
            Our scorer analyzes speech density, keywords, questions, numbers, and emotional hooks to find the most shareable moments.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {DEMO_CLIPS.map((clip, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: '#06B6D4' }}>Clip {i + 1}</span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-dark-muted)' }}>
                    <Clock size={11} />
                    {clip.time}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-white">{clip.title}</p>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{clip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best for */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Best for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { emoji: "🎙️", title: "Podcasters", desc: "Extract 10 clips from one episode for a week of content" },
              { emoji: "🎓", title: "Educators", desc: "Turn lectures into bite-sized learning clips students actually watch" },
              { emoji: "📺", title: "YouTubers", desc: "Repurpose long-form into Shorts that drive subscribers back" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="mb-3 text-2xl">{item.emoji}</div>
                <p className="text-sm font-bold text-white">{item.title}</p>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this works */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">Why AI-picked clips outperform manual cuts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: <Zap size={18} />, title: "Word density scoring", desc: "High speech velocity = high engagement. AI finds where you spoke with the most energy." },
              { icon: <Sparkles size={18} />, title: "Keyword detection", desc: "Questions, numbers, strong verbs, and emotional hooks are weighted higher." },
              { icon: <Scissors size={18} />, title: "Sentence boundary snapping", desc: "Clips start and end on natural pauses, not mid-sentence." },
              { icon: <Clock size={18} />, title: "Position diversity", desc: "Clips are spread across the full video, not just the first few minutes." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="shrink-0 mt-0.5" style={{ color: '#06B6D4' }}>{item.icon}</div>
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo clips from Paul Graham talk */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-2xl font-black">10 clips extracted from one 22-min video</h2>
          <p className="mb-8 text-center text-sm" style={{ color: 'var(--text-dark-muted)' }}>
            Source: Paul Graham, Founder of Y Combinator, Live from Stockholm. AI picked these high-energy moments automatically.
          </p>
          <div className="mb-6 flex justify-center">
            <a
              href="https://youtu.be/QHJkUw31YX8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#06B6D4' }}
            >
              ▶ Watch original full video on YouTube
              <ArrowRight size={14} />
            </a>
          </div>
          <DemoClipsGrid />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <Link href="/dashboard?videoType=long-video-clips" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
            Try Long Video Clips
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • Upload any length • Captions included</p>
        </div>
      </section>
    </main>
  );
}
