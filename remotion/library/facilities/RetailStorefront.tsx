import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface RetailStorefrontProps {
  storeName?: string;
  category?: string;
  isOpen?: boolean;
  className?: string;
}

export const RetailStorefront: React.FC<RetailStorefrontProps> = ({
  storeName = 'THE VELVET ATELIER',
  category = 'Boutique Fashion & Accessories',
  isOpen = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          RETAIL STOREFRONT
        </span>
        <span className="text-white/40">COMMERCIAL FACADE</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
        {/* Striped Awning */}
        <div className="h-6 w-full flex rounded-t-lg overflow-hidden border-b border-black">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={"flex-1 h-full " + (i % 2 === 0 ? 'bg-amber-600' : 'bg-white')} />
          ))}
        </div>

        {/* Store Sign */}
        <div className="text-center py-2">
          <div className="text-sm font-black tracking-widest text-white uppercase">{storeName}</div>
          <div className="text-[10px] text-white/50">{category}</div>
        </div>

        {/* Glass Windows & Door */}
        <div className="flex-1 flex space-x-2 items-end pt-2 border-t border-white/10">
          <div className="flex-1 h-24 bg-sky-950/40 border border-sky-400/30 rounded flex items-center justify-center p-2 relative">
            <span className="text-[9px] text-sky-300 font-mono text-center">WINDOW DISPLAY</span>
          </div>
          <div className="w-16 h-28 bg-zinc-800 border-2 border-amber-500/60 rounded flex flex-col items-center justify-center space-y-2">
            <div className="w-8 h-10 border border-white/20 rounded flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            {isOpen && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black font-black text-[8px] animate-pulse">
                OPEN
              </span>
            )}
          </div>
          <div className="flex-1 h-24 bg-sky-950/40 border border-sky-400/30 rounded flex items-center justify-center p-2 relative">
            <span className="text-[9px] text-sky-300 font-mono text-center">FEATURED PROMO</span>
          </div>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>FOOT TRAFFIC: 1,420 VISITORS/DAY</span>
        <span>HOURS: 10 AM - 9 PM</span>
      </div>
    </div>
  );
};
