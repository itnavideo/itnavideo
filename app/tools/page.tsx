import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { getSeoPagesByKind } from "@/lib/seoContent";

export const metadata: Metadata = {
  title: "AI Video Tools",
  description: "Explore Itnavideo tools for auto captions, AI reels, custom AI reels, long video promos, compare explainers, Auto Draw, and background replacement.",
  alternates: { canonical: "/tools" },
};

export default function ToolsIndexPage() {
  const pages = getSeoPagesByKind("tool");

  return (
    <main className="min-h-screen bg-background px-5 pb-24 pt-32 text-foreground sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
          <Wrench size={16} />
          AI video tools
        </div>
        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl text-foreground">Tools for creating reels, captions, explainers, and promos.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          Start with the tool that matches your goal, then upload content and generate a polished short video.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link key={page.path} href={page.path} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 hover:border-slate-400 dark:hover:border-border">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{page.eyebrow}</p>
              <h2 className="mt-4 text-xl font-black leading-tight text-card-foreground">{page.h1}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
                Open tool
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

