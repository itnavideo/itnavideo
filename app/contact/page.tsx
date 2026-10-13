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
    <main className="min-h-screen bg-white text-slate-900 selection:bg-orange-500/20 selection:text-orange-900 pt-24 sm:pt-28 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* ── AMBIENT BACKGROUND GLOW ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-28 left-10 lg:left-32 w-[600px] h-[500px] bg-orange-500/[0.05] rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        
        {/* ── 2-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ── LEFT COLUMN: HERO, VISUAL & CHANNELS ── */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Access Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-700 text-[11px] font-black tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Contact ItnaVideo</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.08] font-sans">
                Have a question?{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
                  Let&apos;s talk.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Have a question, feedback, or need help with ItnaVideo? Send us a message and our team will get back to you.
              </p>
            </div>

            {/* 3D Customer Support Agent Visual */}
            <div className="relative my-4 flex items-center justify-center lg:justify-start">
              <div className="absolute -z-10 w-72 h-72 rounded-full bg-orange-500/[0.08] blur-3xl left-1/2 -translate-x-1/2" />
              
              <div className="relative w-full max-w-sm sm:max-w-md h-auto">
                <Image
                  src="/assets/support-agent-3d.png"
                  alt="3D Customer Support Agent - Itnavideo"
                  width={520}
                  height={520}
                  className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)]"
                  priority
                />
              </div>
            </div>

            {/* Direct Channel Cards (Stack) */}
            <div className="space-y-3.5 pt-1">
              
              {/* Email Support Card */}
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#FAFAFA] p-4 transition-all duration-300 hover:border-orange-500/40 hover:bg-white hover:shadow-lg hover:shadow-orange-500/10 shadow-xs"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#FF5722] border border-orange-500/20 transition group-hover:scale-105 group-hover:bg-[#FF5722] group-hover:text-white">
                  <Mail size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5722]">
                      Direct Email
                    </span>
                    <span className="text-[10px] text-slate-500">Usually &lt; 24h</span>
                  </div>
                  <span className="block truncate text-sm font-bold text-slate-900 group-hover:text-[#FF5722] transition">
                    {EMAIL_ADDRESS}
                  </span>
                </div>
              </a>

              {/* Instagram & Social DMs Card */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#FAFAFA] p-4 transition-all duration-300 hover:border-orange-500/40 hover:bg-white hover:shadow-lg hover:shadow-orange-500/10 shadow-xs"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#FF5722] border border-orange-500/20 transition group-hover:scale-105 group-hover:bg-[#FF5722] group-hover:text-white">
                  <Instagram size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5722]">
                      Instagram &amp; Social
                    </span>
                    <span className="text-[10px] text-slate-500">Quick DMs</span>
                  </div>
                  <span className="block text-sm font-bold text-slate-900 group-hover:text-[#FF5722] transition">
                    @itnavideo
                  </span>
                </div>
              </a>

            </div>

            {/* Founder Quote Block */}
            <div className="border-l-2 border-orange-500 bg-orange-500/[0.04] p-3.5 rounded-r-xl space-y-1">
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;Every message is reviewed by the ItnaVideo team.&rdquo;
              </p>
              <p className="text-[11px] font-bold text-[#FF5722] text-right">
                — Syed Rohi, Founder
              </p>
            </div>

          </div>

          {/* ── RIGHT COLUMN: CONTACT FORM ── */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-[#FAFAFA] p-6 sm:p-10 shadow-xl relative">
              
              {/* Form Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-[#FF5722] border border-orange-500/20">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                      Send a direct message
                    </h2>
                    <p className="text-xs text-slate-500">
                      Your message goes directly to the ItnaVideo team.
                    </p>
                  </div>
                </div>

                {/* Live Response Time Pill */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-700 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Usually replies within 24 hours</span>
                </span>
              </div>

              {formState === "success" ? (
                <div className="py-12 text-center space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-sans">
                    Message Received!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out! Syed Rohi will review your request and get back to your email shortly.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setFormState("idle")}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition cursor-pointer"
                    >
                      <span>Send another message</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formState === "error" && (
                    <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>
                        Failed to send message. Please email directly at{" "}
                        <strong className="text-red-900">{EMAIL_ADDRESS}</strong>.
                      </span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="full-name"
                      className="mb-1.5 block text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email-address"
                      className="mb-1.5 block text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]"
                    />
                  </div>

                  {/* Inquiry Topic Dropdown */}
                  <div>
                    <label
                      htmlFor="inquiry-topic"
                      className="mb-1.5 block text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono"
                    >
                      Inquiry Topic
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-topic"
                        value={formData.topic}
                        onChange={(e) => setFormData((d) => ({ ...d, topic: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] cursor-pointer appearance-none pr-10 font-medium"
                      >
                        {INQUIRY_TOPICS.map((topic) => (
                          <option key={topic} value={topic} className="bg-white text-slate-900 py-2">
                            {topic}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
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
                      className="mb-1.5 block text-xs font-semibold text-slate-700 tracking-wider uppercase font-mono"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] resize-y min-h-[120px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formState === "loading"}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] py-3.5 px-6 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:brightness-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {formState === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>Send Message &rarr;</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Footer Micro-Trust */}
                  <div className="pt-3 text-center">
                    <p className="text-[11px] text-slate-500 font-medium">
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
