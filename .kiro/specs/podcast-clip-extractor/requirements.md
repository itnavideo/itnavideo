# Requirements Document

## Introduction

The Podcast Clip Extractor is a new multi-step template for Itnavideo that allows users to upload long-form content (podcasts, interviews, webinars, speeches, YouTube videos) and extract multiple short-form vertical clips. Unlike existing single-render templates that process up to 60 seconds of media, this template analyzes the full source, suggests multiple clip candidates using AI, and lets the user select which clips to generate — each consuming one credit. The workflow is: Upload → Analyze → Select → Confirm → Generate.

## Glossary

- **Clip_Extractor**: The template system that handles the full workflow from upload through analysis to multi-clip rendering
- **Transcript_Analyzer**: The AI component that processes full-length transcripts to identify clip-worthy segments
- **Clip_Suggestion**: A recommended segment with start time, end time, title, reason, and estimated duration
- **Clip_Renderer**: The Remotion Lambda component that renders a single selected clip into a vertical short video
- **Credit_System**: The existing Itnavideo billing system where 1 generated video = 1 credit deducted from user balance
- **Source_Media**: The uploaded long-form video or audio file provided by the user
- **Render_Window**: A segment of source media selected for rendering (30s, 45s, or 60s per clip)
- **Dashboard_UI**: The Next.js frontend interface where users interact with the multi-step clip extraction workflow
- **Groq_Whisper**: The primary transcription provider used for speech-to-text processing
- **Remotion_Lambda**: The serverless video rendering engine used for producing final clip outputs
- **Audio_Only_Mode**: A visual presentation mode for podcasts/audio that lack video, using avatar, waveform, and caption overlays
- **Talking_Head_Mode**: A visual presentation mode for video sources featuring speaker-centered cropping

## Requirements

### Requirement 1: Source Media Upload

**User Story:** As a content creator, I want to upload a long video or podcast audio file, so that the system can analyze it for clip-worthy moments.

#### Acceptance Criteria

1. THE Clip_Extractor SHALL accept video uploads in MP4, MOV, and WEBM formats
2. THE Clip_Extractor SHALL accept audio uploads in MP3, WAV, M4A, and AAC formats
3. WHEN a user uploads Source_Media, THE Dashboard_UI SHALL display upload progress and file metadata (name, duration, size)
4. THE Clip_Extractor SHALL accept Source_Media with duration between 2 minutes and 120 minutes
5. IF Source_Media duration is less than 2 minutes, THEN THE Dashboard_UI SHALL display an error message directing the user to use existing single-render templates instead
6. IF Source_Media duration exceeds 120 minutes, THEN THE Dashboard_UI SHALL display an error message stating the maximum supported duration
7. WHEN upload completes, THE Clip_Extractor SHALL store Source_Media in S3 temporary storage with a 48-hour expiry

### Requirement 2: Full Transcript Generation

**User Story:** As a content creator, I want my long video or audio fully transcribed, so that the system can identify interesting moments from the complete content.

#### Acceptance Criteria

1. WHEN Source_Media upload completes, THE Clip_Extractor SHALL transcribe the full Source_Media using Groq_Whisper
2. THE Groq_Whisper transcription SHALL produce word-level timestamps for the entire Source_Media duration
3. WHILE transcription is in progress, THE Dashboard_UI SHALL display a progress indicator with estimated time remaining
4. IF transcription fails, THEN THE Clip_Extractor SHALL display a descriptive error message to the user without proceeding to analysis
5. WHEN Source_Media contains Hindi or Hinglish speech, THE Groq_Whisper SHALL produce clean Roman script captions without Devanagari characters
6. WHEN Source_Media contains English speech, THE Groq_Whisper SHALL produce English captions

### Requirement 3: Clip Detection and Suggestion

**User Story:** As a content creator, I want the system to suggest the best clip-worthy moments from my long content, so that I can quickly find high-value segments without watching the entire video.

#### Acceptance Criteria

1. WHEN transcription completes, THE Transcript_Analyzer SHALL identify clip-worthy segments from the full transcript
2. THE Transcript_Analyzer SHALL detect segments containing: emotional moments, clear advice, controversial statements, useful tips, surprising facts, strong hooks, motivational lines, and complete thoughts
3. THE Transcript_Analyzer SHALL generate the number of Clip_Suggestions matching the user-selected count (3, 5, or 10)
4. EACH Clip_Suggestion SHALL include: start time, end time, suggested title or hook, reason why the segment is clip-worthy, and estimated duration
5. THE Transcript_Analyzer SHALL produce Clip_Suggestions with durations matching the user-selected preference (30 seconds, 45 seconds, or 60 seconds) with a tolerance of plus or minus 5 seconds
6. THE Transcript_Analyzer SHALL select segments that begin and end at natural sentence boundaries
7. THE Transcript_Analyzer SHALL avoid segments that start or end mid-sentence
8. WHEN analysis completes, THE Dashboard_UI SHALL display all Clip_Suggestions in a scrollable list sorted by timestamp

### Requirement 4: Clip Selection and Credit Confirmation

**User Story:** As a content creator, I want to choose which clips to generate and see the exact credit cost before committing, so that I maintain full control over my credit usage.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL allow the user to select one or more Clip_Suggestions for generation using individual checkboxes
2. THE Dashboard_UI SHALL allow the user to deselect previously selected Clip_Suggestions
3. WHILE the user has one or more clips selected, THE Dashboard_UI SHALL display a summary showing: number of selected clips, total credits required (1 credit per clip), and current credit balance
4. WHEN the user clicks the generate button, THE Dashboard_UI SHALL display a confirmation dialog stating the exact credit cost before proceeding
5. IF the user's credit balance is less than the number of selected clips, THEN THE Dashboard_UI SHALL disable the generate button and display an upgrade prompt with a link to the pricing page
6. THE Clip_Extractor SHALL NOT generate any clips without explicit user confirmation of the credit cost

### Requirement 5: Single Clip Rendering (Video Source)

**User Story:** As a content creator with video content, I want each selected clip rendered as a professional vertical short, so that I can publish directly to social platforms.

#### Acceptance Criteria

1. WHEN the user confirms generation, THE Clip_Renderer SHALL render each selected clip independently on Remotion_Lambda
2. EACH rendered clip SHALL use 9:16 vertical format (1080x1920 resolution)
3. THE Clip_Renderer SHALL apply talking-head center crop to fit the source video into vertical format
4. THE Clip_Renderer SHALL overlay clean word-synced captions derived from the Groq_Whisper transcript
5. THE Clip_Renderer SHALL display a progress bar element within the rendered video
6. THE Clip_Renderer SHALL display a hook or title text overlay at the start of each clip
7. THE Clip_Renderer SHALL highlight important words in the captions using a distinct color
8. WHERE a speaker name is provided, THE Clip_Renderer SHALL display a speaker name label in the rendered clip
9. THE Clip_Renderer SHALL apply smooth zoom or camera crop transitions where applicable
10. WHERE CTA text is provided, THE Clip_Renderer SHALL display the CTA text overlay at the end of the clip
11. WHEN a clip render completes, THE Credit_System SHALL deduct exactly 1 credit from the user balance

### Requirement 6: Single Clip Rendering (Audio-Only Source)

**User Story:** As a podcaster with audio-only content, I want each selected clip rendered with engaging visuals, so that I can publish them as video shorts on social platforms.

#### Acceptance Criteria

1. WHEN Source_Media is audio-only, THE Clip_Renderer SHALL render clips using Audio_Only_Mode visual layout
2. THE Audio_Only_Mode SHALL display a speaker avatar or placeholder image as the primary visual
3. THE Audio_Only_Mode SHALL display an animated waveform visualization synced to the audio
4. THE Audio_Only_Mode SHALL display word-synced caption text derived from the Groq_Whisper transcript
5. THE Audio_Only_Mode SHALL display a progress bar element within the rendered video
6. WHERE a podcast title is provided, THE Audio_Only_Mode SHALL display the podcast title as a persistent label
7. THE Audio_Only_Mode SHALL use 9:16 vertical format (1080x1920 resolution)
8. WHEN an audio clip render completes, THE Credit_System SHALL deduct exactly 1 credit from the user balance

### Requirement 7: Dashboard Input Configuration

**User Story:** As a content creator, I want to configure clip extraction preferences before analysis starts, so that suggestions match my desired output style.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL provide an input field for podcast or video title
2. THE Dashboard_UI SHALL provide an optional input field for speaker name
3. THE Dashboard_UI SHALL provide a selector for number of clip suggestions with options: 3, 5, or 10
4. THE Dashboard_UI SHALL provide a selector for clip duration preference with options: 30 seconds, 45 seconds, or 60 seconds
5. THE Dashboard_UI SHALL provide a style selector with options: Podcast subtitles, Talking-head clip, Quote highlight, Educational clip, Viral hook style
6. THE Dashboard_UI SHALL provide an optional input field for CTA text
7. THE Dashboard_UI SHALL default the clip suggestion count to 5 and clip duration to 45 seconds

### Requirement 8: Multi-Step Workflow UX

**User Story:** As a content creator, I want a clear step-by-step process for clip extraction, so that I understand what is happening at each stage and what actions I need to take.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL present the workflow as a sequential 5-step process: Upload, Analyze, Select, Confirm, Generate
2. THE Dashboard_UI SHALL display a step indicator showing the current step and completion status of previous steps
3. THE Dashboard_UI SHALL prevent the user from advancing to the next step until the current step is complete
4. WHILE analysis is in progress (Step 2), THE Dashboard_UI SHALL display a loading state with descriptive status messages
5. WHEN generation is in progress (Step 5), THE Dashboard_UI SHALL display per-clip render progress with individual status indicators
6. THE Dashboard_UI SHALL allow the user to navigate back to the selection step (Step 3) to modify clip choices before re-confirming
7. WHEN all selected clips complete rendering, THE Dashboard_UI SHALL display download links for each completed clip

### Requirement 9: Credit and Billing Integration

**User Story:** As a platform operator, I want clip generation to integrate with the existing credit billing system, so that revenue is correctly captured per clip generated.

#### Acceptance Criteria

1. THE Credit_System SHALL charge 1 credit per clip at the moment rendering begins for that clip
2. THE Clip_Extractor SHALL NOT charge credits for the transcription and analysis steps
3. IF a clip render fails, THEN THE Credit_System SHALL refund the 1 credit charged for that failed clip
4. THE Credit_System SHALL validate sufficient credit balance before starting each individual clip render in the batch
5. IF credit balance reaches zero mid-batch, THEN THE Clip_Extractor SHALL stop rendering remaining clips and notify the user of partial completion

### Requirement 10: Render Output Delivery

**User Story:** As a content creator, I want to access my rendered clips easily, so that I can download and publish them quickly.

#### Acceptance Criteria

1. WHEN a clip render completes, THE Clip_Extractor SHALL provide a download URL for the rendered MP4 file
2. THE Clip_Extractor SHALL store rendered clips in S3 temporary storage with a 48-hour expiry
3. THE Dashboard_UI SHALL display all completed clip downloads in a results panel with clip title and duration
4. THE Clip_Extractor SHALL record each rendered clip in the user's render history accessible from the existing history page
5. IF a clip render fails, THEN THE Dashboard_UI SHALL display an error status for that specific clip with a retry option

### Requirement 11: Clip Preview Before Generation

**User Story:** As a content creator, I want to preview suggested clips before spending credits, so that I can make informed decisions about which clips are worth generating.

#### Acceptance Criteria

1. WHEN the user selects a Clip_Suggestion, THE Dashboard_UI SHALL display a text preview showing the transcript excerpt for that segment
2. THE Dashboard_UI SHALL display the start time, end time, and duration for each Clip_Suggestion
3. THE Dashboard_UI SHALL display the AI-generated reason explaining why each segment is clip-worthy
4. WHERE Source_Media is video, THE Dashboard_UI SHALL allow the user to play the source video starting at the clip's start timestamp for preview
