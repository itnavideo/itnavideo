# ADR-001: Transcript-Grounded SVG Visuals for Faceless Video

- **Status:** Accepted; typed SVG planning, motion rendering, and growth/time-series template implemented
- **Scope:** Finance and educational Faceless Videos, 16:9, maximum 5 minutes

## Context

Faceless Video is moving from stock and uploaded scene images toward graphics that explain the narration. Every scene should contain an SVG visual and supporting text. The storyboard is a preview and confirmation step, not a visual editor. Finance education also needs strict control over values and claims so a chart cannot imply facts the narration did not provide.

## Decision

1. After transcript approval, an AI planner selects a typed visual layout and proposes transcript-grounded labels, values, and relationships for each scene.
2. Use reusable code-owned SVG templates first: allocation, comparison, metric, sequence, concept map, and growth/time-series chart.
3. If none fits, the renderer composes a custom scene from an allow-listed set of SVG primitives. Never accept raw SVG markup from the AI.
4. Every scene renders an SVG visual with supporting text. Stock, Pexels, and uploaded scene images remain paused for this mode.
5. Growth/time-series charts may use only explicit narration-supported points. If a visual needs missing values or labels, choose a non-numeric layout instead of inferring them.
6. The storyboard presents previews only. Creators do not edit the visual type, labels, or values there.
7. Validate AI output before rendering. If planning fails or data is invalid, use a safe deterministic SVG visual based on available narration and keep the render pipeline recoverable.
8. Animate with deterministic Remotion scene-local frames. The growth chart draws its line across the scene and reveals points in a staggered sequence paced against scene duration; all graphic motion remains tied to the scene-local clock.
9. Keep the 16:9 duration limit at 300 seconds and charge one credit per minute.

## Consequences

- SVG layouts remain deterministic and renderer-owned while AI selects among them based on meaning.
- Finance charts cannot invent figures. Narration without enough explicit data uses a non-numeric visual.
- Preview-only storyboards keep the creation flow simple but do not let creators correct graphic labels or values manually.
- A growth/time-series template is required in the reusable visual set.
- The 5-minute limit and this policy must be reflected in related specifications. Typed planner and renderer implementation is complete for the current reusable visual set. AI-proposed chart points and sequence labels are validated against the approved narration before rendering; unsupported values fall back to deterministic transcript-derived visuals.