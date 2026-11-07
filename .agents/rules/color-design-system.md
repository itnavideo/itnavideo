---
name: color-design-system
description: Enforces the White and Black Primary Color System across all pages, features, video types, cards, and sections in Itnavideo.
always_on: true
---

# White & Black Primary Color System

## 1. Executive Master Directive
- **Strict Rule**: White and Black are the primary colors across the entire website, including the homepage, dashboards, and all video studios.
- **Canvas**: Crisp White (`#FFFFFF`, `bg-white`) as the primary background color, with soft light greys (`#F8FAFC`, `#F4F4F5`) for subtle section transitions.
- **Typography**: Deep Jet Black (`text-zinc-950`, `text-black`, `#09090B`) for all primary headings, titles, and high-emphasis typography.
- **Action Buttons**: Premium tactile Jet Black (`bg-zinc-950 text-white hover:bg-zinc-800 rounded-full shadow-md`) for primary CTA buttons.
- **Accents**: Subtle, purposeful accents (blue, emerald, amber) are allowed sparingly to distinguish features or status tags, but the primary aesthetic remains firmly **White and Black**.
- **Deprecated**: The previous Google Analytics orange theme is deprecated.

## 2. Standard Code Patterns

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
