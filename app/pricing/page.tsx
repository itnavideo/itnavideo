import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleHelp, CreditCard, HelpCircle, Mail, Play, ShieldCheck, Video, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import PricingSection from "@/components/landing/PricingSection";
import PricingComparisonTable from "@/components/billing/PricingComparisonTable";

export const metadata: Metadata = {
  title: "Pricing — Monthly AI Video Plans | Itnavideo",
  description: "Affordable monthly AI Video plans starting at $9/month (₹499) for Shorts and $19/month (₹999) for Shorts + Widescreen YouTube Videos.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Simple monthly plans: Basic ($9 / ₹499), Growth ($19 / ₹999), and Pro Agency ($39 / ₹1,999). Free trial available.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Affordable monthly video packs starting at $9 / ₹499. Dedicated studios for Shorts and Widescreen Faceless Video.",
    images: ["/og-image.png"],
  },
};

export default function PricingPage() {
  return (
    <main className="bg-white text-slate-900 min-h-screen pt-12">
      {/* Universal Modern Pricing Section */}
      <PricingSection />

      {/* Clueso-Style Detailed Plan Comparison Matrix */}
      <PricingComparisonTable />

      {/* Material 3 Credits Breakdown Section */}
      <section className="bg-[#FAFAFA] px-4 py-16 sm:px-6 border-b border-slate-200/80">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-700">
              <Sparkles size={14} className="text-[#FF5722]" />
              <span>PREDICTABLE USAGE</span>
            </div>
            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl tracking-tight font-sans">
              What does{" "}
              <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
                1 credit mean?
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Simple, predictable usage across all AI video studios.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Video,
                title: "9:16 Short",
                cost: "1 credit / video",
                text: "Auto Caption Reels, Kinetic Typography, Whiteboard, Compare Explainer, and Long Video Promo.",
              },
              {
                icon: Play,
                title: "16:9 Video",
                cost: "1 credit / minute",
                text: "Faceless Video Generator, Image to Video AI, and Widescreen YouTube Subtitles.",
              },
              {
                icon: Sparkles,
                title: "Long Video → Clips",
                cost: "2 credits / clip",
                text: "AI Hook Detector extracts viral vertical shorts from long podcasts & YouTube videos.",
              },
              {
                icon: Sparkles,
                title: "AI Audio Cleaner",
                cost: "1 credit / job",
                text: "Podcast audio mastering, noise gate filtering, de-reverb, and retake trimming.",
              },
            ].map(({ icon: Icon, title, cost, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-600">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-black text-orange-700 border border-orange-500/20">
                    {cost}
                  </span>
                </div>
                <h3 className="mt-4 font-black text-slate-900 text-base font-sans">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          {/* 3 Step Onboarding Flow */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: CreditCard,
                title: "Choose a plan",
                text: "Select the credits that fit your workflow.",
              },
              {
                step: "02",
                icon: CheckCircle2,
                title: "Start creating",
                text: "Credits activate instantly in your creator dashboard.",
              },
              {
                step: "03",
                icon: Play,
                title: "Create & export",
                text: "Generate your videos and download in crisp 1080p Full HD.",
              },
            ].map(({ step, icon: Icon, title, text }) => (
              <div
                key={step}
                className="relative rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-orange-500/40 hover:shadow-md"
              >
                <span className="text-xs font-black text-orange-600 font-mono">{step}</span>
                <Icon className="mt-3 text-slate-900" size={20} />
                <h3 className="mt-3 font-black text-slate-900 font-sans">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clear Policies & Support */}
      <section className="bg-white px-4 py-16 sm:px-6 border-b border-slate-200/80">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200/90 bg-[#FAFAFA] p-7 sm:p-9 shadow-sm">
            <div className="flex items-center gap-2 text-orange-600">
              <ShieldCheck size={19} />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Creator Guarantee</span>
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-900 font-sans">Simple, transparent billing.</h2>
            <ul className="mt-6 grid gap-4 text-xs sm:text-sm text-slate-700 sm:grid-cols-2">
              {[
                "Top up credits or switch packs anytime.",
                "Failed system renders automatically refund credits.",
                "Monthly credits valid for full 30 days.",
                "Private uploads and render downloads stored safely.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-[#FF5722] via-[#FF7043] to-[#FFA000] p-7 text-white sm:p-9 shadow-xl shadow-orange-500/20">
            <CircleHelp size={22} className="text-white" />
            <h2 className="mt-4 text-2xl font-black font-sans text-white">Need help choosing a plan?</h2>
            <p className="mt-3 text-xs leading-relaxed text-white/90 font-medium">
              Talk to our team about billing, credits, or custom plans.
            </p>
            <div className="mt-6 space-y-2">
              <a href="mailto:support@itnavideo.com" className="flex items-center gap-2 text-xs font-black underline underline-offset-4 text-white hover:opacity-80">
                <Mail size={15} /> support@itnavideo.com
              </a>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 text-xs font-black rounded-full bg-slate-950 text-white px-5 py-2.5 transition hover:bg-slate-900 shadow-md"
              >
                <span>Contact Support</span>
                <ArrowRight size={13} className="text-[#FFA000]" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="px-4 py-16 sm:px-6 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="mx-auto max-w-4xl">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black text-slate-900 sm:text-4xl font-sans">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xs text-slate-600">Everything you need to know about plans, billing, and video credits.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "Is there a free trial or free plan?",
                a: "Yes! You can sign up with zero credit card required to get free credits to test our AI video studios and rendering speed.",
              },
              {
                q: "How do video credits work?",
                a: "1 credit = 1 short-form video (9:16). For widescreen 16:9 videos, 1 credit = 1 minute. 1 credit = AI audio clean job.",
              },
              {
                q: "Do credits expire?",
                a: "Credits are valid for 30 days from the purchase date. You can top up or change plans anytime whenever you need additional video credits.",
              },
              {
                q: "What happens if a render generation fails?",
                a: "If an unexpected system error occurs during processing or rendering, credits are automatically refunded back to your account balance.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We support all major credit and debit cards worldwide (Visa, MasterCard, American Express), international Stripe, and Razorpay.",
              },
              {
                q: "Can I upgrade or change plans anytime?",
                a: "Yes! You can upgrade your plan or top up additional credit packs at any time directly from your account dashboard.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-orange-500/40 transition">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="mt-0.5 shrink-0 text-orange-600" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm font-sans">{q}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Enterprise CTA */}
      <section className="px-4 py-16 sm:px-6 bg-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-white to-amber-500/10 p-8 shadow-xl shadow-orange-500/5 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Enterprise &amp; Media Studios</span>
            <h2 className="mt-2 text-2xl font-black text-slate-900 font-sans">Need more than a standard plan?</h2>
            <p className="mt-1.5 text-xs text-slate-600">Custom credits, API access, higher limits, or white-label solutions for teams and media businesses.</p>
          </div>
          <Link
            href="/contact"
            className="mt-6 sm:mt-0 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-7 py-3.5 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <span>Talk to Sales &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/80 px-4 py-8 bg-[#FAFAFA]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <Link href="/terms" className="hover:text-slate-900 transition">Terms</Link>
          <Link href="/privacy" className="hover:text-slate-900 transition">Privacy</Link>
          <Link href="/contact" className="hover:text-slate-900 transition">Contact</Link>
          <span>© 2026 Itnavideo Inc.</span>
        </div>
      </footer>
    </main>
  );
}
