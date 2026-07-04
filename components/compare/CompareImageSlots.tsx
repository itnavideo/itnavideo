"use client";

import {useEffect, useMemo} from "react";

type CompareImageSlotsProps = {
  files: File[];
  onChange: (files: File[]) => void;
  onError: (message: string) => void;
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

export function CompareImageSlots({files, onChange, onError}: CompareImageSlotsProps) {
  const previews = useMemo(() => {
    return files.slice(0, 2).map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const chooseSlot = (slot: 0 | 1, file: File | null) => {
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      onError(error);
      return;
    }

    const next = files.slice(0, 2);

    if (slot === 1 && !next[0]) {
      onError("Choose left image first, then right image.");
      return;
    }

    next[slot] = file;
    onChange(next.filter(Boolean));
  };

  const removeSlot = (slot: 0 | 1) => {
    const next = files.slice(0, 2);
    next.splice(slot, 1);
    onChange(next.filter(Boolean));
  };

  const slots = [
    {
      index: 0 as const,
      title: "Left visual",
      subtitle: "This appears on the left side",
      inputId: "compare-left-visual",
      file: files[0],
      preview: previews[0],
    },
    {
      index: 1 as const,
      title: "Right visual",
      subtitle: "This appears on the right side",
      inputId: "compare-right-visual",
      file: files[1],
      preview: previews[1],
    },
  ];

  return (
    <div className="rounded-xl border border-blue-400/20 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_rgba(0,0,0,0.45)_48%,_rgba(0,0,0,0.72))] p-4 shadow-[0_0_32px_rgba(37,99,235,0.08)] sm:p-5">
      <div className="mb-5 grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-300">
            Upload compare visuals
          </p>
          <p className="mt-1 text-[11px] font-semibold text-zinc-500">
            Upload exactly 2 images. Preview appears instantly.
          </p>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
            files.length === 2
              ? "border-blue-400/35 bg-blue-500/10 text-blue-200"
              : "border-amber-300/35 bg-amber-400/10 text-amber-100"
          }`}
        >
          {files.length}/2 selected
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {slots.map((slot) => {
          const selected = Boolean(slot.file);

          return (
            <div
              key={slot.inputId}
              className={`group overflow-hidden rounded-lg border p-3 transition-all duration-300 sm:p-4 ${
                selected
                  ? "border-blue-400/40 bg-blue-500/10 shadow-[0_0_26px_rgba(124,58,237,0.16)]"
                  : "border-white/10 bg-white/[0.035] hover:border-blue-400/35"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white">
                    {slot.title}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-zinc-500">
                    {slot.subtitle}
                  </p>
                </div>

                {selected ? (
                  <span className="rounded-full bg-blue-400 px-2 py-1 text-[9px] font-black uppercase text-black">
                    Ready
                  </span>
                ) : null}
              </div>

              <label
                htmlFor={slot.inputId}
                className={`relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border transition-all duration-300 sm:h-44 ${
                  selected
                    ? "border-blue-400/35 bg-black"
                    : "border-dashed border-white/15 bg-black/35 hover:border-blue-400/45 hover:bg-black/45"
                }`}
              >
                {slot.preview ? (
                  <>
                    <img
                      src={slot.preview}
                      alt={slot.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-25 blur-xl"
                    />
                    <img
                      src={slot.preview}
                      alt={slot.title}
                      className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 right-2 z-20 rounded-lg bg-black/70 px-3 py-2 backdrop-blur">
                      <p className="truncate text-[10px] font-black text-white">{slot.file?.name}</p>
                      <p className="mt-0.5 text-[9px] font-bold text-zinc-400">
                        {slot.file ? formatBytes(slot.file.size) : ""}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-blue-400/25 bg-blue-500/10 text-2xl">
                      +
                    </div>
                    <p className="text-xs font-black text-white">
                      Choose {slot.index === 0 ? "left" : "right"} image
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-zinc-500">
                      JPG, PNG, WEBP
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

              {selected ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <label
                    htmlFor={slot.inputId}
                    className="flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-black text-white transition hover:bg-white hover:text-black"
                  >
                    Change
                  </label>
                  <button
                    className="flex min-h-10 items-center justify-center rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-2 text-[11px] font-black text-red-100 transition hover:bg-red-500 hover:text-white"
                    onClick={() => removeSlot(slot.index)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
