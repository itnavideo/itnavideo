import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DatabaseEventBridgeNotificationProps {
  eventSource?: string;
  eventType?: string;
  targetSubscriber?: string;
  className?: string;
}

export const DatabaseEventBridgeNotification: React.FC<DatabaseEventBridgeNotificationProps> = ({
  eventSource = "aws.rds.cluster",
  eventType = "RDS-EVENT-0073 (Failover Completed)",
  targetSubscriber = "Slack Alert Webhook + PagerDuty",
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
            EVENT NOTIFICATION (EVENTBRIDGE)
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          Pub/Sub Bus
        </span>
      </div>

      <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs mb-3">
        <div className="text-[10px] text-zinc-500 uppercase mb-0.5">Event Signature</div>
        <code className="text-sky-300">{eventType}</code>
      </div>

      <div className="text-[10px] font-mono text-zinc-400 flex justify-between">
        <span>Source: {eventSource}</span>
        <span className="text-emerald-400 font-bold">{targetSubscriber}</span>
      </div>
    </div>
  );
};
