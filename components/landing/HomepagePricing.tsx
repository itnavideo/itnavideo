import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { pricingPlans } from "@/lib/billing/plans";

export default function HomepagePricing() {
  const starter = pricingPlans.find(p => p.id === "starter") || pricingPlans[1];
  
  return (
    <section className="bg-gradient-to-b from-white via-orange-50/30 to-white py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-700">
            <Sparkles size={14} className="text-[#FF5722]" />
            <span>SIMPLE CREATOR PRICING</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            One Plan. <span className="bg-gradient-to-r from-[#FF5722] to-[#FFA000] bg-clip-text text-transparent">Everything You Need.</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Get 100 Credits every month. Use them for 100 Shorts or twenty 5-minute Long Videos. Mix and match however you like.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Card */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl flex flex-col hover:border-orange-500/30 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter (Monthly)</h3>
              <p className="text-slate-500 text-sm h-10">Pay month-to-month. Cancel anytime.</p>
            </div>
            <div className="mb-6 flex items-end gap-2">
              <span className="text-5xl font-black text-slate-900">$19.99</span>
              <span className="text-slate-500 font-bold mb-1">/mo</span>
            </div>
            
            <Link href="/pricing" className="w-full mb-8 inline-flex justify-center items-center gap-2 rounded-2xl bg-slate-900 text-white px-6 py-4 text-sm font-bold shadow-md hover:bg-slate-800 transition">
              Get Started Monthly <ArrowRight size={16} />
            </Link>

            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <Check size={20} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">100 Credits per month</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">Make up to 100 Shorts (9:16)</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">Make up to 20 Long Videos (16:9, 5m)</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">Zero Watermark, 1080p HD</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-700">All 11 AI Video Studios</span>
              </div>
            </div>
          </div>

          {/* Yearly Card (Highlighted) */}
          <div className="relative rounded-[32px] border-2 border-[#FF5722] bg-slate-900 p-8 shadow-2xl flex flex-col transform md:-translate-y-4">
            <div className="absolute -top-4 inset-x-0 mx-auto w-max rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] px-4 py-1 text-xs font-black text-black shadow-lg">
              SAVE 50%
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Starter (Yearly)</h3>
              <p className="text-slate-400 text-sm h-10">Commit to your growth and save big.</p>
            </div>
            <div className="mb-6 flex items-end gap-2">
              <span className="text-5xl font-black text-white">$9.99</span>
              <span className="text-slate-400 font-bold mb-1">/mo</span>
            </div>
            <div className="mb-4 text-xs font-medium text-[#FFA000]">
              Billed once annually ($119.88/year)
            </div>
            
            <Link href="/pricing" className="w-full mb-8 inline-flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black px-6 py-4 text-sm font-black shadow-lg shadow-[#FF5722]/30 hover:brightness-110 transition">
              Get Started Yearly <ArrowRight size={16} />
            </Link>

            <div className="space-y-4 flex-1">
              <div className="flex gap-3">
                <Check size={20} className="text-[#FFA000] shrink-0" />
                <span className="text-sm font-semibold text-white">100 Credits per month</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-[#FFA000] shrink-0" />
                <span className="text-sm font-semibold text-white">Make up to 100 Shorts (9:16)</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-[#FFA000] shrink-0" />
                <span className="text-sm font-semibold text-white">Make up to 20 Long Videos (16:9, 5m)</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-[#FFA000] shrink-0" />
                <span className="text-sm font-semibold text-white">Zero Watermark, 1080p HD</span>
              </div>
              <div className="flex gap-3">
                <Check size={20} className="text-[#FFA000] shrink-0" />
                <span className="text-sm font-semibold text-white">All 11 AI Video Studios</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/pricing" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition">
            See all plans & volume discounts for agencies &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}