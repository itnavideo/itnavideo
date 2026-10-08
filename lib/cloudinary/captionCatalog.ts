import previewTranscripts from "@/lib/cloudinary/autocaption-transcripts.json";
import { SUBTITLE_PRESETS } from "@/remotion/types/subtitles";
import { SavedPreviewTranscript } from "@/lib/captions/previewTranscript";

export interface CaptionStyleCatalogItem {
  key: string; // Style preset key (e.g., "Ali Abdaal Clean Pill", "Hormozi Viral Pop", "Cook")
  filename: string;
  publicId: string;
  previewVideoUrl: string;
  posterUrl: string;
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  durationSeconds: number;
}

// Preferred direct mapping from preset key to dedicated video file
const PREFERRED_STYLE_FILE_MAP: Record<string, string> = {
  "Hormozi Viral Pop": "hormozi-viral-pop.mp4",
  "MrBeast Shorts Impact": "mrbeast-shorts-impact.mp4",
  "MrBeast 16:9 Punch": "mrbeast-16-9-punch.mp4",
  "Impact": "impact.mp4",
  "Bold Creator": "creator-3.mp4",
  "Kinetic": "kinetic.mp4",
  "Shorts Karaoke": "shorts-karaoke.mp4",
  "Crazy": "crazy.mp4",
  "Crazy 2": "crazy-2.mp4",
  "Cursive": "cursive.mp4",
  "Gamer": "gamer.mp4",
  "Submagic Glow": "submagic-glow.mp4",
  "Spark Glow": "spark.mp4",
  "Spark": "spark.mp4",
  "Vox Documentary": "vox-documentary.mp4",
  "BBC / Netflix Closed Captions": "bbc-netflix-closed-captions.mp4",
  "Studio Podcast": "solo.mp4",
  "Diary of a CEO": "diary-of-a-ceo.mp4",
  "Huberman Lab Lecture": "huberman-lab-lecture.mp4",
  "MKBHD Tech Studio": "mkbhd-tech-studio.mp4",
  "Kurzgesagt Explainer": "kurzgesagt-explainer.mp4",
  "M3 Tonal Pill": "m3-tonal-pill.mp4",
  "M3 Dynamic Chip": "m3-dynamic-chip.mp4",
  "M3 Elevated Card": "m3-elevated-card.mp4",
  "Minimal Clean": "ali-abdaal-clean-pill.mp4",
  "Lex Fridman Minimalist": "lex-fridman-minimalist.mp4",
  "Devane Luxury Serif": "devane-luxury-serif.mp4",
  "Ali Abdaal Clean Pill": "ali-abdaal-clean-pill.mp4",
  "Opus Inverted Box": "opus-inverted-box.mp4",
  "Cyber Lime Pill": "cyber-lime-pill.mp4",
  "Cook": "cook.mp4",
  "Discipline": "discipline.mp4",
  "Master": "master.mp4",
  "Punch": "punch.mp4",
  "Red Wipe": "red-wipe.mp4",
  "Estate": "estate.mp4",
  "Creator 3": "creator-3.mp4",
  "Story": "story.mp4",
  "Solo": "solo.mp4",
};

// Raw transcript dataset indexed by filename
const TRANSCRIPT_DATA = previewTranscripts as Record<string, SavedPreviewTranscript>;
const RAW_FILENAMES = Object.keys(TRANSCRIPT_DATA);

// Build helper to construct Cloudinary video and poster URLs
function buildCloudinaryVideoUrl(publicId: string): string {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  const encoded = publicId.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/dhouh9idx/video/upload/f_auto,q_auto/${encoded}.mp4`;
}

function buildCloudinaryPosterUrl(publicId: string): string {
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId.replace(/\.mp4$/i, ".jpg");
  const encoded = publicId.split("/").map(encodeURIComponent).join("/");
  return `https://res.cloudinary.com/dhouh9idx/video/upload/so_0.5,f_auto,q_auto/${encoded}.jpg`;
}

// Build 1-to-1 catalog for all style keys in SUBTITLE_PRESETS
export function buildCaptionStyleCatalog(): Record<string, CaptionStyleCatalogItem> {
  const catalog: Record<string, CaptionStyleCatalogItem> = {};
  const allStyleKeys = Object.keys(SUBTITLE_PRESETS);
  const assignedFilenames = new Set<string>();

  // 1. Assign preferred direct matches
  for (const key of allStyleKeys) {
    const preferredFile = PREFERRED_STYLE_FILE_MAP[key];
    if (preferredFile && TRANSCRIPT_DATA[preferredFile] && !assignedFilenames.has(preferredFile)) {
      const data = TRANSCRIPT_DATA[preferredFile];
      const publicId = data.publicId || preferredFile.replace(/\.mp4$/i, "");
      catalog[key] = {
        key,
        filename: preferredFile,
        publicId,
        previewVideoUrl: buildCloudinaryVideoUrl(publicId),
        posterUrl: buildCloudinaryPosterUrl(publicId),
        transcript: data.transcript || "",
        words: data.words || [],
        durationSeconds: data.durationSeconds || 8,
      };
      assignedFilenames.add(preferredFile);
    }
  }

  // 2. Assign remaining unassigned raw video files to remaining styles
  const remainingFiles = RAW_FILENAMES.filter((f) => !assignedFilenames.has(f));
  let remainingIdx = 0;

  for (const key of allStyleKeys) {
    if (catalog[key]) continue;
    const nextFile = remainingFiles[remainingIdx % remainingFiles.length] || RAW_FILENAMES[remainingIdx % RAW_FILENAMES.length];
    const data = TRANSCRIPT_DATA[nextFile];
    const publicId = data?.publicId || nextFile.replace(/\.mp4$/i, "");
    catalog[key] = {
      key,
      filename: nextFile,
      publicId,
      previewVideoUrl: buildCloudinaryVideoUrl(publicId),
      posterUrl: buildCloudinaryPosterUrl(publicId),
      transcript: data?.transcript || "",
      words: data?.words || [],
      durationSeconds: data?.durationSeconds || 8,
    };
    remainingIdx += 1;
  }

  return catalog;
}

export const CAPTION_STYLE_CATALOG = buildCaptionStyleCatalog();

export function getCaptionStyleCatalogItem(presetKey: string): CaptionStyleCatalogItem {
  if (CAPTION_STYLE_CATALOG[presetKey]) {
    return CAPTION_STYLE_CATALOG[presetKey];
  }
  // Fallback to first item if key not found
  const firstKey = Object.keys(CAPTION_STYLE_CATALOG)[0];
  return CAPTION_STYLE_CATALOG[firstKey];
}
