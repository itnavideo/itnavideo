/**
 * Render Notification & Audio Chime System for Itnavideo Studio
 * Provides Web Notification permissions, Native System Tray alerts, Audio Chimes, and Auto Downloads.
 */

/**
 * Request Web Notification permission when user triggers render
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'default') {
    try {
      return await Notification.requestPermission();
    } catch {
      return Notification.permission;
    }
  }

  return Notification.permission;
}

/**
 * Sends a native OS/Browser System Tray Notification on 1080p render completion
 */
export function sendRenderCompleteNotification({
  title = 'Download Complete! 🎉',
  body = 'Aapki 1080p Full HD video render ho chuki hai. Click to view & download.',
  outputUrl,
  onNotificationClick,
}: {
  title?: string;
  body?: string;
  outputUrl?: string;
  onNotificationClick?: () => void;
}): Notification | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/icons/logo-192.png',
        badge: '/icons/badge-72.png',
        tag: 'render-complete',
        silent: false,
      });

      notification.onclick = () => {
        window.focus();
        if (onNotificationClick) {
          onNotificationClick();
        } else if (outputUrl) {
          window.open(outputUrl, '_blank');
        }
      };

      return notification;
    } catch {
      // Silently catch notification construct restrictions
    }
  }

  return null;
}

/**
 * Plays a short, crisp celebration chime (audio cue) using Web Audio API synth
 */
export function playRenderSuccessSound(): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Try playing static audio chime file if available
    const staticAudio = new Audio('/sounds/notification-chime.mp3');
    staticAudio.play().catch(() => {
      // Fallback to high-precision Web Audio API dual-tone chime
      playSynthesizedChime();
    });
  } catch {
    playSynthesizedChime();
  }
}

/**
 * Fallback Web Audio API Synthesizer Chime
 * Dual-tone pleasant chime: E5 (659.25Hz) -> B5 (987.77Hz)
 */
function playSynthesizedChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Tone 1: E5
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Tone 2: B5 (high chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.1);
    gain2.gain.setValueAtTime(0.001, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.8);
  } catch {
    // Ignore autoplay errors
  }
}

/**
 * Triggers a direct browser file download for active tab
 */
export async function triggerAutoDownload(url: string, filename: string): Promise<void> {
  if (typeof window === 'undefined' || !url) return;

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'itnavideo-export.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank');
  }
}
