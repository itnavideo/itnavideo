"use client";
import React from 'react';

export default function Pricing() {
  const tiers = [
    { name: "Starter", price: "Free", features: ["3 Videos/mo", "720p Quality", "Watermark"] },
    { name: "Pro", price: "$19/mo", features: ["Unlimited Videos", "4K Quality", "No Watermark", "AI Voice Clone"] },
  ];

  return (
    <div className="min-h-screen bg-black py-32 px-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4">Simple Pricing.</h1>
        <p className="text-gray-400">Scale your content with AI without breaking the bank.</p>
      </div>

      <div className="flex flex-col md:row justify-center gap-8 max-w-4xl mx-auto">
        {tiers.map((tier) => (
          <div key={tier.name} className={`flex-1 p-8 rounded-3xl border ${tier.name === 'Pro' ? 'border-purple-500 bg-purple-500/5 shadow-2xl shadow-purple-500/10' : 'border-gray-800 bg-gray-900/50'}`}>
            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
            <div className="text-4xl font-black mb-6">{tier.price}</div>
            <ul className="space-y-4 mb-8">
              {tier.features.map(f => (
                <li key={f} className="text-gray-300 flex items-center gap-2">
                  <span className="text-purple-500 text-xl">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-bold transition ${tier.name === 'Pro' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white text-black hover:bg-gray-200'}`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}