import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleHelp, CreditCard, HelpCircle, Mail, Play, ShieldCheck, Video, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import PricingSection from "@/components/landing/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — Monthly AI Video Plans | Itnavideo",
  description: "Affordable monthly AI Video plans starting at $29/month for 75 credits and $49/month for 135 credits.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Simple monthly plans: Starter ($29), Growth ($49), and Pro ($149). Free trial available.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Affordable monthly credit packs starting at $29. Top-up credits whenever you need.",
  },
};

export default function PricingPage() {
  return (
    <main className="bg-[#050505] text-white min-h-screen pt-12">
      {/* Universal Modern Pricing Section */}
      <PricingSection />

      {/* Material 3 Credits Breakdown Section */}
      <section className="bg-[#050505] px-4 py-16 sm:px-6 border-b border-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-bold text-[#FF9100]">
              <Sparkles size={14} className="text-[#FF8F00]" />
              <span>PREDICTABLE USAGE</span>
            </div>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl tracking-tight font-sans">
              What does{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
                1 credit mean?
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Simple, predictable usage across all 11 AI video studios.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Video,
                title: "9:16 Short",
                cost: "1 credit / minute",
                text: "Auto Caption Reels, Kinetic Typography, Whiteboard, Compare Explainer, and Long Video Promo.",
              },
              {
                icon: Play,
                title: "16:9 Video",
                cost: "2 credits / minute",
                text: "Faceless Video Generator, Image to Video AI, and Widescreen YouTube Subtitles.",
              },
              {
                icon: Sparkles,
                title: "Long Video → Clips",
                cost: "1 credit / minute",
                text: "AI Hook Detector extracts viral vertical shorts from long podcasts & YouTube videos.",
              },
              {
                icon: Sparkles,
                title: "AI Audio Cleaner",
                cost: "1 credit / 5 minutes",
                text: "Podcast audio mastering, noise gate filtering, de-reverb, and retake trimming.",
              },
            ].map(({ icon: Icon, title, cost, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-[#0F1117] p-6 transition-all duration-200 hover:border-[#FF6D00]/40 hover:bg-[#151821]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#FF6D00]/20 bg-[#FF6D00]/10 text-[#FF9100]">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full bg-[#151821] px-2.5 py-1 text-[11px] font-black text-[#FFA726] border border-white/10">
                    {cost}
                  </span>
                </div>
                <h3 className="mt-4 font-black text-white text-base font-sans">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{text}</p>
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
                className="relative rounded-3xl border border-white/10 bg-[#0F1117]/80 p-6 transition hover:border-[#FF6D00]/40"
              >
                <span className="text-xs font-black text-[#FF9100] font-mono">{step}</span>
                <Icon className="mt-3 text-white" size={20} />
                <h3 className="mt-3 font-black text-white font-sans">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clear Policies & Support */}
      <section className="bg-[#050505] px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-[#0F1117] p-7 sm:p-9">
            <div className="flex items-center gap-2 text-[#FF9100]">
              <ShieldCheck size={19} />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Creator Guarantee</span>
            </div>
            <h2 className="mt-4 text-2xl font-black text-white font-sans">Simple, transparent billing.</h2>
            <ul className="mt-6 grid gap-4 text-xs sm:text-sm text-zinc-300 sm:grid-cols-2">
              {[
                "Top up credits or switch packs anytime.",
                "Failed system renders automatically refund credits.",
                "Monthly credits valid for full 30 days.",
                "Private uploads and render downloads stored safely.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#FF8F00]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-3xl border border-[#FF6D00]/40 bg-gradient-to-br from-[#FF6D00] via-[#FF8F00] to-orange-700 p-7 text-black sm:p-9 shadow-xl">
            <CircleHelp size={22} className="text-black" />
            <h2 className="mt-4 text-2xl font-black font-sans text-black">Need help choosing a plan?</h2>
            <p className="mt-3 text-xs leading-relaxed text-black/80 font-medium">
              Talk to our team about billing, credits, or custom plans.
            </p>
            <div className="mt-6 space-y-2">
              <a href="mailto:support@itnavideo.com" className="flex items-center gap-2 text-xs font-black underline underline-offset-4 text-black hover:opacity-80">
                <Mail size={15} /> support@itnavideo.com
              </a>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 text-xs font-black rounded-full bg-black text-white px-5 py-2.5 transition hover:bg-zinc-900"
              >
                <span>Contact Support</span>
                <ArrowRight size={13} className="text-[#FF8F00]" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="px-4 pb-20 sm:px-6 bg-[#050505] border-b border-white/10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black text-white sm:text-4xl font-sans">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-[#FF6D00] to-[#FFA726] bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Everything you need to know about plans, billing, and video credits.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "Is there a free trial or free plan?",
                a: "Yes! You can sign up with zero credit card required to get 20 free credits for 3 days to test our AI video studios and rendering speed.",
              },
              {
                q: "How do video credits work?",
                a: "1 credit = 1 minute of vertical 9:16 video (Reels/Shorts). 2 credits = 1 minute of widescreen 16:9 video. 1 credit = 5 minutes of AI audio cleaning.",
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
                a: "We support all major credit and debit cards worldwide (Visa, MasterCard, American Express), international PayPal/Stripe, and Razorpay.",
              },
              {
                q: "Can I upgrade or change plans anytime?",
                a: "Yes! You can upgrade your plan or top up additional credit packs at any time directly from your account dashboard.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-3xl border border-white/10 bg-[#0F1117] p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="mt-0.5 shrink-0 text-[#FF9100]" />
                  <div>
                    <h3 className="font-extrabold text-white text-sm font-sans">{q}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Enterprise CTA */}
      <section className="px-4 py-16 sm:px-6 bg-[#050505]">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#FF6D00]/30 bg-gradient-to-r from-[#0F1117] via-[#050505] to-[#FF6D00]/10 p-8 shadow-xl text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF9100]">Enterprise &amp; Media Studios</span>
            <h2 className="mt-2 text-2xl font-black text-white font-sans">Need more than a standard plan?</h2>
            <p className="mt-1.5 text-xs text-zinc-400">Custom credits, API access, higher limits, or white-label solutions for teams and media businesses.</p>
          </div>
          <Link
            href="/contact"
            className="mt-6 sm:mt-0 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-3.5 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition duration-200 hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <span>Talk to Sales &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 px-4 py-8 bg-[#050505]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <Link href="/terms" className="hover:text-zinc-300 transition">Terms</Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition">Privacy</Link>
          <Link href="/contact" className="hover:text-zinc-300 transition">Contact</Link>
          <span>© 2026 Itnavideo Inc.</span>
        </div>
      </footer>
    </main>
  );
}
