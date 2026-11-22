import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PrivateLinkVPCEndpointProps {
  vpcEndpointId?: string;
  dnsEntry?: string;
  trafficEncrypted?: boolean;
  className?: string;
}

export const PrivateLinkVPCEndpoint: React.FC<PrivateLinkVPCEndpointProps> = ({
  vpcEndpointId = "vpce-0a91fbc42d9182",
  dnsEntry = "vpce-0a91fbc42d9182-xyz.database.us-east-1.vpce.amazonaws.com",
  trafficEncrypted = true,
  className = ""
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      className={`p-6 rounded-2xl bg-zinc-950/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-md ${className}`}
      style={{ transform: `scale(${entrance})`, opacity: entrance }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 font-mono">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            AWS PRIVATELINK (VPC ENDPOINT)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/20 font-bold">
          100% PRIVATE ENCLAVE
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3 overflow-hidden text-ellipsis">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Private DNS Entry</div>
        <code className="text-emerald-300 text-[11px]">{dnsEntry}</code>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Endpoint ID: {vpcEndpointId}</span>
        <span className="text-emerald-400 font-bold">Zero Public Gateway</span>
      </div>
    </div>
  );
};
