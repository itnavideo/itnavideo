"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { WhiteboardVideo } from "@/remotion/templates/WHITEBOARD_VIDEO/template";
import type { WhiteboardScene } from "@/services/ai/whiteboardPlanner";
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Type,
  Image as ImageIcon,
  Palette,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  GripVertical,
  Sparkles,
  ChevronRight,
  Edit2,
  Check,
  Download,
  Share2,
  Sliders,
  Volume2,
  Clock,
  ArrowLeft,
  RefreshCw,
  AudioWaveform,
  Hand,
} from "lucide-react";
import { WhiteboardDrawingPickerModal } from "./WhiteboardDrawingPickerModal";
import { MARKER_COLOR_PALETTE } from "@/components/dashboard/WhiteboardStudio";

interface WhiteboardEditableWorkspaceProps {
  initialScenes: WhiteboardScene[];
  audioUrl?: string;
  durationSeconds: number;
  fontPersonality: string;
  markerColor: string;
  handStyle: string;
  onBackToStudio?: () => void;
  onExportRender?: (updatedScenes: WhiteboardScene[]) => void;
  isExporting?: boolean;
}

export type SceneLayerType = "headline" | "hero_visual" | "accent_color" | "supporting_data" | "audio_timing";

export interface SceneLayerItem {
  id: string;
  type: SceneLayerType;
  label: string;
  subtitle: string;
  visible: boolean;
}

export function WhiteboardEditableWorkspace({
  initialScenes,
  audioUrl = "/whiteboard-preview.mp3",
  durationSeconds = 60,
  fontPersonality = "balsamiq",
  markerColor = "auto",
  handStyle = "right",
  onBackToStudio,
  onExportRender,
  isExporting = false,
}: WhiteboardEditableWorkspaceProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Editable scenes state
  const [scenes, setScenes] = useState<WhiteboardScene[]>(initialScenes);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedLayerId, setSelectedLayerId] = useState<SceneLayerType | null>("headline");

  // Inline editing state
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [headlineDraft, setHeadlineDraft] = useState("");
  const [isDrawingPickerOpen, setIsDrawingPickerOpen] = useState(false);

  // Hidden layers tracking map: { [sceneId_layerType]: boolean }
  const [hiddenLayers, setHiddenLayers] = useState<Record<string, boolean>>({});

  // Sync current frame with Remotion player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameUpdate = (e: any) => {
      setCurrentFrame(e.detail.frame);
      const currentTime = e.detail.frame / 30;
      const idx = scenes.findIndex((s) => currentTime >= s.startTime && currentTime < s.endTime);
      if (idx !== -1 && idx !== activeSceneIndex) {
        setActiveSceneIndex(idx);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener("frameupdate", onFrameUpdate);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);

    return () => {
      player.removeEventListener("frameupdate", onFrameUpdate);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, [scenes, activeSceneIndex]);

  const activeScene = scenes[activeSceneIndex] || scenes[0];

  // Update headline draft when active scene changes
  useEffect(() => {
    if (activeScene) {
      setHeadlineDraft(activeScene.headline || "");
      setEditingHeadline(false);
    }
  }, [activeSceneIndex, activeScene]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    playerRef.current.play();
  };

  const jumpToScene = (index: number) => {
    if (!playerRef.current || !scenes[index]) return;
    setActiveSceneIndex(index);
    const targetFrame = Math.round(scenes[index].startTime * 30);
    playerRef.current.seekTo(targetFrame);
  };

  // Save headline edit
  const handleSaveHeadline = () => {
    if (!headlineDraft.trim()) return;
    const updated = [...scenes];
    updated[activeSceneIndex] = {
      ...updated[activeSceneIndex],
      headline: headlineDraft.trim(),
    };
    setScenes(updated);
    setEditingHeadline(false);
  };

  // Replace drawing
  const handleReplaceDrawing = (drawingId: string, drawingName: string) => {
    const updated = [...scenes];
    updated[activeSceneIndex] = {
      ...updated[activeSceneIndex],
      heroVisual: {
        ...updated[activeSceneIndex].heroVisual,
        drawingId,
        label: drawingName,
      },
    };
    setScenes(updated);
  };

  // Change marker accent color for active scene
  const handleChangeSceneColor = (colorHex: string) => {
    const updated = [...scenes];
    updated[activeSceneIndex] = {
      ...updated[activeSceneIndex],
      accentColor: colorHex,
    };
    setScenes(updated);
  };

  // Toggle layer visibility
  const toggleLayerVisibility = (layerType: SceneLayerType) => {
    const key = `${activeScene.id}_${layerType}`;
    setHiddenLayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Active scene layers list
  const activeSceneLayers: SceneLayerItem[] = useMemo(() => {
    if (!activeScene) return [];

    const layers: SceneLayerItem[] = [
      {
        id: "headline",
        type: "headline",
        label: "Headline Text",
        subtitle: `"${activeScene.headline}"`,
        visible: !hiddenLayers[`${activeScene.id}_headline`],
      },
      {
        id: "hero_visual",
        type: "hero_visual",
        label: "Hero Illustration",
        subtitle: activeScene.heroVisual?.label || activeScene.heroVisual?.drawingId || "Vector Sketch",
        visible: !hiddenLayers[`${activeScene.id}_hero_visual`],
      },
      {
        id: "accent_color",
        type: "accent_color",
        label: "Marker Accent Stroke",
        subtitle: activeScene.accentColor || "#FF5722",
        visible: !hiddenLayers[`${activeScene.id}_accent_color`],
      },
      {
        id: "audio_timing",
        type: "audio_timing",
        label: "Voiceover Sync & Timing",
        subtitle: `${activeScene.startTime.toFixed(1)}s – ${activeScene.endTime.toFixed(1)}s (${(activeScene.endTime - activeScene.startTime).toFixed(1)}s duration)`,
        visible: true,
      },
    ];

    if (activeScene.supportingItems?.length || activeScene.statData || activeScene.comparisonData) {
      layers.push({
        id: "supporting_data",
        type: "supporting_data",
        label: "Supporting Structure",
        subtitle: `${activeScene.archetype.replace("_", " ")} layout`,
        visible: !hiddenLayers[`${activeScene.id}_supporting_data`],
      });
    }

    return layers;
  }, [activeScene, hiddenLayers]);

  // Composition props sent to live player
  const compositionProps = useMemo(() => {
    // Filter scenes with modified visibility / text
    const processedScenes = scenes.map((s) => {
      const isHeadlineHidden = hiddenLayers[`${s.id}_headline`];
      const isDrawingHidden = hiddenLayers[`${s.id}_hero_visual`];

      return {
        ...s,
        headline: isHeadlineHidden ? "" : s.headline,
        heroVisual: isDrawingHidden
          ? { ...s.heroVisual, drawingId: "none" }
          : s.heroVisual,
      };
    });

    return {
      mediaSrc: audioUrl,
      mediaType: "audio" as const,
      durationSeconds: Math.max(10, Math.round(durationSeconds)),
      scenes: processedScenes,
      fontPersonality,
      markerColor,
      handStyle,
      showHand: handStyle !== "none",
    };
  }, [scenes, audioUrl, durationSeconds, fontPersonality, markerColor, handStyle, hiddenLayers]);

  const currentTimeSec = (currentFrame / 30).toFixed(1);

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Top Workspace Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {onBackToStudio && (
            <button
              type="button"
              onClick={onBackToStudio}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Return to Audio Settings"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                Edit Video
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Layers & Composition
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Customize text, swap illustrations, adjust marker colors, and preview live animation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onExportRender && (
            <button
              type="button"
              onClick={() => onExportRender(scenes)}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Creating Video...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Create Video</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Player on Left, Layer Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
        {/* Left: 9:16 Remotion Player (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-3xl border-2 border-slate-700 bg-white shadow-2xl overflow-hidden">
            <Player
              ref={playerRef}
              component={WhiteboardVideo}
              inputProps={compositionProps as any}
              durationInFrames={Math.round(durationSeconds * 30)}
              compositionWidth={1080}
              compositionHeight={1920}
              fps={30}
              style={{ width: "100%", height: "100%" }}
              controls={false}
              autoPlay={false}
              loop={true}
              clickToPlay={true}
              spaceKeyToPlayOrPause={true}
              acknowledgeRemotionLicense
            />
          </div>

          {/* Player Controls Bar */}
          <div className="w-full max-w-[320px] mt-4 flex items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-slate-950" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Restart</span>
            </button>
            <span className="font-mono text-xs text-slate-400">
              {currentTimeSec}s / {durationSeconds}s
            </span>
          </div>
        </div>

        {/* Right: Scene Timeline & Layer Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Horizontal Scene Timeline Strip */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Scenes Timeline ({scenes.length} Scenes)</span>
              </span>
              <span className="text-[11px] text-slate-400">Tap scene to jump & edit</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
              {scenes.map((scene, idx) => {
                const isActive = activeSceneIndex === idx;

                return (
                  <button
                    key={scene.id || idx}
                    type="button"
                    onClick={() => jumpToScene(idx)}
                    className={`flex flex-col p-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? "bg-orange-500/20 border-orange-500 text-white ring-1 ring-orange-500/50"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                    style={{ minWidth: "120px" }}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-black uppercase text-orange-400">
                        Scene #{idx + 1}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {scene.startTime.toFixed(1)}s
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-[110px]">
                      {scene.headline || "Scene Beat"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Scene Layer Inspector */}
          {activeScene && (
            <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-5 space-y-5">
              {/* Scene Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold text-xs flex items-center justify-center">
                    #{activeSceneIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Scene #{activeSceneIndex + 1} Layers
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {activeScene.startTime.toFixed(1)}s – {activeScene.endTime.toFixed(1)}s ({activeScene.archetype.replace("_", " ")})
                    </p>
                  </div>
                </div>

                {/* Accent Color Swatch Quick Picker */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-400 mr-1 hidden sm:inline-block">Marker:</span>
                  {MARKER_COLOR_PALETTE.filter(m => m.id !== "auto").map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleChangeSceneColor(m.hex)}
                      className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                        activeScene.accentColor === m.hex
                          ? "scale-125 ring-2 ring-white"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: m.hex, borderColor: m.ringHex }}
                      title={m.name}
                    />
                  ))}
                </div>
              </div>

              {/* Layers List */}
              <div className="space-y-2.5">
                {activeSceneLayers.map((layer) => {
                  const isSelected = selectedLayerId === layer.type;

                  return (
                    <div
                      key={layer.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-slate-750 border-orange-500/60 ring-1 ring-orange-500/30"
                          : "bg-slate-800 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                          onClick={() => setSelectedLayerId(layer.type)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                            {layer.type === "headline" && <Type className="w-4 h-4 text-amber-400" />}
                            {layer.type === "hero_visual" && <ImageIcon className="w-4 h-4 text-blue-400" />}
                            {layer.type === "accent_color" && <Palette className="w-4 h-4 text-rose-400" />}
                            {layer.type === "supporting_data" && <Layers className="w-4 h-4 text-purple-400" />}
                            {layer.type === "audio_timing" && <AudioWaveform className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block">
                              {layer.label}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {layer.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Layer Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {layer.type === "headline" && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLayerId("headline");
                                setEditingHeadline(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
                              title="Edit text"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {layer.type === "hero_visual" && (
                            <button
                              type="button"
                              onClick={() => setIsDrawingPickerOpen(true)}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-orange-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition"
                            >
                              Change
                            </button>
                          )}

                          {layer.type !== "audio_timing" && (
                            <button
                              type="button"
                              onClick={() => toggleLayerVisibility(layer.type)}
                              className={`p-1.5 rounded-lg transition ${
                                layer.visible
                                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              }`}
                              title={layer.visible ? "Hide layer" : "Show layer"}
                            >
                              {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline Headline Text Editor */}
                      {layer.type === "headline" && editingHeadline && (
                        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2">
                          <input
                            type="text"
                            value={headlineDraft}
                            onChange={(e) => setHeadlineDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveHeadline()}
                            placeholder="Type new headline text..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSaveHeadline}
                            className="px-3 py-1.5 rounded-lg bg-orange-500 text-slate-950 text-xs font-bold hover:brightness-110"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingHeadline(false)}
                            className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Visual Drawing Replacement Modal */}
      <WhiteboardDrawingPickerModal
        isOpen={isDrawingPickerOpen}
        onClose={() => setIsDrawingPickerOpen(false)}
        currentDrawingId={activeScene?.heroVisual?.drawingId || ""}
        onSelectDrawing={handleReplaceDrawing}
      />
    </div>
  );
}

