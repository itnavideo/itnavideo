import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import WavToMp3Client from "./WavToMp3Client";

export const metadata: Metadata = {
  title: "Free WAV to MP3 Converter Online | No Login | Itnavideo",
  description:
    "Convert WAV audio to high-quality 320kbps MP3 online for free. No login required. Private browser-based conversion.",
  alternates: {
    canonical: "/wav-to-mp3",
  },
};

export default function WavToMp3Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/" aria-label="Itnavideo home">
            <BrandLogo size="md" showTagline={false} />
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white px-4 py-2.5 text-xs font-black text-black transition hover:bg-brand-mint"
          >
            Dashboard
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex rounded-full border border-brand-mint/25 bg-brand-mint/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-mint">
              Free audio tool
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Convert WAV to MP3 online.
            </h1>

            <p className="mt-5 max-w-2xl text-base font-bold leading-8 text-zinc-400 sm:text-lg">
              Upload a WAV file and convert it into a high-quality 320kbps MP3.
              No login, no watermark, and no server upload. Conversion happens in your browser.
            </p>

            <div className="mt-7 grid gap-3 text-sm font-bold text-zinc-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                Private browser conversion
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                High-quality 320kbps MP3
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                Free without login
              </div>
            </div>

            <p className="mt-5 text-xs font-bold leading-6 text-zinc-500">
              Note: MP3 is a compressed format, so exact lossless conversion is not possible.
              For best quality, this tool exports at 320kbps.
            </p>
          </div>

          <WavToMp3Client />
        </section>
      </div>
    </main>
  );
}
