# Archived / Reference Note

This document is archived/reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo.

# Itnavideo Startup Docs Index

Use this file as the internal table of contents for the startup documentation folder.

> [Added by Codex] The polished website version of this index is available at `/docs`. The Markdown files below remain the editable source documents.

## Core Startup Files

| File | Purpose | Main Audience |
|---|---|---|
| `01-startup-overview.md` | Problem, solution, target users, current status, and vision. | Founders, investors |
| `02-product-and-features.md` | Product features, live video types, inputs, outputs, and future video type ideas. | Product, design, growth |
| `03-technical-architecture.md` | Tech stack, render pipeline, deployment, costs, and Supabase tables. | Engineering |
| `04-video-type-rules.md` | Video type rules, Remotion requirements, naming, testing, and QA expectations. | Engineering, design |
| `05-subtitle-language-rules.md` | Caption/subtitle language policy and provider limitations. | Product, engineering |
| `06-assets-and-s3.md` | Asset storage rules, S3 lifecycle, CDN, and deployment constraints. | Engineering, operations |
| `07-known-issues-and-fixes.md` | Known production/dev issues and their fixes. | Engineering, support |
| `08-roadmap.md` | Immediate, short-term, and future roadmap items. | Founders, product |
| `09-yc-investor-notes.md` | YC notes, decision log, metrics, demo notes, and competitive landscape. | Founders, investors |

## Source Archive And Master Documentation

| File | Purpose | Notes |
|---|---|---|
| `GOOGLE_DOC_CONTENT.md` | Original Google Docs content imported into the repo. | Keep as source archive unless intentionally cleaned. |
| `ITNAVIDEO_INTERNAL_PRODUCT_DOCUMENTATION.md` | Professional master internal product documentation. | Includes trackers, risks, issue log, improvement log, video type profiles, architecture, APIs, deployment, and roadmap. |

## Recommended Reading Order

1. `ITNAVIDEO_INTERNAL_PRODUCT_DOCUMENTATION.md`
2. `01-startup-overview.md`
3. `02-product-and-features.md`
4. `03-technical-architecture.md`
5. `04-video-type-rules.md`
6. `07-known-issues-and-fixes.md`
7. `08-roadmap.md`
8. `09-yc-investor-notes.md`

## Maintenance Rules

- Keep `GOOGLE_DOC_CONTENT.md` as the original/reference archive.
- Keep `ITNAVIDEO_INTERNAL_PRODUCT_DOCUMENTATION.md` as the readable master document.
- Update the specific numbered file when a focused topic changes.
- Update `/docs` when the public/internal docs hub needs new sections or visual summaries.
- Mark new assumptions or placeholders clearly when facts are not confirmed.
