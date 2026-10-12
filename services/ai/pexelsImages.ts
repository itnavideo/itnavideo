type PexelsPhoto = {
  imageUrl: string;
  photographer: string;
  photographerUrl: string;
  sourceUrl: string;
};

export type PexelsSceneQuery = {
  sceneNumber: number;
  query: string;
};

export async function searchPexelsFallbackImages(
  queries: PexelsSceneQuery[],
  options: { orientation: 'landscape' | 'portrait'; maxSearches?: number; concurrency?: number },
): Promise<Map<number, PexelsPhoto>> {
  return new Map<number, PexelsPhoto>();
}