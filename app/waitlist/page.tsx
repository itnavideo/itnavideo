"use client";

import React from "react";
import { ArrowRight, Clock3, GraduationCap, Youtube } from "lucide-react";
import { toast } from "sonner";

export default function WaitlistPage() {
  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      await submitLead({
        kind: "waitlist",
        email,
        source: "web_main",
      });

      toast.success("You're on the list!");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    }
  };

  return (
    <main className="brand-surface flex min-h-screen items-center px-6 py-24 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
            <Clock3 size={16} />
            Private waitlist
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Long-form AI video generation.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
            Early access for YouTube explainers, podcast visuals, educational videos, chapter planning, B-roll, captions, and documentary-style editing.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-white/10 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-brand-mint sm:max-w-md"
              required
            />
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-7 py-4 font-black text-black transition hover:bg-white">
              Join waitlist
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6">
          {[
            { title: "YouTube scripts", desc: "Turn long voiceovers into chapters and scenes.", icon: Youtube },
            { title: "Course content", desc: "Build structured education videos from lessons.", icon: GraduationCap },
            { title: "Smart pacing", desc: "Slow cinematic sections and fast hook moments.", icon: Clock3 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="border-b border-white/10 py-5 last:border-b-0">
                <Icon className="mb-3 text-brand-mint" size={22} />
                <h2 className="font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

async function submitLead(input: { kind: "waitlist"; email: string; source: string }) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.details || data.error || "Submission failed.");
  }
}
