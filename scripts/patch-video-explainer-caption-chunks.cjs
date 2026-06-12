const fs = require("fs");

const path = "remotion/templates/VIDEO_EXPLAINER/template.tsx";
let text = fs.readFileSync(path, "utf8");

if (text.includes("const expandCaptionChunks =")) {
  console.log("expandCaptionChunks already exists. Skipping function insert.");
} else {
  const marker = "function breakSubtitleLines(text: string) {";
  const markerIndex = text.indexOf(marker);

  if (markerIndex === -1) {
    console.error("Could not find breakSubtitleLines marker");
    process.exit(1);
  }

  const functionText = `
const expandCaptionChunks = (item: ContinuousCaptionItem): ContinuousCaptionItem[] => {
  const caption = normalizeCaption(item);
  const duration = Math.max(0, caption.end - caption.start);
  const words = cleanText(caption.text).split(/\\s+/).filter(Boolean);

  if (words.length <= 6 && duration <= 3.2) {
    return [caption];
  }

  const chunkSize = words.length > 18 ? 4 : 5;
  const chunks: string[] = [];

  for (let index = 0; index < words.length; index += chunkSize) {
    const chunk = words.slice(index, index + chunkSize).join(' ').trim();
    if (chunk) chunks.push(chunk);
  }

  if (chunks.length <= 1) {
    return [caption];
  }

  const step = duration > 0 ? duration / chunks.length : 1.2;

  return chunks.map((chunk, index) => {
    const start = caption.start + index * step;
    const end = index === chunks.length - 1 ? caption.end : caption.start + (index + 1) * step;

    return {
      ...caption,
      id: \`\${caption.id || 'caption'}-chunk-\${index + 1}\`,
      start,
      end: Math.max(start + 0.45, end),
      text: limitWords(chunk, 6, 54),
      lines: breakSubtitleLines(chunk),
    };
  });
};

`;

  text = text.slice(0, markerIndex) + functionText + text.slice(markerIndex);
}

const oldMap = ".map(normalizeCaption)";
if (!text.includes(oldMap)) {
  console.error("Could not find .map(normalizeCaption)");
  process.exit(1);
}

text = text.replace(oldMap, ".flatMap(expandCaptionChunks)");

fs.writeFileSync(path, text, "utf8");
console.log("Caption chunking patch applied.");
