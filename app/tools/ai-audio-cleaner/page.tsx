import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Audio Cleaner – Remove Silence, Filler Words & Background Noise | Itnavideo",
  description: "Upload your audio. AI removes long silences, filler words (um, uh, like), repeated sentences, background noise, and normalizes volume. Get clean, professional audio in seconds.",
  alternates: { canonical: "/tools/ai-audio-cleaner" },
  openGraph: {
    title: "AI Audio Cleaner – Remove Silence, Fillers & Noise",
    description: "Upload audio → AI cleans it → Download professional-quality audio. No editing skills needed.",
  },
};

export default function AIAudioCleanerPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#052e16' }}>
      {/* Hero */}
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: '1px solid rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.08)', color: '#F97316' }}>
            <Mic size={14} />
            AI Audio Tool
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
            AI Audio Cleaner<br />
            <span style={{ color: '#F97316' }}>Script Preview, Mistake &amp; Silence Removal</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: 'var(--text-dark-secondary)' }}>
            Upload long podcasts, voiceovers, or interviews. AI generates a full script in the preview dashboard, removes recording mistakes, repeated takes, and long awkward silences, delivering ready-to-use studio audio.
          </p>
          <div className="mt-8">
            <Link href="/dashboard?videoType=ai-audio-cleaner" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
              Clean Your Audio
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • Full script preview • Instant download</p>
        </div>
      </section>

      {/* Banner */}
      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-orange-400/15 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <img src="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_0000000084e482119c5951ac67c32219_lncnaa.png" alt="AI Audio Cleaner waveform and script visualization" className="w-full h-auto" loading="lazy" />
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-black">What AI Audio Cleaner does</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🔇", title: "Remove Long Silence", desc: "Cuts dead air and awkward pauses longer than 1 second" },
              { icon: "🗣️", title: "Remove Filler Words", desc: 'Detects and cuts "um", "uh", "like", "you know", "basically"' },
              { icon: "🔁", title: "Remove Repeats", desc: "Detects when you said the same thing twice and keeps the best take" },
              { icon: "✂️", title: "Remove False Starts", desc: "Cuts self-corrections like \"I was — I mean, we were...\"" },
              { icon: "🔊", title: "Noise Reduction", desc: "Reduces background hum, hiss, AC noise, and room echo" },
              { icon: "📊", title: "Volume Normalize", desc: "Consistent loudness throughout, no sudden jumps or whispers" },
              { icon: "⏱️", title: "Trim Start & End", desc: "Removes dead silence at the beginning and end of your recording" },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="mb-2 text-2xl">{feature.icon}</div>
                <p className="text-sm font-bold text-white">{feature.title}</p>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", icon: "📤", title: "Upload audio", desc: "MP3, WAV, M4A, AAC, or FLAC — any length" },
              { step: "2", icon: "🤖", title: "AI processes", desc: "Transcribes, detects issues, and cleans your audio" },
              { step: "3", icon: "📥", title: "Download clean audio", desc: "Get your polished audio file instantly" },
            ].map((item) => (
              <div key={item.step} className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <div className="mb-3 text-3xl">{item.icon}</div>
                <p className="text-sm font-black text-white">{item.title}</p>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{item.desc}</p>
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
              { emoji: "🎙️", title: "Podcasters", desc: "Clean up interviews and solo episodes before publishing" },
              { emoji: "🎬", title: "Voiceover Artists", desc: "Remove mistakes and noise from raw recordings" },
              { emoji: "📚", title: "Course Creators", desc: "Polish lecture audio for professional courses" },
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

      {/* FAQ */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-black">FAQ</h2>
          <div className="grid gap-3">
            {[
              { q: "What audio formats are supported?", a: "MP3, WAV, M4A, AAC, and FLAC. Any sample rate or bitrate." },
              { q: "Is there a duration limit?", a: "For now, AI Audio Cleaner processes the first 1 minute of your audio. Longer support coming soon." },
              { q: "Will it change my voice?", a: "No. The AI only removes unwanted parts (silence, fillers, noise). Your voice stays natural." },
              { q: "How does filler word detection work?", a: "We transcribe your audio with AI, detect filler patterns (um, uh, like, you know), and surgically cut them while keeping natural speech flow." },
              { q: "Can I choose which cleaning options to apply?", a: "Yes. Every option (silence removal, filler removal, noise reduction, etc.) has an individual toggle." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-dark)' }}>
                <summary className="cursor-pointer text-sm font-bold text-white list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="mt-2 text-xs leading-5" style={{ color: 'var(--text-dark-muted)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <Link href="/dashboard?videoType=ai-audio-cleaner" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark">
            Clean Your Audio Now
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-dark-muted)' }}>No credit card needed • 1 credit per clean • Instant download</p>
        </div>
      </section>
    </main>
  );
}
