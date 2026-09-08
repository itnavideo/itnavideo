import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleHelp, CreditCard, HelpCircle, Mail, Play, ShieldCheck, Video, Sparkles } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import PricingSection from "@/components/landing/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — Monthly AI Video Plans | Itnavideo",
  description: "Affordable monthly AI Video plans starting at $29/month for 50 credits and $49/month for 150 credits.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Simple monthly plans: Starter ($29), Growth ($49), and Pro ($149). Free trial available.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Affordable monthly plans starting at $29/month. Cancel or top-up anytime.",
  },
};

export default function PricingPage() {
  return (
    <main className="bg-zinc-950 text-zinc-100 min-h-screen pt-12">
      {/* Universal Modern Pricing Section (Cards, Credit Explainer, Comparison Table, Razorpay Checkout) */}
      <PricingSection />

      {/* Material 3 Credits Breakdown Section */}
      <section className="bg-zinc-950 px-4 py-16 sm:px-6 border-b border-zinc-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400">
              <Sparkles size={14} />
              <span>PREDICTABLE USAGE</span>
            </div>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl tracking-tight">
              Know exactly how your{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                credits work
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              No hidden editing meters. Use your monthly credits across vertical reels or widescreen YouTube explainers.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Video,
                title: "All 9:16 Shorts & Reels",
                cost: "1 Credit / min",
                text: "Auto Caption Reels, Typography, Whiteboard, and Compare Explainers.",
              },
              {
                icon: Play,
                title: "16:9 Long Videos",
                cost: "2 Credits / min",
                text: "Widescreen YouTube explainers and promo clips with synced graphics.",
              },
              {
                icon: Sparkles,
                title: "Faceless Video (16:9)",
                cost: "2 Credits / min",
                text: "Multi-scene AI scenes, Cloudinary b-roll, motion transitions (10 min = 20 credits).",
              },
              {
                icon: Sparkles,
                title: "AI Audio Cleaner",
                cost: "1 Credit / 5 min",
                text: "Podcast speech cleaning, noise removal, and filler retake trimming.",
              },
            ].map(({ icon: Icon, title, cost, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-200 hover:border-orange-500/40 hover:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-black text-orange-300">
                    {cost}
                  </span>
                </div>
                <h3 className="mt-4 font-black text-white text-base">{title}</h3>
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
                title: "Pick Your Plan",
                text: "Start Free ($0) or choose Starter ($29), Growth ($49), or Pro ($149) with 100% secure checkout.",
              },
              {
                step: "02",
                icon: CheckCircle2,
                title: "Instant Activation",
                text: "Credits arrive immediately in your creator dashboard with zero queue wait times.",
              },
              {
                step: "03",
                icon: Play,
                title: "Export in 1080p / 4K",
                text: "Download crisp MP4s ready to publish on TikTok, Instagram, and YouTube.",
              },
            ].map(({ step, icon: Icon, title, text }) => (
              <div
                key={step}
                className="relative rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700"
              >
                <span className="text-xs font-black text-orange-400">{step}</span>
                <Icon className="mt-3 text-white" size={20} />
                <h3 className="mt-3 font-black text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Workflow Showcase */}
      <section className="bg-zinc-900/40 px-4 py-16 sm:px-6 border-b border-zinc-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">Engine Output</p>
              <h2 className="mt-2 text-3xl font-black text-white">Create real, ready-to-post videos in minutes.</h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-zinc-400">
              One unified subscription powers both vertical short reels and widescreen 16:9 YouTube videos.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png",
                title: "Auto Caption Reels",
                text: "High-contrast dynamic captions in Roman Hinglish & English.",
              },
              {
                image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788093814/teacher-welcome_ouesss.png",
                title: "Compare Explainers",
                text: "Visual decision battles with dual images and automated narration.",
              },
              {
                image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png",
                title: "16:9 Faceless Video",
                text: "Full widescreen YouTube videos with AI chapters and Cloudinary visuals.",
              },
            ].map((item) => (
              <article key={item.title} className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
                <Image
                  src={item.image}
                  alt={`${item.title} preview`}
                  width={720}
                  height={960}
                  className="h-44 w-full object-cover object-top"
                />
                <div className="p-5">
                  <h3 className="font-black text-white text-sm">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Clear Policies & Support */}
      <section className="bg-zinc-950 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-7 sm:p-9">
            <div className="flex items-center gap-2 text-orange-400">
              <ShieldCheck size={19} />
              <span className="text-xs font-black uppercase tracking-[0.18em]">Creator Guarantee</span>
            </div>
            <h2 className="mt-4 text-2xl font-black text-white">Transparent & Fair Policies.</h2>
            <ul className="mt-6 grid gap-4 text-xs sm:text-sm text-zinc-400 sm:grid-cols-2">
              {[
                "Cancel, top up, or upgrade anytime.",
                "Failed system renders automatically refund credits.",
                "Monthly credits valid for full 30 days.",
                "Private uploads and downloads stored safely.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-orange-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 p-7 text-white sm:p-9 shadow-xl">
            <CircleHelp size={22} />
            <h2 className="mt-4 text-2xl font-black">Billing Questions?</h2>
            <p className="mt-3 text-xs leading-relaxed text-orange-100">
              Need assistance with international cards, invoices, or custom enterprise volumes?
            </p>
            <a href="mailto:rohi@itnavideo.com" className="mt-6 flex items-center gap-2 text-xs font-black underline underline-offset-4">
              <Mail size={15} /> rohi@itnavideo.com
            </a>
            <a
              href="https://www.instagram.com/itnavideo/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-xs font-black underline underline-offset-4"
            >
              DM @itnavideo on Instagram →
            </a>
          </aside>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="px-4 pb-20 sm:px-6 bg-zinc-950 border-b border-zinc-800/80">
        <div className="mx-auto max-w-4xl">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black text-white sm:text-4xl">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Everything you need to know about plans, dollar billing, and credits</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "Is there a Free trial available?",
                a: "Yes! You can sign up with zero credit card required and create 1 free Auto Caption video in 1080p (with watermark) to test our transcription accuracy and animations.",
              },
              {
                q: "What is the difference between Starter and Growth?",
                a: "Starter ($29/mo) is optimized for vertical 9:16 Shorts & Reels. Growth ($49/mo) unlocks full 16:9 widescreen YouTube videos (Faceless Video), AI Audio Cleaner, and priority fast rendering.",
              },
              {
                q: "How do video credits work?",
                a: "1 Credit = 1 minute of 9:16 vertical video. 2 Credits = 1 minute of 16:9 widescreen video (e.g. 10 min Faceless video = 20 credits). 1 Credit = 5 minutes of AI audio cleaning.",
              },
              {
                q: "Do exports have a watermark?",
                a: "Free exports include a subtle Itnavideo watermark. All paid plans (Starter, Growth, Pro) export in clean 1080p/4K with zero watermark.",
              },
              {
                q: "Can I cancel or change plans anytime?",
                a: "Yes! There are zero long-term contracts. You can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard.",
              },
              {
                q: "What payment methods are supported?",
                a: "We support major credit and debit cards worldwide (Visa, MasterCard, American Express), international PayPal/Stripe where available, and Razorpay.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="mt-0.5 shrink-0 text-orange-400" />
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{q}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Enterprise CTA */}
      <section className="px-4 py-16 sm:px-6 bg-zinc-950">
        <div className="mx-auto max-w-4xl rounded-3xl border border-orange-500/30 bg-gradient-to-r from-zinc-900 via-zinc-950 to-orange-950/40 p-8 shadow-xl text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Enterprise & Media Studios</span>
            <h2 className="mt-2 text-2xl font-black text-white">Need custom volume, API access, or white-label?</h2>
            <p className="mt-1.5 text-xs text-zinc-400">Tailored multi-seat plans for media agencies, newsrooms, and high-frequency channels.</p>
          </div>
          <Link
            href="mailto:rohi@itnavideo.com"
            className="mt-6 sm:mt-0 inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/25 transition duration-200 hover:from-amber-400 hover:to-orange-500"
          >
            Contact Sales
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-800 px-4 py-8 bg-zinc-950">
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


