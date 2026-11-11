'use client';

import React, { useEffect, useRef } from 'react';
import InteractiveRenderEngine, { type JobStatus, type Mode } from '@/components/render/InteractiveRenderEngine';
import {
  requestNotificationPermission,
  sendRenderCompleteNotification,
  playRenderSuccessSound,
  triggerAutoDownload,
} from '@/lib/renderNotifications';

export interface RenderProgressModalProps {
  isOpen: boolean;
  mode: Mode;
  status?: JobStatus | null;
  title?: string;
  fileName?: string;
  autoDownload?: boolean;
  onRetry?: () => void;
  onReset?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function RenderProgressModal({
  isOpen,
  mode,
  status,
  title = 'ItnaVideo Export',
  fileName,
  autoDownload = true,
  onRetry,
  onReset,
  onCancel,
  onClose,
}: RenderProgressModalProps) {
  const hasTriggeredRef = useRef<string | null>(null);
  const safeStatus: JobStatus = status || { state: 'idle' };

  // 1. Request Notification permission on render start
  useEffect(() => {
    if (isOpen && (safeStatus.state === 'starting' || safeStatus.state === 'rendering')) {
      requestNotificationPermission().catch(() => { });
    }
  }, [isOpen, safeStatus.state]);

  // 2. Trigger System Tray Notification, Audio Chime, and Auto-Download when ready
  useEffect(() => {
    const isReady = safeStatus.state === 'ready' || Boolean(safeStatus.outputFile);
    const renderId = safeStatus.jobId || safeStatus.outputFile || 'ready-render';

    if (isOpen && isReady && hasTriggeredRef.current !== renderId) {
      hasTriggeredRef.current = renderId;

      // Play short celebration chime audio
      playRenderSuccessSound();

      // Trigger System Tray Notification
      sendRenderCompleteNotification({
        title: 'Download Ready!',
        body: `Your 1080p Full HD video (${title}) has finished rendering. Click to view and download.`,
        outputUrl: safeStatus.outputFile,
        onNotificationClick: () => {
          if (safeStatus.outputFile) {
            window.open(safeStatus.outputFile, '_blank');
          }
        },
      });

      // Auto-download file if enabled and output URL is available
      if (autoDownload && safeStatus.outputFile) {
        const downloadName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-1080p.mp4`;
        triggerAutoDownload(safeStatus.outputFile, downloadName).catch(() => {});
      }
    }
  }, [isOpen, safeStatus.state, safeStatus.outputFile, safeStatus.jobId, title, autoDownload]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl">
        <InteractiveRenderEngine
          mode={mode}
          status={safeStatus}
          title={title}
          fileName={fileName}
          onRetry={onRetry || (() => { })}
          onReset={onReset || onClose || (() => { })}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

export default RenderProgressModal;
