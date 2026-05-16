import { Captions, Download, Layers3, Music, Play, SlidersHorizontal, Sparkles } from "lucide-react";

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">AI editor</p>
            <h1 className="text-5xl font-black">Timeline review</h1>
            <p className="mt-4 max-w-2xl text-zinc-400">Inspect scene timing, captions, overlays, SFX, and export settings before final render.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white">
            <Download size={18} />
            Export MP4
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-white/10 bg-zinc-950 p-4">
            <div className="relative mx-auto aspect-[9/16] max-h-[660px] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(160deg,#111827,#050506_55%,#0f766e)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                <span className="rounded-md bg-black/55 px-3 py-1 text-xs font-bold">1080x1920</span>
                <span className="rounded-md bg-brand-mint px-3 py-1 text-xs font-black text-black">Ready</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              <div className="absolute inset-x-5 bottom-24 rounded-lg bg-black/75 p-4 text-center text-xl font-black">
                Your captions stay inside the safe zone.
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <Panel icon={<Sparkles size={20} />} title="Director style" value="Cinematic reels pacing" />
            <Panel icon={<Captions size={20} />} title="Captions" value="Karaoke highlights enabled" />
            <Panel icon={<Layers3 size={20} />} title="Visual layers" value="B-roll, overlays, grain" />
            <Panel icon={<Music size={20} />} title="Audio mix" value="Voiceover, SFX, music fade" />
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-4 font-black text-black transition hover:bg-brand-mint">
              <SlidersHorizontal size={18} />
              Render video
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Panel({ icon, title, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950 p-5">
      <div className="mb-4 text-brand-mint">{icon}</div>
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">{title}</h2>
      <p className="mt-2 font-bold text-white">{value}</p>
    </div>
  );
}
