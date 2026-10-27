import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Video, Zap, Sparkles, CheckCircle2, TrendingUp, Music, Layers, BarChart, Clock, Mic, Play } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Faceless AI Shorts Generator | Create Viral 9:16 Shorts Instantly",
  description: "Generate 9:16 Faceless Shorts with AI. Upload audio and let our AI create viral YouTube Shorts, TikToks, and Instagram Reels with kinetic typography, motion graphics, and background music.",
};

export default function FacelessShortsLandingPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-[#FF5722]/30 selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo size="md" variant="dark" />
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-zinc-300 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/dashboard/faceless-shorts"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white text-sm font-black shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform"
            >
              Start Creating
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-bold mb-6">
              <Sparkles size={16} />
              <span>The Ultimate 9:16 Viral Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Faceless AI Shorts <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
                Generator
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Transform your audio into highly engaging, viral 9:16 shorts in minutes. 
              Our AI automatically sources background media, adds kinetic typography, 
              syncs motion graphics, and applies professional sound effects—all without you ever showing your face.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/faceless-shorts"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black font-black text-lg shadow-[0_0_30px_rgba(255,87,34,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Create Your First Short</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* What is Faceless AI Shorts Generator? (SEO Content) */}
        <section className="py-16 border-t border-white/10 bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                  What is a Faceless AI Shorts Generator?
                </h2>
                <div className="space-y-4 text-zinc-300 leading-relaxed font-medium">
                  <p>
                    A Faceless AI Shorts Generator is a specialized video creation tool designed to produce high-retention, vertical (9:16) videos for platforms like YouTube Shorts, TikTok, and Instagram Reels without requiring the creator to be on camera. 
                  </p>
                  <p>
                    In today's fast-paced creator economy, keeping the audience's attention is everything. Our pipeline is built specifically for this. You simply upload your voiceover or audio file, and the AI takes over. It transcribes the audio with millisecond precision, creates a dynamic storyboard, and pairs your words with striking stock visuals, motion graphics, and SVG illustrations.
                  </p>
                  <p>
                    The result? A fully produced, ready-to-publish short-form video that features professional kinetic typography, background music perfectly ducked under your voiceover, and sound effects that make key moments pop. This enables you to scale your content production, run multiple automated "cash cow" channels, and reach millions of viewers—all while maintaining complete anonymity.
                  </p>
                  <p>
                    Whether you are telling a spooky Reddit story, explaining a complex financial concept, sharing a motivational quote, or simply providing quick facts, the Faceless AI Shorts Generator ensures your content looks polished and retains viewers until the very last second.
                  </p>
                </div>
              </div>
              
              <div className="relative aspect-[9/16] w-full max-w-[360px] mx-auto rounded-3xl border-4 border-[#121624] overflow-hidden shadow-[0_0_40px_rgba(255,87,34,0.15)] bg-black">
                <img 
                  src="https://res.cloudinary.com/dhouh9idx/image/upload/v1792945593/file_00000000806482119547c1b937b7e386_zsrmkb.png" 
                  alt="Faceless AI Shorts Example" 
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-0 right-0 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FF5722] text-white shadow-xl shadow-[#FF5722]/40 mb-4 animate-pulse">
                    <Play size={24} className="ml-1" />
                  </div>
                  <h3 className="text-xl font-black text-white">Vertical & Viral</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Everything You Need to Go Viral
              </h2>
              <p className="text-zinc-400 text-lg font-medium">Built for the modern algorithm.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Mic,
                  title: "Audio-Driven Engine",
                  desc: "Upload your MP3/WAV, and our AI transcribes and aligns every word flawlessly.",
                  color: "text-purple-400",
                  bg: "bg-purple-500/10"
                },
                {
                  icon: Sparkles,
                  title: "Kinetic Typography",
                  desc: "Highlight key phrases with Hormozi-style bouncing captions and vibrant colors.",
                  color: "text-amber-400",
                  bg: "bg-amber-500/10"
                },
                {
                  icon: Layers,
                  title: "AI Storyboarding",
                  desc: "Intelligent scene splitting. We pair contextually relevant stock visuals automatically.",
                  color: "text-blue-400",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: Music,
                  title: "Smart Audio Mixing",
                  desc: "Background music is auto-ducked so your voice remains crisp and clear.",
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10"
                },
                {
                  icon: Video,
                  title: "Strictly 9:16 Format",
                  desc: "Perfectly optimized 1080x1920 resolution for Shorts, Reels, and TikToks.",
                  color: "text-rose-400",
                  bg: "bg-rose-500/10"
                },
                {
                  icon: TrendingUp,
                  title: "High Retention Pacing",
                  desc: "Fast cuts and dynamic motion graphics designed to hook viewers in the first 3 seconds.",
                  color: "text-orange-400",
                  bg: "bg-orange-500/10"
                }
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#0B0F19] border border-white/5 hover:border-orange-500/30 transition-colors">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-zinc-400 font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-[#0B0F19] border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-16">
              How to Create Faceless Shorts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
              <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#121624] to-[#1A1F33] border border-orange-500/30 flex items-center justify-center text-2xl font-black text-[#FF5722] shadow-lg shadow-orange-500/10">1</div>
                <h3 className="text-xl font-bold text-white">Upload Audio</h3>
                <p className="text-zinc-400 font-medium">Bring your voiceover, script reading, or story audio.</p>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#121624] to-[#1A1F33] border border-orange-500/30 flex items-center justify-center text-2xl font-black text-[#FF5722] shadow-lg shadow-orange-500/10">2</div>
                <h3 className="text-xl font-bold text-white">AI Processing</h3>
                <p className="text-zinc-400 font-medium">Our engine plans scenes, matches visuals, and animates captions.</p>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#121624] to-[#1A1F33] border border-orange-500/30 flex items-center justify-center text-2xl font-black text-[#FF5722] shadow-lg shadow-orange-500/10">3</div>
                <h3 className="text-xl font-bold text-white">Export & Publish</h3>
                <p className="text-zinc-400 font-medium">Download your stunning 1080p MP4 ready for viral reach.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Dominate the Feed?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 font-medium">
              Join thousands of creators using Itnavideo to automate their faceless short-form content.
            </p>
            <Link
              href="/dashboard/faceless-shorts"
              className="inline-flex px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black font-black text-xl shadow-[0_0_40px_rgba(255,87,34,0.3)] hover:scale-105 transition-all"
            >
              Start Generating Shorts
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
