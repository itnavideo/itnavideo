import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface BankBranchVaultProps {
  branchCode?: string;
  vaultClass?: string;
  depositBoxes?: number;
  className?: string;
}

export const BankBranchVault: React.FC<BankBranchVaultProps> = ({
  branchCode = 'COMMERCIAL BANK BRANCH #402',
  vaultClass = 'Class 3 Heavy Reinforced Steel & Concrete',
  depositBoxes = 1200,
  className = '',
}) => {
  const frame = useCurrentFrame();

  return (
    <div className={"w-full h-full p-6 bg-zinc-950 border border-white/10 rounded-2xl text-white font-sans flex flex-col justify-between " + className}>
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
          FINANCIAL VAULT & BANK BRANCH
        </span>
        <span className="text-white/40">{branchCode}</span>
      </div>

      <div className="flex-1 my-4 bg-zinc-900 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <div className="text-sm font-bold text-white">High-Security Vault & Deposit Repository</div>
          <div className="text-xs text-amber-400 font-mono">{vaultClass}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-2">
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">TIMELOCK STATUS</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">Dual Custody Timed</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">SAFE DEPOSIT BOXES</div>
            <div className="text-xs font-bold text-white mt-1">{depositBoxes} Secured</div>
          </div>
          <div className="p-2.5 bg-zinc-950 rounded border border-white/10 text-center">
            <div className="text-[10px] text-white/40 font-mono">TELLER WINDOWS</div>
            <div className="text-xs font-bold text-amber-300 mt-1">6 Bulletproof Bays</div>
          </div>
        </div>

        <div className="text-xs text-white/60 flex justify-between pt-2 border-t border-white/10">
          <span>SEISMIC VIBRATION SENSOR: ARMED</span>
          <span className="text-emerald-400 font-mono">CASH RESERVES AUDITED</span>
        </div>
      </div>

      <div className="text-xs font-mono text-white/40 flex justify-between">
        <span>ATM VESTIBULE: 24/7 ENCRYPTED ACCESS</span>
        <span>CENTRAL POLICE DISPATCH TIED</span>
      </div>
    </div>
  );
};
