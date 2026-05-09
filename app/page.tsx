// app/page.js

import Link from "next/link";
import {
  Sparkles,
  Upload,
  Video,
  Wand2,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from 'framer-motion';
import BrandWall from "@/components/BrandWall";
import HowItWorks from "@/components/HowItWorks"; // Assuming you have this component
import ComparisonSection from "@/components/ComparisonSection"; // Assuming you have this component
import LongFormComingSoon from "@/components/LongFormComingSoon";
import FAQSection from "@/components/FAQSection";
import TestimonialSection from "@/components/TestimonialSection";
import EngagementHook from "@/components/EngagementHook";

export default function HomePage() {
  return (
    <main className="bg-black text-white overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[140px] rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles size={18} className="text-purple-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-purple-300">
              AI-Powered Video Creation Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-white">
            Upload Voice.
            <br />
            Get Cinematic Videos.
            <br />
            <span className="text-purple-500">Automatically.</span>
          </h1>

          {/* Subheading */}
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-normal tracking-tight">
            Itnavideo transforms voice recordings into professional
            short-form videos using AI — complete with captions,
            animations, transitions, and cinematic storytelling.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14">
            
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              Start Creating Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/pricing" className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg text-white border border-white/10 hover:bg-white/5 transition-all backdrop-blur-sm">
              <PlayCircle size={22} />
              Watch Demo
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            
            <StatCard number="10x" label="Faster Editing" />
            <StatCard number="4K" label="Video Exports" />
            <StatCard number="AI" label="Scene Planning" />
            <StatCard number="100%" label="Automated Workflow" />
          </div>
        </div>
      </section>

      {/* BRAND LOGO WALL - Assuming BrandWall is already integrated */}
      <BrandWall />

      {/* ENGAGEMENT PHILOSOPHY HOOK */}
      <EngagementHook />

      {/* FEATURES */}
      <section className="px-6 py-24">
        
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-5">
              Features
            </p>

            <h2 className="text-5xl font-bold mb-6">
              Everything Needed To Create Viral Videos
            </h2>

            <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-8 font-medium">
              AI handles captions, animations, storytelling, sound syncing,
              safe-zones, and rendering automatically.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <FeatureCard
              icon={<Upload size={28} />}
              title="Voice Upload"
              desc="Upload voiceovers, screenshots, clips, and media files instantly."
            />

            <FeatureCard
              icon={<Wand2 size={28} />}
              title="AI Scene Planning"
              desc="AI automatically creates scenes, transitions, hooks, and pacing."
            />

            <FeatureCard
              icon={<Video size={28} />}
              title="Cinematic Rendering"
              desc="Generate high-quality MP4 videos optimized for social platforms."
            />

            <FeatureCard
              icon={<Sparkles size={28} />}
              title="Smart Captions"
              desc="Millisecond-level caption synchronization with dynamic animations."
            />

            <FeatureCard
              icon={<CheckCircle2 size={28} />}
              title="Platform Optimization"
              desc="Safe-zones and layouts optimized for Reels, Shorts, and TikTok."
            />

            <FeatureCard
              icon={<PlayCircle size={28} />}
              title="AI Storytelling"
              desc="Create engaging short-form videos without editing experience."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Using the improved HowItWorks component */}
      <HowItWorks />

      {/* COMPARISON SECTION - Using the improved ComparisonSection component */}
      <ComparisonSection />

      {/* LONG-FORM VIDEOS COMING SOON */}
      <LongFormComingSoon />

      {/* TESTIMONIALS SECTION */}
      <TestimonialSection />

      {/* FAQ SECTION */}
      <FAQSection />

      {/* CTA - This section is already present, just ensuring it's at the bottom */}
      <section className="px-6 py-28">
        
        <div className="max-w-5xl mx-auto rounded-[40px] border border-purple-500/20 bg-gradient-to-br from-purple-600/20 to-pink-600/10 p-12 text-center">
          
          <h2 className="text-5xl font-bold mb-6">
            Start Creating With AI Today
          </h2>

          <p className="text-zinc-300 text-lg leading-8 mb-10 max-w-3xl mx-auto font-medium">
            Join the next generation of creators using AI to automate
            cinematic short-form video production.
          </p>

          <Link
            href="/pricing"
            className="inline-block bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl text-lg font-semibold"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}

/* Stats */
function StatCard({ number, label }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-4xl font-bold mb-2">{number}</h3>

      <p className="text-zinc-400">{label}</p>
    </div>
  );
}

/* Features */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-purple-500/40 transition">
      
      <div className="w-14 h-14 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-semibold mb-4">
        {title}
      </h3>

      <p className="text-zinc-400 leading-7 font-medium">
        {desc}
      </p>
    </div>
  );
}

/* Steps */
function StepCard({ step, title, desc }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      
      <div className="text-purple-500 text-lg font-semibold mb-5">
        {step}
      </div>

      <h3 className="text-3xl font-bold mb-4">
        {title}
      </h3>

      <p className="text-zinc-400 leading-7 font-medium">
        {desc}
      </p>
    </div>
  );
}