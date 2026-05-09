import React from 'react';
import { X, Check, Clock, Zap, DollarSign, Sparkles } from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">The Better Way to Create</h2>
          <p className="text-zinc-400">Stop wasting hours in Premiere Pro. Let AI do the heavy lifting.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional Way */}
          <div className="p-8 rounded-3xl border border-white/5 bg-zinc-950/50 opacity-60">
            <h3 className="text-2xl font-bold mb-6 text-zinc-300">Traditional Editing</h3>
            <ul className="space-y-4">
              <ComparisonItem icon={<Clock className="text-red-400" />} text="4-6 hours per short video" />
              <ComparisonItem icon={<DollarSign className="text-red-400" />} text="$500+ /month for editors" />
              <ComparisonItem icon={<X className="text-red-400" />} text="Manual caption syncing" />
              <ComparisonItem icon={<X className="text-red-400" />} text="Finding B-roll manually" />
            </ul>
          </div>

          {/* Itnavideo Way */}
          <div className="p-8 rounded-3xl border border-purple-500/30 bg-purple-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
              AI Powered
            </div>
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              Itnavideo <Sparkles size={20} className="text-purple-400" />
            </h3>
            <ul className="space-y-4">
              <ComparisonItem icon={<Zap className="text-purple-400" />} text="Ready in under 2 minutes" />
              <ComparisonItem icon={<Check className="text-purple-400" />} text="Fraction of the cost" />
              <ComparisonItem icon={<Check className="text-purple-400" />} text="Auto-synced viral captions" />
              <ComparisonItem icon={<Check className="text-purple-400" />} text="AI-curated cinematic scenes" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-zinc-300 font-medium">
      {icon} <span>{text}</span>
    </li>
  );
}