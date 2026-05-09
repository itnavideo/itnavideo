import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">
        <h1 className="text-4xl font-bold text-white">Itnavideo Admin</h1>
        <p className="mt-4 max-w-3xl text-zinc-400 text-lg">
          Welcome to your startup control center. Use the sidebar to manage users, videos, product settings,
          and operational data.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/dashboard" className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 hover:border-purple-500 transition">
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          <p className="mt-3 text-zinc-400">See key metrics and product health at a glance.</p>
        </Link>

        <Link href="/admin/users" className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 hover:border-purple-500 transition">
          <h2 className="text-xl font-semibold text-white">Users</h2>
          <p className="mt-3 text-zinc-400">Manage creators, traffic, and waitlist participants.</p>
        </Link>

        <Link href="/admin/videos" className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 hover:border-purple-500 transition">
          <h2 className="text-xl font-semibold text-white">Videos</h2>
          <p className="mt-3 text-zinc-400">Review generated videos, status, and export history.</p>
        </Link>

        <Link href="/admin/settings" className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 hover:border-purple-500 transition">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <p className="mt-3 text-zinc-400">Update product configuration, access rules, and platform settings.</p>
        </Link>
      </div>
    </div>
  );
}
