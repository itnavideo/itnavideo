import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CouponPromoCodeProps {
  code?: string;
  discount?: string;
  terms?: string;
  className?: string;
}

export const CouponPromoCode: React.FC<CouponPromoCodeProps> = ({
  code = 'GROWTH50',
  discount = '50% OFF',
  terms = 'Applies to first year of all annual plans',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          COUPON VOUCHER
        </span>
        <span className="text-white/40">ONE-CLICK COPY</span>
      </div>

      <div className="flex-1 my-4 border-2 border-dashed border-amber-500/60 bg-amber-950/20 rounded-xl p-5 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
        <div className="px-3 py-1 rounded-full bg-amber-500 text-black font-black text-xs">
          {discount}
        </div>
        <div className="flex items-center space-x-3 bg-zinc-900 px-4 py-2 rounded-lg border border-white/15">
          <span className="font-mono text-lg font-black tracking-widest text-white">{code}</span>
          <button className="px-2.5 py-1 rounded bg-white text-black font-bold text-xs hover:bg-zinc-200">
            COPY
          </button>
        </div>
        <div className="text-[11px] text-white/60 text-center font-mono">{terms}</div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>REDEMPTIONS: 1,842 APPLIED</span>
        <span>EXPIRY: 48 HOURS</span>
      </div>
    </div>
  );
};
