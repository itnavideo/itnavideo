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
    <main className="min-h-screen bg-background px-5 pb-24 pt-32 text-foreground sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
          <Users size={16} />
          Use cases
        </div>
        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl text-foreground">AI video workflows for different creators and teams.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          Choose the audience closest to your work and see how Itnavideo can help create short-form videos.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link key={page.path} href={page.path} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 hover:border-slate-400 dark:hover:border-border">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{page.eyebrow}</p>
              <h2 className="mt-4 text-xl font-black leading-tight text-card-foreground">{page.h1}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
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

