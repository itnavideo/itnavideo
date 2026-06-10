export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-4xl font-black text-white">Founder settings</h1>
        <p className="mt-3 text-zinc-400">
          Operational reminders for the private founder admin panel. Keep secrets server-only.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingCard
          title="Required production env"
          items={[
            'SUPABASE_SERVICE_ROLE_KEY',
            'ADMIN_API_KEY',
          ]}
        />
        <SettingCard
          title="Founder-only notes"
          items={[
            'Do not expose /admin links in public footer.',
            'Keep ADMIN_API_KEY server-only and rotate it if it is shared.',
            'Keep the next video structure small: 5 to 7 steps maximum.',
            'Do not add extra media libraries or AI rulebooks until the new structure is defined.',
          ]}
        />
      </div>
    </div>
  );
}

function SettingCard({ title, items }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
