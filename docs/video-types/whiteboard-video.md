# Whiteboard Video

## Purpose and flow
Whiteboard Video turns the current audio or video upload into a polished vertical explanation reel. The user picks a whiteboard design in the dashboard; the job flow transcribes the current upload with Groq, builds a deterministic board plan, and renders the selected design in Remotion.

## Board picker (Phase B)
- The dashboard exposes four curated boards: `corporate-luxury` (default), `classroom`, `dark-modern`, and `coworking` ("Studio").
- Selection is stored as `whiteboardBoard` state and sent in the job payload. The jobs route validates it against a `WHITEBOARD_BOARDS` allow-list (`resolveWhiteboardBoard`) and falls back to `corporate-luxury` for unknown values.
- The template's `boardStyle` prop drives `BOARD_CONFIGS[boardStyle]` (previously hardcoded to a single board). Each board defines its own writable safe-zone, max points, and max text rows.

## Live preview (Phase C)
- The dashboard renders a CapCut-style sticky `WhiteboardPreview` (`@remotion/player`) so the user sees the writing animation, board scene, and safe-zone fit before rendering. Real points come from the transcript at render time; the preview uses sample points.
- `public/assets` board images are not deployed to Vercel, so the browser preview passes a `boardImageUrl` override pointing at Vercel-served `/preview/board-*.jpg`. Lambda render uses `staticFile(board.image)` from the site bundle when no override is given.

## Deterministic planner (Phase A)
- The planner is local and uses no secondary AI provider; text, timing, and density are derived from the render window.
- `extractPoint()` strips leading filler/discourse words (English + Roman Hinglish, e.g. "So basically the main thing" → "main thing") before keeping the first content words within the character budget.
- `inferBulletType` and `inferIcon` recognize Hinglish cues (pehla/doosra/phir for steps, bacho/galti/khatra for warnings, chahiye/zaroori/dhyan for must-do, etc.).
- `buildConclusion()` derives a short takeaway recap from the highlighted point (or title) so the board ends on a summary. Previously the conclusion was always empty.
- Board density: up to four concise, spaced points (`MAX_BOARD_POINTS = 4`); the per-board config caps this further to fit each safe-zone. `corporate-luxury` allows 4 points / 15 text rows.

## Text and captions
- Groq Whisper transcribes the current upload for planning. English stays English; Hindi/Hinglish stays Roman script. No translation provider is used.
- Visible caption bars and external progress dots are not rendered. Board writing plus the uploaded narration are the full presentation.
- Whiteboard Video adds no background music or sound effects. Uploaded narration is the primary audio.

## Visual QA
Check each of the four boards with a long title, a long point, and more than four supplied points. Confirm only the planned points appear, all text stays within the board safe-zone, the conclusion recap shows, no external caption/progress UI appears, and both audio-only and video uploads preserve source narration. Confirm the dashboard live preview matches the selected board.
