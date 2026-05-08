import React from 'react';
import { Play, Video, Zap, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/10">
        <div className="text-2xl font-bold tracking-tighter italic">
          ITNA<span className="text-blue-500">VIDEO</span>.AI
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
          <a href="#" className="hover:text-white transition">Showcase</a>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-8">
          <Zap size={14} className="text-blue-500 fill-blue-500" />
          <span className="text-xs font-medium tracking-wide text-gray-300 uppercase">Next Gen Video Creation</span>
        </div>
        
        {/* Responsive Heading */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          CREATE VIDEOS <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            IN SECONDS
          </span>
        </h1>

        <p className="max-w-2xl text-gray-400 text-base md:text-xl mb-10 leading-relaxed px-4">
          The ultimate AI-powered platform to transform your ideas into professional videos instantly. 
          No editing skills required.
        </p>

        {/* Buttons Stack on Mobile */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all">
            <Play size={20} fill="currentColor" />
            <span>Start Creating Now</span>
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all">
            Watch Demo
          </button>
        </div>
      </main>

      {/* Features Grid - 1 col on mobile, 3 on desktop */}
      <section className="px-6 md:px-24 py-20 bg-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Video className="text-blue-500" />}
            title="AI Generation"
            desc="Write a prompt and watch the AI bring your vision to life with cinematic quality."
          />
          <FeatureCard 
            icon={<Zap className="text-purple-500" />}
            title="Instant Export"
            desc="Render and export your videos in 4K resolution within minutes, not hours."
          />
          <FeatureCard 
            icon={<Smartphone className="text-green-500" />}
            title="Mobile First"
            desc="Create, edit, and share videos directly from your phone with our optimized UI."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-black border border-white/10 hover:border-blue-500/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}