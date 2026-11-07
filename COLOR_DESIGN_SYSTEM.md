# Itnavideo — White & Black Primary Color System

This document is the **Single Source of Truth for Colors, Design Tokens, and UI Patterns** across the entire Itnavideo platform.

---

## 1. Executive Master Directive: White & Black Primary Color System

> [!IMPORTANT]
> **FOUNDER DIRECTIVE: WHITE & BLACK PRIMARY COLOR SYSTEM**:
> - **Primary Canvas Background**: Crisp White (`#FFFFFF`) and clean soft neutrals (`#F8FAFC`, `#F4F4F5`).
> - **Typography & Headings**: Deep Jet Black (`#09090B`, `zinc-950`, `slate-950`).
> - **Key UI Elements & Action Buttons**: Tactile monochrome Jet Black (`bg-zinc-950 text-white hover:bg-zinc-800`), providing an executive, modern, Apple/Linear/Vercel-level aesthetic.
> - **Accents Where Helpful**: Subtle, purposeful accents (electric blue, emerald, amber) are permitted strictly for status badges, tags, or feature differentiation, but the foundational brand identity is firmly **White and Black**.
> - **Eliminate Orange Overuse**: The previous Google Analytics orange theme is deprecated.

---

## 2. Core Color Tokens Matrix

### A. Primary Canvas & Surfaces
| Token Name | HEX Code | Tailwind Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Base Canvas** | `#FFFFFF` | `bg-white` | Primary website background canvas |
| **Subtle Neutral Surface**| `#F8FAFC` / `#FAFAFD` | `bg-slate-50` / `bg-zinc-50` | Secondary sections, tickers, subtle backgrounds |
| **Elevated Card Surface** | `#FFFFFF` | `bg-white` | Cards, panels, dropdowns |
| **Subtle Border** | `#E2E8F0` / `rgba(0,0,0,0.08)` | `border-zinc-200` / `border-slate-200` | Crisp, clean separation lines |

### B. Typography & Contrast
| Token Name | HEX / Class | Purpose & Usage |
| :--- | :--- | :--- |
| **Primary Headings & Titles** | `text-zinc-950` / `text-black` (`#09090B`) | High-contrast, executive headlines and titles |
| **Body & Subtitles** | `text-zinc-600` / `text-slate-600` | High-legibility editorial descriptions |
| **Muted Metadata** | `text-zinc-400` / `text-slate-400` | Timestamps, micro-labels, fine details |

### C. Buttons & Action Anchors
| Button Type | Styling Pattern | Purpose |
| :--- | :--- | :--- |
| **Primary CTA Button** | `bg-zinc-950 text-white hover:bg-zinc-800 rounded-full shadow-md` | Primary conversion actions, Get Started, Create Free |
| **Secondary Button** | `bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 rounded-full` | Secondary workflows, browse specs, documentation |
| **Ghost Action** | `text-zinc-700 hover:text-black font-semibold` | Inline navigation links and utility triggers |

### D. Purposeful Status Indicators
| Status State | HEX Code | Tailwind Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Success** | `#10B981` | `text-emerald-600`, `bg-emerald-50` | Verified status, completion marks |
| **Error / Alert** | `#EF4444` | `text-rose-600`, `bg-rose-50` | Input alerts, system errors |
| **Active Highlight** | `#0066FF` | `text-blue-600`, `bg-blue-50` | Studio category tags, active pills |

---

## 3. UI Component Patterns

### Primary Jet Black CTA Button
```tsx
<button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 px-8 py-3.5 text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all">
  <span>Start Creating Free</span>
  <ArrowRight size={16} />
</button>
```

### High-Impact Headline
```tsx
<h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 font-sans">
  Build High-Converting Videos with{' '}
  <span className="bg-gradient-to-b from-zinc-950 via-zinc-800 to-zinc-500 bg-clip-text text-transparent">
    Instant AI Speed
  </span>
</h1>
```
