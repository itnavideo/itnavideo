import Link from "next/link";
import { BadgeCheck, Clock3, CreditCard, Download, LockKeyhole, ShieldCheck } from "lucide-react";

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Billing</p>
        <h1 className="text-5xl font-black">Plan and usage</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Billing is prepared for premium exports, but checkout stays locked until the working video demo is approved.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-white/10 bg-zinc-950 p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
                  <BadgeCheck size={16} />
                  Current plan
                </div>
                <h2 className="text-3xl font-black">Starter proof plan</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Stable 720p exports are active for demo review. 1080p exports and paid billing will unlock after payment provider approval.
                </p>
              </div>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-black text-white transition hover:bg-white/10">
                <LockKeyhole size={17} />
                View locked upgrades
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Active export", "720p"],
                ["Premium export", "1080p locked"],
                ["Checkout", "Approval pending"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                  <p className="mt-2 text-xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <Info icon={<CreditCard size={20} />} title="Payment gateway" desc="Stripe checkout will be connected after approval." />
            <Info icon={<Download size={20} />} title="Working proof" desc="Upload audio, render MP4, then play or download from the dashboard." />
            <Info icon={<ShieldCheck size={20} />} title="Safe rollout" desc="Users can test the product before paid 1080p upgrades open." />
            <Info icon={<Clock3 size={20} />} title="Next step" desc="Share a working demo with the payment provider review team." />
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
