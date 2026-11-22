import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SSLTLSEncryptionInTransitProps {
  tlsVersion?: string;
  cipherSuite?: string;
  sslMode?: string;
  certExpiryDays?: number;
  className?: string;
}

export const SSLTLSEncryptionInTransit: React.FC<SSLTLSEncryptionInTransitProps> = ({
  tlsVersion = "TLSv1.3",
  cipherSuite = "TLS_AES_256_GCM_SHA384",
  sslMode = "verify-full (mTLS)",
  certExpiryDays = 84,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-sky-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            ENCRYPTION IN-TRANSIT (mTLS)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/20 font-bold">
          {tlsVersion}
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs mb-3">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase">SSL Verification Mode</div>
            <div className="text-sky-400 font-bold mt-0.5">{sslMode}</div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-zinc-300">CA Verified</span>
        </div>

        <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Negotiated Cipher Suite</div>
          <code className="text-emerald-400">{cipherSuite}</code>
        </div>
      </div>

      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
        <span>Client Certificate Valid</span>
        <span className="text-sky-300">{certExpiryDays} Days Until Renewal</span>
      </div>
    </div>
  );
};
