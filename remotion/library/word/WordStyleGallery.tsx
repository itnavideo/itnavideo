import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WordStyleGalleryProps {
  selectedStyle?: string;
  themeFont?: string;
}

export const WordStyleGallery: React.FC<WordStyleGalleryProps> = (props) => {
  const {
    selectedStyle = "Heading 1",
    themeFont = "Aptos / Aptos Display",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const styles = [
    { name: 'Normal', preview: 'AaBbCcDd', desc: 'Calibri 11pt, Regular' },
    { name: 'No Spacing', preview: 'AaBbCcDd', desc: 'Calibri 11pt, 0pt after' },
    { name: 'Heading 1', preview: 'AaBbCc', desc: 'Aptos Display 18pt, Bold, Blue' },
    { name: 'Heading 2', preview: 'AaBbCc', desc: 'Aptos 14pt, SemiBold' },
    { name: 'Title', preview: 'AaBb', desc: 'Aptos 28pt, Primary Accent' },
    { name: 'Intense Quote', preview: '“AaBbCc”', desc: 'Italic 11pt, Left Accent Border' },
  ];

  const activeIndex = Math.min(Math.floor(frame / 40) % styles.length, styles.length - 1);
  const activeName = styles[activeIndex]?.name || selectedStyle;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Word Style Gallery</h3>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Theme Font Set: {themeFont}</span>
        </div>
        <span style={{ fontSize: '11px', backgroundColor: '#1e293b', padding: '4px 10px', borderRadius: '4px', border: '1px solid #334155' }}>
          Change Styles ▾
        </span>
      </div>

      {/* Grid of Styles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        flex: 1,
      }}>
        {styles.map((st) => {
          const isSelected = st.name === activeName;
          return (
            <div key={st.name} style={{
              backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.15)' : '#1e293b',
              border: isSelected ? '2px solid #3b82f6' : '1px solid #334155',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: isSelected ? '#60a5fa' : '#cbd5e1' }}>
                {st.name}
              </div>
              <div style={{
                fontSize: st.name === 'Title' ? '22px' : '16px',
                fontWeight: st.name.includes('Heading') || st.name === 'Title' ? 700 : 400,
                color: isSelected ? '#ffffff' : '#94a3b8',
                textAlign: 'center',
                margin: '8px 0',
              }}>
                {st.preview}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>
                {st.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
