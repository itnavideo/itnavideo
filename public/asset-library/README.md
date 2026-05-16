Owned local fallback asset library for Itnavideo.

Current storage split:

- Cloudinary stores user uploads and final generated MP4 files.
- `assets_library/` stores permanent render-worker assets such as fonts, icons, and sound effects.
- `public/asset-library/` stores small local fallback assets that can ship with the app.
- Google Drive can be used as the internal reusable asset library for larger curated packs.

Older Cloudinary folders may still exist as compatibility assets:

- sound effects
- screenshots
- colored 90-second background MP4 files

Put local fallback startup assets here so video generation can work without depending on Canva or a remote asset lookup:

- videos: vertical stock clips, b-roll, cinematic backgrounds
- backgrounds: still backgrounds and texture images
- images: photos and visual references
- motion: motion graphics clips
- overlays: transparent PNG/WebP overlays and graphic accents
- sfx: whooshes, hits, risers, ambience, UI sounds
- music: background music beds

Use descriptive filenames with searchable words, for example:

- motivational-office-work-hard.mp4
- cinematic-money-success-background.jpg
- whoosh-fast-transition.mp3
- luxury-calm-background-music.mp3

The AI matcher scores filenames and folders against each scene query.
