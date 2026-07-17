import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Captions, Check, Clock3, Volume2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Long-form Captioned Video — 16:9 Video Captions | Itnavideo",
  description: "Add timed English or Roman Hinglish captions to a 16:9 video up to 10 minutes while preserving your original video and audio.",
  alternates: { canonical: "/long-form-captioned-video" },
  openGraph: { title: "Long-form Captioned Video | Itnavideo", description: "Preserve your 16:9 video and original audio with timed captions, up to 10 minutes." },
};

const benefits = ["Professional 1920×1080 landscape MP4", "Original video and audio stay intact", "Fresh timed captions from this upload only", "English or clean Roman Hinglish captions", "Up to 10 minutes / 500 MB"];

export default function LongFormCaptionedVideoPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Itnavideo Long-form Captioned Video", applicationCategory: "MultimediaApplication", operatingSystem: "Web", url: "https://www.itnavideo.com/long-form-captioned-video", description: "Upload a video and receive a 16:9 long-form MP4 with timed captions while preserving original video and audio.", offers: { "@type": "Offer", priceCurrency: "INR", description: "1 credit per started minute: 5 minutes = 5 credits, 5:01 = 6 credits, and 10 minutes = 10 credits." } };
  return <main className="min-h-screen bg-[#0B1120] px-4 pb-20 pt-28 text-white sm:px-6 sm:pt-32">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")}} />
    <section className="mx-auto max-w-4xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-500/[0.08] px-4 py-2 text-xs font-bold text-cyan-100"><Captions size={14}/>Long Videos</div>
      <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">Caption your full video.<br/><span className="text-cyan-300">Keep the story intact.</span></h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Upload a landscape YouTube video, podcast, interview, or lecture. Itnavideo keeps your original video and audio, then adds readable timed captions across the full video.</p>
      <Link href="/dashboard?videoType=long-form-captioned-video" className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-black text-white brand-btn-primary-dark">Create a Long-form Captioned Video <ArrowRight size={16}/></Link>
    </section>
    <section className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5"><Clock3 className="text-cyan-300"/><p className="mt-3 font-black">Up to 10 minutes</p><p className="mt-1 text-sm text-slate-400">No silent trimming to a 60-second clip.</p></div>
      <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5"><Volume2 className="text-cyan-300"/><p className="mt-3 font-black">Original audio preserved</p><p className="mt-1 text-sm text-slate-400">No replacement narration, music, or SFX.</p></div>
      <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5"><Captions className="text-cyan-300"/><p className="mt-3 font-black">Captions that follow speech</p><p className="mt-1 text-sm text-slate-400">Fresh English or Roman Hinglish transcription.</p></div>
    </section>
    <section className="mx-auto mt-12 max-w-4xl rounded-2xl border border-cyan-300/15 bg-cyan-500/[0.045] p-6 sm:p-8"><h2 className="text-2xl font-black">What you get</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{benefits.map((benefit) => <p key={benefit} className="flex gap-2 text-sm text-slate-200"><Check size={16} className="mt-0.5 shrink-0 text-cyan-300"/>{benefit}</p>)}</div><p className="mt-7 border-t border-white/10 pt-5 text-sm leading-6 text-slate-300"><strong className="text-white">Duration pricing:</strong> 1 credit per started minute. A 5-minute video costs 5 credits, a 5:01 video costs 6 credits, and a 10-minute video costs 10 credits. Failed system renders release their reserved credits.</p></section>
  </main>;
}