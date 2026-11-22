import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleSlidesPresentationDeckProps {
  presentationTitle?: string;
  slideNumber?: number;
  totalSlides?: number;
  themeColor?: string;
}

export const GoogleSlidesPresentationDeck: React.FC<GoogleSlidesPresentationDeckProps> = (props) => {
  const {
    presentationTitle = "Itnavideo Investor Pitch Deck Q4",
    slideNumber = 4,
    totalSlides = 18,
    themeColor = "#F4B400",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f1f3f4',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '30px', backgroundColor: themeColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '16px' }}>📽️</div>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>{presentationTitle}</span>
        </div>
        <button style={{ backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '18px', padding: '6px 18px', fontSize: '12px', fontWeight: 700 }}>
          ▶ Slideshow
        </button>
      </div>

      {/* 16:9 Slide Canvas with Sidebar Filmstrip */}
      <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
        {/* Thumbnail Filmstrip */}
        <div style={{ width: '120px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              height: '60px',
              border: s === slideNumber ? '2px solid #f4b400' : '1px solid #dadce0',
              padding: '6px',
              fontSize: '10px',
              color: '#5f6368',
            }}>
              Slide {s}
            </div>
          ))}
        </div>

        {/* Active Center Slide */}
        <div style={{
          flex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '36px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ width: '36px', height: '4px', backgroundColor: '#f4b400', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#202124', margin: '0 0 8px 0' }}>The AI Video Revolution</h2>
            <p style={{ fontSize: '14px', color: '#5f6368', margin: 0 }}>
              Automating 9:16 vertical shorts and 16:9 studio video production using cloud Remotion and speech intelligence.
            </p>
          </div>
          <div style={{ fontSize: '11px', color: '#9aa0a6', textAlign: 'right' }}>
            Slide {slideNumber} of {totalSlides}
          </div>
        </div>
      </div>
    </div>
  );
};
