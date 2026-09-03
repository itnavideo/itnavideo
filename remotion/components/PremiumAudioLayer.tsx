import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';

export type PremiumSoundCueType =
  | 'soft-click'
  | 'soft-pop'
  | 'pop-medium'
  | 'pop-strong'
  | 'whoosh'
  | 'air-rush'
  | 'swipe'
  | 'ding'
  | 'cash'
  | 'coin-drop'
  | 'typing'
  | 'paper'
  | 'page-flip'
  | 'warning'
  | 'rise'
  | 'hit-soft'
  | 'hit-medium'
  | 'hit-strong'
  | 'bass-drop'
  | 'cinematic-boom'
  | 'data-pulse'
  | 'data-scan'
  | 'digital-beep'
  | 'chime';

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
  'soft-click': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939814/soft-click_q5a67c.wav',
  'soft-pop': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939716/soft-pop_rakwkr.mp3',
  'pop-medium': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939810/pop-medium_pper0p.mp3',
  'pop-strong': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939811/pop-strong_hjdqas.mp3',
  whoosh: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939824/whoosh-short_rfopag.wav',
  'air-rush': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939786/air-rush_cy9opg.wav',
  swipe: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939818/swipe-right_kgvhek.wav',
  ding: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093499/ding-5_kovgrw.mp3',
  cash: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939789/cash-register_ugloom.wav',
  'coin-drop': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939791/coin-drop-finance_roxrte.wav',
  typing: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939821/typing-fast_itr1th.wav',
  paper: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093548/paper-slide_fnjqc9.mp3',
  'page-flip': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093547/page-flip_v5jazi.mp3',
  warning: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939823/warning-beep_aqvyfj.wav',
  rise: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939821/victory-rise_beerfs.wav',
  'hit-soft': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939801/hit-soft_xvsxlu.wav',
  'hit-medium': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939800/hit-medium_etbaw9.wav',
  'hit-strong': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939801/hit-strong_xutgaw.mp3',
  'bass-drop': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093466/bass-drop_sn3ngm.mp3',
  'cinematic-boom': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939790/cinematic-boom_usu3sy.wav',
  'data-pulse': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939795/data-pulse_wyffxf.wav',
  'data-scan': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939795/data-scan_ofyz0z.wav',
  'digital-beep': 'https://res.cloudinary.com/dhouh9idx/video/upload/v1787939795/digital-beep_qmdtyh.wav',
  chime: 'https://res.cloudinary.com/dhouh9idx/video/upload/v1788093483/chime_o1pvom.mp3',
};

const resolveAudioSrc = (src?: string) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  try {
    return staticFile(src.replace(/^\/+/, ''));
  } catch {
    return '';
  }
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
        const src = resolveAudioSrc(cueSrc(cue.type));
        if (!src) return null;
        return (
          <Sequence
            key={`${cue.type || 'cue'}-${from}-${index}`}
            from={from}
            durationInFrames={Math.min(durationInFramesForCue, durationInFrames - from)}
          >
            <Audio
              src={src}
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
