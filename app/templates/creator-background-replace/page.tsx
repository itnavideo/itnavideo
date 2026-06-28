import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Creator Background Replace - Video Background Image | Itnavideo",
  description: "Upload a creator video and one background image. Replace the original video background, adjust crop, zoom, and placement, then export a polished reel.",
  openGraph: {
    title: "Creator Background Replace - Itnavideo",
    description: "Upload a creator video and one background image. Adjust crop, zoom, and placement before export.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Background Replace - Itnavideo",
    description: "Upload a creator video and one background image. Adjust crop, zoom, and placement before export.",
  },
};

export default function CreatorBackgroundReplacePage() {
  return (
    <main className="min-h-screen text-white" style={{ background: "#0F172A" }}>
      <section className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{ border: "1px solid rgba(249, 115, 22, 0.24)", background: "rgba(249, 115, 22, 0.08)", color: "#FDBA74" }}>
            <Sparkles size={14} />
            Creator utility template
          </div>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
            Creator Background Replace
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-dark-secondary)" }}>
            Upload your creator video and a background image. Adjust the image crop and creator placement before final export.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-black">What you get</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Creator video over your uploaded background image",
              "Background fit, crop, zoom, and X/Y position controls",
              "Creator scale and X/Y position controls",
              "Preview values are reused in the final export",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg p-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border-dark)", borderRadius: "12px" }}>
                <Check size={18} className="mt-0.5 shrink-0" style={{ color: "#FDBA74" }} />
                <span className="text-sm leading-6" style={{ color: "var(--text-dark-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <Link
            href="/dashboard?template=creator-background-replace"
            className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 text-[15px] font-semibold text-white transition hover:-translate-y-[1px] brand-btn-primary-dark"
          >
            Use this template
            <ArrowRight size={16} />
          </Link>
          <p className="mt-4 text-sm" style={{ color: "var(--text-dark-muted)" }}>
            Preview and adjustments are free. Final export uses 1 credit.
          </p>
        </div>
      </section>
    </main>
  );
}
