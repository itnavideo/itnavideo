"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WhiteboardEditableWorkspace } from "@/components/dashboard/whiteboard/WhiteboardEditableWorkspace";

// Pre-calculated live scenes from the audio
const PREVIEW_DATA = {
  title: "Power Of Persistence",
  mediaSrc: "/whiteboard-preview.mp3",
  mediaType: "audio" as const,
  durationSeconds: 66,
  scenes: [
    {
      id: "wb-scene-0",
      sceneIndex: 0,
      startTime: 0,
      endTime: 6.06,
      duration: 6.06,
      archetype: "keyword_slam" as const,
      headline: "The power of never giving up",
      heroVisual: {
        drawingId: "lightning_bolt",
        label: "Power & Resilience",
      },
      accentColor: "#14B8A6",
    },
    {
      id: "wb-scene-1",
      sceneIndex: 1,
      startTime: 6.92,
      endTime: 13.64,
      duration: 6.72,
      archetype: "hero_center" as const,
      headline: "Imagine a young entrepreneur",
      heroVisual: {
        drawingId: "piggy_bank",
        label: "Seed Dream",
      },
      accentColor: "#FF5722",
    },
    {
      id: "wb-scene-2",
      sceneIndex: 2,
      startTime: 14.66,
      endTime: 19.54,
      duration: 4.88,
      archetype: "hub_spoke" as const,
      headline: "No money, no team, no guarantee",
      heroVisual: {
        drawingId: "money_stack",
        label: "Zero Capital",
      },
      supportingItems: [
        { id: "1", text: "Zero Funding" },
        { id: "2", text: "Solo Builder" },
      ],
      accentColor: "#3B82F6",
    },
    {
      id: "wb-scene-3",
      sceneIndex: 3,
      startTime: 20.37,
      endTime: 25.07,
      duration: 4.7,
      archetype: "step_ladder" as const,
      headline: "Every single day he works hard",
      heroVisual: {
        drawingId: "calendar_sheet",
        label: "Daily Consistency",
      },
      accentColor: "#10B981",
    },
    {
      id: "wb-scene-4",
      sceneIndex: 4,
      startTime: 25.55,
      endTime: 32.3,
      duration: 6.75,
      archetype: "split_comparison" as const,
      headline: "Rejections pile up & doubts creep in",
      heroVisual: {
        drawingId: "alert_triangle",
        label: "Doubts & Obstacles",
      },
      comparisonData: {
        leftTitle: "The Doubters",
        leftItem: "Too risky, stop now",
        rightTitle: "Inner Drive",
        rightItem: "Keep pushing every day",
      },
      accentColor: "#EF4444",
    },
    {
      id: "wb-scene-5",
      sceneIndex: 5,
      startTime: 33.19,
      endTime: 38.31,
      duration: 5.12,
      archetype: "stat_callout" as const,
      headline: "Most people would quit right here",
      heroVisual: {
        drawingId: "vintage_hourglass",
        label: "Time Running Out",
      },
      statData: {
        number: "90%",
        metric: "Give up too early",
        context: "The inflection point where champions persist",
      },
      accentColor: "#FFA000",
    },
    {
      id: "wb-scene-6",
      sceneIndex: 6,
      startTime: 39.02,
      endTime: 44.89,
      duration: 5.87,
      archetype: "hero_center" as const,
      headline: "One small breakthrough changes everything",
      heroVisual: {
        drawingId: "rocket_launch",
        label: "Breakthrough Launch",
      },
      accentColor: "#10B981",
    },
    {
      id: "wb-scene-7",
      sceneIndex: 7,
      startTime: 45.42,
      endTime: 52.34,
      duration: 6.92,
      archetype: "step_ladder" as const,
      headline: "First customer, first revenue, first momentum",
      heroVisual: {
        drawingId: "gold_bars",
        label: "Gold & Revenue",
      },
      accentColor: "#3B82F6",
    },
    {
      id: "wb-scene-8",
      sceneIndex: 8,
      startTime: 53.02,
      endTime: 59.85,
      duration: 6.83,
      archetype: "split_comparison" as const,
      headline: "Difference between failure and victory",
      heroVisual: {
        drawingId: "balancing_scale",
        label: "Balance & Choice",
      },
      comparisonData: {
        leftTitle: "Giving Up",
        leftItem: "Zero chance of winning",
        rightTitle: "Staying in Game",
        rightItem: "Success is inevitable",
      },
      accentColor: "#14B8A6",
    },
    {
      id: "wb-scene-9",
      sceneIndex: 9,
      startTime: 60.5,
      endTime: 65.84,
      duration: 5.34,
      archetype: "keyword_slam" as const,
      headline: "Never give up on your dream",
      heroVisual: {
        drawingId: "trophy_gold",
        label: "Ultimate Victory",
      },
      accentColor: "#FF5722",
    },
  ],
  showHand: true,
};

export default function WhiteboardLivePreviewPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-white py-6 px-4 sm:px-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between pb-6 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/whiteboard-video"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-zinc-300 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Studio</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>Whiteboard Interactive Studio Workspace</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Live Layer Editor
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <WhiteboardEditableWorkspace
          initialScenes={PREVIEW_DATA.scenes as any}
          audioUrl={PREVIEW_DATA.mediaSrc}
          durationSeconds={PREVIEW_DATA.durationSeconds}
          fontPersonality="marker"
          markerColor="auto"
          handStyle="right"
        />
      </div>
    </div>
  );
}
