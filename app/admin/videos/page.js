export default function AdminVideosPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">
        <h1 className="text-4xl font-bold text-white">Video management</h1>
        <p className="mt-3 text-zinc-400">
          Track render status, review AI-generated outputs, and manage video metadata.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Queued</p>
          <p className="mt-4 text-4xl font-semibold text-white">12</p>
          <p className="mt-2 text-zinc-400">Videos currently rendering</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Published</p>
          <p className="mt-4 text-4xl font-semibold text-white">96</p>
          <p className="mt-2 text-zinc-400">Videos exported this week</p>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="text-sm text-zinc-400">Recent video outputs</div>
        <div className="mt-4 space-y-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-semibold text-white">Instagram Reel - Growth Tips</p>
            <p className="text-zinc-500">Status: Completed • Duration: 00:45</p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-semibold text-white">Podcast Promo</p>
            <p className="text-zinc-500">Status: Rendering • Duration: 01:12</p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-semibold text-white">Course Trailer</p>
            <p className="text-zinc-500">Status: Draft • Duration: 00:38</p>
          </div>
        </div>
      </div>
    </div>
  );
}
