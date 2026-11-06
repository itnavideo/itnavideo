"use client";

import React, { useState, useMemo } from "react";
import { Palette, Check, ChevronDown, Sparkles } from "lucide-react";
import { MARKER_COLOR_PALETTE } from "@/components/dashboard/WhiteboardStudio";

interface WhiteboardMarkerDrawerProps {
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
}

export function WhiteboardMarkerDrawer({
  selectedColorId,
  onSelectColor,
}: WhiteboardMarkerDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedMarker = useMemo(() => {
    return (
      MARKER_COLOR_PALETTE.find((m) => m.id === selectedColorId) ||
      MARKER_COLOR_PALETTE[0]
    );
  }, [selectedColorId]);

  return (
    <div className="relative">
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 transition-all text-left shadow-xs w-full"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-xs group-hover:scale-105 transition-transform"
            style={{
              backgroundColor: selectedMarker.id === "auto" ? "#2563EB" : selectedMarker.hex,
              borderColor: selectedMarker.ringHex || "#CBD5E1",
            }}
          >
            {selectedMarker.id === "auto" ? (
              <Sparkles className="w-4 h-4 text-white" />
            ) : (
              <Palette className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Marker Color
            </div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {selectedMarker.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 group-hover:text-orange-500 transition-colors">
          <span className="text-[11px] font-semibold hidden sm:inline-block">
            {isOpen ? "Close" : "Change"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expandable Palette Panel */}
      {isOpen && (
        <div className="mt-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-2 animate-fadeIn z-30">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Choose Marker Palette
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MARKER_COLOR_PALETTE.map((marker) => {
              const isSelected = selectedColorId === marker.id;

              return (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => {
                    onSelectColor(marker.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-50 border-orange-500 ring-2 ring-orange-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center border shadow-xs"
                    style={{
                      backgroundColor: marker.id === "auto" ? "#2563EB" : marker.hex,
                      borderColor: marker.ringHex,
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {marker.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

