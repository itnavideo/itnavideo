import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface PharmacyDispensaryProps {
  pharmacyName?: string;
  prescriptionsFilled?: number;
  className?: string;
}

export const PharmacyDispensary: React.FC<PharmacyDispensaryProps> = ({
  pharmacyName = 'Apex Care Clinical Pharmacy',
  prescriptionsFilled = 380,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center space-x-1.5">
          <span className="text-emerald-400 font-black">✚</span>
          <span>PHARMACY DISPENSARY</span>
        </span>
        <span className="text-white/40">LICENSED DISPENSARY</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">{pharmacyName}</div>
            <div className="text-xs text-emerald-400/80 font-mono">Controlled Substances Vault Sealed</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-mono">SCRIPTS TODAY</div>
            <div className="text-lg font-bold font-mono text-white">{prescriptionsFilled} Filled</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">ROBOTIC DISPENSER</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">Parata Max Active</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">REFRIGERATED MEDS</div>
            <div className="text-xs font-bold text-sky-400 mt-1">3.8°C Monitored</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">DRUG INTERACTIONS</div>
            <div className="text-xs font-bold text-teal-400 mt-1">0 Alerts</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>BARCODE VERIFICATION: 100% SCAN</span>
          <span className="text-emerald-400 font-mono">PHARMACIST ON DUTY</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>DEA LICENSE: VERIFIED</span>
        <span>DRIVE-THRU PRESCRIPTION WINDOW: OPEN</span>
      </div>
    </div>
  );
};
