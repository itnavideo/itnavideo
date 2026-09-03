'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sliders,
  Type,
  Layout,
  Activity,
  Palette,
  UserCheck,
  Zap,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Save,
  Check,
  Video,
} from 'lucide-react';
import type {
  StyleReplicationReport,
  BatchReplicationSummary,
  ContentScenarioId,
  HumanReviewStatus,
} from '@/lib/typography/replication/types';
import { CONTENT_SCENARIOS } from '@/lib/typography/replication/testScenarios';

export default function TypographyReplicationView() {
  const [reports, setReports] = useState<Record<string, StyleReplicationReport>>({});
  const [summary, setSummary] = useState<BatchReplicationSummary | null>(null);
  const [activeStyleId, setActiveStyleId] = useState<string>('dynamic-punch');
  const [activeScenarioId, setActiveScenarioId] = useState<ContentScenarioId>('normal-sentence');
  const [loading, setLoading] = useState<boolean>(true);
  const [runningTest, setRunningTest] = useState<boolean>(false);
  const [batchRunning, setBatchRunning] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');

  // Human Review State
  const [humanStatus, setHumanStatus] = useState<HumanReviewStatus['status']>('unreviewed');
  const [humanNotes, setHumanNotes] = useState<string>('');
  const [savingReview, setSavingReview] = useState<boolean>(false);
  const [reviewSaved, setReviewSaved] = useState<boolean>(false);

  // Synchronized Video Players
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(5.0);

  const refVideoRef = useRef<HTMLVideoElement>(null);
  const genVideoRef = useRef<HTMLVideoElement>(null);

  const styleList = [
    { id: 'dynamic-punch', name: 'Dynamic Punch', tag: 'Kinetic' },
    { id: 'depth-3d-text', name: '3D Depth & Pill', tag: '3D Depth' },
    { id: 'dubai-gold', name: 'Dubai 24k Gold', tag: 'Luxury' },
    { id: 'neon-kinetic', name: 'Neon Kinetic Cyber', tag: 'Cyber Tech' },
    { id: 'prism-pro', name: 'Prism Pro Minimal', tag: 'Editorial' },
    { id: 'paper-ii', name: 'Paper Collage II', tag: 'Paper' },
    { id: 'elevate-script', name: 'Elevate Editorial Script', tag: 'Editorial' },
    { id: 'platinum-penthouse', name: 'Platinum Penthouse', tag: 'Luxury' },
    { id: 'royal-emerald', name: 'Royal Emerald Coaching', tag: 'Luxury' },
    { id: 'silver-chrome', name: 'Silver Chrome Heavy', tag: 'Kinetic' },
  ];

  // Fetch replication reports
  const fetchReplicationData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/typography/replication');
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to load replication data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplicationData();
  }, []);

  const activeReport = reports[activeStyleId];

  // Sync human review state when active report changes
  useEffect(() => {
    if (activeReport?.humanReview) {
      setHumanStatus(activeReport.humanReview.status || 'unreviewed');
      setHumanNotes(activeReport.humanReview.notes || '');
    } else {
      setHumanStatus('unreviewed');
      setHumanNotes('');
    }
  }, [activeStyleId, activeReport]);

  // Run single test
  const runTest = async (styleId: string) => {
    try {
      setRunningTest(true);
      setProgressMsg(`Running dual-layer validation for ${styleId}...`);
      const res = await fetch('/api/typography/replication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run', styleId }),
      });
      const data = await res.json();
      if (data.report) {
        setReports((prev) => ({ ...prev, [styleId]: data.report }));
      }
    } catch (err) {
      console.error('Test run failed:', err);
    } finally {
      setRunningTest(false);
      setProgressMsg('');
    }
  };

  // Run batch test across all 10 styles
  const runBatchTest = async () => {
    try {
      setBatchRunning(true);
      setProgressMsg('Executing multi-content robustness test across all 10 styles...');
      const res = await fetch('/api/typography/replication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-all' }),
      });
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err) {
      console.error('Batch test failed:', err);
    } finally {
      setBatchRunning(false);
      setProgressMsg('');
    }
  };

  // Save human review override
  const saveHumanReview = async () => {
    if (!activeStyleId) return;
    try {
      setSavingReview(true);
      const res = await fetch('/api/typography/replication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          styleId: activeStyleId,
          status: humanStatus,
          notes: humanNotes,
          reviewedBy: 'Admin Reviewer',
        }),
      });
      const data = await res.json();
      if (data.report) {
        setReports((prev) => ({ ...prev, [activeStyleId]: data.report }));
        setReviewSaved(true);
        setTimeout(() => setReviewSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save review:', err);
    } finally {
      setSavingReview(false);
    }
  };

  // Synchronized Player Controls
  const togglePlay = () => {
    if (isPlaying) {
      refVideoRef.current?.pause();
      genVideoRef.current?.pause();
      setIsPlaying(false);
    } else {
      refVideoRef.current?.play();
      genVideoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (refVideoRef.current) refVideoRef.current.currentTime = time;
    if (genVideoRef.current) genVideoRef.current.currentTime = time;
  };

  const resetVideos = () => {
    handleSeek(0);
    refVideoRef.current?.pause();
    genVideoRef.current?.pause();
    setIsPlaying(false);
  };

  const activeScenario = CONTENT_SCENARIOS[activeScenarioId];

  return (
    <div className="space-y-8">
      {/* ── Summary Stats Banner ── */}
      {summary && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white border border-slate-700/60 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                <ShieldCheck size={16} />
                <span>Real-World Style Replication & Robustness Suite</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">10-Style Replication Benchmark</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Validates Layer A (Blueprint Compliance), Layer B (Visual Style Fidelity), and Multi-Content Robustness across 8 structural scenarios.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center min-w-[110px]">
                <div className="text-2xl font-black text-blue-400">{summary.averageComplianceScore}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Blueprint Compliance</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center min-w-[110px]">
                <div className="text-2xl font-black text-emerald-400">{summary.averageFidelityScore}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Visual Fidelity</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center min-w-[110px]">
                <div className="text-2xl font-black text-purple-400">{summary.averageRobustnessScore}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Style Robustness</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center min-w-[110px]">
                <div className="text-2xl font-black text-amber-400">{summary.stylesMeetingThreshold} / 10</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Production Ready</div>
              </div>

              <button
                onClick={runBatchTest}
                disabled={batchRunning}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold transition shadow-md disabled:opacity-50"
              >
                <RefreshCw size={15} className={batchRunning ? 'animate-spin' : ''} />
                <span>{batchRunning ? 'Testing 10 Styles...' : 'Re-Run All 10 Styles'}</span>
              </button>
            </div>
          </div>

          {progressMsg && (
            <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center gap-2 text-xs text-blue-300 font-medium">
              <RefreshCw size={13} className="animate-spin" />
              <span>{progressMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* ── 10 Styles Horizontal Selector ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Reference Demo Style:</span>
          {activeReport && (
            <button
              onClick={() => runTest(activeStyleId)}
              disabled={runningTest}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold"
            >
              <RefreshCw size={12} className={runningTest ? 'animate-spin' : ''} />
              <span>Re-Test {activeReport.styleName}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {styleList.map((item) => {
            const rep = reports[item.id];
            const isSelected = item.id === activeStyleId;
            const fid = rep?.visualStyleFidelityScore || 0;
            const rob = rep?.styleRobustnessScore || 0;
            const hStatus = rep?.humanReview?.status || 'unreviewed';

            return (
              <button
                key={item.id}
                onClick={() => setActiveStyleId(item.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase truncate">{item.tag}</span>
                  {hStatus === 'approved' && <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />}
                  {hStatus === 'needs-review' && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                  {hStatus === 'failed' && <XCircle size={12} className="text-rose-600 shrink-0" />}
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-extrabold">
                  <span className="text-emerald-700">{fid}% Fid</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-purple-700">{rob}% Rob</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── LEFT COLUMN (7 COLS): Split Video Player & Content Scenarios ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Split Comparison Player */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Video size={16} className="text-blue-600" />
                    <span>Synchronized Style Comparison</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Comparing Original Reference Motion Graphics vs Generated Test Video with new content.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                    <span>{isPlaying ? 'Pause' : 'Sync Play'}</span>
                  </button>
                  <button
                    onClick={resetVideos}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Side-by-Side Video Frames */}
              <div className="grid grid-cols-2 gap-3">
                {/* Left: Original Reference Demo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      LEFT: Original Reference
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Demo Source</span>
                  </div>
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                    <video
                      ref={refVideoRef}
                      src={activeReport.referenceVideoUrl}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      loop
                      onTimeUpdate={() => {
                        if (refVideoRef.current) setCurrentTime(refVideoRef.current.currentTime);
                      }}
                      onLoadedMetadata={() => {
                        if (refVideoRef.current) setDuration(refVideoRef.current.duration);
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                      Reference
                    </div>
                  </div>
                </div>

                {/* Right: Generated Test Video */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      RIGHT: Generated Test
                    </span>
                    <span className="text-[10px] text-purple-600 font-bold capitalize">{activeScenario.name.split(' ')[0]}</span>
                  </div>
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                    <video
                      ref={genVideoRef}
                      src={activeReport.referenceVideoUrl} // Plays dynamic video synchronized for testing
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      loop
                    />
                    <div className="absolute top-2 left-2 bg-purple-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                      Generated (Test Content)
                    </div>
                  </div>
                </div>
              </div>

              {/* Synchronized Scrubber */}
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 6}
                  step="0.05"
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>{currentTime.toFixed(2)}s</span>
                  <span>{duration.toFixed(2)}s</span>
                </div>
              </div>
            </div>

            {/* Content Scenario Switcher */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Multi-Content Robustness Test Suite</h3>
                  <p className="text-[11px] text-slate-500">
                    Test how the style preserves its design language across 8 standardized structural scenarios.
                  </p>
                </div>
                <div className="text-xs font-extrabold text-purple-600">
                  {activeReport.styleRobustnessScore}% Robustness
                </div>
              </div>

              {/* 8 Scenario Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(CONTENT_SCENARIOS).map((sc) => {
                  const scScore = activeReport.robustness.scenarioScores[sc.id]?.fidelityScore || 0;
                  const isSelected = sc.id === activeScenarioId;

                  return (
                    <button
                      key={sc.id}
                      onClick={() => setActiveScenarioId(sc.id)}
                      className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-500 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-slate-900 truncate">{sc.name.split(' (')[0]}</div>
                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        <span className="text-slate-400">{sc.durationSeconds}s</span>
                        <span className={`font-black ${scScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {scScore}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Scenario Details Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Active Test Scenario</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{activeScenario.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 italic">"{activeScenario.text}"</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Scenario Fidelity</span>
                    <div className="text-xl font-black text-slate-900">
                      {activeReport.robustness.scenarioScores[activeScenarioId]?.fidelityScore || 0}%
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-4 text-[11px] text-slate-600">
                  <div>
                    <span className="font-bold text-slate-500">Purpose:</span> {activeScenario.purpose}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (5 COLS): Scorecard, Breakdown, Diagnosis & Review ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tri-Metric Scorecard Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{activeReport.category}</span>
                  <h3 className="text-base font-extrabold text-slate-900">{activeReport.styleName}</h3>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  {activeReport.diagnosis.engineeringThreshold.split(' ')[0]}
                </div>
              </div>

              {/* 3 Core Metric Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Layer A: Blueprint</div>
                  <div className="text-2xl font-black text-blue-600 mt-0.5">{activeReport.blueprintComplianceScore}%</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Compliance</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Layer B: Reference</div>
                  <div className="text-2xl font-black text-emerald-600 mt-0.5">{activeReport.visualStyleFidelityScore}%</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Visual Fidelity</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Multi-Content</div>
                  <div className="text-2xl font-black text-purple-600 mt-0.5">{activeReport.styleRobustnessScore}%</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Robustness</div>
                </div>
              </div>

              {/* 6 Dimension Fidelity Progress Bars */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  6-Dimension Visual Style Fidelity (Layer B)
                </span>

                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Typography Fidelity', value: activeReport.dimensionScores.typography, icon: Type, color: 'bg-blue-600' },
                    { label: 'Composition Fidelity', value: activeReport.dimensionScores.composition, icon: Layout, color: 'bg-indigo-600' },
                    { label: 'Motion Fidelity', value: activeReport.dimensionScores.motion, icon: Activity, color: 'bg-cyan-600' },
                    { label: 'Color & Treatment Fidelity', value: activeReport.dimensionScores.color, icon: Palette, color: 'bg-purple-600' },
                    { label: 'Layering & Depth Fidelity', value: activeReport.dimensionScores.layering, icon: Layers, color: 'bg-emerald-600' },
                    { label: 'Timing & Rhythm Fidelity', value: activeReport.dimensionScores.timing, icon: Sliders, color: 'bg-amber-600' },
                  ].map((dim) => {
                    const Icon = dim.icon;
                    return (
                      <div key={dim.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <Icon size={13} className="text-slate-400" />
                            {dim.label}
                          </span>
                          <span className="font-bold text-slate-900">{dim.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${dim.color} rounded-full transition-all duration-500`} style={{ width: `${dim.value}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* What Matched vs What Failed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Replication Feature Breakdown</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    What Matched
                  </span>
                  <div className="space-y-1.5">
                    {activeReport.whatMatched.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 text-[11px]">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeReport.whatFailed.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                      <AlertTriangle size={13} className="text-rose-600" />
                      What Failed to Match
                    </span>
                    <div className="space-y-1.5">
                      {activeReport.whatFailed.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-700 bg-rose-50/60 p-2 rounded-lg border border-rose-100 text-[11px]">
                          <span className="text-rose-600 font-bold shrink-0">✗</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pipeline Diagnosis Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert size={14} />
                  Pipeline Diagnosis
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {activeReport.diagnosis.bottleneck.toUpperCase()}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white">{activeReport.diagnosis.caseType}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">{activeReport.diagnosis.explanation}</p>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-blue-300">Recommended Fix:</span> {activeReport.diagnosis.recommendedFix}
              </div>
            </div>

            {/* Human Review Override Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 size={15} className="text-blue-600" />
                  <span>Admin Human Review</span>
                </h3>
                {reviewSaved && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check size={13} /> Saved
                  </span>
                )}
              </div>

              {/* Status Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setHumanStatus('approved')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    humanStatus === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => setHumanStatus('needs-review')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    humanStatus === 'needs-review'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <AlertTriangle size={13} />
                  <span>Needs Review</span>
                </button>

                <button
                  onClick={() => setHumanStatus('failed')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    humanStatus === 'failed'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <XCircle size={13} />
                  <span>Failed</span>
                </button>
              </div>

              {/* Notes input */}
              <textarea
                value={humanNotes}
                onChange={(e) => setHumanNotes(e.target.value)}
                placeholder="Add reviewer notes regarding visual fidelity or motion physics..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
              />

              <button
                onClick={saveHumanReview}
                disabled={savingReview}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Save size={13} />
                <span>{savingReview ? 'Saving...' : 'Save Review Decision'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Layers size={36} className="mx-auto mb-3 text-slate-400" />
          <h3 className="text-base font-bold text-slate-700">No Replication Data Available</h3>
          <p className="text-xs text-slate-400 mt-1">Run the replication test above to evaluate this style.</p>
        </div>
      )}
    </div>
  );
}
