"use client";

import { useState } from "react";
import { CheckCircle2, Instagram, Loader2, Mail, MessageSquare, Send, XCircle } from "lucide-react";

const EMAIL_ADDRESS = "rohi@itnavideo.com";
const INSTAGRAM_URL = "https://www.instagram.com/itnavideo/";

export default function ContactPage() {
  const [formState, setFormState] = useState("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (event) => {
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
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <MessageSquare size={22} strokeWidth={2.25} />
          </div>
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Contact
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s talk about your video needs
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Send us a message or reach out directly via Email or Instagram DM. We usually reply within 24 hours.
          </p>
        </div>

        {/* Contact Methods Cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Direct contact options">
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <Mail size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Direct Email</span>
              <span className="block truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600">{EMAIL_ADDRESS}</span>
            </span>
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
              <Instagram size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Instagram DM</span>
              <span className="block text-sm font-semibold text-slate-900 group-hover:text-pink-600">@itnavideo</span>
            </span>
          </a>
        </section>

        {/* Contact Form Card */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-lg font-bold text-slate-900">Send us a message</h2>
          {formState === "success" ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={44} />
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Thanks for reaching out. Syed Rohi will get back to you shortly at your email address.
              </p>
              <button
                type="button"
                onClick={() => setFormState("idle")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Send another message &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="full-name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(event) => setFormData((data) => ({ ...data, name: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="email-address" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <input
                  id="email-address"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData((data) => ({ ...data, email: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="message-text" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Message
                </label>
                <textarea
                  id="message-text"
                  rows={5}
                  placeholder="Tell us what you're building or where you need help..."
                  value={formData.message}
                  onChange={(event) => setFormData((data) => ({ ...data, message: event.target.value }))}
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {formState === "error" ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
                  <XCircle className="mt-0.5 shrink-0 text-red-500" size={16} />
                  <span>Something went wrong. Please try again or email us directly at <a href={`mailto:${EMAIL_ADDRESS}`} className="font-bold underline">{EMAIL_ADDRESS}</a>.</span>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {formState === "loading" ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                {formState === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
