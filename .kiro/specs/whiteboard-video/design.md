# Whiteboard Video — Design

## Visual Layout (1080x1920)

```
┌──────────────────────────────────────┐
│  CORPORATE BACKGROUND (blurred/dark) │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │  ★ META ADS PLAYBOOK          │  │  ← Title (handwritten, underlined)
│  │  ─────────────────────        │  │
│  │                                │  │
│  │  1. Right campaign structure   │  │  ← Point 1 (blue marker)
│  │                                │  │
│  │  2. Scale winners              │  │  ← Point 2 (green marker)
│  │                                │  │
│  │  3. Reinvest profit            │  │  ← Point 3 (red marker)
│  │                                │  │
│  │  4. Improve system             │  │  ← Point 4 (blue marker)
│  │                                │  │
│  │  ✓ Key takeaway here           │  │  ← Conclusion (black, bold)
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  "Captions synced to speech"   │  │  ← Subtitle bar (optional)
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## File Structure

```
remotion/templates/WHITEBOARD_VIDEO/
  template.tsx          ← Main Remotion composition
  WhiteboardScene.tsx   ← Whiteboard card with writing animation
  MarkerText.tsx        ← Handwritten text with progressive reveal
  doodles.tsx           ← Simple SVG icons (arrows, checks, stars, circles)

services/ai/
  whiteboardPlanner.ts  ← AI: transcript → whiteboard points plan

app/dashboard/page.tsx  ← Add video type card + mode config
app/video-types/whiteboard-video/page.tsx ← SEO landing page
app/whiteboard-video/page.tsx             ← Re-export short URL
```

---

## Remotion Component Design

### `template.tsx` — Main composition

```tsx
<AbsoluteFill>
  {/* Corporate background */}
  <CorporateBackground />
  
  {/* Whiteboard card — centered, with shadow */}
  <WhiteboardCard>
    {/* Title */}
    <MarkerText text={title} delay={0} color="black" size="title" />
    
    {/* Points — each appears at its timed moment */}
    {points.map((point, i) => (
      <MarkerText 
        key={i}
        text={point.text}
        delay={point.startFrame}
        color={point.markerColor}
        size="body"
        bullet={point.bulletType}
      />
    ))}
  </WhiteboardCard>
  
  {/* Optional captions at bottom */}
  <SubtitleRenderer captions={captions} config={subtitleConfig} />
</AbsoluteFill>
```

### `MarkerText.tsx` — Writing animation

The key effect: text appears character by character, left to right, like being written.

```tsx
// Using Remotion's interpolate to reveal text progressively
const progress = interpolate(frame, [startFrame, startFrame + writeDuration], [0, 1]);
const visibleChars = Math.floor(text.length * progress);
const displayText = text.slice(0, visibleChars);

// Style: handwritten font + marker color
<span style={{
  fontFamily: 'Kalam, cursive',
  color: markerColor,
  fontSize: titleSize ? 64 : 42,
}}>
  {displayText}
  {progress < 1 && <span className="cursor">|</span>}
</span>
```

### `WhiteboardCard` — The board itself

```tsx
// White card with subtle shadow, slight perspective
<div style={{
  position: 'absolute',
  top: 120, left: 50, right: 50, bottom: 220,
  background: '#FEFEFE',
  borderRadius: 12,
  border: '2px solid #E5E7EB',
  boxShadow: '0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)',
  padding: '60px 50px',
  transform: 'perspective(1200px) rotateY(-1deg)',
}}>
  {children}
</div>
```

### `CorporateBackground` — Professional backdrop

```tsx
// Dark professional gradient with subtle office blur feel
<div style={{
  position: 'absolute', inset: 0,
  background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)',
}}>
  {/* Subtle grid/texture overlay */}
  <div style={{
    position: 'absolute', inset: 0, opacity: 0.03,
    backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 40px)',
  }} />
  {/* Subtle ambient glow behind whiteboard */}
  <div style={{
    position: 'absolute', top: '20%', left: '10%', right: '10%', height: '60%',
    background: 'radial-gradient(ellipse, rgba(96,165,250,0.08), transparent 60%)',
    filter: 'blur(40px)',
  }} />
</div>
```

---

## AI Whiteboard Planner (`whiteboardPlanner.ts`)

### Input
```typescript
{
  transcript: string;
  segments: Array<{ start: number; end: number; text: string }>;
  durationSeconds: number;
}
```

### Output
```typescript
{
  title: string;              // Main heading extracted from transcript
  points: Array<{
    text: string;             // The point text (max 60 chars)
    startTime: number;        // When this point should appear (seconds)
    endTime: number;          // When writing completes
    markerColor: string;      // '#2563EB' | '#DC2626' | '#16A34A' | '#1F2937'
    bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
    icon?: string;            // Optional doodle icon name
  }>;
  source: 'gemini' | 'fallback';
}
```

### Gemini Prompt (single call)
```
You are a whiteboard content designer. Extract key points from this speech transcript.

TRANSCRIPT: {transcript}

RULES:
1. Extract 5-8 key points maximum.
2. Each point must be SHORT (max 8 words). Think whiteboard bullets.
3. First line is the TITLE (3-5 words, topic summary).
4. Assign timing based on when the speaker mentions each point.
5. Alternate marker colors: blue, green, red, blue, green...
6. Choose bullet type: number (for steps), bullet (for lists), check (for tips), arrow (for flow).

OUTPUT FORMAT (JSON only):
{
  "title": "Meta Ads Playbook",
  "points": [
    {"text": "Right campaign structure", "startTime": 3.5, "markerColor": "#2563EB", "bulletType": "number"},
    ...
  ]
}
```

### Fallback (no Gemini)
- Split transcript into segments
- Take first 3-5 words of each segment as a point
- Assign timing evenly across duration
- Alternate colors automatically

---

## Props Interface

```typescript
type WhiteboardVideoProps = {
  mediaSrc?: string;           // Audio/video source URL
  sourceAudioVolume?: number;
  durationSeconds?: number;
  
  // Whiteboard content (from AI planner)
  title?: string;
  points?: Array<{
    text: string;
    startTime: number;
    endTime: number;
    markerColor: string;
    bulletType: string;
    icon?: string;
  }>;
  
  // Style (V1 fixed, future: user selects)
  whiteboardStyle?: 'classic';  // Future: 'dark', 'neon', 'paper', etc.
  
  // Captions
  captions?: Array<{ start: number; end: number; text: string }>;
  captionStyle?: string;
  captionPosition?: 'bottom' | 'none';
};
```

---

## Dashboard Mode Config

```typescript
whiteboardVideo: {
  label: "Whiteboard Video",
  title: "Whiteboard Video",
  description: "🎙️ Upload: Audio or video with speech\n📝 AI writes key points on a whiteboard",
  accept: "audio/*,video/*",
  supported: "MP3, WAV, MP4, MOV",
  bestResult: "Clear explanation with distinct points (30-60s)",
  uploadCta: "🎙️ Upload audio or video",
  icon: PenLine,
  color: "text-emerald-200",
  border: "border-emerald-400/30",
  surface: "bg-emerald-400/[0.08]",
}
```

---

## Marker Color Palette

| Color | Hex | Use |
|-------|-----|-----|
| Blue | `#2563EB` | Primary points, titles |
| Red | `#DC2626` | Warnings, important highlights |
| Green | `#16A34A` | Tips, positive points |
| Black | `#1F2937` | Conclusions, neutral text |
| Purple | `#7C3AED` | Special/accent (future) |

---

## Fonts

- **Title**: `Kalam` (bold, 64px) — Google Font, handwritten style
- **Points**: `Kalam` (regular, 42px)
- **Captions**: Standard subtitle font (Inter or caption style)

Already available: `@fontsource/kalam` is in package.json.
