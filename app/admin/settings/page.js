export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-4xl font-black text-white">Founder settings</h1>
        <p className="mt-3 text-zinc-400">
          Operational reminders for the private founder admin panel. Environment values stay in Vercel, Render, and local env files.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingCard
          title="Required production env"
          items={[
            'GEMINI_API_KEY',
            'NEXT_PUBLIC_FIREBASE_*',
            'FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY',
            'NEXT_PUBLIC_RENDER_BACKEND_URL',
          ]}
        />
        <SettingCard
          title="Founder-only notes"
          items={[
            'Do not expose /admin links in public footer.',
            'Keep admin username/password server-only.',
            'Use local asset library and creator uploads before any external media source.',
            'Move render jobs to backend queue before paid launch.',
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
