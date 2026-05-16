import { BadgeCheck, CreditCard, Download, ShieldCheck } from "lucide-react";

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Billing</p>
        <h1 className="text-5xl font-black">Plan and usage</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">Manage exports, invoices, and plan limits for your Itnavideo workspace.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-white/10 bg-zinc-950 p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
                  <BadgeCheck size={16} />
                  Current plan
                </div>
                <h2 className="text-3xl font-black">Pro Creator</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">1080p exports, premium caption styles, private asset libraries, SFX layers, and advanced video generation.</p>
              </div>
              <button className="rounded-lg bg-brand-mint px-5 py-3 font-black text-black transition hover:bg-white">Upgrade</button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Exports", "42 / 100"],
                ["Storage", "18.4 GB"],
                ["Renewal", "Monthly"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                  <p className="mt-2 text-xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <Info icon={<CreditCard size={20} />} title="Payment method" desc="Visa ending in 4242" />
            <Info icon={<Download size={20} />} title="Invoices" desc="Download receipts for accounting." />
            <Info icon={<ShieldCheck size={20} />} title="Secure billing" desc="Sensitive billing data is handled by payment providers." />
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ icon, title, desc }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950 p-5">
      <div className="mb-4 text-brand-mint">{icon}</div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{desc}</p>
    </div>
  );
}
