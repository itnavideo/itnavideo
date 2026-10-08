'use client';

import React, { useEffect, useRef } from 'react';
import InteractiveRenderEngine, { JobStatus, Mode } from '@/components/render/InteractiveRenderEngine';
import {
  requestNotificationPermission,
  sendRenderCompleteNotification,
  playRenderSuccessSound,
  triggerAutoDownload,
} from '@/lib/renderNotifications';

export interface RenderProgressModalProps {
  isOpen: boolean;
  mode: Mode;
  status: JobStatus;
  title?: string;
  fileName?: string;
  autoDownload?: boolean;
  onRetry?: () => void;
  onReset?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function RenderProgressModal({
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

  // 1. Request Notification permission on render start
  useEffect(() => {
    if (isOpen && (status.state === 'starting' || status.state === 'rendering')) {
      requestNotificationPermission().catch(() => {});
    }
  }, [isOpen, status.state]);

  // 2. Trigger System Tray Notification, Audio Chime, and Auto-Download when ready
  useEffect(() => {
    const isReady = status.state === 'ready' || Boolean(status.outputFile);
    const renderId = status.jobId || status.outputFile || 'ready-render';

    if (isOpen && isReady && hasTriggeredRef.current !== renderId) {
      hasTriggeredRef.current = renderId;

      // Play short celebration chime audio
      playRenderSuccessSound();

      // Trigger System Tray Notification
      sendRenderCompleteNotification({
        title: 'Download Complete! 🎉',
        body: `Aapki 1080p Full HD video (${title}) render ho chuki hai. Click to view & download.`,
        outputUrl: status.outputFile,
        onNotificationClick: () => {
          if (status.outputFile) {
            window.open(status.outputFile, '_blank');
          }
        },
      });

      // Auto-download file if enabled and output URL is available
      if (autoDownload && status.outputFile) {
        const downloadName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-1080p.mp4`;
        triggerAutoDownload(status.outputFile, downloadName).catch(() => {});
      }
    }
  }, [isOpen, status.state, status.outputFile, status.jobId, title, autoDownload]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl">
        <InteractiveRenderEngine
          mode={mode}
          status={status}
          title={title}
          fileName={fileName}
          onRetry={onRetry || (() => {})}
          onReset={onReset || onClose || (() => {})}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
