import React from 'react';
import { Sparkles, ArrowRight, Youtube, Mic, Video } from 'lucide-react';

export default function LongFormComingSoon() {
  return (
    <section className="py-32 px-6 relative bg-black overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <Sparkles size={16} className="text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">Waitlist Open</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter text-white">
              AI Powered <br />
              <span className="text-purple-500">Long-Form</span> Videos
            </h2>

            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Turn 1-hour podcasts or voice recordings into cinematic 
              YouTube documentaries automatically. The future of long-form 
              storytelling is arriving.
            </p>

            <div className="space-y-4">
              <a
                href="https://forms.gle/WuqDzdRsuhtnEED4A"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
              >
                Join the Long-form Waitlist
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-zinc-500 text-sm italic">
                Thanks! You&apos;re now on the itnavideo early access list.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureItem icon={<Youtube size={24} />} title="YouTube Ready" desc="5-20 min cinematic renders" />
            <FeatureItem icon={<Mic size={24} />} title="Podcast Visuals" desc="Auto-B-roll for your voice" />
            <FeatureItem icon={<Video size={24} />} title="Documentaries" desc="AI-driven storytelling" />
            <FeatureItem icon={<Sparkles size={24} />} title="Waitlist Priority" desc="Join 100+ serious creators" />
          </div>
          
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}