'use client';

import React, { useState } from 'react';
import {
  UNIVERSAL_CAPTION_THEMES,
  UNIVERSAL_STICKER_PACKS,
  UNIVERSAL_LAYOUT_FRAMES,
  UNIVERSAL_LOWER_THIRDS,
  UNIVERSAL_PROGRESS_BARS,
  UNIVERSAL_DEMO_PRESETS,
  DemoPresetBlueprint,
  TemplateLibraryConfig,
} from '../../../services/templates/templateLibrary';
import { DemoBlueprintPlayer } from '../../admin/components/DemoBlueprintPlayer';

export interface TemplateLibraryPickerProps {
  config: TemplateLibraryConfig;
  onChange: (updatedConfig: TemplateLibraryConfig) => void;
  onApplyDemoPreset?: (demo: DemoPresetBlueprint) => void;
  aspectRatioFilter?: 'all' | '9:16' | '16:9';
}

export const TemplateLibraryPicker: React.FC<TemplateLibraryPickerProps> = ({
  config,
  onChange,
  onApplyDemoPreset,
  aspectRatioFilter = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'demos' | 'captions' | 'stickers' | 'frames' | 'lowerThirds' | 'progress'>('demos');

  return (
    <div className="w-full bg-muted border border-border rounded-xl p-5 shadow-2xl text-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">🎨</span> Universal Video Template Library
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Pick modular presets or load complete sample demo blueprints (text, stickers, chapter badges)
          </p>
        </div>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">
          Reusable Assets
        </span>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-border mb-6 gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'demos', label: '🚀 Demo Blueprints', count: UNIVERSAL_DEMO_PRESETS.length },
          { id: 'captions', label: 'Caption Themes', count: UNIVERSAL_CAPTION_THEMES.length },
          { id: 'stickers', label: 'Sticker & Icon Packs', count: UNIVERSAL_STICKER_PACKS.length },
          { id: 'frames', label: 'Layout Frames', count: UNIVERSAL_LAYOUT_FRAMES.length },
          { id: 'lowerThirds', label: 'Chapter & Badges', count: UNIVERSAL_LOWER_THIRDS.length },
          { id: 'progress', label: 'Progress Bars', count: UNIVERSAL_PROGRESS_BARS.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-muted/60 text-muted-foreground hover:text-slate-200 hover:bg-muted'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-700 text-muted-foreground'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Demo Blueprints */}
        {activeTab === 'demos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {UNIVERSAL_DEMO_PRESETS.map((demo) => (
              <div
                key={demo.id}
                className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/60 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                      {demo.category}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {demo.aspectRatio}
                    </span>
                  </div>

                  <div className="my-3">
                    <DemoBlueprintPlayer demo={demo} />
                  </div>

                  <h4 className="font-bold text-sm text-white mb-1">{demo.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{demo.description}</p>

                  <div className="bg-background/80 p-3 rounded-lg border border-border space-y-2 mb-4">
                    <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                      <span>📌 Topic:</span> {demo.sampleTopic}
                    </div>
                    <div className="text-[11px] text-muted-foreground italic">
                      "{demo.sampleData.captions[0]?.text}"
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {demo.sampleData.chapterEvents.map((ch) => (
                        <span key={ch.id} className="text-[10px] bg-muted text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/40">
                          {ch.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onChange(demo.templateConfig);
                    if (onApplyDemoPreset) onApplyDemoPreset(demo);
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>🚀 Apply Demo Blueprint</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Caption Themes */}
        {activeTab === 'captions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UNIVERSAL_CAPTION_THEMES.map((theme) => {
              const isSelected = config.captionThemeId === theme.id || (!config.captionThemeId && theme.id === 'glow-viral');
              return (
                <div
                  key={theme.id}
                  onClick={() => onChange({ ...config, captionThemeId: theme.id })}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/50'
                      : 'border-border bg-muted/40 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{theme.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded">
                      {theme.aspectRatio}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{theme.description}</p>
                  <div className="bg-background p-3 rounded-lg text-center text-xs font-bold" style={{ color: theme.styles.activeTextColor, textShadow: theme.styles.textShadow }}>
                    ACTIVE WORD HIGHLIGHT
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sticker Packs */}
        {activeTab === 'stickers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UNIVERSAL_STICKER_PACKS.map((pack) => {
              const isSelected = config.stickerPackId === pack.id || (!config.stickerPackId && pack.id === 'stickman-dev');
              return (
                <div
                  key={pack.id}
                  onClick={() => onChange({ ...config, stickerPackId: pack.id })}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/50'
                      : 'border-border bg-muted/40 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{pack.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-muted text-muted-foreground rounded">
                      {pack.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{pack.description}</p>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {pack.stickers.map((s) => (
                      <span key={s.id} className="text-xs bg-muted border border-border text-muted-foreground px-2 py-1 rounded">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Layout Frames */}
        {activeTab === 'frames' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UNIVERSAL_LAYOUT_FRAMES.map((frame) => {
              const isSelected = config.layoutFrameId === frame.id || (!config.layoutFrameId && frame.id === 'split-16x9');
              return (
                <div
                  key={frame.id}
                  onClick={() => onChange({ ...config, layoutFrameId: frame.id })}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/50'
                      : 'border-border bg-muted/40 hover:border-border'
                  }`}
                >
                  <span className="font-bold text-sm text-white block mb-1">{frame.name}</span>
                  <p className="text-xs text-muted-foreground mb-3">{frame.description}</p>
                  <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                    {frame.layoutType}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Lower Thirds & Chapter Cards */}
        {activeTab === 'lowerThirds' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UNIVERSAL_LOWER_THIRDS.map((item) => {
              const isSelected = config.lowerThirdId === item.id || (!config.lowerThirdId && item.id === 'chapter-badge');
              return (
                <div
                  key={item.id}
                  onClick={() => onChange({ ...config, lowerThirdId: item.id })}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/50'
                      : 'border-border bg-muted/40 hover:border-border'
                  }`}
                >
                  <span className="font-bold text-sm text-white block mb-1">{item.name}</span>
                  <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                  <div
                    className="p-2 rounded-lg text-xs font-bold flex items-center gap-2"
                    style={{ backgroundColor: item.badgeStyle.backgroundColor, color: item.badgeStyle.textColor, borderLeft: `4px solid ${item.badgeStyle.accentColor}` }}
                  >
                    <span>STEP 01</span>
                    <span>Chapter Title Banner</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress Bars */}
        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UNIVERSAL_PROGRESS_BARS.map((bar) => {
              const isSelected = config.progressBarId === bar.id || (!config.progressBarId && bar.id === 'bottom-neon-bar');
              return (
                <div
                  key={bar.id}
                  onClick={() => onChange({ ...config, progressBarId: bar.id })}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/50'
                      : 'border-border bg-muted/40 hover:border-border'
                  }`}
                >
                  <span className="font-bold text-sm text-white block mb-1">{bar.name}</span>
                  <p className="text-xs text-muted-foreground mb-3">{bar.description}</p>
                  <div className="w-full h-2 bg-background rounded overflow-hidden">
                    <div className="h-full w-2/3" style={{ backgroundColor: bar.barColor, boxShadow: bar.glow ? `0 0 8px ${bar.barColor}` : 'none' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

