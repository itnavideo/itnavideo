# Automated Asset Pre-processing Pipeline

This project keeps assets in one place: `public/assets`.

The goal is to make bulk assets searchable, non-repetitive, and safe for Remotion templates.

## Pipeline

1. Add assets to `public/assets/direct/*` or `public/assets/reusable/*`.
2. Run the normal indexer:

```bash
npm run assets:index
```

3. Run pre-processing in dry-run mode:

```bash
npm run assets:preprocess -- --limit=25
```

4. For vision-language metadata, set `OPENAI_API_KEY` and run:

```bash
npm run assets:preprocess -- --with-openai --limit=25
```

5. To generate embeddings too:

```bash
npm run assets:preprocess -- --with-openai --with-embeddings --limit=25
```

6. To actually rename files, use the explicit apply flag:

```bash
npm run assets:preprocess -- --with-openai --apply-renames --limit=25
npm run assets:index
```

Without `--apply-renames`, the script updates metadata but does not rename files.

## Metadata

The preprocessor writes manual metadata to:

```txt
public/assets/asset-labels.json
```

The generated indexer then merges that metadata into:

```txt
public/assets/assets.json
```

Each asset can receive:

- `suggestedFilename`
- `detailedDescription`
- `visualDifference`
- `tags`
- `category`
- `qualityScore`
- `safeToUse`
- `needsLabel`
- `embeddingRef`

Embeddings are stored separately in:

```txt
public/assets/asset-embeddings.json
```

This keeps `assets.json` usable for app/runtime metadata while still allowing semantic search.

## VLM Use

Use a vision-capable model to describe each image/icon:

- what is visible
- specific differences from similar assets
- exact keywords
- suggested filename
- category

The script supports OpenAI's Responses API for image input and the Embeddings API for vectors. OpenAI's current model docs state that latest models support image input/vision through the Responses API, and embedding models expose `/v1/embeddings`.

## Rename Safety

Renaming is destructive for references, so it is opt-in only.

Default mode:

```txt
dry-run / metadata only
```

Apply mode:

```txt
--apply-renames
```

Duplicate names are handled with counters:

```txt
gold-coin-stack.png
gold-coin-stack-02.png
gold-coin-stack-03.png
```

## Smart Selection

`services/ai/assetPicker.ts` uses the generated metadata.

When multiple assets match the same shot keywords, it ranks the top results and randomly picks from the top few. This keeps videos varied instead of always choosing the same image.

## Remotion Timeline

Remotion templates should use the shared sequence layer:

```tsx
<AssetSequenceLayer fps={fps} items={props.assetTimeline} />
```

The layer renders every asset in its own `<Sequence>`:

```tsx
<Sequence from={startFrame} durationInFrames={duration}>
  <Img src={assetSrc} />
</Sequence>
```

That guarantees each asset is visible only during its shot window and disappears automatically afterward.
