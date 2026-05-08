"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, Video, Zap, Sparkles, Layout, 
  ArrowRight, CheckCircle2, Play, 
  Layers, BarChart3, Globe
} from 'lucide-react';

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-[#050816]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <Play size={18} fill="white" className="text-white ml-0.5" />
        </div>
        <span className="text-xl font-bold tracking-tighter text-white">ITNA<span className="text-violet-500">VIDEO</span></span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        {['Features', 'Pipeline', 'Pricing', 'FAQ'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</button>
        <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">
          Get Started
        </button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    {/* Animated Background Gradients */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
    </div>

    <div className="max-w-7xl mx-auto px-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-bold mb-8"
      >
        <Sparkles size={14} />
        <span>2026 AI Generation Engine Live</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05] text-white"
      >
        Upload voice. <br />
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
          Get viral video.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
      >
        The first AI pipeline that handles everything from scene planning to 4K rendering. Stop editing, start creating.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6"
      >
        <button className="group relative bg-violet-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:bg-violet-500 transition-all flex items-center gap-3">
          Start Creating Free
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex -space-x-3 items-center">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050816] bg-gray-800" />
          ))}
          <span className="pl-6 text-sm text-gray-500 font-medium">Joined by 2,000+ creators</span>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-violet-500/50 transition-all group"
  >
    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </motion.div>
);

// --- MAIN PAGE ---

export default function LandingPage() {
  return (
    <div className="bg-[#050816] text-white selection:bg-violet-500/30">
      <Navbar />
      
      <main>
        <Hero />

        {/* Pipeline Section */}
        <section id="pipeline" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">The 1-Click Pipeline</h2>
              <p className="text-gray-400 text-lg">We integrated the best of AI so you don't have to.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { name: 'Whisper', tech: 'Audio-to-Text', icon: Mic },
                { name: 'GPT-4o', tech: 'Scene Planning', icon: Sparkles },
                { name: 'Canva', tech: 'Motion Assets', icon: Layout },
                { name: 'FFmpeg', tech: 'Pro Rendering', icon: Layers },
                { name: 'Cloudinary', tech: 'Fast Delivery', icon: Globe },
              ].map((step, i) => (
                <div key={i} className="relative p-6 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/5 text-center">
                  <step.icon className="mx-auto mb-4 text-violet-400" size={32} />
                  <h4 className="font-bold text-lg">{step.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{step.tech}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap} 
              title="90s Render Speed" 
              desc="Our serverless architecture renders 4K videos faster than you can write a tweet."
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Retention Focused" 
              desc="AI-driven zooms and caption timing designed to maximize 'Watch Time' metrics."
            />
            <FeatureCard 
              icon={CheckCircle2} 
              title="Brand Kits" 
              desc="Save your colors, fonts, and logos once. Apply them to every AI generation."
            />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 text-lg">Scale your content without scaling your costs.</p>
          </div>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Basic Card Example */}
            <div className="p-8 rounded-3xl border border-white/5 bg-white/5">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm text-gray-400">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> 10 Videos / mo</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> 1080p Export</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-bold">Choose Basic</button>
            </div>

            {/* Pro Card - Highlighted */}
            <div className="p-8 rounded-3xl border-2 border-violet-600 bg-violet-600/10 relative scale-105 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400"/> Unlimited Videos</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400"/> 4K Ultra HD</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400"/> Custom AI Voice</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition-all font-bold">Get Pro Access</button>
            </div>

            {/* Business */}
            <div className="p-8 rounded-3xl border border-white/5 bg-white/5 text-gray-500">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <p className="text-sm mb-8">For agencies managing 50+ clients.</p>
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold">Contact Sales</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
           <div className="max-w-sm">
             <div className="text-xl font-bold mb-6">ITNA<span className="text-violet-500">VIDEO</span></div>
             <p className="text-gray-500 text-sm leading-relaxed">Building the future of automated video creation. Founded in 2026 for the creator economy.</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li><a href="#">Features</a></li>
                  <li><a href="#">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li><a href="#">About</a></li>
                  <li><a href="#">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest">Legal</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li><a href="#">Privacy</a></li>
                  <li><a href="#">Terms</a></li>
                </ul>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}