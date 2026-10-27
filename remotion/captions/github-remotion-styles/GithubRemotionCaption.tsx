import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CaptionSegment} from '../../types/subtitles';

type LibraryStyle = 'flame-gradient' | 'spectrum-shift' | 'chromatic-depth' | 'typewriter-reveal' | 'letter-wave' | 'soft-focus';

const STYLE_NAMES: Record<string, LibraryStyle> = {
  'Flame Gradient': 'flame-gradient',
  'Spectrum Shift': 'spectrum-shift',
  'Chromatic Depth': 'chromatic-depth',
  'Typewriter Reveal': 'typewriter-reveal',
  'Letter Wave': 'letter-wave',
  'Soft Focus': 'soft-focus',
};

export const isGithubRemotionCaptionStyle = (name?: string) => Boolean(name && STYLE_NAMES[name]);

export const GithubRemotionCaption: React.FC<{captions: CaptionSegment[]; styleName: string; position?: 'top' | 'center' | 'bottom'}> = ({captions, styleName, position = 'bottom'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentTime = frame / fps;
  const caption = captions.find((item) => currentTime >= item.start && currentTime < item.end);
  if (!caption) return null;
  const localFrame = Math.max(0, frame - Math.round(caption.start * fps));
  const duration = Math.max(1, Math.round((caption.end - caption.start) * fps));
  const enter = spring({frame: localFrame, fps, config: {damping: 18, stiffness: 260, mass: 0.65}, from: 0.82, to: 1});
  const progress = interpolate(localFrame, [0, Math.min(8, duration)], [0, 1], {extrapolateRight: 'clamp'});
  const variant = STYLE_NAMES[styleName];
  const placement: React.CSSProperties = position === 'top' ? {top: '18%'} : position === 'center' ? {top: '50%', transform: 'translateY(-50%)'} : {bottom: '23%'};
  const base: React.CSSProperties = {position: 'absolute', left: '7%', right: '7%', ...placement, textAlign: 'center', fontSize: '5.4vmin', lineHeight: 1.12, fontWeight: 900, color: '#fff', transform: `${position === 'center' ? 'translateY(-50%) ' : ''}scale(${enter})`, opacity: progress, overflowWrap: 'anywhere'};
  let style: React.CSSProperties = base;
  if (variant === 'flame-gradient') style = {...base, color: 'transparent', backgroundImage: `linear-gradient(90deg,hsl(${interpolate(frame,[0,45],[8,45],{extrapolateRight:'extend'})} 100% 54%),#ffd166,#ff5722)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', filter: 'drop-shadow(0 3px 10px #6f1d1b)'};
  if (variant === 'spectrum-shift') style = {...base, color: `hsl(${(frame * 5) % 360} 95% 66%)`, textShadow: '0 3px 12px #000, 0 0 20px currentColor'};
  if (variant === 'chromatic-depth') style = {...base, color: '#f8fafc', textShadow: '-3px 0 #ff3158, 3px 0 #00e5ff, 0 5px 18px #000', letterSpacing: '.025em'};
  if (variant === 'typewriter-reveal') style = {...base, fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontWeight: 700, clipPath: `inset(0 ${100 - progress * 100}% 0 0)`, textShadow: '0 3px 12px #000'};
  if (variant === 'letter-wave') style = {...base, textShadow: '0 4px 14px #000'};
  if (variant === 'soft-focus') style = {...base, fontFamily: 'Georgia, serif', fontWeight: 600, letterSpacing: '.015em', filter: `blur(${interpolate(localFrame,[0,6],[3,0],{extrapolateRight:'clamp'})}px)`, textShadow: '0 3px 16px #000'};
  if (variant === 'letter-wave') {
    const phase = frame / 5;
    return <div style={style}>{caption.text.split('').map((char, index) => <span key={`${index}-${char}`} style={{display:'inline-block', transform:`translateY(${Math.sin(phase + index * .45) * 5}px)`}}>{char === ' ' ? '\u00a0' : char}</span>)}</div>;
  }
  return <div style={style}>{caption.text}</div>;
};
