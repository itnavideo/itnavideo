import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { getSeoPagesByKind } from "@/lib/seoContent";

export const metadata: Metadata = {
  title: "AI Video Use Cases",
  description: "Explore Itnavideo use cases for creators, coaches, teachers, businesses, podcasters, and course creators.",
  alternates: { canonical: "/use-cases" },
};

export default function UseCasesIndexPage() {
  const pages = getSeoPagesByKind("useCase");

  return (
    <main className="min-h-screen bg-[#0B1120] px-5 pb-24 pt-32 text-white sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-mint/25 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
          <Users size={16} />
          Use cases
        </div>
        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">AI video workflows for different creators and teams.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Choose the audience closest to your work and see how Itnavideo can help create short-form videos.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link key={page.path} href={page.path} className="group rounded-lg border border-white/10 bg-zinc-950 p-5 transition hover:border-brand-mint/40 hover:bg-zinc-900">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-mint">{page.eyebrow}</p>
              <h2 className="mt-4 text-xl font-black leading-tight">{page.h1}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{page.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-mint">
                View use case
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
