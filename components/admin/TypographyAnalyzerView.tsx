'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Layers,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Download,
  ExternalLink,
  Sliders,
  Type,
  Layout,
  Activity,
  Palette,
  UserCheck,
  Music,
  ShieldAlert,
  Code,
  Zap,
  ChevronRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type { AdvancedStyleBlueprint, KeyframeDetection, TypographyEvent } from '@/lib/typography/blueprintSchema';
import TypographyReplicationView from './TypographyReplicationView';

interface StyleSummary {
  styleId: string;
  name: string;
  category: string;
  sourceVideoUrl: string;
  posterUrl?: string;
  analyzed: boolean;
  overallConfidence: number;
  fontFamily: string;
  fontCategory: string;
  entranceMotion: string;
  primaryTextColor: string;
  accentColor: string;
  layerPlacement: string;
  distinctivenessScore: number;
  status: string;
  analyzedAt: string | null;
}

export default function TypographyAnalyzerView() {
  const [workbenchMode, setWorkbenchMode] = useState<'replication' | 'blueprints'>('replication');
  const [styles, setStyles] = useState<StyleSummary[]>([]);
  const [activeStyleId, setActiveStyleId] = useState<string>('dynamic-punch');
  const [activeBlueprint, setActiveBlueprint] = useState<AdvancedStyleBlueprint | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzingStyle, setAnalyzingStyle] = useState<string | null>(null);
  const [batchAnalyzing, setBatchAnalyzing] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'typography' | 'composition' | 'motion' | 'color' | 'subject' | 'rhythm' | 'confidence' | 'json'>('typography');
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch styles list on mount
  const fetchStyles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/typography/analyze');
      const data = await res.json();
      if (data.styles) {
        setStyles(data.styles);
        if (!activeStyleId && data.styles[0]) {
          setActiveStyleId(data.styles[0].styleId);
        }
      }
    } catch (err) {
      console.error('Failed to load styles:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch active blueprint
  const fetchBlueprint = async (styleId: string) => {
    try {
      const res = await fetch(`/api/typography/analyze?styleId=${styleId}`);
      const data = await res.json();
      if (data.blueprint) {
        setActiveBlueprint(data.blueprint);
      } else {
        setActiveBlueprint(null);
      }
    } catch (err) {
      console.error('Failed to load blueprint:', err);
      setActiveBlueprint(null);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  useEffect(() => {
    if (activeStyleId) {
      fetchBlueprint(activeStyleId);
    }
  }, [activeStyleId]);

  // Run single analysis
  const runAnalysis = async (styleId: string, force = true) => {
    try {
      setAnalyzingStyle(styleId);
      const res = await fetch('/api/typography/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styleId, force }),
      });
      const data = await res.json();
      if (data.blueprint) {
        setActiveBlueprint(data.blueprint);
        await fetchStyles();
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzingStyle(null);
    }
  };

  // Run batch analysis of all 10 demos
  const runBatchAnalysis = async () => {
    try {
      setBatchAnalyzing(true);
      setBatchProgress('Running temporal frame extraction & AI vision reverse-engineering for all 10 demos...');
      const res = await fetch('/api/typography/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true, force: true }),
      });
      const data = await res.json();
      if (data.blueprints) {
        setBatchProgress('Batch complete! Validating distinctiveness matrix...');
        await fetchStyles();
        if (activeStyleId) {
          await fetchBlueprint(activeStyleId);
        }
      }
    } catch (err) {
      console.error('Batch analysis failed:', err);
    } finally {
      setBatchAnalyzing(false);
      setBatchProgress('');
    }
  };

  // Analyze custom video
  const analyzeCustomVideo = async () => {
    if (!customVideoUrl) return;
    try {
      setAnalyzingStyle('custom');
      const res = await fetch('/api/typography/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: customVideoUrl, name: 'Custom Video Demo', force: true }),
      });
      const data = await res.json();
      if (data.blueprint) {
        setActiveBlueprint(data.blueprint);
        setShowCustomModal(false);
        setCustomVideoUrl('');
        await fetchStyles();
      }
    } catch (err) {
      console.error('Custom video analysis failed:', err);
    } finally {
      setAnalyzingStyle(null);
    }
  };

  const copyBlueprintJson = () => {
    if (!activeBlueprint) return;
    navigator.clipboard.writeText(JSON.stringify(activeBlueprint, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBlueprintJson = () => {
    if (!activeBlueprint) return;
    const blob = new Blob([JSON.stringify(activeBlueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeBlueprint.metadata.styleId}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeStyleSummary = styles.find((s) => s.styleId === activeStyleId);

  // Video time update listener
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#1a73e8] to-[#9333ea] flex items-center justify-center text-white shadow-sm">
                <Layers size={22} />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
                  Advanced Typography Style Analyzer & Reverse-Engineering Workbench
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Deconstructs motion graphics reference videos into resolution-independent machine-readable Style Blueprints.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCustomModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
            >
              <Zap size={14} className="text-[#1a73e8]" />
              <span>Analyze Custom Video URL</span>
            </button>

            <button
              onClick={runBatchAnalysis}
              disabled={batchAnalyzing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#9333ea] hover:opacity-95 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              {batchAnalyzing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Batch Analyzing (FFmpeg + Gemini Vision)...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Re-Analyze All 10 Demos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Demo Styles</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{styles.length}</div>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Analyzed Blueprints</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
              {styles.filter((s) => s.analyzed).length} / {styles.length}
            </div>
          </div>
          <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">System Avg Confidence</div>
            <div className="text-xl font-extrabold text-blue-700 mt-0.5">
              {styles.length > 0
                ? Math.round(
                    (styles.reduce((acc, s) => acc + (s.overallConfidence || 0.88), 0) / styles.length) * 100
                  )
                : 90}
              %
            </div>
          </div>
          <div className="bg-purple-50/60 rounded-xl p-3 border border-purple-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Differentiation Health</div>
            <div className="text-xl font-extrabold text-purple-700 mt-0.5">
              {styles.length > 0
                ? Math.round(
                    styles.reduce((acc, s) => acc + (s.distinctivenessScore || 90), 0) / styles.length
                  )
                : 92}
              %
            </div>
          </div>
        </div>

        {batchProgress && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 font-semibold flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin text-blue-600" />
            <span>{batchProgress}</span>
          </div>
        )}
      </div>

      {/* Primary Workbench Mode Switcher */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <button
          onClick={() => setWorkbenchMode('replication')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition shadow-xs ${
            workbenchMode === 'replication'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Real-World Style Replication & Robustness</span>
          <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-black ml-1">
            Production Suite
          </span>
        </button>

        <button
          onClick={() => setWorkbenchMode('blueprints')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition shadow-xs ${
            workbenchMode === 'blueprints'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Layers size={16} />
          <span>Deep Blueprint & Vision Analyzer</span>
        </button>
      </div>

      {workbenchMode === 'replication' ? (
        <TypographyReplicationView />
      ) : (
        <>
      {/* Style Selector Horizontal Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Reference Demo Style ({styles.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Click a card to inspect reverse-engineered blueprint</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {styles.map((style) => {
            const isSelected = style.styleId === activeStyleId;
            return (
              <button
                key={style.styleId}
                onClick={() => setActiveStyleId(style.styleId)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-[#1a73e8] bg-blue-50/50 shadow-md ring-2 ring-[#1a73e8]/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      style.category === 'luxury'
                        ? 'bg-amber-100 text-amber-800'
                        : style.category === 'cyber-tech'
                        ? 'bg-cyan-100 text-cyan-800'
                        : style.category === 'depth'
                        ? 'bg-indigo-100 text-indigo-800'
                        : style.category === 'paper-collage'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {style.category}
                  </span>
                  {style.analyzed ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400">Unanalyzed</span>
                  )}
                </div>

                <div className="font-bold text-xs text-slate-800 truncate">{style.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{style.fontFamily} • {style.entranceMotion}</div>

                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                  <div
                    className="h-2.5 w-2.5 rounded-full border border-slate-300"
                    style={{ backgroundColor: style.primaryTextColor }}
                  />
                  <div
                    className="h-2.5 w-2.5 rounded-full border border-slate-300"
                    style={{ backgroundColor: style.accentColor }}
                  />
                  <span className="text-[9px] font-semibold text-slate-400 ml-auto">
                    {Math.round((style.overallConfidence || 0.88) * 100)}% Conf
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Reverse-Engineering Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reference Video Player & Temporal Keyframe Scrubber (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Reference Demo: {activeStyleSummary?.name}
                </h3>
              </div>
              <button
                onClick={() => runAnalysis(activeStyleId, true)}
                disabled={analyzingStyle === activeStyleId}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1a73e8] hover:bg-blue-100 text-[11px] font-bold transition disabled:opacity-50"
              >
                <RefreshCw size={12} className={analyzingStyle === activeStyleId ? 'animate-spin' : ''} />
                <span>Re-Analyze Video</span>
              </button>
            </div>

            {/* Video Player */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-[480px] mx-auto flex items-center justify-center shadow-inner">
              {activeStyleSummary?.sourceVideoUrl ? (
                <video
                  ref={videoRef}
                  src={activeStyleSummary.sourceVideoUrl}
                  controls
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-slate-500 text-xs font-medium">No video source available</div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
              <span>Timecode: {currentTime.toFixed(2)}s</span>
              <a
                href={activeStyleSummary?.sourceVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#1a73e8] hover:underline"
              >
                <span>Original MP4</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Temporal Transition Keyframe Gallery */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Activity size={14} className="text-[#1a73e8]" />
                <span>Sampled Frames & Transitions ({activeBlueprint?.sampleKeyframes?.length || 0})</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Click to seek video</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {activeBlueprint?.sampleKeyframes?.map((frame, idx) => (
                <button
                  key={idx}
                  onClick={() => seekTo(frame.timestampSeconds)}
                  className="flex flex-col text-left p-2 rounded-lg border border-slate-200 hover:border-[#1a73e8] bg-slate-50 hover:bg-blue-50/40 transition group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span className="font-bold text-slate-700">{frame.timestampSeconds.toFixed(2)}s</span>
                    <span className="text-[9px] px-1 bg-slate-200 rounded font-sans uppercase">
                      {frame.visualStateRole || 'beat'}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 line-clamp-1 group-hover:text-[#1a73e8]">
                    {frame.detectedText}
                  </div>
                  <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{frame.visualStateDescription}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tracked Typography Events List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Sliders size={14} className="text-[#9333ea]" />
                <span>Tracked Typography Events ({activeBlueprint?.trackedEvents?.length || 0})</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Temporal Motion Tracking</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {activeBlueprint?.trackedEvents?.map((event, idx) => (
                <div
                  key={event.id || idx}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#1a73e8]">
                      {event.startTime.toFixed(2)}s - {event.endTime.toFixed(2)}s ({event.duration}s)
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                      {event.hierarchy}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-800">{event.text}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
                    <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      ⚡ {event.entrance.type}
                    </span>
                    <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      📈 {event.entrance.ramp.inferredEasing}
                    </span>
                    <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      👤 {event.layerPlacement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reverse-Engineered Style Blueprint Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-100 custom-scrollbar">
              {[
                { id: 'typography', label: 'Typography System', icon: Type },
                { id: 'composition', label: 'Composition', icon: Layout },
                { id: 'motion', label: 'Motion & Animation', icon: Activity },
                { id: 'color', label: 'Color & Effects', icon: Palette },
                { id: 'subject', label: 'Subject & Depth', icon: UserCheck },
                { id: 'rhythm', label: 'Rhythm & Audio', icon: Music },
                { id: 'confidence', label: 'Confidence Report', icon: ShieldAlert },
                { id: 'json', label: 'Blueprint JSON', icon: Code },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1a73e8] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Blueprint Content Sections */}
            {activeBlueprint ? (
              <div className="space-y-6">
                {/* 1. Typography Tab */}
                {activeTab === 'typography' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Estimated Google Font Family
                        </div>
                        <div className="text-base font-bold text-slate-900">
                          {activeBlueprint.typography.fontFamilyEstimate.value}
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {activeBlueprint.typography.fontFamilyEstimate.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(activeBlueprint.typography.fontFamilyEstimate.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Font Classification Category
                        </div>
                        <div className="text-base font-bold text-slate-900">
                          {activeBlueprint.typography.fontCategory.value}
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            {activeBlueprint.typography.fontCategory.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(activeBlueprint.typography.fontCategory.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tier Treatments */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Visual Hierarchy Tier Rules
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Hero Tier */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                              Hero Tier
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {activeBlueprint.typography.heroTreatment.relativeScale}x Scale
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-800 uppercase">
                            Weight: {activeBlueprint.typography.heroTreatment.fontWeight}
                          </div>
                          <div className="text-[10px] text-slate-500 space-y-0.5 font-mono">
                            <div>Casing: {activeBlueprint.typography.heroTreatment.casing}</div>
                            <div>Letter Spacing: {activeBlueprint.typography.heroTreatment.letterSpacingRatio}</div>
                            <div>Line Height: {activeBlueprint.typography.heroTreatment.lineHeightRatio}</div>
                          </div>
                        </div>

                        {/* Lead Tier */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              Lead Tier
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {activeBlueprint.typography.leadTreatment.relativeScale}x Scale
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            Weight: {activeBlueprint.typography.leadTreatment.fontWeight}
                          </div>
                          <div className="text-[10px] text-slate-500 space-y-0.5 font-mono">
                            <div>Casing: {activeBlueprint.typography.leadTreatment.casing}</div>
                            <div>Style: {activeBlueprint.typography.leadTreatment.fontStyle || 'normal'}</div>
                            <div>Opacity: {activeBlueprint.typography.leadTreatment.opacity}</div>
                          </div>
                        </div>

                        {/* Sub Tier */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                              Sub Tier
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {activeBlueprint.typography.subTreatment.relativeScale}x Scale
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            Weight: {activeBlueprint.typography.subTreatment.fontWeight}
                          </div>
                          <div className="text-[10px] text-slate-500 space-y-0.5 font-mono">
                            <div>Casing: {activeBlueprint.typography.subTreatment.casing}</div>
                            <div>Opacity: {activeBlueprint.typography.subTreatment.opacity}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                      <div className="font-bold text-slate-800">Word Grouping & Density Rules:</div>
                      <div className="font-mono text-[11px] text-slate-600">
                        • Grouping Rule: <span className="font-bold text-[#1a73e8]">{activeBlueprint.typography.wordGroupingRule}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600">
                        • Text Density: <span className="font-bold text-[#1a73e8]">{activeBlueprint.typography.textDensity.value}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600">
                        • Line Break Policy: <span className="font-bold text-[#1a73e8]">{activeBlueprint.typography.lineBreakPolicy}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Composition Tab */}
                {activeTab === 'composition' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Normalized Anchor Position
                        </div>
                        <div className="text-base font-bold text-slate-900 font-mono">
                          X: {activeBlueprint.composition.anchor.xRatio} | Y: {activeBlueprint.composition.anchor.yRatio}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Alignment: {activeBlueprint.composition.anchor.horizontalAlign} • {activeBlueprint.composition.anchor.verticalAlign}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Layout Structure
                        </div>
                        <div className="text-base font-bold text-slate-900 capitalize">
                          {activeBlueprint.composition.layoutStructure.value.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Edge-to-edge: {activeBlueprint.composition.isEdgeToEdge ? 'Yes' : 'No'} • Negative Space: {(activeBlueprint.composition.negativeSpaceRatio * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Responsive Adaptations */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Resolution-Independent Adaptations
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                          <div className="font-bold text-slate-800 text-xs">📱 9:16 Portrait (Reel)</div>
                          <div>Y-Ratio: {activeBlueprint.composition.aspectRatioAdaptation.portrait_9_16.yRatio}</div>
                          <div>Scale: {activeBlueprint.composition.aspectRatioAdaptation.portrait_9_16.scaleMultiplier}x</div>
                          <div>Max Line: {activeBlueprint.composition.aspectRatioAdaptation.portrait_9_16.maxLineWidthRatio}</div>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                          <div className="font-bold text-slate-800 text-xs">🖥️ 16:9 Landscape</div>
                          <div>Y-Ratio: {activeBlueprint.composition.aspectRatioAdaptation.landscape_16_9.yRatio}</div>
                          <div>Scale: {activeBlueprint.composition.aspectRatioAdaptation.landscape_16_9.scaleMultiplier}x</div>
                          <div>Align: {activeBlueprint.composition.aspectRatioAdaptation.landscape_16_9.alignment}</div>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                          <div className="font-bold text-slate-800 text-xs">🔲 1:1 Square</div>
                          <div>Y-Ratio: {activeBlueprint.composition.aspectRatioAdaptation.square_1_1.yRatio}</div>
                          <div>Scale: {activeBlueprint.composition.aspectRatioAdaptation.square_1_1.scaleMultiplier}x</div>
                          <div>Max Line: {activeBlueprint.composition.aspectRatioAdaptation.square_1_1.maxLineWidthRatio}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Motion & Animation Tab */}
                {activeTab === 'motion' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Entrance Motion & Easing
                        </div>
                        <div className="text-base font-bold text-[#1a73e8] uppercase">
                          {activeBlueprint.animation.entrance.type.value}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Easing: <span className="font-bold text-slate-800">{activeBlueprint.animation.entrance.easing.value}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Duration: {activeBlueprint.animation.entrance.durationSeconds * 1000}ms
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Active & Exit Behavior
                        </div>
                        <div className="text-base font-bold text-slate-900 capitalize">
                          Active: {activeBlueprint.animation.active.type}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Exit: {activeBlueprint.animation.exit.type} ({activeBlueprint.animation.exit.durationSeconds * 1000}ms)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Motion Intensity: {activeBlueprint.animation.motionIntensity}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Motion Ranges & Interpolation Bounds
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-slate-600">
                        <div>
                          Scale: [{activeBlueprint.animation.entrance.scaleRange[0]}, {activeBlueprint.animation.entrance.scaleRange[1]}]
                        </div>
                        <div>
                          Opacity: [{activeBlueprint.animation.entrance.opacityRange[0]}, {activeBlueprint.animation.entrance.opacityRange[1]}]
                        </div>
                        <div>
                          Rotation: [{activeBlueprint.animation.entrance.rotationRangeDeg?.[0] || 0}°, {activeBlueprint.animation.entrance.rotationRangeDeg?.[1] || 0}°]
                        </div>
                        <div>
                          Stagger: {activeBlueprint.animation.wordByWordStagger ? `${activeBlueprint.animation.staggerDelaySeconds}s` : 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Color & Effects Tab */}
                {activeTab === 'color' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="h-6 w-full rounded-md border border-slate-300" style={{ backgroundColor: activeBlueprint.color.primaryTextColor.value }} />
                        <div className="text-[10px] font-bold uppercase text-slate-400">Primary Text</div>
                        <div className="text-xs font-mono font-bold text-slate-800">{activeBlueprint.color.primaryTextColor.value}</div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="h-6 w-full rounded-md border border-slate-300" style={{ backgroundColor: activeBlueprint.color.secondaryTextColor.value }} />
                        <div className="text-[10px] font-bold uppercase text-slate-400">Secondary Text</div>
                        <div className="text-xs font-mono font-bold text-slate-800">{activeBlueprint.color.secondaryTextColor.value}</div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="h-6 w-full rounded-md border border-slate-300" style={{ backgroundColor: activeBlueprint.color.accentColor.value }} />
                        <div className="text-[10px] font-bold uppercase text-slate-400">Accent Highlight</div>
                        <div className="text-xs font-mono font-bold text-slate-800">{activeBlueprint.color.accentColor.value}</div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="h-6 w-full rounded-md border border-slate-300" style={{ backgroundColor: activeBlueprint.color.secondaryAccentColor.value }} />
                        <div className="text-[10px] font-bold uppercase text-slate-400">Secondary Accent</div>
                        <div className="text-xs font-mono font-bold text-slate-800">{activeBlueprint.color.secondaryAccentColor.value}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Visual Effects & Color Grade
                      </h4>
                      <div className="text-xs text-slate-600 font-mono space-y-1">
                        <div>• Color Grade Filter: <span className="font-bold text-slate-900">{activeBlueprint.color.colorGrade.filter}</span></div>
                        <div>• Glow Effect: {activeBlueprint.color.effects.hasGlow ? `Active (${activeBlueprint.color.effects.glowRadiusPx}px ${activeBlueprint.color.effects.glowColor})` : 'Disabled'}</div>
                        <div>• Drop Shadow: {activeBlueprint.color.effects.hasDropShadow ? `Active (blur ${activeBlueprint.color.effects.shadowBlur}px)` : 'Disabled'}</div>
                        <div>• Glass Backdrop: {activeBlueprint.color.effects.hasGlassBackdrop ? `Active (blur ${activeBlueprint.color.effects.glassBlurPx}px)` : 'Disabled'}</div>
                        <div>• Torn Paper Tape: {activeBlueprint.color.effects.hasTapeBadge ? 'Active' : 'Disabled'}</div>
                        <div>• Contrast Ratio Estimate: <span className="font-bold text-emerald-600">{activeBlueprint.color.contrastRatioEstimate}:1 (High)</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Subject & Depth Tab */}
                {activeTab === 'subject' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Subject Awareness Mode
                        </div>
                        <div className="text-base font-bold text-slate-900 capitalize">
                          {activeBlueprint.subjectRelationship.awarenessMode.value.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Status: {activeBlueprint.subjectRelationship.awarenessMode.status} ({(activeBlueprint.subjectRelationship.awarenessMode.confidence * 100).toFixed(0)}% conf)
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Layer Placement (Depth)
                        </div>
                        <div className="text-base font-bold text-purple-700 capitalize">
                          {activeBlueprint.subjectRelationship.layerPlacement.value.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Requires Cutout: {activeBlueprint.subjectRelationship.requiresSubjectCutout ? 'Yes (3-Layer Depth)' : 'No'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600 font-mono">
                      <div className="font-bold text-slate-800">Collision Avoidance Parameters:</div>
                      <div>• Headroom Safety Margin: {activeBlueprint.subjectRelationship.collisionAvoidance.headroomSafetyRatio * 100}%</div>
                      <div>• Face Avoidance Weight: {activeBlueprint.subjectRelationship.collisionAvoidance.faceAvoidanceWeight * 100}%</div>
                      <div>• Pill Capsule Backdrop: {activeBlueprint.subjectRelationship.hasPillBackdropAroundSubject ? 'Enabled' : 'Disabled'}</div>
                    </div>
                  </div>
                )}

                {/* 6. Rhythm & Audio Tab */}
                {activeTab === 'rhythm' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Style Personality & Rhythm
                        </div>
                        <div className="text-base font-bold text-slate-900 capitalize">
                          {activeBlueprint.pacingAndRhythm.personality.value.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Pattern: <span className="font-bold text-[#1a73e8]">{activeBlueprint.pacingAndRhythm.rhythmPattern.value}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Sound Sync & SFX Personality
                        </div>
                        <div className="text-base font-bold text-slate-900 capitalize">
                          {activeBlueprint.soundSync.personality.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Primary Hit: {activeBlueprint.soundSync.primaryHitType} • Ducking: {activeBlueprint.soundSync.duckingEnabled ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600 font-mono">
                      <div className="font-bold text-slate-800">Pacing Cadence:</div>
                      <div>• Target Words Per Phrase: {activeBlueprint.pacingAndRhythm.targetWordsPerPhrase} words</div>
                      <div>• Average Phrase Duration: {activeBlueprint.pacingAndRhythm.averagePhraseDurationSec}s</div>
                      <div>• Transition Frequency: ~{activeBlueprint.pacingAndRhythm.transitionFrequencyPerMinute} cuts/min</div>
                    </div>
                  </div>
                )}

                {/* 7. Confidence & Validation Tab */}
                {activeTab === 'confidence' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                        <div className="text-[10px] font-bold uppercase text-emerald-600">Typography</div>
                        <div className="text-lg font-extrabold text-emerald-700">{activeBlueprint.validation.typographyConsistencyScore}%</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center">
                        <div className="text-[10px] font-bold uppercase text-blue-600">Motion</div>
                        <div className="text-lg font-extrabold text-blue-700">{activeBlueprint.validation.motionConsistencyScore}%</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center">
                        <div className="text-[10px] font-bold uppercase text-purple-600">Color System</div>
                        <div className="text-lg font-extrabold text-purple-700">{activeBlueprint.validation.colorConsistencyScore}%</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                        <div className="text-[10px] font-bold uppercase text-amber-600">Distinctiveness</div>
                        <div className="text-lg font-extrabold text-amber-700">{activeBlueprint.validation.distinctivenessScore}%</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Property-Level Confidence & Evidence Breakdown
                      </h4>
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                            <tr>
                              <th className="p-3">Property</th>
                              <th className="p-3">Extracted Value</th>
                              <th className="p-3">Confidence</th>
                              <th className="p-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr>
                              <td className="p-3 font-semibold">Font Family</td>
                              <td className="p-3">{activeBlueprint.typography.fontFamilyEstimate.value}</td>
                              <td className="p-3">{(activeBlueprint.typography.fontFamilyEstimate.confidence * 100).toFixed(0)}%</td>
                              <td className="p-3"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">{activeBlueprint.typography.fontFamilyEstimate.status}</span></td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold">Font Category</td>
                              <td className="p-3">{activeBlueprint.typography.fontCategory.value}</td>
                              <td className="p-3">{(activeBlueprint.typography.fontCategory.confidence * 100).toFixed(0)}%</td>
                              <td className="p-3"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">{activeBlueprint.typography.fontCategory.status}</span></td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold">Entrance Motion</td>
                              <td className="p-3">{activeBlueprint.animation.entrance.type.value}</td>
                              <td className="p-3">{(activeBlueprint.animation.entrance.type.confidence * 100).toFixed(0)}%</td>
                              <td className="p-3"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">{activeBlueprint.animation.entrance.type.status}</span></td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold">Motion Easing</td>
                              <td className="p-3">{activeBlueprint.animation.entrance.easing.value}</td>
                              <td className="p-3">{(activeBlueprint.animation.entrance.easing.confidence * 100).toFixed(0)}%</td>
                              <td className="p-3"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">{activeBlueprint.animation.entrance.easing.status}</span></td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold">Primary Text Color</td>
                              <td className="p-3">{activeBlueprint.color.primaryTextColor.value}</td>
                              <td className="p-3">{(activeBlueprint.color.primaryTextColor.confidence * 100).toFixed(0)}%</td>
                              <td className="p-3"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">{activeBlueprint.color.primaryTextColor.status}</span></td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold">Subject Layering</td>
                              <td className="p-3">{activeBlueprint.subjectRelationship.layerPlacement.value}</td>
                              <td className="p-3">{(activeBlueprint.subjectRelationship.layerPlacement.confidence * 100).toFixed(0)}%</td>
                              <td className="p-3"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">{activeBlueprint.subjectRelationship.layerPlacement.status}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. JSON Blueprint Tab */}
                {activeTab === 'json' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500">
                        lib/typography/blueprints/{activeBlueprint.metadata.styleId}.json
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyBlueprintJson}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
                        >
                          <Copy size={13} />
                          <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                        </button>
                        <button
                          onClick={downloadBlueprintJson}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition"
                        >
                          <Download size={13} />
                          <span>Download .json</span>
                        </button>
                      </div>
                    </div>

                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[500px] leading-relaxed custom-scrollbar">
                      {JSON.stringify(activeBlueprint, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-[#1a73e8] flex items-center justify-center mx-auto">
                  <Sparkles size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">No Blueprint Generated Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click &quot;Re-Analyze Video&quot; to run FFmpeg multi-stage frame extraction and Gemini multimodal reverse-engineering on this demo.
                  </p>
                </div>
                <button
                  onClick={() => runAnalysis(activeStyleId, true)}
                  disabled={analyzingStyle === activeStyleId}
                  className="px-5 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition shadow-sm"
                >
                  {analyzingStyle === activeStyleId ? 'Analyzing Demo...' : 'Analyze Demo Video Now'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </>
      )}

      {/* Custom Video Analysis Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap size={18} className="text-[#1a73e8]" />
                <span>Analyze Any Reference Typography Video</span>
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide a public URL to any MP4 video (Cloudinary, S3, or CDN). The system will sample temporal frames,
              infer typography and motion rules, generate a reusable Style Blueprint, and make it available.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Video MP4 URL</label>
              <input
                type="url"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/.../video.mp4"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={analyzeCustomVideo}
                disabled={!customVideoUrl || analyzingStyle === 'custom'}
                className="px-5 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition disabled:opacity-50"
              >
                {analyzingStyle === 'custom' ? 'Analyzing...' : 'Run Reverse-Engineering'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
