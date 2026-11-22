import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

export interface EncryptionVisualizationProps {
  title?: string;
  plaintext?: string;
  cipherAlgorithm?: string;
  hashDigest?: string;
  className?: string;
}

export const EncryptionVisualization: React.FC<EncryptionVisualizationProps> = ({
  title = 'AES-256 GCM ASYMMETRIC ENCRYPTION',
  plaintext = 'CONFIDENTIAL RENDER TOKEN: sec_99f2e1da7b1f284b',
  cipherAlgorithm = 'CIPHER: AES-256-GCM + RSA-4096 PUBKEY',
  hashDigest = 'SHA-256: 79bbff190d956be3d71fccd291da8e3060c0d1c0',
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 1, stiffness: 80 },
  });

  // Animated cipher scramble text simulation
  const scrambleProgress = Math.min(1, frame / (fps * 2));
  const chars = '0123456789ABCDEFabcdef!@#$%^&*()';
  const scrambled = plaintext
    .split('')
    .map((c, i) => {
      if (Math.random() < scrambleProgress) {
        return chars[Math.floor(Math.sin(frame + i) * 1000) % chars.length];
      }
      return c;
    })
    .join('');

  return (
    <div
      className={`relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none overflow-hidden ${className}`}
      style={{ opacity: entry }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            CRYPTOGRAPHIC ENGINE
          </div>
          <h3 className="text-base sm:text-xl font-serif font-black tracking-wide text-zinc-100 uppercase">
            {title}
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold">● ENCRYPTED</span>
      </div>

      {/* Plaintext to Cipher Scramble */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
            PLAINTEXT INPUT STREAM
          </span>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-300 mt-1">
            {plaintext}
          </div>
        </div>

        {/* Algorithm Middle Badge */}
        <div className="text-center">
          <span className="bg-zinc-900 border border-emerald-500/60 text-emerald-400 text-xs font-mono font-bold px-4 py-1.5 rounded-full inline-block shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            🔒 {cipherAlgorithm}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
            CIPHERTEXT PAYLOAD OUTPUT
          </span>
          <div className="bg-zinc-950 border border-emerald-900/60 rounded-lg p-3 text-xs font-mono text-emerald-400 break-all mt-1 shadow-inner">
            {scrambled}
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">
          DIGEST: <span className="text-amber-400">{hashDigest}</span>
        </div>
      </div>
    </div>
  );
};
