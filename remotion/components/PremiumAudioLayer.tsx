import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';

export type PremiumSoundCueType =
  | 'soft-click'
  | 'soft-pop'
  | 'whoosh'
  | 'swipe'
  | 'ding'
  | 'cash'
  | 'typing'
  | 'paper'
  | 'warning'
  | 'rise';

export type PremiumSoundCue = {
  time?: number;
  type?: PremiumSoundCueType;
  volume?: number;
  durationSeconds?: number;
  ducking?: boolean;
  pan?: -1 | -0.5 | 0 | 0.5 | 1;
};

export type PremiumStyleLock = {
  styleId?: string;
  audioMix?: {
    ducking?: boolean;
    duckToVolume?: number;
    spatialPan?: boolean;
    duckAttackMs?: number;
    duckReleaseMs?: number;
  };
  ambience?: {
    src?: string;
    volume?: number;
  };
};

type PremiumAudioLayerProps = {
  soundCues?: PremiumSoundCue[];
  styleLock?: PremiumStyleLock;
  enabled?: boolean;
};

const SFX_PATHS: Record<PremiumSoundCueType, string> = {
  'soft-click': 'assets/reusable/sound-effects/soft-click.wav',
  'soft-pop': 'assets/reusable/sound-effects/pop-soft.wav',
  whoosh: 'assets/reusable/sound-effects/whoosh-short.wav',
  swipe: 'assets/reusable/sound-effects/swipe-right.wav',
  ding: 'assets/reusable/sound-effects/bell-ding.wav',
  cash: 'assets/reusable/sound-effects/cash-count.wav',
  typing: 'assets/reusable/sound-effects/typing-fast.wav',
  paper: 'assets/reusable/sound-effects/paper-turn.wav',
  warning: 'assets/reusable/sound-effects/warning-beep.wav',
  rise: 'assets/reusable/sound-effects/rise-sweep.wav',
};

const resolveAudioSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
};

const cueSrc = (type?: PremiumSoundCueType) => SFX_PATHS[type || 'soft-click'] || SFX_PATHS['soft-click'];

export const PremiumAudioLayer: React.FC<PremiumAudioLayerProps> = ({
  soundCues = [],
  styleLock,
  enabled = true,
}) => {
  const {fps, durationInFrames} = useVideoConfig();
  if (!enabled) return null;

  const ambience = styleLock?.ambience;
  const ambienceSrc = resolveAudioSrc(ambience?.src);
  const duckToVolume = Math.max(0.45, Math.min(1, Number(styleLock?.audioMix?.duckToVolume) || 0.72));
  const duckAttackFrames = Math.max(1, Math.round((Math.max(1, Number(styleLock?.audioMix?.duckAttackMs) || 5) / 1000) * fps));
  const duckReleaseFrames = Math.max(2, Math.round((Math.max(40, Number(styleLock?.audioMix?.duckReleaseMs) || 200) / 1000) * fps));

  return (
    <>
      {ambienceSrc ? (
        <Audio
          src={ambienceSrc}
          volume={(frame) => {
            const base = Math.max(0, Math.min(0.04, Number(ambience?.volume) || 0.02));
            const duckFactor = soundCues.reduce((lowest, cue) => {
              const cueFrame = Math.round(Number(cue.time || 0) * fps);
              const delta = frame - cueFrame;
              if (delta < -duckAttackFrames || delta > duckReleaseFrames) return lowest;
              const localDuck = delta < 0
                ? 1 - (1 - duckToVolume) * ((duckAttackFrames + delta) / duckAttackFrames)
                : duckToVolume + (1 - duckToVolume) * (delta / duckReleaseFrames);
              return Math.min(lowest, localDuck);
            }, 1);
            return base * duckFactor;
          }}
        />
      ) : null}

      {soundCues.slice(0, 24).map((cue, index) => {
        const from = Math.max(0, Math.round(Number(cue.time || 0) * fps));
        if (from >= durationInFrames) return null;
        const durationInFramesForCue = Math.max(3, Math.round(Number(cue.durationSeconds || 1.2) * fps));
        return (
          <Sequence
            key={`${cue.type || 'cue'}-${from}-${index}`}
            from={from}
            durationInFrames={Math.min(durationInFramesForCue, durationInFrames - from)}
          >
            <Audio
              src={resolveAudioSrc(cueSrc(cue.type))}
              volume={(frame) => {
                const local = frame - from;
                const fadeFrames = Math.max(2, Math.round(fps * 0.08));
                const fadeIn = Math.min(1, Math.max(0, local / fadeFrames));
                const fadeOut = Math.min(1, Math.max(0, (durationInFramesForCue - local) / fadeFrames));
                const duck = cue.ducking === false ? 1 : Math.min(1, duckToVolume + 0.16);
                return Math.max(0, Math.min(0.2, Number(cue.volume) || 0.1)) * Math.min(fadeIn, fadeOut) * duck;
              }}
            />
          </Sequence>
        );
      })}
    </>
  );
};
