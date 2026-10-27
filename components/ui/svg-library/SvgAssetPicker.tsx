'use client';

import React, { useState, useMemo } from 'react';
import { SVG_ASSET_REGISTRY, SvgCategory } from '../../../lib/svg-library/registry';

export const SvgAssetPicker = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SvgCategory | 'all'>('all');

  const filteredAssets = useMemo(() => {
    return (SVG_ASSET_REGISTRY || []).filter((asset) => {
      const matchesSearch = (asset.name || '').toLowerCase().includes(search.toLowerCase()) || 
                            (asset.keywords || []).some(k => k.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900 border border-white/10 rounded-xl overflow-hidden text-white">
      <div className="p-4 border-b border-white/10 flex flex-col gap-3">
        <h3 className="text-lg font-semibold tracking-tight">SVG Asset Library</h3>
        <input 
          type="text"
          placeholder="Search arrows, shapes, highlights..."
          className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {['all', 'arrows', 'shapes', 'highlights', 'diagrams', 'infographics', 'general', 'business', 'finance', 'technology', 'education', 'health', 'people', 'marketing', 'geography', 'nature', 'transport', 'conceptual'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {(!filteredAssets || filteredAssets.length === 0) ? (
          <div className="col-span-full py-12 text-center text-zinc-500 text-sm">No assets found for "{search}"</div>
        ) : (
          (filteredAssets || []).filter(Boolean).map((asset) => (
            <div key={asset.id || Math.random()} className="group flex flex-col bg-zinc-950 border border-white/5 hover:border-white/20 rounded-lg overflow-hidden transition-all cursor-pointer">
              <div className="aspect-square w-full flex items-center justify-center p-4 bg-zinc-900/50">
                {asset.component ? <asset.component size={64} isThumbnail={true} {...(asset.defaultProps || {})} /> : null}
              </div>
              <div className="p-2 text-center border-t border-white/5">
                <p className="text-xs font-medium truncate">{asset.name || 'Unknown'}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{asset.category || 'general'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
