"use client";

import React, { useState, useMemo } from "react";
import { Type, Search, X, Check, ChevronDown } from "lucide-react";
import { WHITEBOARD_FONTS_CATALOG } from "@/components/dashboard/WhiteboardStudio";

interface WhiteboardFontDrawerProps {
  selectedFontId: string;
  onSelectFont: (fontId: string) => void;
}

export function WhiteboardFontDrawer({
  selectedFontId,
  onSelectFont,
}: WhiteboardFontDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const selectedFont = useMemo(() => {
    return (
      WHITEBOARD_FONTS_CATALOG.find((f) => f.id === selectedFontId) ||
      WHITEBOARD_FONTS_CATALOG[0]
    );
  }, [selectedFontId]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    WHITEBOARD_FONTS_CATALOG.forEach((f) => {
      if (f.badge) cats.add(f.badge);
    });
    return Array.from(cats);
  }, []);

  const filteredFonts = useMemo(() => {
    return WHITEBOARD_FONTS_CATALOG.filter((font) => {
      const matchesSearch =
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || font.badge === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 transition-all text-left shadow-xs w-full"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Type className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Font Personality
            </div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {selectedFont.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 group-hover:text-orange-500 transition-colors">
          <span className="text-[11px] font-semibold hidden sm:inline-block">Change</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Expandable Library Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Whiteboard Font Library</h3>
                  <p className="text-xs text-slate-500">Select the handwriting font used for all sketch text</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Categories */}
            <div className="p-4 space-y-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search handwriting font styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredFonts.map((font) => {
                const isSelected = selectedFontId === font.id;

                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => {
                      onSelectFont(font.id);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {font.name}
                        </span>
                        {font.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {font.badge}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Font Preview Sample */}
                    <div
                      style={{ fontFamily: font.cssFamily }}
                      className="text-base text-slate-800 py-1.5 px-2 bg-slate-50 rounded-lg border border-slate-100 line-clamp-1"
                    >
                      {font.sample}
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2 truncate">
                      {font.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

