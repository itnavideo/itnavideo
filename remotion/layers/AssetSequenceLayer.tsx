import {Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {LucideAssetIcon} from './LucideAssetIcon';

export type AssetSequenceItem = {
  id: string;
  overlayId?: string;
  start: number;
  end: number;
  src: string;
  title: string;
  kind?: 'image' | 'icon' | 'background' | 'frame';
  category?: string;
  tags?: string[];
  role?: 'background' | 'supporting' | 'primary';
  motion?: 'slowZoom' | 'panLeft' | 'float' | 'pop' | 'parallax';
  frameText?: string;
  frameType?: string;
  frameValue?: string;
  frameLabel?: string;
  frameItems?: string[];
};

type AssetSequenceLayerProps = {
  fps: number;
  items?: unknown;
};

export const assetSequenceLayerStyles = `
.asset-timeline-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}
.asset-shot {
  position: absolute;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
}
.asset-shot.background {
  inset: 0;
  border: 0;
  border-radius: 0;
  opacity: 0.92;
  filter: saturate(1.05) contrast(1.02);
  box-shadow: none;
}
.asset-shot.background::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 22%, rgba(92, 232, 213, 0.10), transparent 34%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.70));
}
.asset-shot.primary {
  z-index: 4;
  left: 650px;
  top: 1038px;
  width: 340px;
  height: 420px;
  border-radius: 26px;
}
.asset-shot.supporting {
  z-index: 4;
  left: 72px;
  top: 1420px;
  width: 240px;
  height: 240px;
  border-radius: 34px;
}
.asset-shot.supporting.icon {
  left: 86px;
  top: 1436px;
  width: 148px;
  height: 148px;
  border-radius: 26px;
  padding: 22px;
}
.asset-shot.icon {
  padding: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.035));
}
.asset-shot.frame {
  display: grid;
  place-items: center;
  border-color: rgba(92, 232, 213, 0.28);
  background:
    radial-gradient(circle at 50% 18%, rgba(92, 232, 213, 0.18), transparent 38%),
    linear-gradient(145deg, rgba(7, 16, 20, 0.98), rgba(18, 26, 32, 0.94));
}
.asset-shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.asset-shot.background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(22px) brightness(0.62) saturate(0.92);
  transform: scale(1.16);
}
.asset-shot.icon img {
  object-fit: contain;
}
.asset-shot-lucide {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: #5ce8d5;
  filter: drop-shadow(0 14px 30px rgba(92, 232, 213, 0.22));
}
.asset-shot-lucide svg {
  width: min(72%, 96px);
  height: min(72%, 96px);
}
.asset-shot-label {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.56);
  padding: 8px 10px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 18px;
  font-weight: 900;
}
.asset-shot.background .asset-shot-label {
  display: none;
}
.asset-shot.supporting.icon .asset-shot-label {
  display: none;
}
.asset-shot.frame .asset-shot-label {
  display: none;
}
.asset-frame-visual {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  overflow: hidden;
  color: white;
  text-align: center;
}
.asset-frame-visual::before {
  content: "";
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
}
.asset-frame-kicker {
  position: absolute;
  left: 26px;
  top: 24px;
  color: #5ce8d5;
  font-size: 18px;
  font-weight: 950;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.asset-frame-text {
  max-width: 86%;
  color: #fff;
  font-size: 48px;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.95;
  text-transform: uppercase;
  text-shadow: 0 12px 38px rgba(0, 0, 0, 0.42);
}
.asset-frame-value {
  color: #ffd84d;
  font-size: 62px;
  font-weight: 950;
  line-height: 0.9;
}
.asset-frame-list {
  display: grid;
  gap: 10px;
  width: 82%;
}
.asset-frame-list-row {
  display: grid;
  grid-template-columns: 34px 1fr;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.07);
  padding: 10px 12px;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.05;
  text-align: left;
}
.asset-frame-list-row span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 999px;
  background: #5ce8d5;
  color: #061015;
  font-size: 16px;
}
`;

export const AssetSequenceLayer = ({fps, items}: AssetSequenceLayerProps) => {
  const timeline = normalizeAssetTimeline(items);
  if (!timeline.length) return null;

  return (
    <div className="asset-timeline-layer">
      {timeline.map((item) => {
        const from = Math.max(0, Math.round(item.start * fps));
        const duration = Math.max(1, Math.round((item.end - item.start) * fps));
        return (
          <Sequence durationInFrames={duration} from={from} key={item.id}>
            <AssetShot durationFrames={duration} item={item} />
          </Sequence>
        );
      })}
    </div>
  );
};

function normalizeAssetTimeline(value: unknown): AssetSequenceItem[] {
  if (!Array.isArray(value)) return [];
  const timeline: AssetSequenceItem[] = [];
  value.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      const record = item as Record<string, unknown>;
      const start = Math.max(0, Number(record.start) || 0);
      const end = Math.max(0, Number(record.end) || 0);
      const src = cleanText(record.src).slice(0, 700);
      const kind = record.kind === 'icon' || record.kind === 'background' || record.kind === 'frame' ? record.kind : 'image';
      if ((!src && kind !== 'frame') || end <= start) return;
      timeline.push({
        id: cleanText(record.id || `asset-shot-${index}`).replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 160) || `asset-shot-${index}`,
        overlayId: cleanText(record.overlayId).slice(0, 80) || undefined,
        start,
        end,
        src,
        title: limitWords(record.title || 'Asset', 5, 96),
        kind,
        category: cleanText(record.category || 'general').slice(0, 80),
        tags: Array.isArray(record.tags) ? record.tags.map((tag) => cleanText(tag).slice(0, 32)).filter(Boolean).slice(0, 12) : [],
        role: record.role === 'background' || record.role === 'supporting' || record.role === 'primary' ? record.role : 'primary',
        motion: record.motion === 'slowZoom' || record.motion === 'panLeft' || record.motion === 'float' || record.motion === 'pop' || record.motion === 'parallax'
          ? record.motion
          : 'slowZoom',
        frameText: cleanText(record.frameText).slice(0, 64) || undefined,
        frameType: cleanText(record.frameType).slice(0, 40) || undefined,
        frameValue: cleanText(record.frameValue).slice(0, 32) || undefined,
        frameLabel: cleanText(record.frameLabel).slice(0, 48) || undefined,
        frameItems: Array.isArray(record.frameItems) ? record.frameItems.map((item) => limitWords(item, 5, 56)).filter(Boolean).slice(0, 5) : undefined,
      });
    });
  return timeline.sort((a, b) => a.start - b.start || a.end - b.end);
}

const AssetShot = ({item, durationFrames}: {item: AssetSequenceItem; durationFrames: number}) => {
  const localFrame = useCurrentFrame();
  const src = resolveMediaSrc(item.src);
  const lucideName = resolveLucideName(item.src);
  const role = item.role || 'primary';
  const kind = item.kind || 'image';
  if (kind === 'frame') {
    return (
      <div className={`asset-shot ${role} ${kind}`} style={assetShotStyle(item, localFrame, durationFrames)}>
        <AssetFrameVisual item={item} />
      </div>
    );
  }
  if (!src && !lucideName) return null;
  return (
    <div className={`asset-shot ${role} ${kind}`} style={assetShotStyle(item, localFrame, durationFrames)}>
      {lucideName ? <LucideAssetIcon name={lucideName} title={item.title} /> : <Img alt={item.title} src={src} />}
      {role !== 'background' ? <div className="asset-shot-label">{item.title}</div> : null}
    </div>
  );
};

const AssetFrameVisual = ({item}: {item: AssetSequenceItem}) => {
  const frameType = cleanText(item.frameType || '');
  const text = limitWords(item.frameText || item.title || 'Key Point', 2, 42).toUpperCase();
  const label = limitWords(item.frameLabel || item.category || 'Key Point', 3, 36).toUpperCase();
  const items = (item.frameItems || []).slice(0, frameType === 'TimelineFrame' ? 4 : 5);

  return (
    <div className={`asset-frame-visual ${frameType}`}>
      <div className="asset-frame-kicker">{label}</div>
      {frameType === 'StatisticCounter' || frameType === 'BigNumberReveal' || frameType === 'MoneyGrowthGraph' ? (
        <div>
          <div className="asset-frame-value">{item.frameValue || text}</div>
          <div className="asset-frame-text">{item.frameValue ? text : label}</div>
        </div>
      ) : frameType === 'ChecklistFrame' || frameType === 'TimelineFrame' ? (
        <div className="asset-frame-list">
          {(items.length ? items : [text, 'Action', 'Result']).slice(0, 5).map((entry, index) => (
            <div className="asset-frame-list-row" key={`${entry}-${index}`}>
              <span>{index + 1}</span>
              <p>{entry}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="asset-frame-text">{text}</div>
      )}
    </div>
  );
};

function assetShotStyle(item: AssetSequenceItem, localFrame: number, durationFrames: number) {
  const enter = clamp(localFrame / 14, 0, 1);
  const exit = clamp((durationFrames - localFrame) / 12, 0, 1);
  const opacity = Math.min(enter, exit);
  return {
    opacity: item.role === 'background' ? opacity * 0.92 : opacity,
    transform: 'none',
  };
}

function resolveMediaSrc(src: string | undefined) {
  if (!src) return '';
  if (/^lucide:/i.test(src)) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  return staticFile(src.replace(/^\/+/, ''));
}

function resolveLucideName(src: string | undefined) {
  const match = String(src || '').match(/^lucide:(.+)$/i);
  return match?.[1]?.trim() || '';
}

function cleanText(value: unknown) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function limitWords(value: unknown, maxWords: number, maxChars: number) {
  return cleanText(value)
    .split(/\s+/)
    .slice(0, maxWords)
    .join(' ')
    .slice(0, maxChars);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

