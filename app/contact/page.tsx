"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const EMAIL_ADDRESS = "support@itnavideo.com";
const INSTAGRAM_URL = "https://www.instagram.com/itnavideo/";

const INQUIRY_TOPICS = [
  "General Question",
  "Technical Support",
  "Billing & Plans",
  "Feature Request",
  "Partnership",
  "Business / Enterprise",
  "Feedback",
];

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "General Question",
    message: "",
  });

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
          topic: formData.topic,
          message: formData.message.trim(),
          source: "contact_page",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success !== false) {
        setFormState("success");
        setFormData({ name: "", email: "", topic: "General Question", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#FF6D00]/30 selection:text-white pt-24 sm:pt-28 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* ── AMBIENT BACKGROUND GLOW ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Ambient Warm Orange Spotlights */}
        <div className="absolute top-28 left-10 lg:left-32 w-[600px] h-[500px] bg-[#FF6D00]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[400px] bg-[#FFA726]/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        
        {/* ── 2-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ── LEFT COLUMN: HERO, VISUAL & CHANNELS ── */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Access Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6D00]/10 border border-[#FF6D00]/25 text-[#FF9100] text-[11px] font-black tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8F00] animate-pulse" />
              <span>Contact ItnaVideo</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-[1.08] font-sans">
                Have a question?{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726]">
                  Let&apos;s talk.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Have a question, feedback, or need help with ItnaVideo? Send us a message and our team will get back to you.
              </p>
            </div>

            {/* 3D Customer Support Agent Visual */}
            <div className="relative my-4 flex items-center justify-center lg:justify-start">
              {/* Warm Spotlight behind the 3D Agent */}
              <div className="absolute -z-10 w-72 h-72 rounded-full bg-orange-500/[0.12] blur-3xl left-1/2 -translate-x-1/2" />
              
              <div className="relative w-full max-w-sm sm:max-w-md h-auto">
                <Image
                  src="/assets/support-agent-3d.png"
                  alt="3D Customer Support Agent - Itnavideo"
                  width={520}
                  height={520}
                  className="w-full h-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.9)]"
                  priority
                />
              </div>
            </div>

            {/* Direct Channel Cards (Stack) */}
            <div className="space-y-3.5 pt-1">
              
              {/* Email Support Card */}
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0F1117] p-4 transition-all duration-300 hover:border-[#FF6D00]/50 hover:bg-[#151821] hover:shadow-xl hover:shadow-[#FF6D00]/10 shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] border border-[#FF6D00]/30 transition group-hover:scale-110 group-hover:bg-[#FF6D00] group-hover:text-black">
                  <Mail size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF9100]">
                      Direct Email
                    </span>
                    <span className="text-[10px] text-slate-400">Usually &lt; 24h</span>
                  </div>
                  <span className="block truncate text-sm font-bold text-white group-hover:text-[#FFA726] transition">
                    {EMAIL_ADDRESS}
                  </span>
                </div>
              </a>

              {/* Instagram & Social DMs Card */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0F1117] p-4 transition-all duration-300 hover:border-[#FF6D00]/50 hover:bg-[#151821] hover:shadow-xl hover:shadow-[#FF6D00]/10 shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-pink-500/20 text-[#FFA726] border border-[#FF6D00]/30 transition group-hover:scale-110 group-hover:bg-[#FF6D00] group-hover:text-black">
                  <Instagram size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF9100]">
                      Instagram &amp; Social
                    </span>
                    <span className="text-[10px] text-slate-400">Quick DMs</span>
                  </div>
                  <span className="block text-sm font-bold text-white group-hover:text-[#FFA726] transition">
                    @itnavideo
                  </span>
                </div>
              </a>

            </div>

            {/* Founder Quote Block */}
            <div className="border-l-2 border-orange-500/40 bg-white/[0.02] p-3.5 rounded-r-xl space-y-1">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Every message is reviewed by the ItnaVideo team.&rdquo;
              </p>
              <p className="text-[11px] font-bold text-[#FF9100] text-right">
                — Syed Rohi, Founder
              </p>
            </div>

          </div>

          {/* ── RIGHT COLUMN: CONTACT FORM ── */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/[0.08] bg-[#0F1117] p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-2xl relative">
              
              {/* Form Card Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6D00]/15 text-[#FF9100] border border-[#FF6D00]/30">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                      Send a direct message
                    </h2>
                    <p className="text-xs text-slate-400">
                      Your message goes directly to the ItnaVideo team.
                    </p>
                  </div>
                </div>

                {/* Live Response Time Pill */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Usually replies within 24 hours</span>
                </span>
              </div>

              {formState === "success" ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-white font-sans">
                    Message Received!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out! Syed Rohi will review your request and get back to your email shortly.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setFormState("idle")}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition border border-white/10 cursor-pointer"
                    >
                      <span>Send another message</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formState === "error" && (
                    <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>
                        Failed to send message. Please email directly at{" "}
                        <strong className="text-white">{EMAIL_ADDRESS}</strong>.
                      </span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="full-name"
                      className="mb-1.5 block text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono"
                    >
                      Full Name
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      placeholder="Your name or channel name"
                      value={formData.name}
                      onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-[#FF6D00]/60 focus:ring-1 focus:ring-[#FF6D00]/40"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email-address"
                      className="mb-1.5 block text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono"
                    >
                      Email Address
                    </label>
                    <input
                      id="email-address"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-[#FF6D00]/60 focus:ring-1 focus:ring-[#FF6D00]/40"
                    />
                  </div>

                  {/* Inquiry Topic Dropdown */}
                  <div>
                    <label
                      htmlFor="inquiry-topic"
                      className="mb-1.5 block text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono"
                    >
                      Inquiry Topic
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-topic"
                        value={formData.topic}
                        onChange={(e) => setFormData((d) => ({ ...d, topic: e.target.value }))}
                        className="w-full rounded-xl border border-white/[0.08] bg-[#050505] px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF6D00]/60 focus:ring-1 focus:ring-[#FF6D00]/40 cursor-pointer appearance-none pr-10 font-medium"
                      >
                        {INQUIRY_TOPICS.map((topic) => (
                          <option key={topic} value={topic} className="bg-[#0F1117] text-white py-2">
                            {topic}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Multi-line textarea */}
                  <div>
                    <label
                      htmlFor="message-text"
                      className="mb-1.5 block text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono"
                    >
                      Message
                    </label>
                    <textarea
                      id="message-text"
                      rows={5}
                      placeholder="Tell us what you're creating, what video templates you need, or where you need help..."
                      value={formData.message}
                      onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-[#FF6D00]/60 focus:ring-1 focus:ring-[#FF6D00]/40 resize-y min-h-[120px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] py-3.5 px-6 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/20 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {formState === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message &rarr;</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Footer Micro-Trust */}
                  <div className="pt-3 text-center">
                    <p className="text-[11px] text-zinc-500 font-medium">
                      🔒 Zero spam guarantee &bull; Direct founder triage
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
