# Faceless Video Visual Planning Glossary

- **Approved transcript**: The creator-reviewed transcript used as the source of narration text and factual claims for storyboard planning.
- **Graphic plan**: Typed data for a scene's visual intent, title, labels, values, and relationships. It is not SVG markup.
- **Reusable SVG template**: A code-owned layout for a known visual type: allocation, comparison, metric, sequence, concept map, or growth/time-series chart.
- **Custom SVG composition**: A scene-specific arrangement assembled by code from approved SVG primitives when no reusable template fits.
- **Approved SVG primitive**: A renderer-owned shape, path, connector, label, bar, axis, node, or other element. AI output can request supported elements but cannot provide executable SVG markup.
- **Transcript-grounded data**: Numeric values, time points, labels, and relationships directly supported by the approved narration. Unspoken values are not filled in by inference.
- **Scene-local frame**: The Remotion frame count relative to the start of one scene, used to make its SVG motion deterministic.
- **Storyboard preview**: A visual preview of the planned scene. In this workflow it is read-only; visual type and chart data are not manually editable in the storyboard.