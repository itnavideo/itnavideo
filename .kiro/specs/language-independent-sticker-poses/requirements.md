# Requirements Document

## Introduction

The sticker/presenter pose system in the Compare Explainer template (and future templates) currently relies on English and Hinglish keyword matching to determine which sticker pose to display. This approach fails for non-English, non-Hinglish scripts (Kannada, Marathi, Tamil, Telugu, Hindi in Devanagari, Urdu, Arabic, Persian, Bengali, Gujarati, etc.). This feature makes sticker pose selection completely independent of the user's script language by introducing scene intent metadata from the planner, a structural fallback based on video position, and an optional low-priority language-aware phrase matching layer.

**Core Principle:** Sticker pose selection must NOT depend on the language of the user's script. Users may upload scripts/audio in English, Hinglish, Hindi, Kannada, Marathi, Urdu, Persian/Farsi, Arabic, Tamil, Telugu, Bengali, Gujarati, or any other language. Sticker file names and internal pose IDs remain English, but the script language must never affect pose switching behavior.

## Glossary

- **Pose_Resolver**: The standalone utility module that determines which sticker pose to display at any given time during video playback. Must be template-agnostic and reusable.
- **Scene_Intent**: A metadata field assigned to each overlay/caption by the planner, describing the communicative purpose of that scene (e.g., intro, explain_left, question, warning, conclusion). Assigned from structure and overlay type, NOT from caption text language.
- **Sticker_Pose**: One of six internal English pose IDs for the presenter character: `welcome`, `left`, `right`, `thinking`, `warning`, `success`. These map directly to sticker image files (e.g., `teacher-welcome.png`, `teacher-left.png`).
- **Intent_Map**: The mapping from Scene_Intent values to Sticker_Pose values.
- **Planner**: The local reel planning system (`services/ai/reelPlanner.ts`) that generates overlay timelines and render props from transcripts.
- **Overlay_Timeline**: The array of timed overlay objects passed as render props to the template.
- **Structural_Fallback**: A pose selection strategy based on video progress zones and template structure, completely independent of caption text content or language.
- **Compare_Explainer**: The comparison video template (`remotion/templates/COMPARE_EXPLAINER/template.tsx`) that displays a sticker presenter alongside comparison content.

## Requirements

### Requirement 1: Language Independence

**User Story:** As a video creator who uploads scripts in any language (Hindi, Kannada, Marathi, Urdu, Persian, Arabic, Tamil, Telugu, Bengali, Gujarati, English, Hinglish, or any other), I want my sticker presenter to change poses naturally regardless of the language I use.

#### Acceptance Criteria

1. THE Pose_Resolver SHALL determine sticker poses without depending on the language of caption text or overlay text content
2. WHEN a user uploads a script in Kannada, Marathi, Urdu, Persian, Arabic, Tamil, or any non-Latin script, THE sticker poses SHALL still change naturally throughout the video following the intro→explanation→comparison→conclusion arc
3. THE system SHALL keep all internal pose IDs in English: `welcome`, `left`, `right`, `thinking`, `warning`, `success`
4. THE system SHALL map internal pose IDs to sticker files using the pattern: `teacher-{poseId}.png` (e.g., `teacher-welcome.png`, `teacher-left.png`, `teacher-right.png`, `teacher-thinking.png`, `teacher-warning.png`, `teacher-success.png`)
5. THE script language SHALL NOT affect which sticker pose is displayed at any point in the video

### Requirement 2: Scene Intent Metadata in Overlay Timeline

**User Story:** As a video creator using any language, I want the planner to assign a scene intent to each overlay so that my sticker presenter reacts to content meaning regardless of script language.

#### Acceptance Criteria

1. WHEN the Planner builds an overlay timeline for the Compare Explainer template, THE Planner SHALL assign a `stickerPose` field to each overlay object with one of the values: `welcome`, `left`, `right`, `thinking`, `warning`, `success`
2. WHEN the Planner builds an overlay timeline for the Compare Explainer template, THE Planner SHALL assign a `sceneIntent` field to each overlay object with one of the supported values
3. THE supported `sceneIntent` values SHALL be: `intro`, `explain`, `explain_left`, `explain_right`, `comparison`, `question`, `confusion`, `warning`, `mistake`, `important_point`, `benefit`, `success`, `conclusion`, `cta`, `neutral`
4. THE Intent_Map SHALL map scene intents to sticker poses as follows:
   - `intro` → `welcome`
   - `explain` → `left` or `right` depending on layout position
   - `explain_left` → `left`
   - `explain_right` → `right`
   - `comparison` → alternate `left` / `right` based on active side
   - `question` → `thinking`
   - `confusion` → `thinking`
   - `warning` → `warning`
   - `mistake` → `warning`
   - `important_point` → `thinking` or `left`/`right` depending on layout
   - `benefit` → `success`
   - `success` → `success`
   - `conclusion` → `success`
   - `cta` → `success`
   - `neutral` → structural fallback
5. WHEN overlay objects already contain valid `stickerPose` values, THE Pose_Resolver SHALL use the `stickerPose` value directly without further inference

### Requirement 3: Planner Intent Assignment Strategy

**User Story:** As a video creator, I want the planner to determine scene intent from overlay position, type, and template structure rather than from caption text content, so that intent assignment works for all languages without translation.

#### Acceptance Criteria

1. THE Planner SHALL assign `sceneIntent` based on overlay index position and overlay type (`hook`, `point`, `stat`, `warning`, `quote`, `cta`) rather than by analyzing caption text content
2. WHEN the overlay type is `hook` or the overlay is the first in the timeline, THE Planner SHALL assign `sceneIntent` value `intro`
3. WHEN the overlay type is `cta` or the overlay is the last in the timeline, THE Planner SHALL assign `sceneIntent` value `conclusion`
4. WHEN the overlay type is `warning`, THE Planner SHALL assign `sceneIntent` value `warning`
5. FOR overlays in the first half of the timeline (excluding first and last), THE Planner SHALL assign `sceneIntent` value `explain_left`
6. FOR overlays in the second half of the timeline (excluding first and last), THE Planner SHALL assign `sceneIntent` value `explain_right`
7. FOR the middle overlay(s) in the timeline, THE Planner SHALL assign `sceneIntent` value `comparison` or `question`
8. THE Planner SHALL assign intents without calling any external translation or language detection API
9. THE Planner intent assignment SHALL produce correct intents even when the script is entirely in a non-Latin script (e.g., Devanagari, Arabic, Kannada script)

### Requirement 4: Structural Fallback Pose Selection

**User Story:** As a video creator, I want my sticker presenter to follow a natural presentation arc based on video structure even when no scene intent metadata is available, so that pose switching works correctly for all existing renders and any script language.

#### Acceptance Criteria

1. WHEN an overlay has no `stickerPose` field and no `sceneIntent` field, THE Pose_Resolver SHALL determine the pose using the Structural_Fallback strategy based on video progress position
2. THE Structural_Fallback SHALL assign poses using the Compare Explainer template structure, favoring left/right direction poses (~70% of duration):
   - First 5% of video → `welcome` (intro only)
   - 5%-30% → `left` (primary direction, with brief `thinking` at ~25%)
   - 30%-55% → alternating `left`/`right` (comparison zone, direction-dominant)
   - 55%-80% → `right` (primary direction, with brief `warning` only if scene warrants it)
   - 80%-92% → `left` or `right` alternating (wrapping up explanation)
   - Final 8% → `success` (conclusion/outro)
3. WHEN the video is within the first 1.5 seconds, THE Pose_Resolver SHALL select the `welcome` pose regardless of other signals
4. WHEN the video is within the final 2.8 seconds, THE Pose_Resolver SHALL select the `success` pose regardless of other signals
5. THE Structural_Fallback SHALL NOT depend on caption text content, ensuring it works identically for all languages

### Requirement 5: Pose Resolution Priority Order

**User Story:** As a developer, I want a clear priority order for pose resolution so that the system behaves predictably when multiple signals are available.

#### Acceptance Criteria

1. THE Pose_Resolver SHALL resolve poses using the following strict priority order (first match wins):
   - Priority 1: Explicit `stickerPose` field on the overlay/caption
   - Priority 2: `sceneIntent` field mapped through the Intent_Map
   - Priority 3: Template structure fallback based on video progress
   - Priority 4: Progress-based fallback (pose arc without template context)
   - Priority 5: Optional keyword matching (only if safe and only for Latin-script text)
2. WHEN a higher-priority signal produces a valid pose, THE Pose_Resolver SHALL ignore all lower-priority signals
3. THE Pose_Resolver SHALL produce exactly one valid Sticker_Pose value for every frame of the video
4. Keyword matching (Priority 5) SHALL be optional and SHALL NOT use broad single-word keywords like: `kya`, `compare`, `difference`, `better`, `vs`, `but`. These cause false positives and can lock one pose for the entire video.
5. Keyword matching SHALL only be attempted when the text is confirmed to be Latin-script (English/Hinglish/Roman)

### Requirement 6: Backward Compatibility

**User Story:** As a video creator with existing renders, I want my previously created videos to continue displaying correct sticker poses without re-rendering.

#### Acceptance Criteria

1. WHEN render props do not contain `stickerPose` or `sceneIntent` fields on overlays, THE Pose_Resolver SHALL fall through to the Structural_Fallback without error
2. THE Pose_Resolver SHALL accept overlay objects with or without the new metadata fields and produce valid poses in both cases
3. WHEN keyword-based matching is retained as a tertiary signal, THE Pose_Resolver SHALL only apply keyword matching after structural fallback produces a generic alternating pose, and only for overlays that contain confirmed Latin-script text
4. Existing renders with the old keyword-only approach SHALL still produce reasonable pose switching through the structural fallback

### Requirement 7: No Paid Translation APIs

**User Story:** As the platform owner, I want the sticker pose system to operate without paid translation services so that costs remain predictable and language support scales without API fees.

#### Acceptance Criteria

1. THE Pose_Resolver SHALL determine sticker poses without calling OpenAI, Google Cloud Translation, AWS Translate, Azure Translator, or any paid language processing API
2. THE Planner SHALL assign scene intents without calling any paid translation or language detection API
3. IF keyword matching is used as an optional low-priority fallback, THEN THE Pose_Resolver SHALL limit matching to locally stored phrase lists and avoid broad single-word matches that cause false positives
4. IF translation support is added in the future, THEN IT SHALL only translate short scene summaries (not full scripts) for intent detection, and SHALL be gated behind explicit approval

### Requirement 8: Extensibility for Future Templates

**User Story:** As a developer building new templates, I want the pose resolution system to be reusable so that future templates get language-independent sticker behavior without duplicating logic.

#### Acceptance Criteria

1. THE Pose_Resolver SHALL be implemented as a standalone utility function that accepts overlay metadata, video timing, template config, and left/right title context, and returns a Sticker_Pose value
2. THE Pose_Resolver SHALL accept a template-specific structural fallback configuration so that different templates can define their own progress-to-pose mappings
3. WHEN a new template provides a custom structural fallback configuration, THE Pose_Resolver SHALL use that configuration instead of the Compare Explainer default mapping
4. THE system SHALL support these template-to-sticker-set associations for future use:
   - Education templates → teacher sticker sets (2d, cartoon, explainer, etc.)
   - Finance templates → banker sticker sets
   - Health templates → doctor sticker sets
   - Business templates → corporate sticker sets
   - Story/advice templates → grandpa sticker sets
   - Legal templates → lawyer sticker sets
   - News templates → news-anchor sticker sets
   - Religious/spiritual templates → religious character sticker sets

### Requirement 9: Pose Usage Distribution (70/30 Rule)

**User Story:** As a video creator, I want my sticker presenter to mainly point toward on-screen content (left/right) and only occasionally use special reaction poses, so that the sticker feels like a natural presenter guiding the viewer's attention rather than randomly switching between reactions.

#### Acceptance Criteria

1. THE Pose_Resolver SHALL produce a pose distribution where approximately 70% of the video duration uses direction/explanation poses (`left`, `right`) and approximately 30% uses special intent poses (`welcome`, `thinking`, `warning`, `success`)
2. THE direction poses (`left`, `right`) SHALL be the primary/default presenter behavior, used when:
   - Explaining a point or concept
   - Pointing to text, cards, or comparison boxes on screen
   - Showing a comparison side (left item or right item)
   - Highlighting something on screen
   - Guiding viewer's attention to content
3. THE special intent poses SHALL only appear when the scene actually requires them:
   - `welcome` → intro, first scene, topic start only
   - `thinking` → explicit question, confusion, or doubt moment
   - `warning` → explicit mistake, caution, or wrong usage moment
   - `success` → conclusion, correct answer, benefit, CTA, final rule, outro only
4. THE Pose_Resolver SHALL NOT overuse `thinking`, `warning`, or `success` poses. These SHALL appear only at specific script moments, not as generic fallback behavior.
5. THE Structural_Fallback SHALL favor `left`/`right` alternation for the middle 60-70% of video duration, with special poses only at the boundaries (intro/outro) and at explicitly marked intent points
6. WHEN no specific intent is detected for a scene, THE Pose_Resolver SHALL default to `left` or `right` (alternating) rather than `thinking` or any other special pose
7. THE sticker SHALL NOT change poses too frequently. Pose changes SHALL occur when:
   - Scene changes
   - Topic direction changes (left→right or right→left)
   - Comparison side changes
   - A question/warning/conclusion moment appears
   - A scene runs longer than 5-8 seconds without change

### Requirement 10: Visual QA Verification

**User Story:** As a developer and platform owner, I want this feature to be visually verified, not only code-tested, so that I can confirm the sticker actually changes in rendered output.

#### Acceptance Criteria

1. THE implementation SHALL include a local QA render or contact-sheet test using a Compare Explainer sample with the following script structure: intro → left explanation → right explanation → question/difference → warning/mistake → conclusion
2. THE visual QA SHALL confirm that the following pose changes appear in the rendered output:
   - Intro section → `welcome` pose
   - Left item explanation → `left` pose (sticker points toward left)
   - Right item explanation → `right` pose (sticker points toward right)
   - Question/difference section → `thinking` pose
   - Warning/mistake section → `warning` pose
   - Conclusion/outro → `success` pose
3. THE visual QA SHALL include a diagnostic script that logs pose-per-timestamp to confirm at least 5 distinct pose changes across a 30-second video
4. THE visual QA SHALL be repeated with a non-English sample (e.g., generic placeholder captions without meaningful English words) to confirm structural fallback works independently of caption language
5. THE visual QA SHALL verify the 70/30 distribution rule: direction poses (`left`/`right`) should occupy approximately 70% of total video frames, and special poses (`welcome`/`thinking`/`warning`/`success`) should occupy approximately 30%

## Out of Scope

- Full paid translation API integration for intent detection
- AI-based scene understanding (Gemini/OpenAI) for pose selection
- Animated sticker transitions (sprite sheets, Lottie, video-based stickers)
- Adding new poses beyond the current 6 (welcome, left, right, thinking, warning, success)
- Custom pose file naming per template (all templates use the same `teacher-{pose}.png` pattern)
