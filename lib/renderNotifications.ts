/**
 * lib/renderNotifications.ts
 *
 * Handles:
 * 1. Notification sound chime (Web Audio API bell/chime with high audibility).
 * 2. Browser Desktop Notification (works across background tabs and other apps).
 * 3. Tab title flashing (e.g. "🔔 (1) Video Ready! - Itnavideo").
 * 4. Active render persistence in localStorage (resilient across tab refresh, tab closing, or switching apps).
 */

export interface ActiveRenderRecord {
  renderId: string;
  bucketName: string;
  userId: string;
  mode: string;
  title: string;
  design?: string;
  startedAt: number;
  estimatedSeconds?: number;
}

const ACTIVE_RENDER_KEY_PREFIX = 'itnavideo_active_render_';
let titleFlashInterval: ReturnType<typeof setInterval> | null = null;
let originalDocumentTitle: string = '';

/**
 * Ask browser for notification permission when user triggers a render.
 */
export async function requestRenderNotificationPermission(): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  try {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  } catch {
    // Some browsers reject permission request if not directly in user gesture
  }
}

/**
 * Plays a bright, pleasant multi-tone success chime (D5 -> G5 -> B5 -> D6 bell chord).
 * Uses Web Audio API oscillator synthesis so no external audio files are required.
 */
export function playRenderSuccessSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Melodic ascending chime frequencies (D5, G5, B5, D6)
    const notes = [
      { freq: 587.33, start: 0.00, dur: 0.35, gain: 0.35 },
      { freq: 783.99, start: 0.12, dur: 0.40, gain: 0.40 },
      { freq: 987.77, start: 0.24, dur: 0.45, gain: 0.45 },
      { freq: 1174.66, start: 0.36, dur: 0.80, gain: 0.50 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.5, ctx.currentTime);
    masterGain.connect(ctx.destination);

    notes.forEach(({ freq, start, dur, gain: noteGainValue }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(noteGainValue, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
  } catch (err) {
    console.warn('[renderNotifications] Audio chime blocked or unavailable:', err);
  }
}

/**
 * Triggers all completion alerts:
 * 1. Sound chime
 * 2. Mobile vibration (if supported)
 * 3. OS Desktop notification (if permission granted)
 * 4. Tab title flash
 */
export function triggerRenderCompletionNotification(title?: string, outputFile?: string): void {
  if (typeof window === 'undefined') return;

  // 1. Play chime
  playRenderSuccessSound();

  // 2. Vibrate mobile devices
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  } catch {
    // Ignore vibration failure
  }

  // 3. Desktop Notification (works across background tabs and other applications)
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification('🎉 Video Ready! - Itnavideo', {
        body: `"${title || 'Your AI Video'}" has finished rendering! Click here to download or preview.`,
        icon: '/favicon.ico',
        tag: 'itnavideo-video-ready',
        requireInteraction: true,
      });

      notif.onclick = () => {
        window.focus();
        if (outputFile) {
          window.location.hash = 'projects';
        }
        notif.close();
      };
    }
  } catch (err) {
    console.warn('[renderNotifications] Desktop notification failed:', err);
  }

  // 4. Tab title alert flash (if tab is hidden / user is on another tab)
  startTabTitleFlash(title);
}

/**
 * Flashes the tab title so user sees it even when reading another tab.
 */
function startTabTitleFlash(title?: string): void {
  if (typeof document === 'undefined') return;
  if (titleFlashInterval) clearInterval(titleFlashInterval);

  if (!originalDocumentTitle) {
    originalDocumentTitle = document.title || 'Itnavideo';
  }

  let showAlt = true;
  const alertTitle = `🔔 (1) Video Ready! - ${title || 'Itnavideo'}`;

  titleFlashInterval = setInterval(() => {
    document.title = showAlt ? alertTitle : originalDocumentTitle;
    showAlt = !showAlt;
  }, 1200);

  // Clear flash when user returns to window
  const clearOnFocus = () => {
    if (titleFlashInterval) {
      clearInterval(titleFlashInterval);
      titleFlashInterval = null;
    }
    if (originalDocumentTitle) {
      document.title = originalDocumentTitle;
    }
    window.removeEventListener('focus', clearOnFocus);
  };

  window.addEventListener('focus', clearOnFocus);
}

/**
 * Active render persistence in localStorage
 */
export function saveActiveRender(userId: string, record: ActiveRenderRecord): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${ACTIVE_RENDER_KEY_PREFIX}${userId}`, JSON.stringify(record));
  } catch {
    // Ignore storage errors
  }
}

export function loadActiveRender(userId: string): ActiveRenderRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`${ACTIVE_RENDER_KEY_PREFIX}${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.renderId === 'string' && parsed.renderId) {
      // Don't restore jobs older than 6 hours
      if (Date.now() - (parsed.startedAt || 0) < 6 * 60 * 60 * 1000) {
        return parsed as ActiveRenderRecord;
      }
    }
    clearActiveRender(userId);
    return null;
  } catch {
    return null;
  }
}

export function clearActiveRender(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(`${ACTIVE_RENDER_KEY_PREFIX}${userId}`);
  } catch {
    // Ignore
  }
}
