"use client";

import React from "react";
import { TypographyStudio } from "@/components/dashboard/TypographyStudio";
import type { KineticMotionPresetId } from "@/lib/kineticMotion/kineticMotionPresets";

export interface KineticMotionStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  selectedPreset?: KineticMotionPresetId | string;
  onSelectPreset?: (presetId: KineticMotionPresetId) => void;
  sfxIntensity?: "full" | "subtle" | "none";
  onSfxIntensityChange?: (v: "full" | "subtle" | "none") => void;
  pacing?: "fast" | "smooth";
  onPacingChange?: (v: "fast" | "smooth") => void;
  textCase?: "uppercase" | "natural";
  onTextCaseChange?: (v: "uppercase" | "natural") => void;
  accentColor?: string;
  onAccentColorChange?: (v: string) => void;
  fontFamily?: string;
  onFontFamilyChange?: (v: string) => void;
  intensity?: any;
  onIntensityChange?: (v: any) => void;
  aspectRatio?: "9:16";
  onAspectRatioChange?: (v: "9:16") => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function KineticMotionStudio({
  selectedFile,
  onSelectFile,
  selectedPreset = "creator-editorial",
  onSelectPreset = () => {},
  sfxIntensity = "full",
  onSfxIntensityChange = () => {},
  pacing = "fast",
  onPacingChange = () => {},
  textCase = "uppercase",
  onTextCaseChange = () => {},
  onGenerate,
  isGenerating = false,
}: KineticMotionStudioProps) {
  return (
    <TypographyStudio
      selectedFile={selectedFile}
      onSelectFile={onSelectFile}
      typographyStyle={selectedPreset || "creator-editorial"}
      onTypographyStyleChange={(style) => onSelectPreset(style as any)}
      typographySfxIntensity={sfxIntensity}
      onTypographySfxIntensityChange={onSfxIntensityChange}
      typographyPacing={pacing}
      onTypographyPacingChange={onPacingChange}
      typographyTextCase={textCase}
      onTypographyTextCaseChange={onTextCaseChange}
      onGenerate={onGenerate}
      isGenerating={isGenerating}
    />
  );
}

export default KineticMotionStudio;
