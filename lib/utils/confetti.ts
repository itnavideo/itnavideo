import confetti from 'canvas-confetti';

/**
 * Fires a dual-cannon celebratory confetti blast for new user signups.
 */
export const fireSignupCelebration = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#FF6D00', '#FF8F00', '#FFA726', '#FFFFFF', '#10B981', '#6366F1'];

  // Left & Right dual cannon celebration
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
      zIndex: 9999,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  })();
};
