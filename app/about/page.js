import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Clapperboard,
  GraduationCap,
  Layers3,
  Mic2,
  PlaySquare,
  Sparkles,
  UploadCloud,
  Users,
  Wand2,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

export const metadata = {
  title: "About Itnavideo | AI Video Explainer Platform",
  description:
    "Itnavideo kya karta hai, users ko kya faida milta hai, kaise kaam karta hai, aur creators, students, educators, businesses, aur AI engineers ke liye kyu useful hai.",
};

const answers = [
  {
    eyebrow: "Karta kya hai?",
    title: "Itnavideo long idea ko short, polished AI video mein convert karta hai.",
    desc: "User apna video, voice, ya script deta hai. Platform us content ko samajh kar 9:16 explainer reel, captions, scenes, visuals, music cues, aur final render workflow mein organize karta hai.",
    icon: PlaySquare,
  },
  {
    eyebrow: "Faida kya hai?",
    title: "Editing time kam, output zyada clear, aur posting faster.",
    desc: "Creators ko blank timeline se start nahi karna padta. Itnavideo speech ko clean story mein badalta hai, important points highlight karta hai, aur publish-ready vertical video draft banata hai.",
    icon: BadgeCheck,
  },
  {
    eyebrow: "Kaise kaam karta hai?",
    title: "AI planner pehle content samajhta hai, phir video direction deta hai.",
    desc: "Transcript, hook, scene structure, caption text, visual assets, timing, music, sound effects, and render instructions ek planned pipeline se guzarte hain.",
    icon: BrainCircuit,
  },
  {
    eyebrow: "Kaun use karta hai?",
    title: "Creators, students, educators, founders, marketers, and teams.",
    desc: "Jo bhi knowledge, product demo, lecture, explainer, ya social content ko short-form video mein present karna chahta hai, uske liye Itnavideo useful hai.",
    icon: Users,
  },
];

const workflow = [
  {
    title: "Upload or write",
    desc: "Video, audio, ya script se start karo.",
    icon: UploadCloud,
  },
  {
    title: "AI understands",
    desc: "Speech, topic, tone, and key points detect hote hain.",
    icon: Mic2,
  },
  {
    title: "Director plan",
    desc: "Hook, captions, scenes, visuals, and pacing decide hota hai.",
    icon: Clapperboard,
  },
  {
    title: "Render ready",
    desc: "Vertical reel/export workflow final output ke liye prepare hota hai.",
    icon: Layers3,
  },
];

const audiences = [
  "Content creators: fast reels, explainers, captions, and social posts.",
  "Students: notes, concepts, and study content ko visual video mein convert karna.",
  "Educators: lecture clips and learning material ko short explainers banana.",
  "Businesses: product demos, tutorials, ads, and customer education content.",
  "AI engineers: real content pipeline, prompt logic, rendering, and automation ka practical example.",
];

export default function AboutPage() {
  return (
    <main className="bg-[#050506] text-white">
      <section className="brand-surface relative overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <div className="mb-8">
              <BrandLogo size="lg" showTagline />
            </div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">
              About Itnavideo
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">
              AI video banana ab editing nahi, direction dena hai.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
              Itnavideo ek AI video platform hai jo creators aur teams ko raw
              idea, script, ya video se clean explainer reels banane mein help
              karta hai. Simple words mein: content do, AI usko short, clear,
              and publish-ready video structure mein convert karta hai.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 text-base font-black text-black transition hover:bg-white"
              >
                Try the workflow
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/5 px-6 py-4 text-base font-bold text-white transition hover:bg-white/10"
              >
                See features
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/85 shadow-2xl shadow-black/30">
            <div className="relative aspect-[4/5] bg-black">
              <Image
                src="/visuals/site-scenes/ai-engineer-night-work.png"
                alt="AI engineer working on an automated video creation system"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 460px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/12 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-mint">
                  AI Engineer View
                </p>
                <h2 className="mt-2 text-3xl font-black">Prompt to production</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-zinc-300">
                  Transcript, planning, asset selection, rendering, and export
                  tied into one practical workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">
              Clear explanation
            </p>
            <h2 className="text-4xl font-black leading-tight tracking-normal md:text-6xl">
              Itnavideo ko samajhne ka simple breakdown.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {answers.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.eyebrow}
                  className="rounded-lg border border-white/10 bg-zinc-950 p-6"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                    <Icon size={20} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-mint">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-black leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    {item.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-zinc-950/60 px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">
              How it works
            </p>
            <h2 className="text-4xl font-black leading-tight tracking-normal">
              Raw content se AI-directed reel tak.
            </h2>
            <p className="mt-5 text-sm leading-6 text-zinc-400">
              Itnavideo ka goal random generator banana nahi hai. Goal hai ek
              repeatable production pipeline: content samjho, story plan karo,
              video compose karo, phir render-ready output do.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {workflow.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-white/10 bg-black/25 p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-brand-mint">
                      0{index + 1}
                    </span>
                    <Icon className="text-brand-gold" size={22} />
                  </div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
            <div className="relative aspect-[16/11] bg-black">
              <Image
                src="/founder/syed-mohammed-rohi.webp"
                alt="Syed Mohammed Rohi, founder of Itnavideo"
                fill
                className="object-cover object-[50%_32%]"
                sizes="(min-width: 1024px) 540px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/8 to-transparent" />
            </div>
            <div className="p-8">
              <Sparkles className="mb-6 text-brand-mint" size={28} />
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">
                Background
              </p>
              <h2 className="text-3xl font-black">Built from a real creator pain.</h2>
              <p className="mt-5 text-lg leading-8 text-zinc-300">
                Itnavideo is founded by Syed Mohammed Rohi. The idea is simple:
                a creator may have good knowledge or a strong message, but
                turning it into a clean video still takes too much editing time.
                Itnavideo brings AI planning and video rendering together so
                that creation becomes faster and more repeatable.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-8">
            <GraduationCap className="mb-6 text-brand-gold" size={30} />
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">
              Who uses it
            </p>
            <h2 className="text-3xl font-black leading-tight">
              Made for people who need video output without becoming full-time editors.
            </h2>
            <div className="mt-7 grid gap-3">
              {audiences.map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-4 text-sm font-semibold leading-6 text-zinc-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-brand-mint/20 bg-brand-mint/10 p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <Wand2 className="mb-6 text-brand-mint" size={30} />
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">
                For AI engineers
              </p>
              <h2 className="text-3xl font-black leading-tight md:text-5xl">
                Itnavideo shows an end-to-end AI product, not just a demo prompt.
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-300">
                AI engineer ke liye yeh project useful hai because it connects
                prompt design, transcription, content planning, asset selection,
                template logic, rendering, storage, billing, and user workflow.
                Matlab AI idea ko real product pipeline mein kaise convert karte
                hain, woh clearly visible hota hai.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "Input: video, audio, script, or user prompt",
                "AI layer: transcript, hook, scenes, captions, visuals",
                "System layer: render job, media storage, history, and billing",
                "Output: short-form video workflow users can repeat",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-brand-mint/20 bg-black/35 px-4 py-4 text-sm font-black leading-6 text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
