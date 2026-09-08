# Creator Reaction

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Creator Reaction |
| Internal ID | `CREATOR_REACTION` |
| Composition ID | `CREATOR-REACTION` |
| Dashboard Mode | `creatorReaction` |
| Category | Creator |

## Purpose

React to any video/topic with a face-cam or voice overlay + a message/opinion card. Like a YouTube reaction format in reel form.

## Required User Inputs

| Input | Type | Required |
|-------|------|----------|
| Audio/Video (your reaction) | Audio/Video | Yes |
| Reference video (optional) | Video | No |
| Creator image (for audio mode) | Image | No |
| Message text | Text | Yes |

## Output: 1080×1920 (9:16), up to 60s

## Key Rules
- User's reaction audio/video is the primary media
- Message card displays the creator's text/opinion
- If audio-only mode: show creator image + message
- If video mode: show reaction video + reference clip
- No background music by default
