import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BoutiqueShowroomProps {
  collectionName?: string;
  designer?: string;
  vipLounge?: boolean;
  className?: string;
}

export const BoutiqueShowroom: React.FC<BoutiqueShowroomProps> = ({
  collectionName = 'Haute Couture Spring 2026',
  designer = 'Maison Valmont',
  vipLounge = true,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
          LUXURY BOUTIQUE SHOWROOM
        </span>
        <span className="text-white/40">VIP APPAREL</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-mono text-rose-400 font-bold uppercase">{designer}</div>
            <div className="text-base font-extrabold text-white">{collectionName}</div>
          </div>
          {vipLounge && (
            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/40">
              ★ PRIVATE SALON
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 my-3">
          <div className="flex-1 p-3 bg-zinc-950 rounded-lg border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">SPOTLIGHT MANNEQUINS</div>
            <div className="text-sm font-bold text-white mt-0.5">8 Center Runway Displays</div>
          </div>
          <div className="flex-1 p-3 bg-zinc-950 rounded-lg border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">FITTING SUITES</div>
            <div className="text-sm font-bold text-rose-300 mt-0.5">4 Smart Mirrors</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>APPOINTMENT-ONLY ACCESS</span>
          <span className="text-rose-400 font-mono">CONCIERGE ON DUTY</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>LIGHTING: 3000K WARM GALLERY SPEC</span>
        <span>SECURITY: DUAL RFID ESCORT</span>
      </div>
    </div>
  );
};
