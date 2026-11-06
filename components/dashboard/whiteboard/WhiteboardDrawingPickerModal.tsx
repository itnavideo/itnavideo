"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Check, Sparkles, Image as ImageIcon } from "lucide-react";
import { WHITEBOARD_VECTOR_DRAWINGS, type VectorDrawingDef } from "@/lib/whiteboard/vectorDrawings";

interface WhiteboardDrawingPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDrawingId: string;
  onSelectDrawing: (drawingId: string, drawingName: string) => void;
}

export function WhiteboardDrawingPickerModal({
  isOpen,
  onClose,
  currentDrawingId,
  onSelectDrawing,
}: WhiteboardDrawingPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const drawingsList: VectorDrawingDef[] = useMemo(() => {
    return Object.values(WHITEBOARD_VECTOR_DRAWINGS);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    drawingsList.forEach((d) => {
      if (d.category) cats.add(d.category);
    });
    return Array.from(cats);
  }, [drawingsList]);

  const filteredDrawings = useMemo(() => {
    return drawingsList.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        (d.keywords && d.keywords.some((k) => k.toLowerCase().includes(q)));
      const matchesCategory =
        selectedCategory === "All" || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [drawingsList, searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0E1526] rounded-3xl border border-white/10 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF6D00]/20 border border-[#FF6D00]/30 text-[#FFA726] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Choose Hero Visual Drawing</h3>
              <p className="text-xs text-slate-400">Pick an animated vector drawing for this whiteboard scene</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 space-y-3 border-b border-white/10 bg-[#070B14]/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drawings by name or concept (doctor, money, rocket, trophy...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-white/10 bg-[#070B14] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#FF6D00] text-black font-black"
                    : "bg-[#151E30] text-slate-300 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Vector Drawings */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredDrawings.map((drawing) => {
            const isSelected = currentDrawingId === drawing.id;

            return (
              <button
                key={drawing.id}
                type="button"
                onClick={() => {
                  onSelectDrawing(drawing.id, drawing.name);
                  onClose();
                }}
                className={`flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer group ${
                  isSelected
                    ? "bg-[#FF6D00]/15 border-[#FF6D00] ring-1 ring-[#FF6D00]/30 text-white"
                    : "bg-[#151E30] border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
                }`}
              >
                {/* SVG Stroke Preview */}
                <div className="w-16 h-16 rounded-xl bg-[#070B14] border border-white/10 flex items-center justify-center p-2.5 mb-2 group-hover:scale-105 transition-transform">
                  <svg
                    viewBox={drawing.viewBox || "0 0 100 100"}
                    className="w-full h-full stroke-white fill-none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {drawing.strokes?.slice(0, 10).map((stroke, i) => (
                      <path
                        key={i}
                        d={stroke.d}
                        stroke={stroke.colorKey === "accent" ? "#FF6D00" : stroke.colorKey === "highlight" ? "#FFA726" : stroke.colorKey === "danger" ? "#EF4444" : stroke.colorKey === "success" ? "#10B981" : "#FFFFFF"}
                      />
                    ))}
                  </svg>
                </div>

                <span className="text-xs font-bold text-white line-clamp-1">
                  {drawing.name}
                </span>
                <span className="text-[10px] text-slate-400 capitalize mt-0.5">
                  {drawing.category}
                </span>

                {isSelected && (
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-[#FF6D00] text-black text-[9px] font-black flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#070B14]/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

