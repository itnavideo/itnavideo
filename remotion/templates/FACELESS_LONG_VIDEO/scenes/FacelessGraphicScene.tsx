import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { FacelessGraphicItem, SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

type Props = {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
};

function linesFor(label: string, max = 22) {
  const words = String(label || '').split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? line + ' ' + word : word;
  });
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function Label({ item, x, y, color, font, anchor = 'start' }: {
  item: FacelessGraphicItem;
  x: number;
  y: number;
  color: string;
  font: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontFamily={font} fontSize="28" fontWeight="750">
      {linesFor(item.label).map((line, index) => <tspan key={index} x={x} dy={index ? 34 : 0}>{line}</tspan>)}
    </text>
  );
}

export function FacelessGraphicScene({
  scene,
  headingFont = 'Montserrat, Inter, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = sceneFrame ?? frame;
  const reveal = spring({ frame: localFrame, fps, config: { damping: 18, mass: 0.8, stiffness: 115 } });
  const draw = interpolate(localFrame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const plan = scene.graphicPlan;
  const kind = plan?.kind || 'concept';
  const items = (plan?.items?.length ? plan.items : [{ label: scene.heading || 'Key idea' }]).slice(0, 5);
  const isDark = palette?.isDark ?? false;
  const ink = isDark ? '#F8FAFC' : '#0F172A';
  const muted = isDark ? '#94A3B8' : '#64748B';
  const hairline = isDark ? 'rgba(226,232,240,.17)' : 'rgba(15,23,42,.13)';
  const surface = isDark ? '#151E30' : '#F8FAFC';
  const orange = '#FF5722';
  const amber = '#FFA000';
  const emerald = '#10B981';
  const id = 'faceless-graphic-' + scene.sceneNumber;
  const title = plan?.title || scene.heading || 'Key insight';
  const valueItems = items.filter((item) => typeof item.value === 'number');
  const maxValue = Math.max(1, ...valueItems.map((item) => item.value || 0));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', color: ink, opacity: reveal }}>
      <div style={{ position: 'absolute', top: 76, left: 112, right: 112, zIndex: 2 }}>
        <div style={{ color: orange, fontFamily: bodyFont, fontWeight: 900, fontSize: 17, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {kind === 'allocation' ? 'MONEY BREAKDOWN' : kind === 'comparison' ? 'SIDE BY SIDE' : kind === 'sequence' ? 'HOW IT WORKS' : kind === 'metric' ? 'KEY NUMBER' : kind === 'growth' ? 'GROWTH OVER TIME' : 'VISUAL EXPLANATION'}
        </div>
        <div style={{ marginTop: 14, maxWidth: 1500, color: ink, fontFamily: headingFont, fontWeight: 900, fontSize: 58, lineHeight: 1.05, letterSpacing: '-0.035em' }}>
          {title}
        </div>
        {scene.supportingText ? <div style={{ marginTop: 12, maxWidth: 1200, color: muted, fontFamily: bodyFont, fontSize: 25, fontWeight: 600 }}>{scene.supportingText}</div> : null}
      </div>

      <svg viewBox="0 0 1720 660" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', width: 'calc(100% - 120px)', height: '64%', left: 60, bottom: 42, overflow: 'visible' }} role="img" aria-label={title}>
        <defs>
          <linearGradient id={id + '-warm'} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={orange} /><stop offset="1" stopColor={amber} />
          </linearGradient>
          <linearGradient id={id + '-cool'} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={orange} /><stop offset="1" stopColor={emerald} />
          </linearGradient>
        </defs>

        {kind === 'allocation' && items.map((item, index) => {
          const value = Math.max(0, item.value || 0);
          const y = 112 + index * 104;
          const entered = spring({ frame: Math.max(0, localFrame - index * 5), fps, config: { damping: 18, mass: 0.75, stiffness: 115 } });
          return (
            <g key={index} opacity={entered}>
              <Label item={item} x={80} y={y + 4} color={ink} font={bodyFont} />
              <text x="1620" y={y + 4} textAnchor="end" fill={orange} fontFamily={headingFont} fontSize="31" fontWeight="900">{item.displayValue || value}</text>
              <rect x="80" y={y + 25} width="1540" height="24" rx="12" fill={hairline} />
              <rect x="80" y={y + 25} width={1540 * (value / maxValue) * draw} height="24" rx="12" fill={'url(#' + id + '-warm)'} />
            </g>
          );
        })}

        {kind === 'comparison' && [items[0] || { label: 'First idea' }, items[1] || { label: 'Second idea' }].map((item, index) => {
          const x = index === 0 ? 100 : 920;
          const color = index === 0 ? orange : emerald;
          const entered = spring({ frame: Math.max(0, localFrame - index * 5), fps, config: { damping: 18, mass: 0.75, stiffness: 115 } });
          return (
            <g key={index} opacity={entered} transform={'translate(0 ' + interpolate(entered, [0, 1], [28, 0]) + ')'}>
              <rect x={x} y="90" width="700" height="430" rx="28" fill={surface} stroke={hairline} strokeWidth="2" />
              <rect x={x} y="90" width="700" height="8" rx="4" fill={color} />
              <circle cx={x + 350} cy="220" r="76" fill={color} fillOpacity=".12" stroke={color} strokeWidth="3" />
              <path d={'M ' + (x + 318) + ' 220 h 64 M ' + (x + 350) + ' 188 v 64'} stroke={color} strokeWidth="8" strokeLinecap="round" />
              <Label item={item} x={x + 350} y={354} color={ink} font={headingFont} anchor="middle" />
              {item.displayValue && <text x={x + 350} y="470" textAnchor="middle" fill={color} fontFamily={headingFont} fontSize="42" fontWeight="900">{item.displayValue}</text>}
            </g>
          );
        })}
        {kind === 'comparison' && <g><circle cx="860" cy="305" r="38" fill={ink} /><text x="860" y="315" textAnchor="middle" fill={isDark ? '#070B14' : '#FFFFFF'} fontFamily={headingFont} fontWeight="900" fontSize="23">VS</text></g>}

        {kind === 'sequence' && <g>
          <path d="M 170 300 H 1550" stroke={hairline} strokeWidth="10" strokeLinecap="round" />
          <path d="M 170 300 H 1550" stroke={'url(#' + id + '-warm)'} strokeWidth="6" strokeLinecap="round" strokeDasharray="1380" strokeDashoffset={1380 * (1 - draw)} />
          {items.map((item, index) => {
            const x = 170 + (index * 1380) / Math.max(1, items.length - 1);
            const entered = spring({ frame: Math.max(0, localFrame - index * 5), fps, config: { damping: 18, mass: 0.75, stiffness: 115 } });
            return <g key={index} opacity={entered}>
              <circle cx={x} cy="300" r="42" fill={surface} stroke={index % 2 ? amber : orange} strokeWidth="5" />
              <circle cx={x} cy="300" r="14" fill={'url(#' + id + '-warm)'} />
              <Label item={item} x={x} y={396} color={ink} font={bodyFont} anchor="middle" />
              <text x={x} y="220" textAnchor="middle" fill={muted} fontFamily={bodyFont} fontSize="18" fontWeight="800">STEP {index + 1}</text>
            </g>;
          })}
        </g>}

        {kind === 'metric' && <g>
          <circle cx="860" cy="326" r="206" fill={surface} stroke={hairline} strokeWidth="2" />
          <circle cx="860" cy="326" r="174" fill="none" stroke={hairline} strokeWidth="22" />
          <circle cx="860" cy="326" r="174" fill="none" stroke={'url(#' + id + '-warm)'} strokeWidth="22" strokeLinecap="round" strokeDasharray="420 1100" strokeDashoffset={420 * (1 - draw)} transform="rotate(-90 860 326)" />
          <text x="860" y="330" textAnchor="middle" dominantBaseline="middle" fill={ink} fontFamily={headingFont} fontSize="94" fontWeight="950">{items[0]?.displayValue || ''}</text>
          <Label item={items[0] || { label: title }} x={860} y={424} color={muted} font={bodyFont} anchor="middle" />
        </g>}

        {kind === 'growth' && (() => {
          const points = items.filter((item) => typeof item.value === 'number');
          const minValue = Math.min(...points.map((item) => item.value || 0));
          const valueRange = Math.max(1, Math.max(...points.map((item) => item.value || 0)) - minValue);
          const left = 150, right = 1570, top = 100, bottom = 535;
          const coords = points.map((item, index) => ({
            item,
            x: left + ((right - left) * index) / Math.max(1, points.length - 1),
            y: bottom - (((item.value || 0) - minValue) / valueRange) * (bottom - top),
          }));
          const path = coords.map((point, index) => (index ? 'L ' : 'M ') + point.x + ' ' + point.y).join(' ');
          const stagger = Math.max(3, Math.min(10, Math.floor((scene.duration * fps) / Math.max(4, points.length * 3))));
          return <g>
            {[0, 1, 2, 3].map((index) => {
              const y = top + ((bottom - top) * index) / 3;
              return <line key={index} x1={left} y1={y} x2={right} y2={y} stroke={hairline} strokeWidth="2" strokeDasharray="5 10" />;
            })}
            <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={muted} strokeWidth="3" />
            <path d={path} fill="none" stroke={'url(#' + id + '-warm)'} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" pathLength="1000" strokeDasharray="1000" strokeDashoffset={1000 * (1 - draw)} />
            {coords.map(({ item, x, y }, index) => {
              const entered = spring({ frame: Math.max(0, localFrame - 12 - index * stagger), fps, config: { damping: 18, mass: 0.7, stiffness: 120 } });
              return <g key={item.label + index} opacity={entered} transform={'translate(0 ' + interpolate(entered, [0, 1], [18, 0]) + ')'}>
                <circle cx={x} cy={y} r="18" fill={surface} stroke={orange} strokeWidth="8" />
                <text x={x} y={y - 32} textAnchor="middle" fill={ink} fontFamily={headingFont} fontSize="25" fontWeight="900">{item.displayValue}</text>
                <text x={x} y={bottom + 48} textAnchor="middle" fill={muted} fontFamily={bodyFont} fontSize="23" fontWeight="800">{item.label}</text>
              </g>;
            })}
          </g>;
        })()}

        {kind === 'concept' && <g>
          <ellipse cx="860" cy="338" rx="560" ry="225" fill="none" stroke={hairline} strokeWidth="2" strokeDasharray="7 12" />
          {items.map((item, index) => {
            const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(1, items.length);
            const x = 860 + Math.cos(angle) * 560;
            const y = 338 + Math.sin(angle) * 225;
            const entered = spring({ frame: Math.max(0, localFrame - index * 5), fps, config: { damping: 18, mass: 0.75, stiffness: 115 } });
            return <g key={index} opacity={entered}>
              <circle cx={x} cy={y} r="106" fill={surface} stroke={index % 2 ? emerald : orange} strokeWidth="3" />
              <circle cx={x} cy={y} r="94" fill={index % 2 ? emerald : orange} fillOpacity=".08" />
              <Label item={item} x={x} y={y - 8} color={ink} font={bodyFont} anchor="middle" />
            </g>;
          })}
          <circle cx="860" cy="338" r="136" fill={ink} />
          <text x="860" y="330" textAnchor="middle" fill={isDark ? '#070B14' : '#FFFFFF'} fontFamily={headingFont} fontSize="25" fontWeight="900">
            {linesFor(title, 16).map((line, index) => <tspan key={index} x="860" dy={index ? 32 : 0}>{line}</tspan>)}
          </text>
        </g>}
      </svg>
    </div>
  );
}