import Link from "next/link";
import { ArrowRight, Film, LayoutDashboard } from "lucide-react";

export default function VideosPage() {
  return (
    <main className="brand-surface min-h-screen px-6 py-28 text-white">
      <div className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-zinc-950 p-8">
        <Film className="mb-6 text-brand-mint" size={30} />
        <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-brand-mint">Videos</p>
        <h1 className="max-w-3xl text-4xl font-black md:text-6xl">Your rendered reels live in the dashboard.</h1>
        <p className="mt-5 max-w-2xl text-zinc-400">
          Use the dashboard to create Video Explainer reels, track render status, and open completed MP4 download links while they are available.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Create", "Start from a video upload."],
            ["Render", "Track planning, upload, rendering, and final MP4."],
            ["Download", "Use completed links before temporary storage expires."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-black/25 p-5">
              <p className="font-black text-white">{title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
        <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white">
          <LayoutDashboard size={18} />
          Open dashboard
          <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}
