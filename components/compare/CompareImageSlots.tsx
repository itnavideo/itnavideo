"use client";

import {useEffect, useMemo} from "react";

type CompareImageSlotsProps = {
  files: File[];
  onChange: (files: File[]) => void;
  onError: (message: string) => void;
  leftTitle?: string;
  rightTitle?: string;
  onLeftTitleChange?: (val: string) => void;
  onRightTitleChange?: (val: string) => void;
};

const MAX_BYTES = 25 * 1024 * 1024;

function validateImage(file: File) {
  const validType = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
  if (!validType) return "Compare images must be JPG, PNG, or WEBP files.";
  if (file.size > MAX_BYTES) return "Each Compare image must be under 25MB.";
  return "";
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CompareImageSlots({
  files,
  onChange,
  onError,
  leftTitle = "",
  rightTitle = "",
  onLeftTitleChange,
  onRightTitleChange,
}: CompareImageSlotsProps) {
  const leftFile = files[0] || null;
  const rightFile = files[1] || null;

  const leftPreview = useMemo(() => (leftFile ? URL.createObjectURL(leftFile) : ''), [leftFile]);
  const rightPreview = useMemo(() => (rightFile ? URL.createObjectURL(rightFile) : ''), [rightFile]);

  useEffect(() => {
    return () => {
      if (leftPreview) URL.revokeObjectURL(leftPreview);
      if (rightPreview) URL.revokeObjectURL(rightPreview);
    };
  }, [leftPreview, rightPreview]);

  const chooseSlot = (slot: 0 | 1, file: File | null) => {
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      onError(error);
      return;
    }

    if (slot === 0) {
      onChange([file, rightFile].filter(Boolean) as File[]);
    } else {
      // Slot 1
      if (leftFile) {
        onChange([leftFile, file]);
      } else {
        const next: File[] = [];
        (next as any)[1] = file;
        onChange(next);
      }
    }
  };

  const removeSlot = (slot: 0 | 1) => {
    if (slot === 0) {
      if (rightFile) {
        const next: File[] = [];
        (next as any)[1] = rightFile;
        onChange(next);
      } else {
        onChange([]);
      }
    } else {
      onChange(leftFile ? [leftFile] : []);
    }
  };

  const filledCount = (leftFile ? 1 : 0) + (rightFile ? 1 : 0);

  const slots = [
    {
      index: 0 as const,
      title: "Option A (Left)",
      subtitle: "Appears on left split-screen",
      inputId: "compare-left-visual",
      file: leftFile,
      preview: leftPreview,
      dotColor: "bg-blue-400",
      nameValue: leftTitle,
      onNameChange: onLeftTitleChange,
      namePlaceholder: "e.g. iPhone 16 Pro",
    },
    {
      index: 1 as const,
      title: "Option B (Right)",
      subtitle: "Appears on right split-screen",
      inputId: "compare-right-visual",
      file: rightFile,
      preview: rightPreview,
      dotColor: "bg-purple-400",
      nameValue: rightTitle,
      onNameChange: onRightTitleChange,
      namePlaceholder: "e.g. Galaxy S25 Ultra",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-zinc-400">
          Upload 2 visual screenshots and assign comparison titles.
        </p>

        <span
          className={`inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
            filledCount === 2
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              filledCount === 2 ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
            }`}
          />
          {filledCount}/2 Visuals Ready
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {slots.map((slot) => {
          const selected = Boolean(slot.file);

          return (
            <div
              key={slot.inputId}
              className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 ${
                selected
                  ? "border-white/20 bg-zinc-800/40 shadow-md"
                  : "border-white/10 bg-black/30 hover:border-white/20 hover:bg-black/40"
              }`}
            >
              {/* Slot Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${slot.dotColor}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {slot.title}
                  </span>
                </div>
                {selected ? (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Ready
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-500">Image Required</span>
                )}
              </div>

              {/* Upload Drop Area */}
              <label
                htmlFor={slot.inputId}
                className={`relative flex h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 ${
                  selected
                    ? "border-white/10 bg-black"
                    : "border-dashed border-white/15 bg-white/[0.02] hover:border-[#FF6D00]/50 hover:bg-white/[0.04]"
                }`}
              >
                {slot.preview ? (
                  <>
                    <img
                      src={slot.preview}
                      alt={slot.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-20 blur-md"
                    />
                    <img
                      src={slot.preview}
                      alt={slot.title}
                      className="relative z-10 max-h-full max-w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur">
                      <p className="truncate text-[10px] font-medium text-white">{slot.file?.name}</p>
                      <p className="text-[9px] text-zinc-400">
                        {slot.file ? formatBytes(slot.file.size) : ""}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-3">
                    <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-lg text-zinc-400 transition-colors group-hover:bg-[#FF6D00]/20 group-hover:text-[#FFA726]">
                      +
                    </div>
                    <p className="text-xs font-semibold text-white">
                      Upload Image {slot.index === 0 ? "A" : "B"}
                    </p>
                    <p className="mt-0.5 text-[9px] text-zinc-500">
                      JPG, PNG, or WEBP up to 25MB
                    </p>
                  </div>
                )}
              </label>

              <input
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                id={slot.inputId}
                onChange={(event) => {
                  chooseSlot(slot.index, event.target.files?.[0] || null);
                  event.currentTarget.value = "";
                }}
                type="file"
              />

              {/* Action buttons if image is selected */}
              {selected ? (
                <div className="mt-2.5 flex gap-2">
                  <label
                    htmlFor={slot.inputId}
                    className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                  >
                    Replace
                  </label>
                  <button
                    className="flex flex-1 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 py-1.5 text-[11px] font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                    onClick={() => removeSlot(slot.index)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ) : null}

              {/* Name / Title Input directly in Option Card */}
              {slot.onNameChange ? (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <label className="flex items-center justify-between text-[11px] font-medium text-zinc-400 mb-1">
                    <span>Name {slot.index === 0 ? "A" : "B"} (Title)</span>
                    <span className="text-[10px] tabular-nums text-zinc-500">
                      {slot.nameValue.length}/40
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    value={slot.nameValue}
                    onChange={(e) => slot.onNameChange!(e.target.value)}
                    placeholder={slot.namePlaceholder}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs font-semibold text-white placeholder-zinc-600 outline-none transition focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]/20"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
