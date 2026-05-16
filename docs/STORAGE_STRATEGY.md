# Itnavideo Storage Strategy

Last updated: 2026-05-14

This file defines where assets and user media should live.

---

## Current Decision

Use this split:

- **Google Drive**: internal Itnavideo reusable asset library.
- **Cloudinary**: user uploads, generated previews, and rendered videos.
- **AWS S3**: future paid scale storage when the startup grows.

---

## Google Drive Internal Asset Library

Drive link:

```text
https://drive.google.com/drive/folders/1iulyUwCACiwHw-q1y0dgp8fcnnL_i8A7?usp=sharing
```

Scope:

- This link is only for Itnavideo assets.
- Use it for reusable platform assets, not user private uploads.
- Share this Drive folder with the asset-reader service account as `Viewer`:
- Drive API read access was verified on 2026-05-14.

```text
itnavideo-drive-assets@vocal-marking-496314-p4.iam.gserviceaccount.com
```

API environment variables:

```env
GOOGLE_DRIVE_ASSET_LIBRARY_FOLDER_ID=1iulyUwCACiwHw-q1y0dgp8fcnnL_i8A7
GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL=itnavideo-drive-assets@vocal-marking-496314-p4.iam.gserviceaccount.com
GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_DRIVE_FONTS_FOLDER_NAME=fonts
```

Keep the private key in `.env.local` or deployment secrets only. Do not commit it.

Recommended folder structure:

```text
Itnavideo Assets/
  sound_effects/
    transition/
    impact/
    riser/
    ambient/
    ui_foley/
    texture/

  screenshots/
    app/
    social_proof/
    tutorials/
    product/
    generic/

  background_videos/
    solid_colors/
    gradients/
    cinematic/
    minimal/
    energetic/

  images/
    people/
    business/
    education/
    tech/
    motivation/
    product/

  video_clips/
    broll/
    talking_head_backgrounds/
    screen_recordings/
    product_clips/

  music/
    calm/
    cinematic/
    energetic/
    luxury/

  metadata/
    asset_index.xlsx
    naming_rules.md

  fonts/
    Montserrat/
    Inter/
    Roboto/
    Open_Sans/
    Lato/
    ...

  material_symbols/
    Material_Symbols_Outlined/
    Material_Symbols_Rounded/
    Material_Symbols_Sharp/
```

Folder and file naming rules:

- Use lowercase.
- Use underscores.
- Avoid spaces.
- Use searchable words.

Examples:

```text
whoosh_fast_transition_001.mp3
impact_cinematic_hit_002.wav
background_blue_gradient_90s_001.mp4
screenshot_app_dashboard_001.png
image_business_growth_001.jpg
broll_phone_scroll_vertical_001.mp4
```

---

## Cloudinary User Media

Use Cloudinary for:

- User voice/audio uploads.
- User video uploads.
- User optional images/screenshots.
- Generated MP4 renders.
- Short-lived previews.

Do not use Cloudinary as the main internal reusable asset library going forward.

---

## Future AWS S3

Move to AWS S3 later for:

- Large render storage.
- Long-term generated videos.
- Larger internal asset packs.
- Backup and lifecycle policies.
- CloudFront delivery if needed.

Do not build S3 now unless storage cost, scale, or durability becomes a blocker.

---

## FFmpeg Rule

The render pipeline should search assets in this order:

```text
User upload
-> Google Drive internal asset library
-> public/asset-library local fallback
-> text card / text overlay
```

If any asset is missing, FFmpeg should keep rendering with text fallback.

---

## Google Drive Fonts

Google Fonts are stored in:

```text
Itnavideo Assets/fonts/
```

Current status:

- 30 Google font families are uploaded.
- Drive API read access can see the `fonts` folder.
- FFmpeg caches selected `.ttf` files into `public/cache/drive-fonts`.

Render behavior:

```text
Template font family
-> Google Drive fonts folder
-> local cached .ttf
-> public/fonts fallback
-> system/default FFmpeg font
```

Missing fonts must not fail a render.

---

## Google Material Symbols

Google Material Symbols are stored in:

```text
Itnavideo Assets/material_symbols/
```

Current status:

- Drive folder is visible to the service account.
- Available style folders:
  - `Material_Symbols_Outlined`
  - `Material_Symbols_Rounded`
  - `Material_Symbols_Sharp`

Use these for:

- Explainer icons.
- Educational bullets.
- App/tutorial highlights.
- CTA symbols.
- Simple motion overlays.

Render behavior:

```text
Need icon/symbol
-> Google Drive material_symbols
-> local/cache icon asset
-> text label fallback
```

Missing symbols must not fail a render. If a symbol is unavailable, use a text overlay/card.
