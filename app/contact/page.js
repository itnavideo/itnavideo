"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Clock, Instagram, Loader2, Mail, MessageSquare, Send, Sparkles, Users, XCircle } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState("idle"); // idle | loading | success | error
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setFormState("loading");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          source: "contact_page",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success !== false) {
        setFormState("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <main className="bg-[#050506] min-h-screen text-white">
      <div className="px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {/* Left: Contact options */}
            <section>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-mint/20 bg-brand-mint/[0.06] px-4 py-2 text-xs font-bold text-brand-mint">
                <Sparkles size={13} />
                Contact
              </div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Let's talk about your video needs.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-300">
                Whether you're a creator, business, agency, or partner — tell us what you need help with. We're here to support your video creation journey.
              </p>

              <div className="mt-10 grid gap-4">
                {[
                  {
                    title: "Support",
                    desc: "For account, payment, rendering, or video generation issues.",
                    href: "mailto:support@itnavideo.com",
                    label: "support@itnavideo.com",
                    icon: Mail,
                  },
                  {
                    title: "Creator Access",
                    desc: "For creators who want to test or use Itnavideo.",
                    href: "mailto:creators@itnavideo.com",
                    label: "creators@itnavideo.com",
                    icon: Users,
                  },
                  {
                    title: "Partnerships & Business",
                    desc: "For agencies, platforms, and business collaborations.",
                    href: "mailto:partners@itnavideo.com",
                    label: "partners@itnavideo.com",
                    icon: Building2,
                  },
                  {
                    title: "Founder / Product",
                    desc: "For roadmap, investor conversations, and product feedback.",
                    href: "mailto:rohi@itnavideo.com",
                    label: "rohi@itnavideo.com",
                    icon: Sparkles,
                  },
                  {
                    title: "Instagram",
                    desc: "Follow or DM the official Itnavideo page.",
                    href: "https://www.instagram.com/itnavideo",
                    label: "@itnavideo",
                    icon: Instagram,
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 rounded-xl border border-white/8 bg-zinc-900/30 p-4 transition hover:border-brand-mint/30 hover:bg-zinc-900/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-mint/10 text-brand-mint">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-black text-white">{card.title}</h2>
                        <p className="mt-0.5 text-xs leading-5 text-zinc-400">{card.desc}</p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-mint">
                          {card.label}
                          <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Response time */}
              <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
                <Clock size={13} className="text-brand-mint/60" />
                We usually reply within 24–48 hours.
              </div>
            </section>

            {/* Right: Contact form */}
            <section className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8">
              <div className="mb-6">
                <MessageSquare className="mb-4 text-brand-mint" size={24} />
                <h2 className="text-2xl font-black">Send a message</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Tell us what you're building or where you need help. We'll get back to you soon.
                </p>
              </div>

              {formState === "success" ? (
                <div className="rounded-xl border border-brand-mint/20 bg-brand-mint/[0.06] p-6 text-center">
                  <CheckCircle2 className="mx-auto mb-3 text-brand-mint" size={32} />
                  <p className="font-black text-white">Message received!</p>
                  <p className="mt-2 text-sm text-zinc-400">We'll reply within 24–48 hours.</p>
                  <button onClick={() => setFormState("idle")} className="mt-4 text-xs font-bold text-brand-mint hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-400">Full name</span>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                      required
                      className="w-full rounded-lg border border-white/15 bg-zinc-950/80 px-4 py-3.5 text-sm font-medium text-white outline-none placeholder:text-zinc-600 transition focus:border-brand-mint/60 focus:ring-1 focus:ring-brand-mint/30"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-400">Email address</span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                      required
                      className="w-full rounded-lg border border-white/15 bg-zinc-950/80 px-4 py-3.5 text-sm font-medium text-white outline-none placeholder:text-zinc-600 transition focus:border-brand-mint/60 focus:ring-1 focus:ring-brand-mint/30"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-400">Message</span>
                    <textarea
                      rows={5}
                      placeholder="Tell us what you're building, creating, or need help with..."
                      value={formData.message}
                      onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                      required
                      className="w-full resize-none rounded-lg border border-white/15 bg-zinc-950/80 px-4 py-3.5 text-sm font-medium text-white outline-none placeholder:text-zinc-600 transition focus:border-brand-mint/60 focus:ring-1 focus:ring-brand-mint/30"
                    />
                  </label>

                  {formState === "error" ? (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-xs text-rose-300">
                      <XCircle size={14} />
                      Something went wrong. Please try again or email us directly at support@itnavideo.com
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-mint px-6 py-4 text-sm font-black text-black transition hover:bg-white disabled:opacity-70 sm:w-auto"
                  >
                    {formState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {formState === "loading" ? "Sending..." : "Send Message"}
                  </button>

                  <p className="text-[11px] text-zinc-600">
                    Or email directly: <a href="mailto:support@itnavideo.com" className="text-brand-mint/70 hover:text-brand-mint">support@itnavideo.com</a>
                  </p>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Minimal footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
          <span>© 2026 Itnavideo Inc.</span>
        </div>
      </footer>
    </main>
  );
}
