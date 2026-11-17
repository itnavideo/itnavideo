/**
 * Master Platform Mode & Strategy Configuration
 *
 * Controls the temporary free access model, daily download limits,
 * and user feedback collection system. Designed for seamless future
 * re-introduction of paid plans without altering underlying billing code.
 */

export const PLATFORM_MODE_CONFIG = {
  /**
   * Temporary Free Access Strategy Flag
   * When true:
   * - Public pricing pages and links are hidden
   * - Feature paywalls are bypassed (all 15 video tools accessible for free)
   * - Users can generate and preview unlimited videos
   * - Downloads are limited to 2 per day per registered user
   */
  TEMPORARY_FREE_ACCESS: true,

  /**
   * Number of completed video downloads allowed per registered user per day
   */
  DAILY_FREE_DOWNLOAD_LIMIT: 2,

  /**
   * Daily reset timezone (India Standard Time: UTC+05:30)
   */
  DAILY_RESET_TIMEZONE: 'Asia/Kolkata',

  /**
   * Re-engagement and feedback prompts
   */
  ENABLE_POST_DOWNLOAD_FEEDBACK: true,
  ALLOW_UNLIMITED_PREVIEWS: true,
} as const;

/**
 * Returns today's date formatted as YYYY-MM-DD in Asia/Kolkata (IST) timezone.
 */
export function getTodayDateIST(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: PLATFORM_MODE_CONFIG.DAILY_RESET_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

/**
 * Calculates the exact timestamp (ISO string) when the daily allowance next resets
 * (12:00:00 AM IST on the next calendar day).
 */
export function getNextResetTimestampIST(date: Date = new Date()): {
  resetIso: string;
  secondsRemaining: number;
  formattedTime: string;
} {
  // Get current date string in IST
  const todayIST = getTodayDateIST(date);
  const [year, month, day] = todayIST.split('-').map(Number);

  // Tomorrow 00:00:00 in IST is UTC: IST - 5h30m
  // Construct tomorrow in UTC using year, month-1, day + 1, then subtract 5 hours 30 mins
  const tomorrowISTMidnightUTC = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));
  // Subtract 5.5 hours to convert IST midnight to UTC
  tomorrowISTMidnightUTC.setUTCMinutes(tomorrowISTMidnightUTC.getUTCMinutes() - 330);

  const nowMs = date.getTime();
  const resetMs = tomorrowISTMidnightUTC.getTime();
  const diffSec = Math.max(0, Math.floor((resetMs - nowMs) / 1000));

  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);

  return {
    resetIso: tomorrowISTMidnightUTC.toISOString(),
    secondsRemaining: diffSec,
    formattedTime: `${hours}h ${minutes}m`,
  };
}
