import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Captions, Check, Clock3, Film, Laptop, MonitorPlay, Shield, Sparkles, Upload, Volume2, Wand2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Long Caption Pro AI Video Maker — 16:9 Landscape Subtitles | Itnavideo",
  description: "Upload any landscape video up to 10 minutes and get professional timed captions with our AI video generator. Original video and audio stay intact.",
  alternates: { canonical: "/long-caption-pro" },
  openGraph: {
    title: "Long Caption Pro AI Video Maker — 16:9 Landscape Subtitles | Itnavideo",
    description: "Keep your full 16:9 video and original audio. Add readable timed captions. Up to 10 minutes, 1920×1080 MP4.",
    images: ["/visuals/previews/long-caption-pro.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Long Caption Pro AI Video Maker | Itnavideo",
    description: "Professional timed captions for your 16:9 video. Original audio preserved. Up to 10 minutes.",
    images: ["/visuals/previews/long-caption-pro.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Itnavideo Long Caption Pro",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: "https://www.itnavideo.com/long-caption-pro",
  description: "Upload a 16:9 video and receive a full-length MP4 with professional timed captions. Original video and audio preserved. Supports up to 10 minutes.",
  offers: { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: "9", highPrice: "90", offerCount: "10" },
  screenshot: "https://www.itnavideo.com/visuals/previews/long-caption-pro.png",
};

const steps = [
  { icon: Upload, title: "Upload your video", desc: "MP4, MOV, or WEBM with clear speech. Up to 10 minutes / 500 MB." },
  { icon: Wand2, title: "Choose caption style", desc: "6 professional landscape-safe styles: Studio Clean, Cinematic, Marker Highlight, and more." },
  { icon: Film, title: "Download full MP4", desc: "1920×1080 landscape video with your original audio and timed captions baked in." },
];

const features = [
  { icon: Clock3, title: "Up to 10 minutes", desc: "Podcasts, interviews, lectures, long explainers — no artificial trimming to a short clip." },
  { icon: Volume2, title: "Original audio 100% preserved", desc: "Your voiceover, music, and ambience stay exactly as recorded. No AI narration or replacement." },
  { icon: Captions, title: "Word-level timed captions", desc: "Groq Whisper transcription with word-by-word timing. Readable, properly grouped." },
  { icon: MonitorPlay, title: "Native 1920×1080 landscape", desc: "Your video stays 16:9. No cropping, no black bars, no aspect ratio change." },
  { icon: Shield, title: "Private and auto-deleted", desc: "All uploads are encrypted in transit and auto-delete after 48 hours. We never share content." },
  { icon: Laptop, title: "6 landscape caption styles", desc: "Studio Clean, Cinematic, Marker Highlight, Midnight, Glass Blur, Metallic Gradient — designed for wide screens." },
];

const useCases = [
  { emoji: "🎙️", title: "Podcasters", desc: "Add readable captions to your full podcast episode for YouTube accessibility." },
  { emoji: "🎓", title: "Educators", desc: "Make lectures and tutorials accessible with clear English or Hinglish captions." },
  { emoji: "💼", title: "Business presentations", desc: "Add subtitles to webinar recordings, product demos, and internal training." },
  { emoji: "📹", title: "YouTubers", desc: "Caption your long-form videos without editing software or manual SRT work." },
  { emoji: "🎤", title: "Interview creators", desc: "Interview clips with professional captions — ready for LinkedIn and YouTube." },
  { emoji: "📰", title: "News & current affairs", desc: "Quick turn-around captions for news analysis and commentary videos." },
];

const pricing = [
  { duration: "1 minute", credits: "1 credit" },
  { duration: "2 minutes", credits: "2 credits" },
  { duration: "5 minutes", credits: "5 credits" },
  { duration: "6 minutes", credits: "5.8 credits" },
  { duration: "7 minutes", credits: "6.6 credits" },
  { duration: "10 minutes", credits: "9 credits" },
];

const faqs = [
  { q: "What video formats are supported?", a: "MP4, MOV, and WEBM with clear speech. Maximum 500 MB file size and 10 minutes duration." },
  { q: "Is the original audio preserved?", a: "Yes. We never add background music, SFX, or AI narration. Your source audio stays at full volume." },
  { q: "What languages are supported?", a: "English and Roman Hinglish (Hindi in Latin script). No Devanagari or Arabic script is used." },
  { q: "What happens if transcription fails?", a: "If we can't detect clear speech, we show an error and you're not charged. Upload a video with clear speaking voice." },
  { q: "Are credits charged before or after?", a: "Credits are reserved only after Lambda accepts the render and settled only after a successful MP4 is generated. Failed renders release credits." },
  { q: "Can I use portrait or square videos?", a: "The renderer preserves aspect ratio using object-fit: contain. Landscape 16:9 videos produce the best result." },
  { q: "What if my video is over 10 minutes?", a: "Currently the maximum is 10 minutes. For longer content, split your video before uploading." },
];

export default function LongFormCaptionedVideoPage() {
  redirect("/auto-caption-generator");
  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,182,212,0.08),rgba(15,23,42,0)_50%)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/[0.08] px-5 py-2.5 text-xs font-bold text-cyan-100">
            <Sparkles size={13} />
            Long Videos — The complete captioning solution
          </div>
          <h1 className="text-4xl font-black leading-[1.05] sm:text-6xl md:text-7xl">
            Caption your full video.
            <br />
            <span className="bg-[linear-gradient(135deg,#22D3EE_0%,#A78BFA_100%)] bg-clip-text text-transparent">Keep every frame.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Upload a 16:9 YouTube video, podcast, interview, or lecture. Itnavideo preserves your original video and audio, then adds clean timed captions across the entire video — up to 10 minutes.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard?videoType=long-caption-pro"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white px-9 py-4 text-base font-black text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.12)] transition hover:-translate-y-[1px] hover:bg-zinc-100"
            >
              Create Long Caption Pro
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
            >
              View pricing
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Laptop Preview ── */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[22px] border-[7px] border-slate-900 bg-background p-1.5 shadow-[0_40px_100px_rgba(6,182,212,0.12),0_12px_32px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-video overflow-hidden rounded-[13px] bg-muted">
              <Image
                src="/visuals/previews/long-caption-pro.png"
                alt="16:9 long-form captioned video showing readable timed captions on a landscape video"
                fill
                sizes="(min-width: 1024px) 1000px, 92vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 rounded-xl bg-background/80 px-7 py-3.5 text-center backdrop-blur-sm shadow-lg">
                <p className="text-base font-bold text-white sm:text-lg">Professional captions — your video stays intact</p>
              </div>
              <span className="absolute left-1/2 top-2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-slate-700" />
            </div>
          </div>
          <div className="relative mx-auto h-3.5 w-3/5 rounded-b-xl border-x border-b border-slate-900 bg-muted shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
            <span className="absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 bg-cyan-100/20" />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Three simple steps</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">No timeline. No manual syncing. No editing software.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="group relative rounded-2xl border border-white/8 bg-white/[0.025] p-6 text-center transition hover:border-cyan-300/20">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-500/[0.1]">
                <step.icon size={26} className="text-cyan-300" />
              </div>
              <span className="absolute right-4 top-4 text-4xl font-black text-white/[0.04]">{i + 1}</span>
              <h3 className="text-base font-black text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 pb-20 sm:px-6" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.03) 50%, transparent 100%)' }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-black sm:text-4xl">Everything you need</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-cyan-300/15">
                <f.icon size={22} className="mb-3 text-cyan-300" />
                <p className="text-sm font-black text-white">{f.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who This Is For ── */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-black sm:text-4xl">Who this is for</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <div key={uc.title} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <span className="text-2xl">{uc.emoji}</span>
                <p className="mt-3 text-sm font-black text-white">{uc.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-cyan-300/15 bg-cyan-500/[0.04] p-6 sm:p-10">
          <h2 className="text-center text-2xl font-black sm:text-3xl">Simple duration-based pricing</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">1 credit per started minute through 5 min, then 0.8 per additional minute. No hidden fees.</p>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pricing.map((p) => (
              <div key={p.duration} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-sm font-bold text-slate-200">{p.duration}</span>
                <span className="rounded-full border border-cyan-300/25 bg-cyan-400/[0.1] px-3 py-1 text-xs font-bold text-cyan-100">{p.credits}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">Credits reserved on render start; released on failure. No charge for failed transcription.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black sm:text-3xl">Frequently asked questions</h2>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-white/8 bg-white/[0.02] p-4 sm:p-5">
                <summary className="cursor-pointer list-none text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {faq.q}
                    <span className="shrink-0 text-xs text-slate-500 transition group-open:rotate-45">＋</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 pb-28 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Ready to caption your video?</h2>
          <p className="mt-3 text-sm text-muted-foreground">Upload once, get a captioned 16:9 MP4. No editing skills required.</p>
          <Link
            href="/dashboard?videoType=long-caption-pro"
            className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-white px-9 py-4 text-base font-black text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.12)] transition hover:-translate-y-[1px] hover:bg-zinc-100"
          >
            Create Long Caption Pro
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-xs text-slate-500">Clear credit cost shown before every render • Original video never altered</p>
        </div>
      </section>
    </main>
  );
}

