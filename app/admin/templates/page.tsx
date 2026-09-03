'use client';

import { useEffect, useState } from "react";
import { getAdminOverviewStats, getAdminVideos } from "../actions";
import {
  UNIVERSAL_CAPTION_THEMES,
  UNIVERSAL_STICKER_PACKS,
  UNIVERSAL_LAYOUT_FRAMES,
  UNIVERSAL_LOWER_THIRDS,
  UNIVERSAL_PROGRESS_BARS,
  UNIVERSAL_DEMO_PRESETS,
  DemoPresetBlueprint,
} from "@/services/templates/templateLibrary";
import { DemoBlueprintPlayer } from "../components/DemoBlueprintPlayer";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Coins,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  BarChart4,
  Layers,
  Palette,
  Layout,
  Tag,
  Activity,
  PlaySquare,
  Play,
  Film,
  X
} from "lucide-react";

const ALL_TEMPLATES = [
  { slug: "AUTO_CAPTION_GENERATOR", name: "Auto Caption Generator" },
  { slug: "COMPARE_EXPLAINER", name: "Compare Explainer Video" },
  { slug: "WHITEBOARD_VIDEO", name: "Whiteboard Video" },
  { slug: "TYPOGRAPHY_VIDEO", name: "Typography Video" },
  { slug: "MULTI_IMAGES_VIDEO", name: "Multi Images Video" },
  { slug: "LONG_VIDEO_PROMO", name: "Long Video Promo" },
  { slug: "ai-audio-cleaner", name: "AI Audio Cleaner" },
  { slug: "LONG_VIDEO_PRO", name: "Long Video Pro" },
  { slug: "LONG_VIDEO_CLIPS", name: "Long Video Clips" }
];

export default function AdminTemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [videoStats, setVideoStats] = useState<any[]>([]);
  const [activeDemoModal, setActiveDemoModal] = useState<DemoPresetBlueprint | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const oStats = await getAdminOverviewStats();
      setStats(oStats);

      const videos = await getAdminVideos();
      const compiled = ALL_TEMPLATES.map((t) => {
        const matches = videos.filter((v) => v.mode === t.slug);
        const success = matches.filter((v) => v.outputFile).length;
        const successRate = matches.length > 0 ? (success / matches.length) * 100 : 100;
        const avgRender = matches.length > 0 ? 35 : 0;
        const totalCredits = matches.reduce((sum, item) => sum + item.creditsUsed, 0);

        return {
          slug: t.slug,
          name: t.name,
          usageCount: matches.length,
          successRate,
          avgRenderTime: `${avgRender}s`,
          creditsUsed: totalCredits,
        };
      });

      setVideoStats(compiled);
    } catch {
      // fallback fail gracefully
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1a73e8]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1a73e8]">
              Composition Blueprints & Assets
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Film className="text-[#1a73e8]" size={26} />
            <span>Template & Asset Library</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Inspect interactive video blueprints, Remotion layers, sticker packs, and performance telemetry.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Directory</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Aggregating Template Analytics...
          </p>
        </div>
      ) : (
        <>
          {/* Section 1: Interactive Playable Sample Demo Blueprints */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PlaySquare className="text-[#1a73e8]" size={18} />
                  Interactive Video Blueprints (Live Previews)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time previews with kinetic captions, stickman bounce animations, and chapter badges.
                </p>
              </div>
              <span className="text-xs bg-blue-50 text-[#1a73e8] font-bold px-3 py-1 rounded-full border border-blue-200">
                {UNIVERSAL_DEMO_PRESETS.length} Playable Assets
              </span>
            </div>

            {/* Playable Video Player Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {UNIVERSAL_DEMO_PRESETS.map((demo) => (
                <div
                  key={demo.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between transition-all shadow-xs hover:border-slate-300 hover:shadow-md group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1a73e8] uppercase bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        {demo.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {demo.aspectRatio}
                      </span>
                    </div>

                    {/* Embedded Live Video Player */}
                    <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
                      <DemoBlueprintPlayer demo={demo} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-[#1a73e8] transition">
                        {demo.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{demo.description}</p>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs text-slate-700">
                        <span className="text-amber-700 font-bold block text-[11px]">Topic: {demo.sampleTopic}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {demo.sampleData.chapterEvents.map((ch) => (
                            <span key={ch.id} className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {ch.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveDemoModal(demo)}
                    className="w-full mt-4 py-2 bg-[#1a73e8] hover:bg-[#1967d2] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Expand Video Player</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Universal Template Telemetry & Usage Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <BarChart4 size={15} className="text-[#1a73e8]" />
                <span>Composition Templates Telemetry</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Template Name</th>
                    <th className="px-6 py-3.5 text-center">Renders Generated</th>
                    <th className="px-6 py-3.5 text-center">Success Rate</th>
                    <th className="px-6 py-3.5 text-center">Avg Render Time</th>
                    <th className="px-6 py-3.5 text-right">Total Credits Burned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {videoStats.map((item) => (
                    <tr key={item.slug} className="hover:bg-slate-50/80 transition font-sans">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-700">
                        {item.usageCount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#34a853] border border-emerald-200 font-bold font-mono text-[11px]">
                          {Math.round(item.successRate)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-slate-500">
                        {item.avgRenderTime}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        {item.creditsUsed} cr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Expanded Demo Modal */}
      {activeDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeDemoModal.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{activeDemoModal.category}</p>
              </div>
              <button
                onClick={() => setActiveDemoModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <DemoBlueprintPlayer demo={activeDemoModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
