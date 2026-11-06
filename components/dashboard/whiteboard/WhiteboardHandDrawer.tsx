"use client";

import React, { useState, useMemo } from "react";
import { Hand, Check, ChevronDown, Zap } from "lucide-react";
import { HAND_DRAWING_STYLES } from "@/components/dashboard/WhiteboardStudio";

interface WhiteboardHandDrawerProps {
  selectedHandId: string;
  onSelectHand: (handId: string) => void;
}

export function WhiteboardHandDrawer({
  selectedHandId,
  onSelectHand,
}: WhiteboardHandDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedHand = useMemo(() => {
    return (
      HAND_DRAWING_STYLES.find((h) => h.id === selectedHandId) ||
      HAND_DRAWING_STYLES[0]
    );
  }, [selectedHandId]);

  return (
    <div className="relative">
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 transition-all text-left shadow-xs w-full"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-sm">
            {selectedHand.icon || "✋"}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Hand Sketch Style
            </div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {selectedHand.name}
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

      {/* Expandable Hand Style Options */}
      {isOpen && (
        <div className="mt-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-2 animate-fadeIn z-30">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Choose Drawing Hand
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {HAND_DRAWING_STYLES.map((hand) => {
              const isSelected = selectedHandId === hand.id;

              return (
                <button
                  key={hand.id}
                  type="button"
                  onClick={() => {
                    onSelectHand(hand.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-lg shrink-0">{hand.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {hand.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {hand.badge}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

