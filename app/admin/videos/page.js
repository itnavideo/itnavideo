export default function AdminVideosPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-4xl font-black text-white">Videos</h1>
        <p className="mt-3 text-zinc-400">
          Founder view for the current reel pipeline: planning, captions, visuals, rendering, and export readiness.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Planning" value="Active" note="Script beats, title, visual mode, and scene assets." />
        <InfoCard title="Captions" value="Typography-led" note="Large title moments instead of karaoke-heavy scenes." />
        <InfoCard title="Visuals" value="Asset matched" note="Images, icons, motion assets, and fallback visuals." />
        <InfoCard title="Export" value="Secure render" note="Vertical MP4 render path with temporary download links." />
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-black text-white">Next backend upgrade</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Keep improving render observability: clearer job states, better error messages, and easier checks for asset language, missing media, and final playback.
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, value, note }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{note}</p>
    </div>
  );
}
