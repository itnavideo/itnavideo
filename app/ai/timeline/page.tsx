'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Captions,
  ImageIcon,
  Layers3,
  MousePointer2,
  Play,
  RotateCcw,
  Sparkles,
  Video,
  Wand2,
} from 'lucide-react';
import { getContrastRatio } from '@/services/ai/designSystem/colors';
import type { VisualAsset } from '@/services/assets/visualAssets';

type TrackId = 'video' | 'assets' | 'text' | 'audio';
type InteractionMode = 'drag' | 'resize-start' | 'resize-end' | 'playhead';

type TimelineBlock = {
  id: string;
  trackId: TrackId;
  start: number;
  end: number;
  label: string;
  color: string;
  backgroundColor?: string;
  textColor?: string;
};

type ConflictMarker = {
  id: string;
  time: number;
  blockId: string;
  message: string;
  severity: 'warning' | 'error';
  suggestedColor: string;
};

type Interaction = {
  mode: InteractionMode;
  blockId?: string;
  startX: number;
  initialStart: number;
  initialEnd: number;
  initialPlayhead: number;
};

const TRACKS: Array<{ id: TrackId; label: string; icon: React.ReactNode }> = [
  { id: 'video', label: 'Video', icon: <Video size={15} /> },
  { id: 'assets', label: 'Assets', icon: <ImageIcon size={15} /> },
  { id: 'text', label: 'Text', icon: <Captions size={15} /> },
  { id: 'audio', label: 'Audio', icon: <Layers3 size={15} /> },
];

const INITIAL_BLOCKS: TimelineBlock[] = [
  { id: 'video_1', trackId: 'video', start: 0, end: 7.5, label: 'Hook background', color: '#0f172a', backgroundColor: '0x0f172a' },
  { id: 'video_2', trackId: 'video', start: 7.5, end: 15, label: 'Light product shot', color: '#f8fafc', backgroundColor: '0xf8fafc' },
  { id: 'video_3', trackId: 'video', start: 15, end: 24, label: 'Cinematic close', color: '#111827', backgroundColor: '0x111827' },
  { id: 'asset_1', trackId: 'assets', start: 2.2, end: 6.4, label: 'App icon card', color: '#38bdf8' },
  { id: 'asset_2', trackId: 'assets', start: 10, end: 13.8, label: 'Logo cutout', color: '#fbbf24' },
  { id: 'text_1', trackId: 'text', start: 0.8, end: 4.4, label: 'Stop wasting edits', color: '#22c55e', textColor: '0xffffff' },
  { id: 'text_2', trackId: 'text', start: 8.1, end: 11.6, label: 'AI builds scenes', color: '#a78bfa', textColor: '0xffffff' },
  { id: 'text_3', trackId: 'text', start: 16.2, end: 21.5, label: 'Ready to publish', color: '#fb7185', textColor: '0x111827' },
  { id: 'audio_1', trackId: 'audio', start: 0, end: 24, label: 'Voiceover mix', color: '#34d399' },
];

const DURATION_SECONDS = 24;
const LEFT_GUTTER = 148;
const RULER_HEIGHT = 38;
const TRACK_HEIGHT = 58;
const BLOCK_HEIGHT = 34;
const MIN_BLOCK_DURATION = 0.35;

export default function AiTimelinePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef<Interaction | null>(null);
  const [blocks, setBlocks] = useState<TimelineBlock[]>(INITIAL_BLOCKS);
  const [playhead, setPlayhead] = useState(3.2);
  const [selectedBlockId, setSelectedBlockId] = useState('text_2');
  const [canvasWidth, setCanvasWidth] = useState(1024);
  const [zoom, setZoom] = useState(1);
  const [driveAssets, setDriveAssets] = useState<VisualAsset[]>([]);
  const [driveConfigured, setDriveConfigured] = useState<boolean | null>(null);

  const pxPerSecond = useMemo(() => ((canvasWidth - LEFT_GUTTER - 24) / DURATION_SECONDS) * zoom, [canvasWidth, zoom]);
  const canvasHeight = RULER_HEIGHT + TRACKS.length * TRACK_HEIGHT + 18;
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) || null;
  const conflicts = useMemo(() => findColorConflicts(blocks), [blocks]);
  const selectedConflict = conflicts.find((conflict) => conflict.blockId === selectedBlockId) || conflicts[0] || null;
  const activeBlocks = useMemo(() => blocks.filter((block) => playhead >= block.start && playhead <= block.end), [blocks, playhead]);
  const activeVideo = [...activeBlocks].reverse().find((block) => block.trackId === 'video');
  const activeText = activeBlocks.filter((block) => block.trackId === 'text');
  const activeAssets = activeBlocks.filter((block) => block.trackId === 'assets');

  useEffect(() => {
    const updateSize = () => {
      setCanvasWidth(Math.max(760, Math.round(wrapRef.current?.clientWidth || 1024)));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/assets/drive?kind=all&limit=24')
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        setDriveConfigured(Boolean(data.configured));
        setDriveAssets(Array.isArray(data.assets) ? data.assets : []);
      })
      .catch(() => {
        if (cancelled) return;
        setDriveConfigured(false);
        setDriveAssets([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const drawTimeline = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackground(ctx, canvasWidth, canvasHeight);
    drawRuler(ctx, canvasWidth, pxPerSecond);
    drawTracks(ctx, blocks, selectedBlockId, conflicts, canvasWidth, pxPerSecond);
    drawPlayhead(ctx, playhead, canvasHeight, pxPerSecond);
  }, [blocks, canvasHeight, canvasWidth, conflicts, playhead, pxPerSecond, selectedBlockId]);

  useEffect(() => {
    drawTimeline();
  }, [drawTimeline]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event);
    const playheadX = timeToX(playhead, pxPerSecond);

    if (Math.abs(point.x - playheadX) <= 8 && point.y >= RULER_HEIGHT) {
      interactionRef.current = { mode: 'playhead', startX: point.x, initialStart: 0, initialEnd: 0, initialPlayhead: playhead };
      return;
    }

    const hit = hitTestBlock(point, blocks, pxPerSecond);
    if (!hit) {
      setSelectedBlockId('');
      setPlayhead(clamp(xToTime(point.x, pxPerSecond), 0, DURATION_SECONDS));
      return;
    }

    setSelectedBlockId(hit.block.id);
    const left = timeToX(hit.block.start, pxPerSecond);
    const right = timeToX(hit.block.end, pxPerSecond);
    const mode: InteractionMode = Math.abs(point.x - left) <= 7 ? 'resize-start' : Math.abs(point.x - right) <= 7 ? 'resize-end' : 'drag';
    interactionRef.current = {
      mode,
      blockId: hit.block.id,
      startX: point.x,
      initialStart: hit.block.start,
      initialEnd: hit.block.end,
      initialPlayhead: playhead,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const interaction = interactionRef.current;
    if (!interaction) return;

    const point = getCanvasPoint(event);
    const deltaSeconds = (point.x - interaction.startX) / pxPerSecond;

    if (interaction.mode === 'playhead') {
      setPlayhead(clamp(interaction.initialPlayhead + deltaSeconds, 0, DURATION_SECONDS));
      return;
    }

    setBlocks((items) => items.map((block) => {
      if (block.id !== interaction.blockId) return block;
      if (interaction.mode === 'drag') {
        const duration = interaction.initialEnd - interaction.initialStart;
        const start = clamp(interaction.initialStart + deltaSeconds, 0, DURATION_SECONDS - duration);
        return { ...block, start: roundTime(start), end: roundTime(start + duration) };
      }

      if (interaction.mode === 'resize-start') {
        const start = clamp(interaction.initialStart + deltaSeconds, 0, interaction.initialEnd - MIN_BLOCK_DURATION);
        return { ...block, start: roundTime(start) };
      }

      const end = clamp(interaction.initialEnd + deltaSeconds, interaction.initialStart + MIN_BLOCK_DURATION, DURATION_SECONDS);
      return { ...block, end: roundTime(end) };
    }));
  };

  const stopInteraction = () => {
    interactionRef.current = null;
  };

  const autoFixConflict = (marker: ConflictMarker | null) => {
    if (!marker) return;
    setBlocks((items) => items.map((block) => (
      block.id === marker.blockId ? { ...block, textColor: marker.suggestedColor } : block
    )));
    setSelectedBlockId(marker.blockId);
    setPlayhead(marker.time);
  };

  const resetTimeline = () => {
    setBlocks(INITIAL_BLOCKS);
    setPlayhead(3.2);
    setSelectedBlockId('text_2');
    setZoom(1);
  };

  const addDriveAssetToTimeline = (asset: VisualAsset) => {
    const start = clamp(playhead, 0, DURATION_SECONDS - 3);
    const isAudio = asset.category.includes('music') || asset.category.includes('sound') || asset.category.includes('sfx');
    const trackId: TrackId = isAudio ? 'audio' : 'assets';
    const next: TimelineBlock = {
      id: `drive_${asset.driveFileId || asset.id}_${Date.now()}`,
      trackId,
      start: roundTime(start),
      end: roundTime(Math.min(DURATION_SECONDS, start + (isAudio ? 6 : 3.5))),
      label: asset.title || 'Drive asset',
      color: isAudio ? '#34d399' : asset.type === 'graphic' ? '#fbbf24' : '#38bdf8',
      backgroundColor: asset.type === 'image' ? '0xffffff' : undefined,
    };
    setBlocks((items) => [...items, next]);
    setSelectedBlockId(next.id);
  };

  return (
    <main className="min-h-screen bg-[#050506] px-5 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">AI timeline</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal md:text-4xl">Timeline control room</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => autoFixConflict(selectedConflict)} className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-black text-black transition hover:bg-emerald-200">
              <Wand2 size={16} />
              Auto-fix
            </button>
            <button onClick={resetTimeline} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10">
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-5 lg:grid-cols-[minmax(320px,430px)_1fr]">
            <PreviewPanel videoBlock={activeVideo} textBlocks={activeText} assetBlocks={activeAssets} time={playhead} />
            <InspectorPanel selectedBlock={selectedBlock} conflict={selectedConflict} conflicts={conflicts} onFix={autoFixConflict} />
          </div>

          <aside className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-black">AI checks</h2>
                <p className="mt-1 text-sm text-zinc-500">{conflicts.length ? `${conflicts.length} conflict markers` : 'No color conflicts'}</p>
              </div>
              {conflicts.length ? <AlertTriangle className="text-amber-300" size={22} /> : <BadgeCheck className="text-emerald-300" size={22} />}
            </div>
            <div className="mt-5 space-y-3">
              {conflicts.length ? conflicts.map((marker) => (
                <button
                  key={marker.id}
                  onClick={() => {
                    setSelectedBlockId(marker.blockId);
                    setPlayhead(marker.time);
                  }}
                  className="w-full rounded-md border border-amber-300/20 bg-amber-300/8 p-4 text-left transition hover:bg-amber-300/12"
                >
                  <p className="text-sm font-black text-amber-100">{formatTime(marker.time)}</p>
                  <p className="mt-1 text-sm leading-5 text-zinc-300">{marker.message}</p>
                </button>
              )) : (
                <div className="rounded-md border border-emerald-300/20 bg-emerald-300/8 p-4 text-sm font-bold text-emerald-100">
                  Contrast guardrail active.
                </div>
              )}
            </div>
          </div>

          <DriveAssetPanel assets={driveAssets} configured={driveConfigured} onAdd={addDriveAssetToTimeline} />
          </aside>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-950 p-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
              <MousePointer2 size={16} />
              <span>{formatTime(playhead)}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPlayhead((time) => (time >= DURATION_SECONDS ? 0 : Math.min(DURATION_SECONDS, time + 0.5)))} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white text-black transition hover:bg-emerald-200" title="Play step">
                <Play size={16} fill="currentColor" />
              </button>
              <input
                aria-label="Zoom"
                type="range"
                min="0.75"
                max="1.8"
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-40 accent-emerald-300"
              />
            </div>
          </div>
          <div ref={wrapRef} className="overflow-x-auto rounded-md border border-white/10 bg-black">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopInteraction}
              onPointerLeave={stopInteraction}
              className="block cursor-crosshair"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function DriveAssetPanel({
  assets,
  configured,
  onAdd,
}: {
  assets: VisualAsset[];
  configured: boolean | null;
  onAdd: (asset: VisualAsset) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-black">Drive assets</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {configured === null ? 'Loading library...' : configured ? `${assets.length} indexed items` : 'Drive not configured'}
          </p>
        </div>
        <ImageIcon className="text-zinc-500" size={21} />
      </div>
      <div className="mt-5 max-h-[300px] space-y-2 overflow-y-auto pr-1">
        {assets.length ? assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => onAdd(asset)}
            className="flex w-full items-center gap-3 rounded-md border border-white/10 bg-black/25 p-3 text-left transition hover:bg-white/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/8 text-zinc-300">
              {asset.type === 'video' ? <Video size={16} /> : asset.type === 'image' ? <ImageIcon size={16} /> : <Layers3 size={16} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{asset.title || asset.id}</p>
              <p className="mt-0.5 truncate text-xs text-zinc-500">{asset.category}</p>
            </div>
          </button>
        )) : (
          <div className="rounded-md border border-white/10 bg-black/25 p-4 text-sm text-zinc-500">
            Add Drive env vars and share the folder with the service account.
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewPanel({
  videoBlock,
  textBlocks,
  assetBlocks,
  time,
}: {
  videoBlock?: TimelineBlock;
  textBlocks: TimelineBlock[];
  assetBlocks: TimelineBlock[];
  time: number;
}) {
  const background = toCssColor(videoBlock?.backgroundColor || '0x0f172a');

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950 p-4">
      <div className="relative mx-auto aspect-[9/16] max-h-[650px] overflow-hidden rounded-lg border border-white/10" style={{ background }}>
        <div className="absolute inset-x-0 top-[14.8%] h-[70.4%] border-y border-white/20 bg-black/10" />
        <div className="absolute inset-x-0 top-[21.9%] h-[56.2%] border-y border-emerald-200/30" />
        <div className="absolute left-4 top-4 rounded-md bg-black/60 px-3 py-1 text-xs font-black">{formatTime(time)}</div>
        {assetBlocks.map((asset, index) => (
          <div key={asset.id} className="absolute right-5 top-24 rounded-lg border border-white/15 bg-white/90 px-4 py-3 text-sm font-black text-zinc-950 shadow-xl" style={{ transform: `translateY(${index * 62}px)` }}>
            {asset.label}
          </div>
        ))}
        <div className="absolute inset-x-6 bottom-28 space-y-3">
          {textBlocks.map((text) => (
            <div key={text.id} className="rounded-md bg-black/55 px-4 py-3 text-center text-2xl font-black" style={{ color: toCssColor(text.textColor || '0xffffff'), WebkitTextStroke: `1px ${bestStrokeFor(text.textColor || '0xffffff')}` }}>
              {text.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InspectorPanel({
  selectedBlock,
  conflict,
  conflicts,
  onFix,
}: {
  selectedBlock: TimelineBlock | null;
  conflict: ConflictMarker | null;
  conflicts: ConflictMarker[];
  onFix: (marker: ConflictMarker | null) => void;
}) {
  const ffmpegEnable = selectedBlock ? `enable='between(t,${roundTime(selectedBlock.start)},${roundTime(selectedBlock.end)})'` : '';

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="text-emerald-300" size={19} />
        <h2 className="font-black">Block inspector</h2>
      </div>
      {selectedBlock ? (
        <div className="mt-5 space-y-4">
          <Field label="Layer" value={selectedBlock.trackId} />
          <Field label="Block" value={selectedBlock.label} />
          <Field label="Timing" value={`${formatTime(selectedBlock.start)} - ${formatTime(selectedBlock.end)}`} />
          <div className="rounded-md border border-white/10 bg-black/30 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">FFmpeg timing</p>
            <p className="mt-2 break-all font-mono text-xs text-emerald-100">{ffmpegEnable}</p>
          </div>
          {conflict ? (
            <div className="rounded-md border border-amber-300/20 bg-amber-300/8 p-4">
              <p className="text-sm font-black text-amber-100">Contrast conflict</p>
              <p className="mt-2 text-sm leading-5 text-zinc-300">{conflict.message}</p>
              <button onClick={() => onFix(conflict)} className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-200 px-3 py-2 text-sm font-black text-black">
                <Wand2 size={15} />
                Auto-fix block
              </button>
            </div>
          ) : (
            <div className="rounded-md border border-emerald-300/20 bg-emerald-300/8 p-4 text-sm font-bold text-emerald-100">
              Selected block passes contrast.
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-white/10 bg-black/30 p-4 text-sm text-zinc-400">
          {conflicts.length ? 'Select a warning marker or timeline block.' : 'Timeline is ready.'}
        </div>
      )}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#050506';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#09090b';
  ctx.fillRect(LEFT_GUTTER, RULER_HEIGHT, width - LEFT_GUTTER, height - RULER_HEIGHT);
}

function drawRuler(ctx: CanvasRenderingContext2D, width: number, pxPerSecond: number) {
  ctx.fillStyle = '#0f0f12';
  ctx.fillRect(0, 0, width, RULER_HEIGHT);
  ctx.font = '12px Arial';
  ctx.textBaseline = 'middle';

  for (let second = 0; second <= DURATION_SECONDS; second += 1) {
    const x = timeToX(second, pxPerSecond);
    ctx.strokeStyle = second % 5 === 0 ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(x, RULER_HEIGHT - (second % 5 === 0 ? 18 : 10));
    ctx.lineTo(x, RULER_HEIGHT);
    ctx.stroke();

    if (second % 5 === 0) {
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(formatTime(second), x + 4, 16);
    }
  }
}

function drawTracks(
  ctx: CanvasRenderingContext2D,
  blocks: TimelineBlock[],
  selectedBlockId: string,
  conflicts: ConflictMarker[],
  width: number,
  pxPerSecond: number,
) {
  TRACKS.forEach((track, index) => {
    const y = RULER_HEIGHT + index * TRACK_HEIGHT;
    ctx.fillStyle = index % 2 === 0 ? '#0b0b0e' : '#09090b';
    ctx.fillRect(0, y, width, TRACK_HEIGHT);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(0, y + TRACK_HEIGHT);
    ctx.lineTo(width, y + TRACK_HEIGHT);
    ctx.stroke();
    ctx.fillStyle = '#d4d4d8';
    ctx.font = 'bold 13px Arial';
    ctx.fillText(track.label, 18, y + TRACK_HEIGHT / 2 + 4);
  });

  blocks.forEach((block) => drawBlock(ctx, block, selectedBlockId === block.id, pxPerSecond));
  conflicts.forEach((marker) => drawMarker(ctx, marker, pxPerSecond));
}

function drawBlock(ctx: CanvasRenderingContext2D, block: TimelineBlock, selected: boolean, pxPerSecond: number) {
  const trackIndex = TRACKS.findIndex((track) => track.id === block.trackId);
  if (trackIndex < 0) return;

  const x = timeToX(block.start, pxPerSecond);
  const y = RULER_HEIGHT + trackIndex * TRACK_HEIGHT + (TRACK_HEIGHT - BLOCK_HEIGHT) / 2;
  const width = Math.max(24, (block.end - block.start) * pxPerSecond);
  roundRect(ctx, x, y, width, BLOCK_HEIGHT, 7);
  ctx.fillStyle = block.color;
  ctx.fill();
  ctx.strokeStyle = selected ? '#ffffff' : 'rgba(255,255,255,0.18)';
  ctx.lineWidth = selected ? 2 : 1;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, x + 6, y + 4, Math.max(1, width - 12), BLOCK_HEIGHT - 8, 5);
  ctx.clip();
  ctx.fillStyle = '#050506';
  ctx.font = 'bold 12px Arial';
  ctx.fillText(block.label, x + 10, y + 22);
  ctx.restore();
}

function drawMarker(ctx: CanvasRenderingContext2D, marker: ConflictMarker, pxPerSecond: number) {
  const x = timeToX(marker.time, pxPerSecond);
  const y = RULER_HEIGHT + TRACKS.findIndex((track) => track.id === 'text') * TRACK_HEIGHT + 4;
  ctx.fillStyle = marker.severity === 'error' ? '#ef4444' : '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 7, y + 13);
  ctx.lineTo(x + 7, y + 13);
  ctx.closePath();
  ctx.fill();
}

function drawPlayhead(ctx: CanvasRenderingContext2D, time: number, height: number, pxPerSecond: number) {
  const x = timeToX(time, pxPerSecond);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, RULER_HEIGHT);
  ctx.lineTo(x, height);
  ctx.stroke();
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(x, RULER_HEIGHT, 6, 0, Math.PI * 2);
  ctx.fill();
}

function hitTestBlock(point: { x: number; y: number }, blocks: TimelineBlock[], pxPerSecond: number) {
  for (const block of [...blocks].reverse()) {
    const trackIndex = TRACKS.findIndex((track) => track.id === block.trackId);
    const x = timeToX(block.start, pxPerSecond);
    const y = RULER_HEIGHT + trackIndex * TRACK_HEIGHT + (TRACK_HEIGHT - BLOCK_HEIGHT) / 2;
    const width = Math.max(24, (block.end - block.start) * pxPerSecond);
    if (point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + BLOCK_HEIGHT) {
      return { block };
    }
  }

  return null;
}

function findColorConflicts(blocks: TimelineBlock[]): ConflictMarker[] {
  const videos = blocks.filter((block) => block.trackId === 'video');
  return blocks
    .filter((block) => block.trackId === 'text')
    .flatMap((textBlock) => {
      const midpoint = (textBlock.start + textBlock.end) / 2;
      const video = videos.find((item) => midpoint >= item.start && midpoint <= item.end);
      if (!video?.backgroundColor || !textBlock.textColor) return [];

      const ratio = getContrastRatio(video.backgroundColor, textBlock.textColor);
      if (ratio >= 4.5) return [];

      const suggestedColor = getContrastRatio(video.backgroundColor, '0xffffff') >= getContrastRatio(video.backgroundColor, '0x111827')
        ? '0xffffff'
        : '0x111827';

      return [{
        id: `conflict_${textBlock.id}`,
        time: roundTime(midpoint),
        blockId: textBlock.id,
        severity: ratio < 3 ? 'error' as const : 'warning' as const,
        suggestedColor,
        message: `${textBlock.label} needs stronger contrast over ${video.label}.`,
      }];
    });
}

function getCanvasPoint(event: React.PointerEvent<HTMLCanvasElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function timeToX(time: number, pxPerSecond: number) {
  return LEFT_GUTTER + time * pxPerSecond;
}

function xToTime(x: number, pxPerSecond: number) {
  return (x - LEFT_GUTTER) / pxPerSecond;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function toCssColor(value: string) {
  if (/^0x[0-9a-f]{6}$/i.test(value)) return `#${value.slice(2)}`;
  return value;
}

function bestStrokeFor(value: string) {
  return getContrastRatio(value, '0xffffff') > getContrastRatio(value, '0x000000') ? '#ffffff' : '#000000';
}

function formatTime(value: number) {
  const total = Math.max(0, Math.round(value * 10) / 10);
  const minutes = Math.floor(total / 60);
  const seconds = total - minutes * 60;
  return `${minutes}:${seconds.toFixed(1).padStart(4, '0')}`;
}

function roundTime(value: number) {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
