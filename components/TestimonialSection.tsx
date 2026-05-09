import React from 'react';

export default function TestimonialSection() {
  return (
    <section className="py-24 px-6 bg-zinc-950/30">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-16">Loved by Creators</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard name="Alex Rivers" role="Content Creator" text="Itnavideo turned my 5-minute talk into 3 viral reels in minutes. Absolute game changer." />
          <TestimonialCard name="Sarah Chen" role="Digital Marketer" text="The AI captions are scarily accurate. Saves me hours of manual syncing every week." />
          <TestimonialCard name="Mike Ross" role="Podcaster" text="Perfect for social clips. My engagement doubled since I started using cinematic B-roll." />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-left">
      <p className="text-zinc-300 italic mb-6">"{text}"</p>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-zinc-500 text-sm">{role}</div>
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
}