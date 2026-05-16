# Professional Dynamic Video Template System

This system gives Itnavideo a professional visual layer without making FFmpeg fragile.

---

## Objective

Render 1080p portrait videos with:

- Color-coded MP4 or solid-color backgrounds.
- Dark readability overlay.
- Safe-zone typography.
- Dynamic text sizing.
- Professional font pairing.
- FFmpeg-safe text animation.
- Category-specific presets.

The renderer must still follow the fallback ladder: if a background, font, caption, or animation fails, produce a clean MP4 with text fallback.

---

## Template JSON

Example:

```json
{
  "template_id": "pro_modern_01",
  "background_color": "deep_blue_mp4",
  "font_family": "Montserrat",
  "animation_style": "word_by_word",
  "text_content": "Your life changes the moment you decide..."
}
```

Template definitions live in:

```text
services/rendering/proVideoTemplates.js
```

Templates are exposed for UI/ops through:

```text
GET /api/templates
```

---

## Active Presets

### Motivational

- Template: `pro_motivational_01`
- Background: deep black/gold or deep red
- Font: Montserrat/Poppins fallback
- Text: bold, center aligned
- Animation: fade-slide
- Effects: dark overlay, vignette, slow zoom

### Educational

- Template: `pro_educational_01`
- Background: navy/teal
- Font: Inter/Roboto fallback
- Text: top-left headings and body
- Animation: typewriter-safe reveal
- Effects: clean overlay without heavy vignette

### Storytelling / Songs

- Template: `pro_storytelling_01`
- Background: deep blue
- Font: Playfair/Merriweather fallback
- Text: bottom-center
- Animation: word-by-word intent, currently supported through caption timing and safe text reveal
- Effects: dark overlay and vignette

### Modern / Tech

- Template: `pro_modern_01`
- Background: deep blue/navy
- Font: Inter/Roboto fallback
- Text: center aligned
- Animation: fade-slide
- Effects: dark overlay and vignette

---

## Font Rules

Primary source:

```text
Google Drive -> Itnavideo Assets/fonts/
```

The renderer downloads the selected `.ttf` file into:

```text
public/cache/drive-fonts/
```

Preferred local fallback files:

```text
public/fonts/Montserrat-Bold.ttf
public/fonts/Poppins-ExtraBold.ttf
public/fonts/Inter-Bold.ttf
public/fonts/Roboto-Bold.ttf
public/fonts/PlayfairDisplay-Bold.ttf
public/fonts/Merriweather-Bold.ttf
public/fonts/Geist-Black.ttf
```

If Drive fonts and local files are missing, FFmpeg uses its system/default font. Missing fonts must not fail the render.

---

## Rendering Rules

Base layer:

- User visual, Google Drive asset, local asset, or text-card background.

Readability layer:

- 20-24% black overlay by preset.
- Vignette when the preset calls for it.

Text layer:

- Dynamic font sizing based on character count.
- Text shadow / glow using a shadow drawtext pass.
- Safe-zone x/y positions.
- Fade-slide or safe reveal animation.

Symbol layer:

- Use Google Drive `material_symbols` when an icon/symbol supports the scene idea.
- Prefer rounded/outlined symbols for educational and modern videos.
- Prefer sharp symbols only for high-energy or tech-style moments.
- If the symbol is missing or unsafe to render, use a text label/card fallback.

Fallback:

- If complex text fails later, retry base text card.
- If background asset is missing, use solid-color template background.
- If Material Symbols are missing, use text instead.
- If category is unknown, use `pro_modern_01`.

---

## Future Upgrade

For highly complex animation:

- Generate HTML5 canvas frames.
- Composite frames into FFmpeg.
- Keep the current drawtext path as fallback.

Do not make canvas rendering mandatory until it is tested under production workload.
