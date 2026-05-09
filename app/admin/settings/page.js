export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">
        <h1 className="text-4xl font-bold text-white">Platform settings</h1>
        <p className="mt-3 text-zinc-400">
          Configure feature flags, waitlist controls, and creator access from one place.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">Waitlist control</h2>
          <p className="mt-3 text-zinc-400">Enable or disable long-form waitlist signups and notification settings.</p>
          <div className="mt-6 space-y-4 text-sm text-zinc-300">
            <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4">
              <div>
                <p className="font-medium text-white">Waitlist status</p>
                <p className="text-zinc-500">Open to creators</p>
              </div>
              <button className="rounded-2xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 transition">Toggle</button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-white">AI & export settings</h2>
          <p className="mt-3 text-zinc-400">Adjust rendering defaults, export quality, and voice/video processing settings.</p>
          <div className="mt-6 space-y-4 text-sm text-zinc-300">
            <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4">
              <div>
                <p className="font-medium text-white">Default export</p>
                <p className="text-zinc-500">1080p MP4</p>
              </div>
              <button className="rounded-2xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 transition">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
