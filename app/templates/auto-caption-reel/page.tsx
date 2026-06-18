import { ArrowRight, Captions, Check, Film, Globe, Palette, Play, Sparkles, Upload, Wand2, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import CaptionStylePicker from './CaptionStylePicker';

export const metadata: Metadata = {
  title: 'Auto Caption Reel — One-Click Subtitles for TikTok, Reels & Shorts | Itnavideo',
  description: 'Upload your reel, pick a caption style, and get professional animated subtitles in seconds. No editing. 13+ languages. Ready for all platforms.',
  alternates: { canonical: '/templates/auto-caption-reel' },
  openGraph: {
    title: 'Auto Caption Reel — One-Click Subtitles',
    description: 'Pick a style. Watch the magic. Download your captioned reel.',
    images: ['/visuals/previews/Auto Caption Reel Home.png'],
  },
};

const features = [
  { icon: Captions, title: 'One-Click Captions', body: 'Generate perfectly synced captions instantly with AI-powered transcription.' },
  { icon: Globe, title: '13+ Languages', body: 'English, Hindi, Hinglish, Urdu, Arabic, Spanish, French, German, and more.' },
  { icon: Palette, title: '18+ Caption Styles', body: 'From bold basics to animated word effects. Pick what fits your brand.' },
  { icon: Sparkles, title: 'Word-Level Sync', body: 'Captions timed to every spoken word, not just sentences. Feels professional.' },
  { icon: Film, title: 'Full HD Export', body: 'Download in 1080p, ready for Instagram, TikTok, YouTube, and LinkedIn.' },
  { icon: Wand2, title: 'No Editing Needed', body: 'Upload and download. No timeline, no manual syncing, no learning curve.' },
];

export default function AutoCaptionReelPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-12 sm:px-6 md:pt-36 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(37,99,235,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-blue-600">One-Click</span> Subtitles for<br />
            TikTok, Reels & Shorts
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg">
            Transform your videos with accurate, lightning-fast subtitles powered by AI. Perfect for creators, educators, and businesses.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard?template=auto-caption-reel" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700">
              Start Here <ArrowRight size={16} />
            </Link>
            <Link href="#playground" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-4 text-sm font-black text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50">
              Try Demo
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><Check size={13} className="text-blue-500" />No editing skills</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-blue-500" />13+ languages</span>
            <span className="flex items-center gap-1.5"><Check size={13} className="text-blue-500" />Ready in seconds</span>
          </div>
        </div>
      </section>

      {/* Playground — Style Picker */}
      <section id="playground" className="bg-gradient-to-b from-zinc-50 to-white px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-blue-600">Playground</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Pick a Style, Watch the Magic Happen</h2>
            <p className="mt-3 text-zinc-500">Select from trending caption templates and watch your video come to life</p>
          </div>
          <CaptionStylePicker />
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-blue-600">Features</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Professional Captions Made Simple</h2>
            <p className="mt-3 text-zinc-500">Everything you need to make your videos stand out and engaging.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-black text-zinc-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accuracy section */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">Captions So Accurate, You&apos;ll Barely Need to Edit</h2>
            <p className="mt-4 text-base leading-7 text-zinc-500">
              Our advanced AI transcription delivers high accuracy right out of the box, so you spend less time fixing errors and more time perfecting your style. Whether it&apos;s clear dialogue or fast-paced content, get captions that just work.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {['Word-level timing', 'Smart punctuation', 'Speaker detection', 'Noise handling'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                  <Check size={14} className="text-blue-500" />{item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg">
            <div className="space-y-3">
              {[
                { time: '00:02', text: 'This is how accurate', confidence: '99%' },
                { time: '00:04', text: 'your subtitles will be', confidence: '98%' },
                { time: '00:06', text: 'on every single video', confidence: '99%' },
              ].map((line) => (
                <div key={line.time} className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
                  <span className="text-[10px] font-bold text-zinc-400">{line.time}</span>
                  <span className="flex-1 text-sm font-bold text-zinc-800">{line.text}</span>
                  <span className="rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-black text-green-600">{line.confidence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Supports 13+ Languages</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {['English', 'Hindi', 'Hinglish', 'Urdu', 'Arabic', 'Kannada', 'Tamil', 'Farsi', 'Spanish', 'French', 'German', 'Portuguese', 'Indonesian'].map((lang) => (
              <span key={lang} className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-600">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-10 text-center text-white sm:p-14">
          <h2 className="text-3xl font-black sm:text-4xl">Ready to Transform Your Videos?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-blue-100">
            Join creators who use Itnavideo to add professional subtitles in seconds. One credit = one captioned reel.
          </p>
          <Link href="/dashboard?template=auto-caption-reel" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-blue-700 shadow-xl transition hover:bg-blue-50">
            Try For Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
