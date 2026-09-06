"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  MessageSquare,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const EMAIL_ADDRESS = "rohi@itnavideo.com";
const INSTAGRAM_URL = "https://www.instagram.com/itnavideo/";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30 selection:text-orange-200 pt-24 pb-20 px-4 sm:px-6">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Header (M3 Expressive) */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Direct Support &bull; We Are Here</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Let&apos;s talk about your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              video needs
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or need a custom video engine? Send us a message or reach out directly. We usually respond within 24 hours.
          </p>
        </div>

        {/* Contact Method Cards (M3 Elevated Containers) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5" aria-label="Direct contact options">
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition-all duration-200 hover:border-orange-500/40 hover:bg-zinc-900 shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/25 transition group-hover:scale-110">
              <Mail size={20} />
            </span>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Direct Email</span>
              <span className="block truncate text-sm font-bold text-white group-hover:text-orange-300 transition">
                {EMAIL_ADDRESS}
              </span>
            </div>
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition-all duration-200 hover:border-orange-500/40 hover:bg-zinc-900 shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-pink-500/20 text-orange-300 border border-orange-500/25 transition group-hover:scale-110">
              <Instagram size={20} />
            </span>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Instagram DM</span>
              <span className="block text-sm font-bold text-white group-hover:text-orange-300 transition">
                @itnavideo
              </span>
            </div>
          </a>
        </div>

        {/* Contact Form Card (M3 High Elevation Card) */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/25">
                <MessageSquare className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Send us a message</h2>
                <p className="text-[11px] text-zinc-400">Directly goes to our founder and engineering desk</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-orange-400" /> &lt; 24h reply
            </span>
          </div>

          {formState === "success" ? (
            <div className="py-10 text-center space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-white">Message Received!</h3>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Thanks for reaching out! Syed Rohi will review your request and get back to your email shortly.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFormState("idle")}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition border border-white/10"
                >
                  Send another message &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formState === "error" && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Failed to send message. Please email directly at <strong className="text-white">{EMAIL_ADDRESS}</strong>.</span>
                </div>
              )}

              <div>
                <label htmlFor="full-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label htmlFor="email-address" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Email Address
                </label>
                <input
                  id="email-address"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label htmlFor="message-text" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Message
                </label>
                <textarea
                  id="message-text"
                  rows={4}
                  placeholder="Tell us what you're building, what video templates you need, or where you need help..."
                  value={formData.message}
                  onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:opacity-95 hover:shadow-orange-500/40 disabled:opacity-50"
                >
                  {formState === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Trust Note */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Zero spam policy
          </span>
          <span>&bull;</span>
          <span>Founder direct review</span>
          <span>&bull;</span>
          <Link href="/dashboard" className="text-orange-400 hover:text-orange-300 hover:underline font-semibold flex items-center gap-1">
            Open Dashboard <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </main>
  );
}
