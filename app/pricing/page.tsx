import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleHelp, CreditCard, HelpCircle, Mail, Play, ShieldCheck, Video, Sparkles } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import PricingSection from "@/components/landing/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — Monthly AI Video Plans | Itnavideo",
  description: "Affordable monthly AI Video plans starting at ₹99 ($2)/month for 15 credits and ₹499 ($6)/month for 100 credits.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Simple monthly plans: Starter (₹99 / $2) and Creator Pro (₹499 / $6).",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Monthly AI Video Plans | Itnavideo",
    description: "Affordable monthly plans starting at ₹99 ($2)/month. Cancel or top-up anytime.",
  },
};

export default function PricingPage() {
  return (
    <main className="bg-background text-slate-100 min-h-screen pt-12">
      {/* Universal Modern Pricing Section (Cards, Credit Explainer, Comparison Table, Razorpay Checkout) */}
      <PricingSection />

      <section className="bg-background px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Credits, made simple</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Know exactly what you&apos;re buying.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">No editing subscription and no surprise renewal—buy credits only when you need to create videos.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Video, title: "1 Short / Reel = 1 Credit", text: "Create a 9:16 short reel up to 60 seconds (Auto Caption, Typography, or Creator Reel)." },
              { icon: Play, title: "1 Min Long Video = 2 Credits", text: "16:9 Faceless Long Videos use 2 credits per minute due to heavy multi-scene rendering." },
              { icon: Sparkles, title: "Audio Clean = 1 Credit / 2 Min", text: "Podcast clipping and AI audio noise removal uses 1 credit for every 2 minutes of audio." },
            ].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-border bg-muted/60 p-6"><Icon className="text-blue-400" size={22} /><h3 className="mt-4 font-black text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { step: "01", icon: CreditCard, title: "Choose Plan", text: "Select your monthly plan (₹99 or ₹499) and complete secure Razorpay checkout." },
              { step: "02", icon: CheckCircle2, title: "Credits arrive", text: "After payment verification, monthly credits are instantly added to your account." },
              { step: "03", icon: Play, title: "Create & download", text: "Pick a Video Type, upload your content, and download your finished MP4." },
            ].map(({ step, icon: Icon, title, text }) => <div key={step} className="relative rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6"><span className="text-xs font-black text-blue-400">{step}</span><Icon className="mt-4 text-white" size={21}/><h3 className="mt-3 font-black text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">What you can create</p><h2 className="mt-3 text-3xl font-black text-slate-950">Use credits for real, ready-to-post videos.</h2></div><p className="max-w-md text-sm leading-relaxed text-slate-600">Your pack works across the live creator workflows—not a generic editing timeline.</p></div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png", title: "Auto Caption Video", text: "Turn a talking video into a captioned reel." },
              { image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788093814/teacher-welcome_ouesss.png", title: "Compare Explainer", text: "Explain a choice with narration and two images." },
              { image: "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png", title: "Long Video Promo", text: "Make a vertical teaser for your longer content." },
            ].map((item) => <article key={item.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><Image src={item.image} alt={`${item.title} preview`} width={720} height={960} className="h-44 w-full object-cover object-top"/><div className="p-5"><h3 className="font-black text-slate-950">{item.title}</h3><p className="mt-1 text-sm text-slate-600">{item.text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-muted/60 p-7 sm:p-9"><div className="flex items-center gap-2 text-blue-400"><ShieldCheck size={19}/><span className="text-xs font-black uppercase tracking-[0.18em]">Clear policies</span></div><h2 className="mt-4 text-2xl font-black text-white">Pay confidently.</h2><ul className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">{["Flexible monthly access—cancel anytime.", "Failed system renders do not use credits.", "Credits valid for 30 days every month.", "Private uploads and completed downloads expire after about 48 hours."].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-blue-400"/>{item}</li>)}</ul></div>
          <aside className="rounded-3xl border border-blue-500/30 bg-blue-600 p-7 text-white sm:p-9"><CircleHelp size={22}/><h2 className="mt-4 text-2xl font-black">Billing or payment issue?</h2><p className="mt-3 text-sm leading-relaxed text-blue-100">We&apos;ll help you with a failed payment, missing credits, or any billing question.</p><a href="mailto:rohi@itnavideo.com" className="mt-6 flex items-center gap-2 text-sm font-black underline underline-offset-4"><Mail size={16}/> rohi@itnavideo.com</a><a href="https://www.instagram.com/itnavideo/" target="_blank" rel="noreferrer" className="mt-3 block text-sm font-black underline underline-offset-4">DM @itnavideo on Instagram →</a></aside>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="px-4 pb-20 sm:px-6 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black text-white sm:text-4xl">Pricing FAQ</h2>
            <p className="text-xs text-muted-foreground">Everything you need to know about credits, plans, and exports</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "Is there a Free plan available?",
                a: "No free credits are provided by default to ensure maximum server speed and zero queue delays. You can get started instantly with our ₹99 ($2) Starter plan."
              },
              {
                q: "Do plans renew automatically?",
                a: "Plans are simple monthly packages with 30-day credit access. You have full control to renew, top-up, or upgrade anytime without surprise lock-ins."
              },
              {
                q: "How do video credits work?",
                a: "1 Credit = 1 Short Reel (up to 60s). 2 Credits = Complex AI Explainers & Whiteboard. 1 Credit / Minute = 16:9 Long-Form Videos up to 10 minutes."
              },
              {
                q: "Do exports have a watermark?",
                a: "No. Both Starter and Creator Pro exports feature crisp 1080p Full HD resolution with zero Itnavideo watermark."
              },
              {
                q: "What happens if a render fails?",
                a: "If a render fails due to a system error, your credits are immediately refunded. You only pay for successful renders."
              },
              {
                q: "How long are credits valid?",
                a: "Monthly credits are valid for 30 days from activation. You can top up or renew your plan whenever you need more."
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-border bg-muted/60 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle size={17} className="mt-0.5 shrink-0 text-blue-400" />
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{q}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Enterprise CTA */}
      <section className="px-4 py-16 sm:px-6 bg-background">
        <div className="mx-auto max-w-4xl rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-background to-slate-950 p-8 shadow-xl text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Enterprise & Custom</span>
            <h2 className="mt-2 text-2xl font-black text-white">Need custom volume, API access, or team seats?</h2>
            <p className="mt-1.5 text-xs text-muted-foreground">Tailored plans for media agencies, newsrooms, and high-volume production studios.</p>
          </div>
          <Link href="mailto:rohi@itnavideo.com" className="mt-6 sm:mt-0 inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 transition duration-200 hover:bg-blue-500">
            Contact Sales
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-border px-4 py-8 bg-background">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <Link href="/terms" className="hover:text-muted-foreground transition">Terms</Link>
          <Link href="/privacy" className="hover:text-muted-foreground transition">Privacy</Link>
          <Link href="/contact" className="hover:text-muted-foreground transition">Contact</Link>
          <span>© 2026 Itnavideo Inc.</span>
        </div>
      </footer>
    </main>
  );
}


