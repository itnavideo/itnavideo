import React from 'react';
import { Zap } from 'lucide-react';

export default function EngagementHook() {
  return (
    <section className="py-24 px-6 bg-black border-y border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mx-auto mb-8">
          <Zap size={32} />
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-6">The First 3 Seconds Decide Everything</h2>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
          Our AI analyzes the hook of your voiceover to ensure the visuals and captions grab 
          attention instantly. Retention is the only metric that matters.
        </p>
      </div>
    </section>
  );
}