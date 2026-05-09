import React from 'react';

export default function BrandWall() {
  return (
    <div className="py-12 border-y border-white/5 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-zinc-500 text-sm font-medium uppercase tracking-widest mb-8">Trusted by creators at</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale contrast-200">
          <div className="text-xl font-bold">CREATOR 1</div>
          <div className="text-xl font-bold">CREATOR 2</div>
          <div className="text-xl font-bold">CREATOR 3</div>
        </div>
      </div>
    </div>
  );
}