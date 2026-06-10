# Asset Library

This is the single source of truth for reusable and direct assets.

## Folders

- `direct/images` - one-off page, section, campaign, or workflow images.
- `direct/icons` - one-off page, section, campaign, or workflow PNG icons.
- `reusable/images` - images that can be selected by AI or reused across templates.
- `reusable/icons` - reusable visual callouts and render icons.
- `reusable/backgrounds` - reusable scene or template backgrounds.
- `reusable/sound-effects` - reusable render sound cues.
- `reusable/background-music` - reusable music beds.
- `reusable/fonts` - reusable render fonts.

Do not put binary assets inside `remotion/templates/*`. Remotion templates should read assets through `assetTimeline`, uploaded/user-selected URLs, or this library index.

Run this after changes:

```bash
npm run assets:index
```

The generated index is `public/assets/assets.json`.

## Vision indexing

For accurate AI picking, run Vision preprocessing on unlabeled image/icon/background assets:

```bash
npm run assets:vision -- --limit=50
```

This updates `asset-labels.json` and `asset-embeddings.json` without renaming files. Review the sample output, then apply content-based filenames in batches:

```bash
npm run assets:vision:apply -- --limit=50
npm run assets:index
```

Use `--all` to refresh every visual asset instead of only assets marked `needsLabel`.
