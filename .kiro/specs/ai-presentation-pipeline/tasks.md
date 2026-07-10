# AI Presentation Pipeline — Implementation Tasks

## Phase 1: Core Pipeline Foundation

- [ ] Task 1: Create `services/ai/presentationPipeline/types.ts` with all type definitions (ScenePlan, TemplateCapabilities, PipelineInput, PipelineOutput, etc.)
- [ ] Task 2: Create `services/ai/presentationPipeline/scriptAnalyzer.ts` — local text analysis that detects intents (hook, explain, compare, question, warning, conclude) from transcript segments
- [ ] Task 3: Create `services/ai/presentationPipeline/sceneSegmenter.ts` — groups segments into scenes respecting min/max duration and template capabilities
- [ ] Task 4: Create `services/ai/presentationPipeline/visualAssigner.ts` — Gemini call that assigns visual types + fallback deterministic assigner
- [ ] Task 5: Create `services/ai/presentationPipeline/assetResolver.ts` — matches user-uploaded assets to scenes
- [ ] Task 6: Create `services/ai/presentationPipeline/planValidator.ts` — validates timing, gaps, capability constraints
- [ ] Task 7: Create `services/ai/presentationPipeline/index.ts` — main `planPresentation()` function that orchestrates all stages

## Phase 2: Template Registry & Adapter Pattern

- [ ] Task 8: Create `services/ai/presentationPipeline/templateRegistry.ts` — registry where templates declare capabilities
- [ ] Task 9: Define adapter interface and create example adapter for a new explainer template
- [ ] Task 10: Integrate pipeline into `app/api/reels/jobs/route.ts` with a `templateUsesSharedPipeline()` check

## Phase 3: First New Template Using Pipeline

- [ ] Task 11: Create a new explanation-focused video type template that consumes ScenePlan[] via its adapter
- [ ] Task 12: Register in remotion/index.tsx, REEL_TEMPLATE_REGISTRY, dashboard, and landing page
- [ ] Task 13: End-to-end test: upload audio → pipeline plans → template renders → MP4 output

## Phase 4: Refinement

- [ ] Task 14: Migrate Compare Explainer's sticker planning to use shared pipeline's intent analysis
- [ ] Task 15: Add pipeline metrics/logging for monitoring AI call success rate and latency
- [ ] Task 16: Document the "how to add a new video type" process in docs/
