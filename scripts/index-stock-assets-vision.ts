import fs from 'fs';
import path from 'path';
import { RAW_ITNAVIDEO_STOCK_ASSETS, toAbsoluteS3AssetUrl, getAssetStyle } from '../constants/itnavideoStockAssets';

export interface IndexedStockAsset {
  assetId: string;
  sourceType: 'stock';
  url: string;
  title: string;
  detailedDescription: string;
  subjects: string[];
  action: string;
  context: string;
  setting: string;
  quantityScale: 'small_amount' | 'moderate' | 'large_abundance' | 'irrelevant';
  emotionMood: string;
  positiveConcepts: string[];
  tierDisqualifiers: string[];
  category: string;
  visualStyle: 'realistic' | '2d' | '3d';
  qualityScore: number;
  isPreIndexed: boolean;
}

export function buildUnifiedStockAssetRegistry(): IndexedStockAsset[] {
  return RAW_ITNAVIDEO_STOCK_ASSETS.map((asset) => {
    const titleLower = asset.title.toLowerCase();
    const posTags = (asset.positiveTags || []).map((t) => t.toLowerCase());
    const negTags = (asset.negativeTags || []).map((t) => t.toLowerCase());

    let scale: IndexedStockAsset['quantityScale'] = 'moderate';
    if (posTags.some((t) => t.includes('little') || t.includes('low money') || t.includes('empty wallet') || t.includes('few coins') || t.includes('small'))) {
      scale = 'small_amount';
    } else if (posTags.some((t) => t.includes('rich') || t.includes('wealth') || t.includes('millionaire') || t.includes('cash pile') || t.includes('massive') || t.includes('yacht') || t.includes('bounty'))) {
      scale = 'large_abundance';
    }

    let context = 'general';
    if (posTags.some((t) => t.includes('broke') || t.includes('poverty') || t.includes('debt') || t.includes('struggling') || t.includes('hardship') || t.includes('low income'))) {
      context = 'financial_hardship';
    } else if (posTags.some((t) => t.includes('wealth') || t.includes('rich') || t.includes('luxury') || t.includes('millionaire'))) {
      context = 'wealth_abundance';
    } else if (posTags.some((t) => t.includes('job') || t.includes('office') || t.includes('work') || t.includes('career'))) {
      context = 'career_business';
    }

    let mood = 'cinematic';
    if (posTags.some((t) => t.includes('stress') || t.includes('crisis') || t.includes('worried') || t.includes('fear'))) {
      mood = 'anxious';
    } else if (posTags.some((t) => t.includes('celebrate') || t.includes('freedom') || t.includes('victory') || t.includes('joy'))) {
      mood = 'joyful';
    }

    return {
      assetId: asset.id,
      sourceType: 'stock',
      url: toAbsoluteS3AssetUrl(asset.url),
      title: asset.title,
      detailedDescription: `${asset.title}. Category: ${asset.categoryLabel}. Key themes: ${posTags.slice(0, 5).join(', ')}.`,
      subjects: posTags.slice(0, 4),
      action: titleLower.includes('calculat') ? 'calculating finances' : titleLower.includes('celebrat') ? 'celebrating' : 'depicting scene concept',
      context,
      setting: asset.category === 'workspace' ? 'office workspace' : 'general environment',
      quantityScale: scale,
      emotionMood: mood,
      positiveConcepts: Array.from(new Set([...posTags, ...titleLower.split(/\s+/)])),
      tierDisqualifiers: negTags,
      category: asset.category,
      visualStyle: getAssetStyle(asset.url),
      qualityScore: 90,
      isPreIndexed: true,
    };
  });
}

function main() {
  const registry = buildUnifiedStockAssetRegistry();
  const outputPath = path.join(process.cwd(), 'public', 'assets', 'unified-assets-indexed.json');
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2));
  console.log(`[STOCK_INDEXER] Indexed ${registry.length} stock assets into ${outputPath}`);
}

if (require.main === module) {
  main();
}
