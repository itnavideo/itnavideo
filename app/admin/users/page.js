export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-4xl font-black text-white">Users</h1>
        <p className="mt-3 text-zinc-400">
          Founder view for creator accounts. Supabase user tables can be connected here when the product is ready for active user operations.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-black text-white">Current state</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard title="Auth" value="Supabase" note="Email/password and Google sign-in." />
          <InfoCard title="Session" value="Persistent" note="Browser-local session enabled." />
          <InfoCard title="Profiles" value="Supabase" note="Saved in project/profile tables." />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, note }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{note}</p>
    </div>
  );
}
