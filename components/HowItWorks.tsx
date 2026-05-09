import React from 'react';
import { Upload, Wand2, Video } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-zinc-950/30">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <Step number="01" icon={<Upload />} title="Upload Voice" desc="Drop your audio or media clips." />
          <Step number="02" icon={<Wand2 />} title="AI Magic" desc="AI syncs visuals and captions." />
          <Step number="03" icon={<Video />} title="Get Video" desc="Ready in minutes for social media." />
        </div>
      </div>
    </section>
  );
}

function Step({ number, icon, title, desc }: { number: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
      <div className="text-purple-500 font-bold mb-4">{number}</div>
      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}