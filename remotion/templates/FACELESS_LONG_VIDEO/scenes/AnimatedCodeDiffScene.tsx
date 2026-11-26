import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { codeToHtml } from 'shiki';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface AnimatedDiffLine {
  lineNum?: number;
  type: 'add' | 'remove' | 'context';
  code: string;
}

export interface AnimatedCodeDiffSceneProps {
  heading?: string;
  filename?: string;
  language?: string;
  lines?: AnimatedDiffLine[];
  headingFont?: string;
  typographyFont?: string;
  palette?: BackgroundColorPalette;
}

const DEFAULT_DIFF_LINES: AnimatedDiffLine[] = [
  { lineNum: 12, type: 'context', code: 'export async function renderScene(jobId: string) {' },
  { lineNum: 13, type: 'remove', code: '  return await renderLocallyWithChromium(jobId);' },
  { lineNum: 14, type: 'add', code: '  return await dispatchAwsLambdaRender({ jobId, fps: 30 });' },
  { lineNum: 15, type: 'context', code: '}' },
];

/**
 * Shiki-powered animated code diff scene with staggered line reveals.
 */
export const AnimatedCodeDiffScene: React.FC<AnimatedCodeDiffSceneProps> = ({
  heading = 'Code Upgrade',
  filename = 'services/remotion/renderEngine.ts',
  language = 'typescript',
  lines = DEFAULT_DIFF_LINES,
  headingFont = 'Inter, sans-serif',
  typographyFont = 'Inter, sans-serif',
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const safeLines = lines.length > 0 ? lines : DEFAULT_DIFF_LINES;

  const [highlightedLines, setHighlightedLines] = useState<string[] | null>(null);
  const [handle] = useState<number>(() => delayRender('Shiki CodeDiff Highlighting'));

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      safeLines.map((l) =>
        codeToHtml(l.code || ' ', {
          lang: language,
          theme: 'github-dark',
        }).catch(() => '')
      )
    )
      .then((htmlList) => {
        if (!cancelled) setHighlightedLines(htmlList);
      })
      .finally(() => {
        continueRender(handle);
      });

    return () => {
      cancelled = true;
    };
  }, [safeLines, language, handle]);

  const cardSpring = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const additions = safeLines.filter((l) => l.type === 'add').length;
  const deletions = safeLines.filter((l) => l.type === 'remove').length;
  const isDark = palette?.isDark ?? false;
  const titleColor = palette?.textPrimary ?? (isDark ? '#FFFFFF' : '#0F172A');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 100px',
        opacity: cardSpring,
        transform: `translateY(${interpolate(cardSpring, [0, 1], [24, 0])}px)`,
      }}
    >
      {heading && (
        <h2
          style={{
            fontFamily: headingFont,
            fontSize: '44px',
            fontWeight: 900,
            color: titleColor,
            marginBottom: '26px',
            textAlign: 'center',
          }}
        >
          {heading}
        </h2>
      )}

      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          backgroundColor: '#0D1117',
          borderRadius: '24px',
          border: '1.5px solid rgba(255,255,255,0.12)',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
        }}
      >
        {/* Window Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: '#161B22',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27C93F' }} />
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: '#E6EDF3' }}>
              {filename}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '14px', fontFamily: 'monospace', fontSize: '18px', fontWeight: 800 }}>
            <span style={{ color: '#3FB950' }}>+{additions}</span>
            <span style={{ color: '#F85149' }}>-{deletions}</span>
          </div>
        </div>

        {/* Staggered Code Lines */}
        <div style={{ padding: '18px 0', fontFamily: typographyFont }}>
          {safeLines.map((line, idx) => {
            const lineProgress = spring({
              frame: Math.max(0, frame - idx * 5),
              fps,
              config: { damping: 16, stiffness: 140 },
            });
            const isAdd = line.type === 'add';
            const isRem = line.type === 'remove';
            const rowBg = isAdd
              ? 'rgba(46, 160, 67, 0.16)'
              : isRem
                ? 'rgba(248, 81, 73, 0.16)'
                : 'transparent';
            const gutterColor = isAdd ? '#3FB950' : isRem ? '#F85149' : '#6E7681';
            const html = highlightedLines?.[idx];

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 28px',
                  backgroundColor: rowBg,
                  borderLeft: `4px solid ${isAdd ? '#3FB950' : isRem ? '#F85149' : 'transparent'}`,
                  opacity: lineProgress,
                  transform: `translateX(${interpolate(lineProgress, [0, 1], [-18, 0])}px)`,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '22px',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ width: '54px', color: '#6E7681', fontSize: '18px', userSelect: 'none' }}>
                  {line.lineNum ?? idx + 1}
                </span>
                <span style={{ width: '30px', color: gutterColor, fontWeight: 900, userSelect: 'none' }}>
                  {isAdd ? '+' : isRem ? '-' : ' '}
                </span>
                {html ? (
                  <div
                    style={{ color: '#E6EDF3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    dangerouslySetInnerHTML={{
                      __html: html
                        .replace(/<pre[^>]*>/g, '<span>')
                        .replace(/<\/pre>/g, '</span>')
                        .replace(/background-color:[^;"]+;?/g, ''),
                    }}
                  />
                ) : (
                  <span style={{ color: isAdd ? '#AFF5B4' : isRem ? '#FFDCD7' : '#C9D1D9', whiteSpace: 'pre' }}>
                    {line.code}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

