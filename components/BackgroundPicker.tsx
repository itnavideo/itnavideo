/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Plus, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateSafePublicUrl } from '@/lib/security/ssrfValidator';

export interface BackgroundItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  fullSrc: string;
  category?: string;
}

export const PRESET_BACKGROUND_IMAGES: BackgroundItem[] = [
  {
    id: 'obsidian-cyber-grid',
    name: 'Obsidian Grid',
    thumbnailUrl: '/preview/Faceless%20Long%20Video.png',
    fullSrc: '/preview/Faceless%20Long%20Video.png',
    category: 'tech',
  },
  {
    id: 'purple-vignette',
    name: 'Purple Vignette',
    thumbnailUrl: '/preview/Typography%20Subtitle%20%26%20Motion%20Overlay.png',
    fullSrc: '/preview/Typography%20Subtitle%20%26%20Motion%20Overlay.png',
    category: 'dark',
  },
  {
    id: 'emerald-studio',
    name: 'Emerald Studio',
    thumbnailUrl: '/preview/Whiteboard%20Video.png',
    fullSrc: '/preview/Whiteboard%20Video.png',
    category: 'studio',
  },
  {
    id: 'royal-indigo',
    name: 'Royal Indigo',
    thumbnailUrl: '/preview/Auto%20Caption%20Reel.png',
    fullSrc: '/preview/Auto%20Caption%20Reel.png',
    category: 'gradient',
  },
  {
    id: 'versus-split',
    name: 'Versus Split',
    thumbnailUrl: '/preview/Compare%20%26%20Versus%20Explainer.png',
    fullSrc: '/preview/Compare%20%26%20Versus%20Explainer.png',
    category: 'tech',
  },
  {
    id: 'multi-images-dark',
    name: 'Multi Image Dark',
    thumbnailUrl: '/preview/Multi%20Images%20Video.png',
    fullSrc: '/preview/Multi%20Images%20Video.png',
    category: 'studio',
  },
];

export interface BackgroundPickerProps {
  selectedId?: string;
  onSelect: (item: BackgroundItem) => void;
  customS3Url?: string;
  onCustomS3UrlChange?: (url: string) => void;
}

export function BackgroundPicker({
  selectedId = 'obsidian-cyber-grid',
  onSelect,
  customS3Url = '',
  onCustomS3UrlChange,
}: BackgroundPickerProps) {
  const [selected, setSelected] = useState<string>(selectedId);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string>('');

  const handleSelect = (item: BackgroundItem) => {
    setSelected(item.id);
    onSelect(item);
  };

  const handleCustomUrlChange = (url: string) => {
    if (onCustomS3UrlChange) onCustomS3UrlChange(url);

    if (!url.trim()) {
      setUrlError('');
      return;
    }

    const validation = validateSafePublicUrl(url);
    if (!validation.isValid) {
      setUrlError(validation.error || 'Invalid S3 URL');
      return;
    }

    setUrlError('');
    setSelected('custom-s3');
    onSelect({
      id: 'custom-s3',
      name: 'Custom AWS S3',
      thumbnailUrl: url,
      fullSrc: url,
      category: 'custom',
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#09090b] p-4 shadow-xl">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#00FF9D]" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Background Image Theme
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500">
          True 16:9 Aspect Ratio
        </span>
      </div>

      {/* Grid Container with Overflow Control (max-h-52 overflow-y-auto) */}
      <div className="max-h-52 overflow-y-auto pr-1.5 custom-scrollbar">
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
          {PRESET_BACKGROUND_IMAGES.map((bg) => {
            const isSelected = selected === bg.id;

            return (
              <div
                key={bg.id}
                onClick={() => handleSelect(bg)}
                className={`relative aspect-[16/9] w-full overflow-hidden rounded-lg transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#00FF9D] ring-2 ring-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.3)] opacity-100 scale-105 z-10'
                    : 'border-2 border-slate-800 opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={bg.thumbnailUrl}
                  alt={bg.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00FF9D] text-black shadow-md">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Bottom Label Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1 text-[9px] font-bold text-slate-200 truncate">
                  {bg.name}
                </div>
              </div>
            );
          })}

          {/* Custom S3 URL / Upload Card */}
          <div
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`relative aspect-[16/9] w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition cursor-pointer text-slate-400 hover:text-[#00FF9D] ${
              selected === 'custom-s3'
                ? 'border-[#00FF9D] bg-slate-900/90 ring-2 ring-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.3)] text-[#00FF9D]'
                : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/80 hover:border-[#00FF9D]/60'
            }`}
          >
            <Plus className="h-4 w-4 mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-tight">
              AWS S3 / Custom
            </span>
          </div>
        </div>
      </div>

      {/* Custom AWS S3 Input Bar with SSRF Protection */}
      {showCustomInput && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-cyan-400 shrink-0" />
            <input
              type="url"
              placeholder="Paste AWS S3 Public Image URL (https://...)"
              value={customS3Url}
              onChange={(e) => handleCustomUrlChange(e.target.value)}
              className={`w-full rounded-lg border bg-slate-900 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none ${
                urlError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700 focus:border-[#00FF9D]'
              }`}
            />
          </div>
          {urlError && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-400 pl-6">
              <AlertCircle className="h-3 w-3" />
              <span>{urlError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
