# Requirements Document

## Introduction

Redesign the LONG_VIDEO_PROMO Remotion template to create a polished, structured 1080×1920 (9:16) promo reel layout. The new design arranges content into distinct vertical sections: thumbnail hero, video title, channel info row with subscribe button, animated arrow CTA, promo clip area with aspect-ratio-aware rendering, and synced captions overlay. The redesign introduces two new optional props (channelLogoSrc, mediaAspect) while maintaining backward compatibility with the existing render pipeline.

## Glossary

- **Template**: The Remotion React component at `remotion/templates/LONG_VIDEO_PROMO/template.tsx` that renders a 1080×1920 video frame at 30fps.
- **Composition**: The Remotion `<Composition>` wrapper that registers the template with ID `LONG-VIDEO-PROMO`.
- **Thumbnail_Hero**: The top section displaying a 16:9 YouTube thumbnail image with play button overlay, "FULL VIDEO" badge, and glow effect.
- **Channel_Info_Row**: A horizontal row showing the channel avatar (circle), channel name, subscriber count, and a red subscribe button.
- **Promo_Clip_Area**: The bottom section displaying a user-uploaded video clip, sized according to its aspect ratio (landscape or portrait).
- **Caption_Overlay**: A text overlay at the bottom of the frame showing time-synced subtitle text from the captions array.
- **Accent_Color**: A user-configurable theme color applied to glows, badges, and accent UI elements.
- **Media_Aspect**: A prop indicating whether the promo clip is landscape (16:9) or portrait (9:16), controlling how the clip is displayed.
- **Chips**: Short badge labels displayed above the thumbnail (e.g., "NEW VIDEO", "FULL GUIDE").
- **Spinning_Ring**: A CSS-animated ring that rotates continuously around the channel logo circle.
- **Pulse_Animation**: A subtle scale oscillation applied to the channel logo circle.

## Requirements

### Requirement 1: Thumbnail Hero Section

**User Story:** As a content creator, I want my YouTube thumbnail displayed prominently with a play button and badge, so that viewers immediately recognize this as a video promo.

#### Acceptance Criteria

1. THE Template SHALL render a 16:9 aspect ratio container in the top section of the 1080×1920 frame.
2. WHEN a thumbnailSrc prop is provided, THE Thumbnail_Hero SHALL display the image filling the container with objectFit cover.
3. WHEN no thumbnailSrc prop is provided, THE Thumbnail_Hero SHALL display a dark gradient placeholder with "YOUR THUMBNAIL" text.
4. THE Thumbnail_Hero SHALL display a centered circular play button overlay with a triangle icon.
5. THE Thumbnail_Hero SHALL display a "FULL VIDEO" badge positioned in the bottom-right corner of the container.
6. THE Thumbnail_Hero SHALL apply a glow or shadow effect around the thumbnail card using the Accent_Color.
7. THE Thumbnail_Hero SHALL have rounded corners and a subtle border on the container.

### Requirement 2: Chip Badges Above Thumbnail

**User Story:** As a content creator, I want customizable badge chips above the thumbnail, so that I can highlight the video type or hook viewers.

#### Acceptance Criteria

1. THE Template SHALL render chip badges above the Thumbnail_Hero section.
2. WHEN a chips prop array is provided, THE Template SHALL display up to 2 chip badges with the text from the array.
3. THE Template SHALL style chip badges with the Accent_Color background, white bold text, and rounded shape.
4. THE Template SHALL animate chip badges with a spring entry animation.

### Requirement 3: Video Title Section

**User Story:** As a content creator, I want the video title displayed prominently below the thumbnail, so that viewers know what the video is about.

#### Acceptance Criteria

1. THE Template SHALL render the title prop as large bold white text below the Thumbnail_Hero.
2. THE Template SHALL center the title text horizontally.
3. THE Template SHALL limit the title display to a maximum of 2 lines with overflow hidden.
4. WHEN the title text exceeds 35 characters, THE Template SHALL reduce the font size to fit within the allocated space.
5. THE Template SHALL animate the title entry with a spring animation and slight vertical translate.

### Requirement 4: Channel Info Row

**User Story:** As a content creator, I want my channel branding displayed with avatar, name, subscribers, and a subscribe button, so that my channel identity is promoted.

#### Acceptance Criteria

1. THE Channel_Info_Row SHALL display below the title section as a horizontal row.
2. WHEN a channelLogoSrc prop is provided, THE Channel_Info_Row SHALL render the image inside a circular container on the left side.
3. WHEN no channelLogoSrc prop is provided, THE Channel_Info_Row SHALL render a circle with the first letter of channelName as fallback.
4. THE Channel_Info_Row SHALL display the channelName text to the right of the avatar circle.
5. WHEN a subscriberCount prop is provided, THE Channel_Info_Row SHALL display the subscriber count below the channel name (e.g., "125K subscribers").
6. THE Channel_Info_Row SHALL display a red "Subscribe" button on the right side of the row.
7. THE Channel_Info_Row SHALL render an animated Spinning_Ring around the channel logo circle that rotates continuously.
8. THE Channel_Info_Row SHALL apply a Pulse_Animation to the channel logo circle that oscillates scale subtly over time.

### Requirement 5: Arrow CTA Section

**User Story:** As a content creator, I want an animated arrow and "WATCH FULL VIDEO" text between the channel info and promo clip, so that viewers are directed toward the thumbnail.

#### Acceptance Criteria

1. THE Template SHALL render an upward-pointing arrow symbol below the Channel_Info_Row.
2. THE Template SHALL render "WATCH FULL VIDEO" text below the arrow.
3. THE Template SHALL animate the arrow with a continuous vertical bounce using sine interpolation.
4. THE Template SHALL style the arrow and text using the Accent_Color.
5. THE Template SHALL apply a spring-based entry animation to the CTA section.

### Requirement 6: Promo Clip Area

**User Story:** As a content creator, I want my promo clip displayed appropriately based on its aspect ratio, so that landscape and portrait clips both look good in the reel.

#### Acceptance Criteria

1. WHEN a mediaSrc prop is provided, THE Promo_Clip_Area SHALL render the video in the bottom section of the frame.
2. WHEN mediaAspect indicates landscape (values "landscape" or "16:9"), THE Promo_Clip_Area SHALL render the clip in a 16:9 container with remaining vertical space left dark.
3. WHEN mediaAspect indicates portrait (values "portrait", "reel", or "9:16"), THE Promo_Clip_Area SHALL render the clip to fill available vertical space with objectFit cover and objectPosition "center top".
4. WHEN no mediaAspect prop is provided, THE Promo_Clip_Area SHALL default to landscape (16:9) container rendering.
5. THE Promo_Clip_Area SHALL apply rounded corners and a subtle border to the clip container.
6. THE Template SHALL start video playback from the frame corresponding to mediaTrimStartSeconds multiplied by fps.
7. THE Template SHALL apply the sourceAudioVolume prop to the video element volume.

### Requirement 7: Caption Overlay

**User Story:** As a content creator, I want synced captions displayed at the bottom of the reel, so that viewers can read the promo message even with sound off.

#### Acceptance Criteria

1. WHEN the captions array contains items, THE Caption_Overlay SHALL display the text of the caption whose start/end range includes the current playback time.
2. WHEN no caption matches the current time, THE Caption_Overlay SHALL display nothing.
3. THE Caption_Overlay SHALL position text at the bottom of the frame above the promo clip area.
4. THE Caption_Overlay SHALL style captions with a semi-transparent dark background, white bold text, and rounded container.
5. THE Caption_Overlay SHALL remain visible on top of all other layers (highest z-index).

### Requirement 8: Backward Compatibility

**User Story:** As a developer, I want the redesigned template to accept the same props from the existing render pipeline, so that no backend changes are required.

#### Acceptance Criteria

1. THE Template SHALL accept all existing props: thumbnailSrc, title, channelName, subscriberCount, mediaSrc, captions, chips, accentColor, mediaTrimStartSeconds, sourceAudioVolume, durationSeconds, sourceDurationSeconds.
2. THE Template SHALL treat channelLogoSrc as an optional prop that defaults to an empty string.
3. THE Template SHALL treat mediaAspect as an optional prop that defaults to "landscape" behavior.
4. THE Composition SHALL maintain the ID "LONG-VIDEO-PROMO" and output 1080×1920 at 30fps.
5. THE Composition SHALL calculate duration from durationSeconds or sourceDurationSeconds props, clamped between 8 and 60 seconds.

### Requirement 9: Visual Polish and Background

**User Story:** As a content creator, I want the overall template to look premium with a dark background, subtle gradients, and particle effects, so that the reel stands out on social media.

#### Acceptance Criteria

1. THE Template SHALL use a dark background (#0a0a0a or similar) as the base layer.
2. THE Template SHALL render subtle radial gradients using the Accent_Color at low opacity.
3. THE Template SHALL render animated floating particles that drift vertically over time.
4. THE Template SHALL apply a vignette overlay at the top and bottom edges of the frame.
5. THE Template SHALL ensure all sections are vertically stacked without overlapping at 1080×1920 resolution.
