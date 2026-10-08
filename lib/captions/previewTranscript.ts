export type PreviewTranscriptWord = {
  word: string;
  start: number;
  end: number;
};

export type SavedPreviewTranscript = {
  publicId: string;
  filename: string;
  transcript: string;
  words: PreviewTranscriptWord[];
  segments: Array<{ start: number; end: number; text: string }>;
  durationSeconds?: number;
};

export type PreviewCaptionChunk = {
  id: number;
  start: number;
  end: number;
  sampleLines: string[];
  activeWord: string;
  words: PreviewTranscriptWord[];
};

export function getPreviewCaptionAtTime(
  savedTranscript: SavedPreviewTranscript | undefined,
  timeSeconds: number,
  wordsPerChunk = 4,
): PreviewCaptionChunk | null {
  if (!savedTranscript?.words?.length) return null;

  const words = savedTranscript.words;
  for (let startIndex = 0; startIndex < words.length; startIndex += wordsPerChunk) {
    const chunkWords = words.slice(startIndex, startIndex + wordsPerChunk);
    const firstWord = chunkWords[0];
    const lastWord = chunkWords[chunkWords.length - 1];
    if (!firstWord || !lastWord || timeSeconds < firstWord.start || timeSeconds > lastWord.end) continue;

    const activeWord = chunkWords.find((word) => timeSeconds >= word.start && timeSeconds <= word.end);
    const splitIndex = Math.ceil(chunkWords.length / 2);
    const firstLine = chunkWords.slice(0, splitIndex).map((word) => word.word).join(" ");
    const secondLine = chunkWords.slice(splitIndex).map((word) => word.word).join(" ");

    return {
      id: Math.floor(startIndex / wordsPerChunk),
      start: firstWord.start,
      end: lastWord.end,
      sampleLines: secondLine ? [firstLine, secondLine] : [firstLine],
      activeWord: activeWord?.word || firstWord.word,
      words: chunkWords,
    };
  }

  return null;
}
