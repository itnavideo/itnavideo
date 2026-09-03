import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { SceneBlueprintItem } from '../../../services/ai/sceneBlueprintTypes';
import { calculateFluidTypography } from './designSystemTypography';

interface VisualSceneLayoutProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function VisualSceneLayout({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Plus Jakarta Sans',
}: VisualSceneLayoutProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Fluid responsive font sizes calculated dynamically
  const sizes = calculateFluidTypography(width, height);

  // Base motion animations
  const springProgress = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 180 },
  });

  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  // Custom Motion Effects based on scene.animation
  let transformMotion = `scale(${springProgress})`;
  if (scene.animation === 'slow_zoom_in') {
    const zoomScale = interpolate(frame, [0, 150], [1, 1.15], { extrapolateRight: 'clamp' });
    transformMotion = `scale(${zoomScale})`;
  } else if (scene.animation === 'slow_zoom_out') {
    const zoomScale = interpolate(frame, [0, 150], [1.15, 1], { extrapolateRight: 'clamp' });
    transformMotion = `scale(${zoomScale})`;
  } else if (scene.animation === 'pan_right') {
    const translateX = interpolate(frame, [0, 150], [-20, 20], { extrapolateRight: 'clamp' });
    transformMotion = `translateX(${translateX}px)`;
  } else if (scene.animation === 'scale_pop') {
    transformMotion = `scale(${springProgress * 1.05})`;
  }

  // Count up value for number_count_up motion
  let displayChartPercent = scene.chartValuePercent || 85;
  if (scene.animation === 'number_count_up') {
    displayChartPercent = Math.round(
      interpolate(frame, [0, 45], [0, scene.chartValuePercent || 85], {
        extrapolateRight: 'clamp',
      })
    );
  }

  const headingStyle = {
    fontFamily: headingFont,
    fontSize: `${sizes.h1}px`,
  };

  const subheadingStyle = {
    fontFamily: bodyFont,
    fontSize: `${sizes.subheading}px`,
  };

  const bodyStyle = {
    fontFamily: bodyFont,
    fontSize: `${sizes.body}px`,
  };

  const statStyle = {
    fontFamily: headingFont,
    fontSize: `${sizes.stat}px`,
  };

  switch (scene.layoutType) {
    // 1. Big Typography
    case 'big_typography':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10" style={{ opacity }}>
          <h1
            className="font-black uppercase tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-w-5xl leading-none mb-6"
            style={{ ...headingStyle, transform: transformMotion }}
          >
            {scene.heading}
          </h1>
          <p className="font-bold text-cyan-300 max-w-3xl" style={subheadingStyle}>
            {scene.supportingText}
          </p>
        </div>
      );

    // 2. Stat Card
    case 'stat_card':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ opacity }}>
          <div className="h-16 w-0 border-l-2 border-dashed border-white/50 mb-2" />
          <div
            className="flex items-center gap-4 rounded-3xl bg-white/95 px-10 py-6 text-zinc-950 shadow-[0_25px_60px_rgba(0,0,0,0.7)] border border-white/40 backdrop-blur-xl"
            style={{ transform: transformMotion }}
          >
            <span className="font-black tracking-tight" style={statStyle}>
              {scene.statValue || scene.heading}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-2xl shadow-lg">
              {scene.statTrend === 'down' ? '⬇️' : '⬆️'}
            </span>
          </div>
          <p className="mt-4 font-bold text-white/90 drop-shadow-md" style={subheadingStyle}>
            {scene.statLabel || scene.supportingText}
          </p>
        </div>
      );

    // 3. Split Screen
    case 'split_screen':
      return (
        <div className="absolute inset-0 grid grid-cols-2 p-16 gap-12 items-center z-10" style={{ opacity }}>
          <div
            className="rounded-3xl border border-white/20 bg-black/40 p-8 backdrop-blur-md flex flex-col justify-center shadow-2xl h-full"
            style={{ transform: transformMotion }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">KEY HIGHLIGHT</span>
            <h2 className="font-black text-white" style={headingStyle}>
              {scene.heading}
            </h2>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <p className="font-semibold text-white/90 leading-relaxed" style={subheadingStyle}>
              {scene.supportingText}
            </p>
          </div>
        </div>
      );

    // 4. Image + Text
    case 'image_text':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10" style={{ opacity }}>
          <div
            className="rounded-3xl border border-white/20 bg-slate-900/90 p-8 shadow-2xl max-w-3xl text-center backdrop-blur-xl"
            style={{ transform: transformMotion }}
          >
            <div className="inline-block rounded-2xl bg-cyan-500/20 px-4 py-1 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-4 border border-cyan-500/30">
              Visual Insight
            </div>
            <h2 className="font-extrabold text-white mb-4" style={headingStyle}>
              {scene.heading}
            </h2>
            <p className="font-medium text-slate-300" style={bodyStyle}>
              {scene.supportingText}
            </p>
          </div>
        </div>
      );

    // 5. Screenshot Highlight
    case 'screenshot_highlight':
      return (
        <div className="absolute inset-0 flex items-center justify-center p-12 z-10" style={{ opacity }}>
          <div
            className="w-full max-w-4xl rounded-2xl border border-white/20 bg-zinc-950 p-6 shadow-[0_0_50px_rgba(56,189,248,0.2)]"
            style={{ transform: transformMotion }}
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-4 text-xs font-mono text-zinc-400">analytics_dashboard.view</span>
            </div>
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-400/40 p-6 text-center">
              <h3 className="font-black text-cyan-300" style={subheadingStyle}>
                {scene.heading}
              </h3>
              <p className="mt-2 text-zinc-200" style={bodyStyle}>
                {scene.supportingText}
              </p>
            </div>
          </div>
        </div>
      );

    // 6. Comparison
    case 'comparison':
      return (
        <div className="absolute inset-0 flex items-center justify-center p-12 z-10" style={{ opacity }}>
          <div className="grid grid-cols-2 gap-8 w-full max-w-5xl" style={{ transform: transformMotion }}>
            <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-8 text-center backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Before / Issue</span>
              <h3 className="font-black text-white mt-2" style={subheadingStyle}>
                {scene.comparisonItems?.left || scene.heading}
              </h3>
            </div>
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">After / Result</span>
              <h3 className="font-black text-white mt-2" style={subheadingStyle}>
                {scene.comparisonItems?.right || scene.supportingText}
              </h3>
            </div>
          </div>
        </div>
      );

    // 7. Timeline
    case 'timeline':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10" style={{ opacity }}>
          <div className="flex items-center gap-6 w-full max-w-4xl" style={{ transform: transformMotion }}>
            {(scene.timelineSteps || ['Hook', 'Growth', 'Scale']).map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="h-12 w-12 rounded-full bg-cyan-500 text-zinc-950 font-black flex items-center justify-center text-lg shadow-lg mb-2">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-white" style={bodyStyle}>
                    {step}
                  </span>
                </div>
                {idx < (scene.timelineSteps?.length || 3) - 1 && (
                  <div className="h-1 flex-1 bg-cyan-500/40 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );

    // 8. Checklist
    case 'checklist':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10" style={{ opacity }}>
          <div
            className="rounded-3xl border border-white/20 bg-slate-900/80 p-8 shadow-2xl max-w-2xl w-full space-y-4 backdrop-blur-xl"
            style={{ transform: transformMotion }}
          >
            <h2 className="font-black text-white border-b border-white/10 pb-3" style={subheadingStyle}>
              {scene.heading}
            </h2>
            {(scene.checklistItems || [scene.supportingText]).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                  ✓
                </span>
                <span className="font-semibold text-slate-200" style={bodyStyle}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    // 9. Quote
    case 'quote':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center z-10" style={{ opacity }}>
          <div className="text-7xl font-serif text-cyan-400 leading-none mb-2">“</div>
          <p
            className="font-extrabold italic text-white max-w-4xl leading-tight mb-4 drop-shadow-lg"
            style={{ ...subheadingStyle, transform: transformMotion }}
          >
            {scene.heading}
          </p>
          <span className="font-bold text-cyan-300 uppercase tracking-widest" style={bodyStyle}>
            — {scene.quoteAuthor || scene.supportingText}
          </span>
        </div>
      );

    // 10. Numbered Point
    case 'numbered_point':
      return (
        <div className="absolute inset-0 flex items-center justify-center p-12 z-10" style={{ opacity }}>
          <div className="flex items-center gap-8 max-w-4xl" style={{ transform: transformMotion }}>
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground font-black text-6xl shadow-2xl">
              #{scene.numberBadge || scene.sceneNumber}
            </div>
            <div>
              <h2 className="font-black text-white mb-2" style={subheadingStyle}>
                {scene.heading}
              </h2>
              <p className="font-medium text-slate-300" style={bodyStyle}>
                {scene.supportingText}
              </p>
            </div>
          </div>
        </div>
      );

    // 11. Fullscreen Statement
    case 'fullscreen_statement':
      return (
        <div className="absolute inset-0 flex items-center justify-center p-12 text-center z-10" style={{ opacity }}>
          <h1
            className="font-black uppercase text-amber-300 tracking-tight max-w-5xl drop-shadow-[0_0_35px_rgba(251,191,36,0.4)]"
            style={{ ...headingStyle, transform: transformMotion }}
          >
            {scene.heading}
          </h1>
        </div>
      );

    // 12. Data Visualization
    case 'data_visualization':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 z-10" style={{ opacity }}>
          <div
            className="rounded-3xl border border-white/20 bg-slate-950/90 p-8 max-w-2xl w-full text-center shadow-2xl backdrop-blur-xl"
            style={{ transform: transformMotion }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Growth Index</span>
            <h2 className="font-black text-white my-3" style={subheadingStyle}>
              {scene.heading}
            </h2>
            <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden p-1 border border-white/10">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${displayChartPercent}%` }}
              />
            </div>
            <p className="mt-3 font-semibold text-slate-400" style={bodyStyle}>
              {scene.supportingText}
            </p>
          </div>
        </div>
      );

    // 13. B-Roll + Overlay
    case 'broll_overlay':
    default:
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-12 text-center z-10" style={{ opacity }}>
          <div
            className="rounded-2xl bg-black/70 px-8 py-4 backdrop-blur-md border border-white/20 shadow-2xl max-w-4xl"
            style={{ transform: transformMotion }}
          >
            <h3 className="font-bold text-white" style={subheadingStyle}>
              {scene.heading}
            </h3>
            {scene.supportingText && (
              <p className="mt-1 text-cyan-300 font-medium" style={bodyStyle}>
                {scene.supportingText}
              </p>
            )}
          </div>
        </div>
      );
  }
}
