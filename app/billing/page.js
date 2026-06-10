import Link from "next/link";
import { BadgeCheck, Clock3, CreditCard, Download, ShieldCheck } from "lucide-react";
import { PricingCheckoutCards } from "@/components/billing/PricingCheckoutCards";
import { pricingPlans } from "@/lib/billing/plans";

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Billing</p>
        <h1 className="text-5xl font-black">Choose your plan</h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Start with the ₹9 one-time test video, or pick a monthly plan if you already know you will publish more.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-lg border border-white/10 bg-zinc-950 p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
                  <BadgeCheck size={16} />
                  Direct checkout
                </div>
                <h2 className="text-3xl font-black">Paid plans are ready</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Pick a plan and pay with Razorpay. The ₹9 test plan unlocks one real export without a subscription.
                </p>
              </div>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-black text-white transition hover:bg-white/10">
                <CreditCard size={17} />
                Compare plans
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                ["Test video", "₹9"],
                ["Paid checkout", "Direct"],
                ["Currency", "INR"],
                ["Checkout", "Razorpay live"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                  <p className="mt-2 text-xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <Info icon={<CreditCard size={20} />} title="Payment gateway" desc="Razorpay Standard Checkout is active for INR payments, including enabled international cards." />
            <Info icon={<Download size={20} />} title="Working proof" desc="Upload audio, render MP4, then play or download from the dashboard." />
            <Info icon={<ShieldCheck size={20} />} title="Signature verified" desc="Payment success is verified on the backend before access is marked ready." />
            <Info icon={<Clock3 size={20} />} title="Coming later" desc="PayPal and foreign-currency pricing can be added for additional international payment options." />
          </aside>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12">
        <PricingCheckoutCards plans={pricingPlans} />
      </section>
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
