import React from 'react';
import { TextImageLayoutSchema } from '../schemas';
import { AnimatedText } from '../primitives';
import { interpolate, useCurrentFrame, Img } from 'remotion';

export const TextImageSplit: React.FC<TextImageLayoutSchema> = ({
  title,
  description,
  imageSrc,
  theme = { primaryColor: '#4d94ff', secondaryColor: '#1a1a2e', accentColor: '#ff4d4d', backgroundColor: '#0f0f13', textColor: '#ffffff' }
}) => {
  const frame = useCurrentFrame();
  const imageOpacity = interpolate(frame - 40, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const imageScale = interpolate(frame - 40, [0, 60], [1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ flex: 1, backgroundColor: theme.backgroundColor, display: 'flex', alignItems: 'center', padding: '80px', color: theme.textColor, width: '100%', height: '100%', gap: '80px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <AnimatedText text={title} style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '30px', lineHeight: 1.2 }} delay={10} />
        <AnimatedText text={description} style={{ fontSize: '36px', opacity: 0.8, lineHeight: 1.5 }} delay={20} duration={30} />
      </div>
      
      <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imageSrc ? (
          <div style={{ width: '100%', height: '80%', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', opacity: imageOpacity }}>
            <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${imageScale})` }} />
          </div>
        ) : (
          <div style={{ width: '100%', height: '80%', borderRadius: '32px', backgroundColor: theme.secondaryColor, border: `2px dashed rgba(255,255,255,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: imageOpacity }}>
            <div style={{ fontSize: '24px', opacity: 0.5 }}>No Image Provided</div>
          </div>
        )}
      </div>
    </div>
  );
};
