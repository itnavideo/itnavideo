import Link from "next/link";
import { AudioLines, Clapperboard, Film, Layers3, Sparkles, Wand2 } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

export const metadata = {
  title: "About | Itnavideo",
  description: "Learn how Itnavideo creates faceless videos and face-camera Shorts with AI.",
};

const principles = [
  { title: "Creator input first", desc: "Start with a voiceover for faceless videos or camera footage for talking-head edits.", icon: AudioLines },
  { title: "Director logic", desc: "Pacing, scene choice, subtitles, music, and SFX should feel intentional, not randomly generated.", icon: Clapperboard },
  { title: "Production ready", desc: "The output has to survive real platform constraints: safe zones, export quality, and repeatable workflows.", icon: Film },
];

const creatorInputs = [
  "Voiceovers, narration, or spoken lessons",
  "Face-camera videos, interviews, talking-head clips, and demos",
  "Optional photos, screenshots, product images, and graphics",
  "Optional video clips, tutorials, screen recordings, and demos",
  "Reusable brand colors, fonts, and visual styles",
];

export default function AboutPage() {
  return (
    <main className="bg-[#050506] text-white">
      <section className="brand-surface relative overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="mb-8">
              <BrandLogo size="lg" showTagline />
            </div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">About Itnavideo</p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              A short-form video engine for modern creators.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
              Itnavideo is built around a simple belief: creators should spend their energy on ideas, not fighting editors. Upload a voiceover for a faceless video or a camera clip for a talking-head edit, then get a polished video draft back.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-mint/10 text-brand-mint">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-black">What we are building</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              A creation tool that turns voiceovers, optional media, and face-camera footage into platform-ready Shorts.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Mission</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">Make editing feel like giving direction.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-white/10 bg-zinc-950 p-6">
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-zinc-950/60 px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Creator inputs</p>
            <h2 className="text-4xl font-black leading-tight">Audio, camera footage, and your assets when available.</h2>
            <p className="mt-5 text-sm leading-6 text-zinc-400">
              The more useful material you add, the more personal the result can feel. Audio is enough for faceless videos; one camera clip is enough for talking-head edits.
            </p>
          </div>
          <div className="grid gap-3">
            {creatorInputs.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-lg border border-white/10 bg-black/25 p-5">
                <span className="font-mono text-sm font-black text-brand-mint">0{index + 1}</span>
                <p className="text-sm font-semibold leading-6 text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-brand-mint/20 bg-brand-mint/10 p-8">
            <Wand2 className="mb-6 text-brand-mint" size={28} />
            <h2 className="text-3xl font-black">Founder note</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-200">
              Itnavideo is founded by Syed Mohammed Rohi, built from the pain of turning ideas into finished video. The goal is to compress hours of editing decisions into workflows that begin with what creators already have: their voice or their camera footage.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-8">
            <Layers3 className="mb-6 text-brand-gold" size={28} />
            <h2 className="text-3xl font-black">Where it goes next</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Short-form comes first, then long-form YouTube, podcast visuals, educational videos, and business content. The same director logic can scale from a 30-second reel to a 20-minute story.
            </p>
            <Link href="/signup" className="mt-8 inline-flex rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white">
              Start creating
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
