"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Bookmark,
  Cloud,
  BookmarkCheck,
  Star,
  Tag,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";

export interface BrandKitPreset {
  id: string;
  name: string;
  creatorHandle: string;
  subtitleStyle?: string;
  backgroundTheme?: string;
  captionPosition?: "bottom" | "center" | "top";
  selectedBgmId?: string;
  bgmVolume?: number;
  enableSfx?: boolean;
  isDefault?: boolean;
  metadata?: Record<string, any>;
}

export interface CreatorBrandKitCardProps {
  storageKey?: string;
  creatorHandle: string;
  onCreatorHandleChange: (handle: string) => void;
  currentSettings: {
    subtitleStyle?: string;
    backgroundTheme?: string;
    captionPosition?: "bottom" | "center" | "top";
    selectedBgmId?: string;
    bgmVolume?: number;
    enableSfx?: boolean;
    [key: string]: any;
  };
  onApplyPreset: (preset: BrandKitPreset) => void;
  prebuiltPresets?: BrandKitPreset[];
  title?: string;
  subtitle?: string;
}

export function CreatorBrandKitCard({
  storageKey = "itnavideo_brand_kits_global",
  creatorHandle,
  onCreatorHandleChange,
  currentSettings,
  onApplyPreset,
  prebuiltPresets = [],
  title = "Creator Brand Kit & Style Presets",
  subtitle = "Save your theme, caption preset, soundtrack, and watermark handle to reuse across every video",
}: CreatorBrandKitCardProps) {
  const [savedPresets, setSavedPresets] = useState<BrandKitPreset[]>(prebuiltPresets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Tier 1: Instant local cache (0ms render)
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: BrandKitPreset[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPresets(parsed);
          const defaultPreset = parsed.find((p) => p.isDefault);
          if (defaultPreset) {
            setActivePresetId(defaultPreset.id);
            onApplyPreset(defaultPreset);
          }
        }
      }
    } catch {}

    // Tier 2: Cloud Sync via Supabase User Metadata (Survives cache clear & laptop switch)
    supabase.auth.getUser().then(({ data }) => {
      const cloudKits = data?.user?.user_metadata?.brandKits?.[storageKey];
      if (Array.isArray(cloudKits) && cloudKits.length > 0) {
        setSavedPresets(cloudKits);
        try {
          localStorage.setItem(storageKey, JSON.stringify(cloudKits));
        } catch {}
        const defaultPreset = cloudKits.find((p: BrandKitPreset) => p.isDefault);
        if (defaultPreset) {
          setActivePresetId(defaultPreset.id);
          onApplyPreset(defaultPreset);
        }
      }
    }).catch(() => {});
  }, [storageKey]);

  // Cloud Sync to Supabase User Profile (Cross-device & cache-proof)
  const syncToCloud = async (presets: BrandKitPreset[]) => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const existingKits = data.user.user_metadata?.brandKits || {};
        await supabase.auth.updateUser({
          data: {
            brandKits: {
              ...existingKits,
              [storageKey]: presets,
            },
          },
        });
      }
    } catch (err) {
      console.warn("[BRAND_KIT_CLOUD_SYNC]", err);
    }
  };

  const handleSave = (makeDefault: boolean) => {
    if (!presetNameInput.trim()) return;
    const newPreset: BrandKitPreset = {
      id: `preset-${Date.now()}`,
      name: presetNameInput.trim(),
      creatorHandle: creatorHandle || "",
      subtitleStyle: currentSettings.subtitleStyle,
      backgroundTheme: currentSettings.backgroundTheme,
      captionPosition: currentSettings.captionPosition,
      selectedBgmId: currentSettings.selectedBgmId,
      bgmVolume: currentSettings.bgmVolume,
      enableSfx: currentSettings.enableSfx,
      isDefault: makeDefault,
    };

    setSavedPresets((prev) => {
      const updated = makeDefault ? prev.map((p) => ({ ...p, isDefault: false })) : [...prev];
      const next = [newPreset, ...updated.filter((p) => p.id !== newPreset.id)];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      syncToCloud(next);
      return next;
    });

    setActivePresetId(newPreset.id);
    setPresetNameInput("");
    setIsModalOpen(false);
    setSaveMessage(`Saved "${newPreset.name}" brand kit!`);
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleDelete = (id: string) => {
    setSavedPresets((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      syncToCloud(next);
      return next;
    });
    if (activePresetId === id) setActivePresetId(null);
  };

  const handleSetDefault = (id: string) => {
    setSavedPresets((prev) => {
      const next = prev.map((p) => ({ ...p, isDefault: p.id === id }));
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
    setSaveMessage("Default preset updated!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
            <Bookmark size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <Cloud size={11} /> Cloud Synced
          </span>
              <h3 className="text-sm font-black text-slate-900">{title}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                1-Click Reuse
              </span>
            </div>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100/70 text-orange-950 font-bold text-xs transition cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <BookmarkCheck size={14} className="text-orange-600" />
          <span>Save Current as Brand Kit</span>
        </button>
      </div>

      {saveMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {isModalOpen && (
        <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 space-y-3 animate-fadeIn">
          <p className="text-xs font-black text-slate-900">
            Save Current Configuration as a Brand Preset
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              placeholder="e.g. My Signature Brand (Dark Slate + Beast Captions)"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-orange-500 shadow-2xs font-medium"
            />
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={!presetNameInput.trim()}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
            >
              Save Preset
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={!presetNameInput.trim()}
              className="px-4 py-2 rounded-xl border border-orange-300 bg-white hover:bg-orange-50 text-orange-800 font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1 justify-center"
            >
              <Star size={13} className="text-orange-600 fill-orange-500" />
              <span>Save &amp; Set Default</span>
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Creator Channel Handle / Watermark Input */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Tag size={13} className="text-orange-600" />
          <span>Channel Watermark &amp; Creator Handle</span>
          <span className="text-[10px] font-semibold text-slate-400 capitalize">(Optional)</span>
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">@</span>
            <input
              type="text"
              value={creatorHandle.replace(/^@/, "")}
              onChange={(e) => onCreatorHandleChange(e.target.value ? `@${e.target.value.replace(/^@/, "")}` : "")}
              placeholder="yourchannel (e.g. founder_daily)"
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs font-bold focus:bg-white focus:border-orange-500 focus:outline-none transition shadow-2xs"
            />
          </div>
          {creatorHandle && (
            <span className="text-[11px] font-bold px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              Watermark HUD Active
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500">
          Renders an official subtle channel chip in the top-right safe zone of your video.
        </p>
      </div>

      {/* Quick-Load Presets Grid */}
      {savedPresets.length > 0 && (
        <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
            Quick-Load Presets &amp; Brand Kits
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {savedPresets.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    setActivePresetId(preset.id);
                    onApplyPreset(preset);
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "border-orange-500 bg-orange-50/60 ring-1 ring-orange-400/40 shadow-xs"
                      : "border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 truncate">
                        {preset.name}
                      </span>
                      {preset.isDefault && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                          <Star size={9} className="fill-amber-500 text-amber-600" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {preset.backgroundTheme || "Standard"} • {preset.subtitleStyle || "Captions"} • {preset.creatorHandle || "No handle"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {!preset.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(preset.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                        title="Make Default Preset"
                      >
                        <Star size={13} />
                      </button>
                    )}
                    {preset.id.startsWith("preset-") && (
                      <button
                        type="button"
                        onClick={() => handleDelete(preset.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Custom Kit"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
