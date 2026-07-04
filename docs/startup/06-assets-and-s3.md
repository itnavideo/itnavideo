# Archived / Reference Note

This document is archived/reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo.

# Assets & S3 System

## Asset Types

| Type | Location | Deployed To |
|------|----------|-------------|
| Reusable render images | `public/assets/reusable/images/` | S3 (indexed in assets.json) |
| Direct/one-time images | `public/assets/direct/images/` | S3 (indexed in assets.json) |
| Background music | `public/assets/reusable/background-music/` | S3 |
| Sound effects | `public/assets/reusable/sound-effects/` | S3 |
| Sticker characters | `public/assets/stickman/` | Lambda site bundle (staticFile) |
| Fonts | `public/assets/reusable/fonts/` | S3 |
| Icons | `public/assets/reusable/icons/` | S3 |
| Website UI visuals | `public/visuals/` | Vercel |
| Brand logos | `public/brand/` | Vercel |
| Sticker dashboard previews | `public/visuals/stickers/previews/` | Vercel |
| Template preview images | `public/preview/` | Vercel |

## Asset Index

- **File:** `public/assets/assets.json`
- **Rebuild command:** `npm run assets:index`
- Contains metadata for all render assets: ID, title, category, tags, S3 URLs, dimensions

## S3 Rules

| Rule | Details |
|------|---------|
| Temporary uploads | Expire after ~48 hours (lifecycle rule) |
| Rendered videos | Expire after ~48 hours |
| Upload prefix | `uploads/raw/` |
| Render prefix | `renders/final/` |
| CORS required | Run `npm run aws:s3:cors` after setup |
| Storage class | S3 Standard (no Glacier for short-lived files) |

## Local vs Production

| Context | Asset Access |
|---------|-------------|
| Local dev (`npm run reel:studio`) | Read from `public/assets/` via filesystem |
| Lambda render (production) | S3 URLs from `assets.json` OR `staticFile()` from site bundle |
| Stickers in Lambda | `staticFile('assets/stickman/...')` — bundled with Lambda site |
| Dashboard preview images | Vercel-served from `public/visuals/` or `public/preview/` |

## Key Rules

- Do NOT put images/fonts/sounds inside `remotion/templates/` — templates are code-only
- Do NOT deploy `public/assets/` to Vercel — `.vercelignore` excludes it
- Do NOT move render assets to `public/brand/` or `public/visuals/` to make them deploy
- After adding/removing assets, always run `npm run assets:index`
- Stickers use `staticFile()` in Lambda — they're part of the site bundle, not S3

## Sticker System (Compare Explainer)

- 16 sticker characters with 6 poses each
- Stored in `public/assets/stickman/{character-name}/`
- Pose files: `teacher-welcome.png`, `teacher-left.png`, `teacher-right.png`, `teacher-thinking.png`, `teacher-warning.png`, `teacher-success.png`
- Body types: `full_body`, `half_body` (different sizing in render)
- Dashboard previews in `public/visuals/stickers/previews/`

## Last Updated

June 2026
