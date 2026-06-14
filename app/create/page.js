import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AudioLines, BadgeCheck, CheckCircle2, Clock3, Film, Layers3, ShieldCheck, Sparkles, Upload } from "lucide-react";

export const metadata = {
  title: "Create AI Reels From Audio, Video, or Images",
  description: "Upload audio or video and create a polished Video Explainer reel.",
  alternates: {
    canonical: "/create",
  },
};

const templates = [
  {
    href: "/dashboard?template=video-explainer",
    image: "/visuals/previews/video-explainer-homepage.png",
    icon: Film,
    title: "Video Explainer",
    bestFor: "Educational, finance, career, and news-style explainers.",
    upload: "Audio or video with clear speech",
    needs: "Real transcript",
    cta: "Use Video Explainer",
    badges: ["Audio", "Video", "Needs speech"],
    accent: "text-cyan-200",
    border: "border-cyan-300/25",
    surface: "bg-cyan-300/[0.07]",
  },
  {
    href: "/dashboard?template=compare",
    image: "/visuals/previews/homepage to show the COMPARE template preview.png",
    icon: Layers3,
    title: "Compare Explainer",
    bestFor: "Left vs right comparisons, before/after, product matchups.",
    upload: "Audio voiceover + 2-4 images",
    needs: "Clear comparison audio",
    cta: "Use Compare Explainer",
    badges: ["Audio", "2-4 images", "Left vs Right"],
    accent: "text-emerald-200",
    border: "border-emerald-300/25",
    surface: "bg-emerald-300/[0.07]",
  },
];

const steps = [
  {title: "Choose template", body: "Pick the output style before upload.", icon: BadgeCheck},
  {title: "Upload source", body: "The upload box changes to the right file type.", icon: Upload},
  {title: "Generate reel", body: "AI plans, renders, and returns a vertical MP4.", icon: Sparkles},
];

const trust = [
  "First video for ₹9",
  "Private temporary uploads",
  "Most reels finish in a few minutes",
  "Best around 1 minute and under 100MB",
];

export default function CreatePage() {
  return (
    <main className="brand-surface min-h-screen px-4 py-24 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Create a Reel</p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">Create an Explainer Video.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Upload audio or video with clear speech and Itnavideo will generate a ready-to-post vertical explainer reel.
            </p>
          </div>

          <div className="rounded-lg border border-brand-mint/25 bg-brand-mint/10 p-5">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 shrink-0 text-brand-mint" size={24} />
              <div>
                <p className="text-lg font-black text-white">Private upload. First video for ₹9.</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Your file is used only to create your reel. Start with a short, clear source for the best result.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="rounded-lg border border-white/10 bg-black/25 p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs font-black text-zinc-600">0{index + 1}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                    <Icon size={18} />
                  </span>
                </div>
                <h2 className="text-lg font-black text-white">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{step.body}</p>
              </article>
            );
          })}
        </div>

        <section className="rounded-lg border border-white/10 bg-zinc-950 p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-mint">Focused launch template</p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Explainer Video</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              We are focusing on one excellent template first so the render stays fast, clear, and reliable.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.title} template={template} />
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {trust.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 p-4 text-sm font-bold text-zinc-300">
              <CheckCircle2 className="shrink-0 text-brand-mint" size={18} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function TemplateCard({template}) {
  const Icon = template.icon;

  return (
    <Link href={template.href} className={`group overflow-hidden rounded-lg border ${template.border} ${template.surface} transition hover:border-white/30`}>
      <div className="relative aspect-[9/16] bg-black">
        <Image
          src={template.image}
          alt={`${template.title} preview`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
        <div className={`absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-md bg-black/58 ${template.accent} backdrop-blur-md`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-black text-white">{template.title}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{template.bestFor}</p>

        <div className="mt-5 space-y-2 text-sm">
          <InfoRow icon={AudioLines} label="Upload" value={template.upload} />
          <InfoRow icon={Clock3} label="Needs" value={template.needs} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {template.badges.map((badge) => (
            <span key={badge} className="rounded-md border border-white/10 bg-black/25 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-300">
              {badge}
            </span>
          ))}
        </div>

        <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-black transition group-hover:bg-brand-mint">
          {template.cta}
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function InfoRow({icon: Icon, label, value}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-white/10 bg-black/25 px-3 py-2.5">
      <Icon className="mt-0.5 shrink-0 text-brand-mint" size={15} />
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">{label}</p>
        <p className="mt-1 font-bold leading-5 text-zinc-200">{value}</p>
      </div>
    </div>
  );
}
