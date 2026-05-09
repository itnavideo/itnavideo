export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400">Overview</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Admin dashboard</h1>
            <p className="mt-3 text-zinc-400">
              Monitor active users, video generation, and waitlist growth from one place.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Users</p>
          <p className="mt-4 text-4xl font-semibold text-white">1,250</p>
          <p className="mt-2 text-zinc-400">Active creators this month</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Videos</p>
          <p className="mt-4 text-4xl font-semibold text-white">3,820</p>
          <p className="mt-2 text-zinc-400">Generated video projects</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Conversion</p>
          <p className="mt-4 text-4xl font-semibold text-white">8.4%</p>
          <p className="mt-2 text-zinc-400">Free-to-paid creator conversion</p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Waitlist</p>
          <p className="mt-4 text-4xl font-semibold text-white">420</p>
          <p className="mt-2 text-zinc-400">Long-form waitlist signups</p>
        </div>
      </div>
    </div>
  );
}
