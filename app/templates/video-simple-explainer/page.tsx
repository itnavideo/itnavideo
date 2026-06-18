import { ArrowRight, Check, Film, Image as ImageIcon, Layers, Play, Sparkles, Type, Upload, Wand2, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Simple Explainer — Creator Video + Subtitles + Image Reel | Itnavideo',
  description: 'Upload your video, add a title and explanation image. Get a polished 9:16 reel with creator video, AI subtitles, and visual support. Ready for Reels & Shorts.',
  alternates: { canonical: '/templates/video-simple-explainer' },
  openGraph: {
    title: 'Video Simple Explainer — Your Video Becomes a Reel',
    description: 'Creator video + AI subtitles + title + explanation image. One upload, one reel.',
    images: ['/visuals/previews/Video Simple Explainer Homepage Hero.png'],
  },
};

const layers = [
  { label: 'Creator Video', desc: 'Your 16:9 video stays on top, full-width', color: 'bg-cyan-500', accent: 'text-cyan-600' },
  { label: 'Title Strip', desc: 'Bold text with hand-painted brush highlight', color: 'bg-yellow-400', accent: 'text-yellow-600' },
  { label: 'AI Subtitles', desc: 'Real speech → timed captions in 13+ languages', color: 'bg-purple-500', accent: 'text-purple-600' },
  { label: 'Explanation Image', desc: 'Your uploaded image fills the bottom section', color: 'bg-emerald-500', accent: 'text-emerald-600' },
];

const features = [
  { icon: Film, title: 'Full-Screen Creator Video', body: 'Your video stays prominent at the top. No tiny thumbnails.' },
  { icon: Sparkles, title: 'AI-Generated Subtitles', body: 'Speech is transcribed and synced word-by-word automatically.' },
  { icon: Type, title: 'Brush-Stroke Title', body: 'Your topic title gets a premium hand-painted yellow highlight.' },
  { icon: ImageIcon, title: 'Custom Bottom Image', body: 'Upload any image — infographic, chart, screenshot, or photo.' },
  { icon: Layers, title: '4-Layer Layout', body: 'Video + Title + Subtitles + Image. Clean, no clutter, no confusion.' },
  { icon: Wand2, title: 'Zero Editing Needed', body: 'Upload → generate → download. No timeline, no manual work.' },
];

const useCases = [
  'Finance explainers (SIP, loans, credit cards)',
  'Career tips & job updates',
  'Educational content (exams, courses)',
  'Product walkthroughs & tutorials',
  'News commentary reels',
  'Course promotion & coaching',
];

export default function VideoExplainerPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-12 sm:px-6 md:pt-36 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(6,182,212,0.05)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-bold text-cyan-700">
                <Film size={14} />
                Video Explainer Template
              </span>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Your Video Becomes a<br />
                <span className="text-cyan-600">Published Reel</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg">
                Upload video with speech, write a title, add one explanation image. AI generates subtitles and creates a vertical reel in seconds.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard?template=video-explainer" className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-cyan-600/15 transition hover:bg-cyan-700">
                  Create Explainer Reel <ArrowRight size={16} />
                </Link>
                <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-4 text-sm font-black text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50">
                  See How It Works
                </Link>
              </div>
              <p className="mt-5 text-xs text-zinc-400">One credit = one reel. Use with any plan.</p>
            </div>

            {/* Preview */}
            <div className="relative mx-auto max-w-[300px] lg:max-w-[340px]">
              <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-2xl">
                <Image src="/visuals/previews/Video Simple Explainer Homepage Hero.png" alt="Video Explainer reel preview" width={540} height={720} className="w-full object-cover object-top" priority />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-lg">
                <p className="text-[10px] font-bold text-zinc-400">Output</p>
                <p className="text-sm font-black text-zinc-900">9:16 MP4 Reel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reel Structure Visual */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-cyan-600">Layout</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Your Reel, Layer by Layer</h2>
            <p className="mt-3 text-zinc-500">Four distinct sections. Clean, readable, professional.</p>
          </div>
          <div className="mt-10 space-y-3">
            {layers.map((layer, i) => (
              <div key={layer.label} className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${layer.color} text-sm font-black text-white`}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-sm font-black ${layer.accent}`}>{layer.label}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-cyan-600">Process</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Three Inputs. One Reel.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { step: '1', icon: Upload, title: 'Upload Video', body: 'MP4, MOV, or audio with clear speech. Max 1 minute used.', accent: 'bg-cyan-50 text-cyan-600' },
              { step: '2', icon: Type, title: 'Write Title + Add Image', body: 'Your title gets a brush highlight. Image fills the bottom section.', accent: 'bg-yellow-50 text-yellow-600' },
              { step: '3', icon: Play, title: 'Generate & Download', body: 'AI transcribes speech, renders all 4 layers. Download 9:16 MP4.', accent: 'bg-purple-50 text-purple-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.accent}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-cyan-600">Features</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Everything You Need</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-black">{f.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Perfect For</h2>
          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {useCases.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-700">
                <Check size={14} className="shrink-0 text-cyan-500" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-700 p-10 text-center text-white sm:p-14">
          <Zap className="mx-auto mb-4" size={32} />
          <h2 className="text-3xl font-black sm:text-4xl">Ready to Create Your Reel?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-cyan-100">
            Upload video, write title, add image. Download a polished vertical reel in minutes. One credit per reel.
          </p>
          <Link href="/dashboard?template=video-explainer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-cyan-700 shadow-xl transition hover:bg-cyan-50">
            Create Explainer Reel <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
