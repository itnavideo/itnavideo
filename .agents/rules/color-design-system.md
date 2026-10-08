---
name: color-design-system
description: Enforces the Google Analytics Visual Design & Color Consistency System and Material Design 3 (M3 - https://m3.material.io/) across all pages, features, video types, cards, and blog posts.
always_on: true
---

# Google Analytics Visual Design & Material Design 3 (M3) System

## 1. Zero Color Drift Policy
- **Strict Rule**: When building new features, studios, landing pages, modals, or blog posts, NEVER introduce arbitrary random colors (e.g. random neon purple, pink, teal, cyan, lime).
- All 10+ video studios and future tools live cohesively under the single **Google Analytics Orange & Slate** brand identity.

## 2. Core Color Tokens

- **Deep Orange**: `#FF6D00` (Signature Google Analytics deep orange)
- **Vibrant Orange**: `#F97316` (Warm midtone)
- **Warm Amber**: `#FF8F00` (Gradient midpoint & active indicators)
- **Golden Orange**: `#FFA726` (Highlight glow & gradient tail)
- **Dark Base Canvas**: `#070B14` (Obsidian slate background)
- **Dark Elevated Container**: `#0E1526` (Card surface)
- **Dark High Container**: `#151E30` (Interactive elevated surface)
- **Light Base Canvas**: `#FFFFFF` / `#F8FAFC`
- **Subtle Structural Border**: `border-white/10` (dark) or `border-slate-200` (light)
- **Status Semantic Colors**:
  - Success: `#10B981` (Emerald)
  - Error: `#EF4444` (Rose)
  - Warning / Paywall: `#F59E0B` (Warm Amber)

## 3. Material Design 3 (M3) Specifications (https://m3.material.io/)

Whenever designing or building UI components, layouts, containers, sheets, navigation, and micro-interactions, **ALWAYS apply Google Material Design 3 (M3)**:

### A. M3 Shape Tokens
- **Extra Large Containers & Cards**: `rounded-[28px]` (Studio cards, preview panels, modal sheets)
- **Medium Containers & Inputs**: `rounded-2xl` (Input fields, spec callout boxes, action bars)
- **Small Elements & Action Anchors**: `rounded-full` (Filter chips, status badges, primary CTA buttons)

### B. M3 Elevation & Surfaces
- Surfaces use tonal layering: Base (`#070B14`) -> Surface Container (`#0E1526`) -> High Surface (`#151E30`).
- Subtle 1px structural borders: `border border-white/10`.
- Ambient hover illumination: `hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15`.

### C. M3 Motion & State Layers
- **Tactile Feedback**: Every clickable button and chip must have `active:scale-95 transition-all duration-200`.
- **Card Hover Response**: `hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]`.
- **Fluid Horizontal Snap Tracks**: For carousels and lists, use `snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar`.

### D. M3 Filter Chips & Segmented Buttons
- Rounded full pills (`rounded-full px-4 py-2 text-xs font-bold`).
- Active state: `bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black font-black shadow-lg shadow-[#FF6D00]/25`.
- Inactive state: `bg-[#0E1526] text-zinc-300 border border-white/10 hover:border-[#FF6D00]/40 hover:text-white`.

## 4. Standard Reusable Code Patterns

### Headline with Google Analytics Orange Gradient
```tsx
<h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl font-sans">
  Build High-Converting Videos with{' '}
  <span className="bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] bg-clip-text text-transparent">
    Google Analytics Simplicity
  </span>
</h1>
```

### Eyebrow Kicker Pill
```tsx
<div className="inline-flex items-center gap-2 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF9100] backdrop-blur-md">
  <Sparkles size={14} className="text-[#FF8F00]" />
  <span>Studio Category</span>
</div>
```

### Primary Action CTA Button
```tsx
<button className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-3.5 text-sm font-black text-black shadow-xl shadow-[#FF6D00]/25 transition-all hover:brightness-110 active:scale-95">
  <span>Start Creating Free</span>
  <ArrowRight size={17} />
</button>
```

