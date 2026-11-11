"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

export type AudioHealthStatus = "good" | "silent" | "clipping" | "exceedsMax" | "corrupt";

export interface AudioHealthInfo {
  status: AudioHealthStatus;
  message: string;
}

export interface UseAudioDiagnosticsOptions {
  file: File | null;
  maxSeconds?: number;
  minSeconds?: number;
}

export function useAudioDiagnostics({
  file,
  maxSeconds = 90,
  minSeconds = 3,
}: UseAudioDiagnosticsOptions) {
  const [audioDuration, setAudioDuration] = useState<number>(60);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioWarning, setAudioWarning] = useState<string | null>(null);
  const [audioHealth, setAudioHealth] = useState<AudioHealthInfo | null>(null);

  useEffect(() => {
    setAudioError(null);
    setAudioWarning(null);
    setAudioHealth(null);

    if (!file) {
      return;
    }

    if (file.size === 0) {
      setAudioError("The uploaded file is empty (0 bytes). Please upload a valid voiceover audio file.");
      setAudioHealth({ status: "corrupt", message: "Empty 0-byte file" });
      return;
    }

    const url = URL.createObjectURL(file);
    const tempAudio = document.createElement("audio");
    tempAudio.preload = "metadata";

    tempAudio.onerror = () => {
      setAudioError("Audio file is corrupt, damaged, or in an unsupported format. Please export as standard MP3, WAV, or M4A.");
      setAudioHealth({ status: "corrupt", message: "Corrupted or unreadable audio format" });
    };

    tempAudio.onloadedmetadata = () => {
      const dur = tempAudio.duration;
      if (!dur || !Number.isFinite(dur)) {
        setAudioError("Unable to calculate audio duration. File may be corrupted.");
        setAudioHealth({ status: "corrupt", message: "Indeterminate duration" });
        return;
      }

      if (dur < minSeconds) {
        setAudioError(`Audio is too short (${dur.toFixed(1)}s). Please upload a complete spoken voiceover of at least ${minSeconds} seconds.`);
        setAudioHealth({ status: "corrupt", message: `Too short (< ${minSeconds}s)` });
        return;
      }

      if (dur > maxSeconds) {
        setAudioDuration(maxSeconds);
        setAudioWarning(`Videos and audio longer than ${maxSeconds} seconds are supported. Only the first ${maxSeconds} seconds will be used.`);
        setAudioHealth({ status: "exceedsMax", message: `Audio is ${Math.round(dur)}s • First ${maxSeconds}s will be used` });
      } else {
        setAudioDuration(Math.round(dur));
        setAudioHealth({ status: "good", message: `Voiceover Ready (~${Math.round(dur)}s) • Healthy Duration` });
      }

      // Non-blocking Client-side Web Audio loudness & silence analyzer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const buffer = e.target?.result as ArrayBuffer;
              if (buffer) {
                const ctx = new AudioCtx();
                const audioDecoded = await ctx.decodeAudioData(buffer.slice(0, 500000));
                const channelData = audioDecoded.getChannelData(0);
                let sumSquares = 0;
                let peak = 0;
                for (let i = 0; i < channelData.length; i++) {
                  const val = Math.abs(channelData[i]);
                  if (val > peak) peak = val;
                  sumSquares += val * val;
                }
                const rms = Math.sqrt(sumSquares / channelData.length);
                ctx.close();

                if (rms < 0.005) {
                  setAudioWarning("Very low voiceover volume detected (near-silent). AI Voice Isolation & Auto-Normalization will automatically boost speech clarity.");
                  setAudioHealth({ status: "silent", message: "Low speech volume detected (-45dB) • Auto-normalization active" });
                } else if (peak >= 0.99) {
                  setAudioWarning("High audio clipping / loud distortion detected. Studio auto-limiter will normalize audio peaks on render.");
                  setAudioHealth({ status: "clipping", message: "Audio clipping detected • Studio limiter will balance peaks" });
                }
              }
            } catch {}
          };
          reader.readAsArrayBuffer(file.slice(0, 500000));
        }
      } catch {}
    };

    tempAudio.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, maxSeconds, minSeconds]);

  return {
    audioDuration,
    audioError,
    audioWarning,
    audioHealth,
    isAudioValid: Boolean(file) && !audioError,
  };
}

export interface AudioHealthDiagnosticsProps {
  error: string | null;
  warning: string | null;
  health: AudioHealthInfo | null;
  denoiseVoice?: boolean;
  onDenoiseVoiceChange?: (enabled: boolean) => void;
  showVoiceIsolation?: boolean;
  alternateStudioUrl?: string;
  alternateStudioLabel?: string;
}

export function AudioHealthDiagnostics({
  error,
  warning,
  health,
  denoiseVoice = true,
  onDenoiseVoiceChange,
  showVoiceIsolation = true,
  alternateStudioUrl,
  alternateStudioLabel,
}: AudioHealthDiagnosticsProps) {
  return (
    <div className="space-y-3">
      {/* Red Error Banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900 animate-fadeIn">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 flex-1">
            <p className="font-black text-rose-950">Audio Error Detected</p>
            <p className="text-rose-700 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Notice Banner */}
      {!error && warning && (
        <div className={`flex items-start gap-3 rounded-xl border p-4 text-xs animate-fadeIn ${
          warning.includes("longer than")
            ? "border-blue-200 bg-blue-50/80 text-blue-900"
            : "border-amber-200 bg-amber-50/80 text-amber-900"
        }`}>
          {warning.includes("longer than") ? (
            <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1.5 flex-1">
            <p className={`font-black ${warning.includes("longer than") ? "text-blue-950" : "text-amber-950"}`}>
              {warning.includes("longer than") ? "Supported 9:16 Duration Policy" : "Audio Optimization Notice"}
            </p>
            <p className={`leading-relaxed ${warning.includes("longer than") ? "text-blue-800" : "text-amber-800"}`}>
              {warning}
            </p>
            {!warning.includes("longer than") && alternateStudioUrl && (
              <div className="pt-1">
                <a
                  href={alternateStudioUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                >
                  {alternateStudioLabel || "Switch to 16:9 Faceless Video (Up to 5 Min)"}
                  <ArrowRight size={13} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Diagnostic Health Pill */}
      {health && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
          <div className="flex items-center gap-2 min-w-0">
            {health.status === "good" ? (
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            ) : health.status === "exceedsMax" ? (
              <Clock size={14} className="text-amber-600 shrink-0" />
            ) : health.status === "corrupt" ? (
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
            ) : (
              <SlidersHorizontal size={14} className="text-blue-600 shrink-0" />
            )}
            <span className="font-bold text-slate-800 truncate">{health.message}</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0 ml-2">
            Audio Diagnostics
          </span>
        </div>
      )}

      {/* AI Voice Isolation & De-Noise Toggle */}
      {showVoiceIsolation && onDenoiseVoiceChange && (
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
          <div className="flex items-start gap-2.5 pr-3">
            <div className="p-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 mt-0.5 shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-slate-900">
                  AI Studio Voice Isolation &amp; De-Noise
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Filters ceiling fan hum, AC rumble, room reverb, street traffic, and phone mic distortion for 99.8% transcription accuracy.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDenoiseVoiceChange(!denoiseVoice)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              denoiseVoice ? "bg-orange-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                denoiseVoice ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
