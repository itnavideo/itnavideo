"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Player } from '@remotion/player';
import {
  Search,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  Play,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  REMOTION_COMPONENT_REGISTRY,
  type VideoComponentMeta,
  type ComponentCategory,
} from '@/remotion/library/registry';
import { DynamicLibraryHost } from '@/remotion/components/DynamicLibraryHost';

const CATEGORIES: Array<{ id: string; label: string; count?: number }> = [
  { id: 'all', label: 'All Components' },
  { id: 'charts', label: 'Charts & Data' },
  { id: 'timelines', label: 'Timelines & History' },
  { id: 'diagrams', label: 'Diagrams & Workflows' },
  { id: 'comparisons', label: 'Versus & Comparisons' },
  { id: 'ui-mockups', label: 'UI & App Mockups' },
  { id: '3d-isometric', label: '3D Isometric' },
  { id: 'business', label: 'Business & SaaS' },
  { id: 'finance', label: 'Finance & Crypto' },
  { id: 'technology', label: 'Tech & Architecture' },
  { id: 'scientific', label: 'Scientific & Medical' },
  { id: 'documentary', label: 'Documentary & Cinema' },
  { id: 'typography', label: 'Kinetic Typography' },
  { id: 'vfx', label: 'VFX & Light Leaks' },
];

export default function ComponentsLibraryClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState<VideoComponentMeta>(
    REMOTION_COMPONENT_REGISTRY[0] || {
      id: 'barchart-classic',
      name: 'Classic Bar Chart',
      category: 'charts',
      description: 'Clean animated bar chart with animated axis and numbers',
      tags: ['chart', 'bar', 'data'],
      aspectRatio: 'both',
    }
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [canvasTheme, setCanvasTheme] = useState<'white' | 'dark'>('white');

  // Filtered list
  const filteredList = useMemo(() => {
    let list = REMOTION_COMPONENT_REGISTRY;

    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <h1 className="font-bold text-lg text-white">Motion Graphics Component Library</h1>
            <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-mono">
              1,292 Components
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3333"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition"
          >
            Open in Remotion Studio (Port 3333)
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Search & Component Catalog */}
        <div className="w-full lg:w-[50%] xl:w-[48%] border-r border-zinc-800 flex flex-col h-[calc(100vh-65px)]">
          {/* Search & Category Filter */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by component name, keyword, or tag (e.g. chart, crypto, timeline, map)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-orange-600 text-white font-semibold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
              <span>Showing {filteredList.length} of {REMOTION_COMPONENT_REGISTRY.length} components</span>
              <span>Click any card to preview in 1080p</span>
            </div>
          </div>

          {/* Component Grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredList.map((comp) => {
              const isSelected = selectedComponent.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-950/20 border-orange-500/80 shadow-lg shadow-orange-950/30 ring-1 ring-orange-500/50'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                        {comp.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono bg-zinc-800/80 px-1.5 py-0.5 rounded">
                        {comp.aspectRatio === 'both' ? '16:9 & 9:16' : comp.aspectRatio}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white line-clamp-1">{comp.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[170px]">
                      {comp.id}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyId(comp.id);
                      }}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition"
                      title="Copy component ID"
                    >
                      {copiedId === comp.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Interactive Remotion Preview Stage */}
        <div className="w-full lg:w-[50%] xl:w-[52%] bg-zinc-950 flex flex-col h-[calc(100vh-65px)]">
          {/* Preview Inspector Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                ACTIVE COMPONENT INSPECTOR
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedComponent.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Canvas Theme Toggle */}
              <div className="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700">
                <button
                  onClick={() => setCanvasTheme('white')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                    canvasTheme === 'white'
                      ? 'bg-white text-zinc-900 shadow font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  White Canvas
                </button>
                <button
                  onClick={() => setCanvasTheme('dark')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                    canvasTheme === 'dark'
                      ? 'bg-zinc-950 text-white shadow font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Dark Canvas
                </button>
              </div>

              <button
                onClick={() => handleCopyId(selectedComponent.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white transition shadow"
              >
                {copiedId === selectedComponent.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    Copied ID
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy ID: &quot;{selectedComponent.id}&quot;
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 16:9 Live Remotion Player — Full Screen Fit */}
          <div className="p-6 flex-1 flex flex-col items-center justify-center overflow-y-auto">
            <div
              className={`w-full max-w-[1040px] aspect-video rounded-2xl overflow-hidden border shadow-2xl relative transition-colors ${
                canvasTheme === 'white' ? 'bg-white border-zinc-300' : 'bg-[#090D16] border-zinc-800'
              }`}
            >
              <Player
                key={`${selectedComponent.id}-${canvasTheme}`}
                component={DynamicLibraryHost}
                inputProps={{
                  componentId: selectedComponent.id,
                  cinematic: false,
                  scale: 1.0,
                  fullScreen: true,
                  palette: { isDark: canvasTheme === 'dark', bg: canvasTheme === 'white' ? '#FFFFFF' : '#0F172A' },
                }}
                durationInFrames={180}
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{ width: '100%', height: '100%' }}
                controls
                autoPlay
                loop
                initialFrame={20}
                acknowledgeRemotionLicense
              />
            </div>

            {/* Component Metadata Sheet */}
            <div className="w-full max-w-[580px] mt-6 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div>
                <span className="text-xs font-semibold text-zinc-400">Description</span>
                <p className="text-sm text-zinc-300 mt-0.5">{selectedComponent.description}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-zinc-400">Tags & Keywords</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedComponent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span>Aspect Ratio: {selectedComponent.aspectRatio}</span>
                <span>Category: {selectedComponent.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

