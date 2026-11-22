import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PricingTierMatrixProps {
  tiers?: { name: string; price: string; highlighted?: boolean }[];
  className?: string;
}

export const PricingTierMatrix: React.FC<PricingTierMatrixProps> = ({
  tiers = [
    { name: 'Starter', price: '$29/mo' },
    { name: 'Pro Creator', price: '$79/mo', highlighted: true },
    { name: 'Enterprise', price: 'Custom' },
  ],
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          SAAS COMMERCIAL PACKAGING
        </span>
        <span className="text-white/40">ANNUAL BILLING (20% OFF)</span>
      </div>

      <div className="flex-1 my-4 grid grid-cols-3 gap-3 items-center">
        {tiers.map((t, i) => (
          <div
            key={i}
            className={"p-4 rounded-xl border flex flex-col items-center text-center justify-between h-full " +
              (t.highlighted ? 'bg-amber-950/30 border-amber-500/60 shadow-lg' : 'bg-zinc-900 border-white/10')}
          >
            <div>
              <div className={"text-xs font-mono font-bold " + (t.highlighted ? 'text-amber-400' : 'text-white/60')}>
                {t.name}
              </div>
              <div className="text-xl font-black font-mono text-white mt-2">{t.price}</div>
            </div>
            <button className={"w-full py-1.5 rounded-lg text-xs font-bold mt-4 " +
              (t.highlighted ? 'bg-amber-500 text-black shadow' : 'bg-zinc-800 text-white')}>
              Select Plan
            </button>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>STRIPE BILLING PORTAL INTEGRATION</span>
        <span>14-DAY RISK-FREE TRIAL</span>
      </div>
    </div>
  );
};
