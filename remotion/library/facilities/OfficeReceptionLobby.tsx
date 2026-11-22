import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface OfficeReceptionLobbyProps {
  companyName?: string;
  visitorsToday?: number;
  conciergeName?: string;
  className?: string;
}

export const OfficeReceptionLobby: React.FC<OfficeReceptionLobbyProps> = ({
  companyName = 'CloudScale Dynamics Corp',
  visitorsToday = 64,
  conciergeName = 'Concierge Desk A',
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-slate-700 text-white font-bold border border-white/20">
          GROUND FLOOR RECEPTION
        </span>
        <span className="text-white/40">VISITOR ENTRYWAY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-base font-bold text-white">{companyName}</div>
            <div className="text-xs text-white/50 font-mono">{conciergeName} • Main Lobby West</div>
          </div>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/40">
            PASSPORT & ID VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">OPTICAL TURNSTILES</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">4 Lanes SpeedGate</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">VISITORS LOGGED</div>
            <div className="text-xs font-bold text-white mt-1">{visitorsToday} Badges Issued</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">DIGITAL SIGN-IN</div>
            <div className="text-xs font-bold text-sky-400 mt-1">Envoy iPad Kiosks</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>HOST AUTO-SMS NOTIFICATIONS: ACTIVE</span>
          <span className="text-white/80 font-mono">LOBBY COFFEE BAR: COMPLIMENTARY</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>SECURITY ESCORT PROTOCOL: TIER 2</span>
        <span>BARCODE BADGE SCANNER: ON</span>
      </div>
    </div>
  );
};
