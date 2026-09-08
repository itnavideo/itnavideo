# Itnavideo Fast Execution Work Tree (Speed Framework)

> **Core Focus**: Daily Itnavideo work revolves around **Existing Video Types** and **Dashboard UI/UX Design**. Yeh guide har modification ko structured, fast aur bug-free tareeqe se execute karne ke liye hai.

---

## 🎨 1. Existing Video Types Iteration Tree (Motion, Captions & Polish)

Jab kisi existing video type (jaise *Auto Caption*, *Compare*, *Long Video Promo*, *Typography*, *Whiteboard*, *Multi Images*) mein changes karne hon:

```mermaid
graph TD
    TASK["🎯 Existing Video Type Enhancement"] --> T1["Branch 1: Locate & Inspect<br/>• Find template folder: remotion/templates/NAME/<br/>• Read docs/video-types/NAME.md<br/>• Check input props schema"]
    TASK --> T2["Branch 2: Template Code Modification<br/>• Springs & timing (interpolate, spring)<br/>• Caption word highlights & styling<br/>• Asset paths (ONLY public/assets/reusable)"]
    TASK --> T3["Branch 3: Prop & Planner Continuity<br/>• Check services/ai/reelPlanner.ts defaults<br/>• Verify app/api/reels/jobs/route.ts props builder<br/>• Ensure no breaking prop changes"]
    TASK --> T4["Branch 4: Instant Fast Verification<br/>• Typecheck: npx tsc --noEmit (0 errors)<br/>• Two-deploy rule if deploying: vercel + lambda"]

    T1 --> T2
    T2 --> T3
    T3 --> T4
```

### ⚡ Video Type Speed Checklist:
- **Rule 1 (Asset Storage)**: Template folders are strictly code-only. Reusable assets belong in `public/assets/reusable/*`. Run `npm run assets:index` if new assets are added.
- **Rule 2 (No Breaking Props)**: Agar template mein koi naya prop add ho raha ho, toh uska default value hamesha define karein taake purane render jobs fail na hon.
- **Rule 3 (Fresh Captions)**: Template hamesha current upload ke transcript par kaam karega, purane titles ya cached data ko carry over nahi karega.

---

## 💻 2. Dashboard UI/UX Design Iteration Tree

Jab website ya dashboard ke user interface, controls, cards ya modals par kaam ho:

```mermaid
graph TD
    UI_TASK["🎯 Dashboard UI/UX Enhancement"] --> U1["Branch 1: Component Isolation<br/>• Identify component in components/ui/ or app/dashboard/page.tsx<br/>• Agar naya widget ho, create isolated file in components/<br/>(Prevent bloating dashboard page)"]
    UI_TASK --> U2["Branch 2: Visual Styling & Design System<br/>• Modern dark aesthetic (zinc-900/950, borders white/10)<br/>• Brand accents (mint #10B981, orange #F97316, purple #8B5CF6)<br/>• Micro-interactions & animations (hover, active, transition)"]
    UI_TASK --> U3["Branch 3: Reactive State & Instant Feedback<br/>• Auto-run preview/analysis on file drop<br/>• Clear loading states (animated pills/spinners)<br/>• Meaningful error & success banners"]
    UI_TASK --> U4["Branch 4: Safe Targeted Integration<br/>• Single contiguous edits in dashboard<br/>• Verify zero syntax/TS errors (npx tsc --noEmit)<br/>• Test responsive layout (mobile + desktop)"]

    U1 --> U2
    U2 --> U3
    U3 --> U4
```

### ⚡ UI/UX Speed Checklist:
- **Keep Dashboard Clean**: Badi complex UI ko direct `app/dashboard/page.tsx` ke andar 500 lines likhne ke bajaye `components/` mein alag component file banakar import karein. Isse dashboard maintainable aur fast rehta hai.
- **Micro-State Clarity**: Har button aur control ka visual feedback ho (disabled opacity, loading text, active color).
- **Targeted Code Changes**: Dashboard file ~5,000 lines ki hai. Hamesha targeted contiguous line blocks ko edit karein taake doosre video types ke controls disturb na hon.

---

## 🚀 3. Speed Principles (Kaam ko Double Fast Karne ke Niyam)

1. **Direct Component Targeting**: Kaam shuru karne se pehle exact file aur line number target karein — puri file ko scan karne mein time waste na ho.
2. **Component Modularity**: Dashboard mein nayi features ke liye `components/` use karein taake page compile fast ho aur merge conflicts na hon.
3. **Instant Compilation Check**: Har visual ya logic change ke baad `npx tsc --noEmit` run karein taake koi silent syntax ya type error na reh jaye.
4. **Isolated Scratch Testing**: Complex calculations ya formatting ke liye chhota 10-line scratch script test karein.

---

## 📦 4. New Video Type (Reference Pipeline)
Agar future mein kabhi koi naya video type banana ho, toh 7-node pipeline:
`remotion/templates` ➔ `remotion/index.tsx` ➔ `reelPlanner.ts` ➔ `app/dashboard/page.tsx` ➔ `app/api/reels/jobs` ➔ `npx tsc` ➔ `deploy pair`.
