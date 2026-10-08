import React from 'react';
import { Globe, Languages } from 'lucide-react';
import { SPOKEN_LANGUAGES, CAPTION_LANGUAGES, type SupportedLanguage } from '@/constants/languages';

interface DualLanguageSelectorProps {
  spokenLanguage: string;
  captionLanguage: string;
  onSpokenLanguageChange: (lang: string) => void;
  onCaptionLanguageChange: (lang: string) => void;
  className?: string;
  compact?: boolean;
}

export function DualLanguageSelector({
  spokenLanguage,
  captionLanguage,
  onSpokenLanguageChange,
  onCaptionLanguageChange,
  className = '',
  compact = false,
}: DualLanguageSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Spoken Audio Language */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-foreground/90">
          <Globe className="h-4 w-4 text-primary shrink-0" />
          <span>Audio Spoken</span>
        </label>
        <div className="relative">
          <select
            value={spokenLanguage}
            onChange={(e) => onSpokenLanguageChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-border bg-card/80 py-2.5 pl-3.5 pr-10 text-xs font-semibold text-foreground shadow-xs transition hover:border-primary/40 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="" disabled>Select a language</option>
            {SPOKEN_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-popover text-popover-foreground py-1">
                {lang.label} {lang.nativeLabel && lang.nativeLabel !== lang.label ? `(${lang.nativeLabel})` : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Caption Output Language */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-foreground/90">
          <Languages className="h-4 w-4 text-purple-400 shrink-0" />
          <span>Caption Language</span>
        </label>
        <div className="relative">
          <select
            value={captionLanguage}
            onChange={(e) => onCaptionLanguageChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-border bg-card/80 py-2.5 pl-3.5 pr-10 text-xs font-semibold text-foreground shadow-xs transition hover:border-purple-400/40 focus:border-purple-400 focus:outline-hidden focus:ring-2 focus:ring-purple-400/20 cursor-pointer"
          >
            <option value="" disabled>Select a language</option>
            {CAPTION_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-popover text-popover-foreground py-1">
                {lang.label} {lang.nativeLabel && lang.nativeLabel !== lang.label ? `(${lang.nativeLabel})` : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Backward-compatible single selector
export const LanguageSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded bg-card text-foreground w-full"
    >
      {SPOKEN_LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};
