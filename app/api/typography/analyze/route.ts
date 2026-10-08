import { NextResponse } from 'next/server';
import {
  analyzeTypographyVideo,
  analyzeAllTypographyDemos,
  getSavedStyleBlueprint,
  getAllSavedStyleBlueprints,
  DEMO_TYPOGRAPHY_VIDEOS,
  type VisionAnalysisOptions,
} from '@/services/ai/typographyAnalyzer';
import { validateBlueprintBatch } from '@/services/ai/typographyAnalyzer/validationEngine';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow up to 5 minutes for multi-stage video sampling and AI vision

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const styleId = searchParams.get('styleId');

    if (styleId) {
      const blueprint = getSavedStyleBlueprint(styleId);
      if (!blueprint) {
        // Return demo metadata if not yet analyzed
        const demo = DEMO_TYPOGRAPHY_VIDEOS.find((d) => d.styleId === styleId);
        return NextResponse.json({
          styleId,
          analyzed: false,
          demo: demo || null,
          blueprint: null,
        });
      }
      return NextResponse.json({
        styleId,
        analyzed: true,
        blueprint,
      });
    }

    // Return list of all demo styles and their analysis status
    const allSaved = getAllSavedStyleBlueprints();
    const savedMap = new Map(allSaved.map((b) => [b.metadata.styleId, b]));

    const styleSummaries = DEMO_TYPOGRAPHY_VIDEOS.map((demo) => {
      const saved = savedMap.get(demo.styleId);
      return {
        styleId: demo.styleId,
        name: demo.name,
        category: demo.category,
        sourceVideoUrl: demo.sourceVideoUrl,
        posterUrl: demo.posterUrl,
        analyzed: !!saved,
        overallConfidence: saved?.metadata?.overallConfidence || 0,
        fontFamily: saved?.typography?.fontFamilyEstimate?.value || 'Montserrat',
        fontCategory: saved?.typography?.fontCategory?.value || 'bold-geometric-sans',
        entranceMotion: saved?.animation?.entrance?.type?.value || 'slam-scale',
        primaryTextColor: saved?.color?.primaryTextColor?.value || '#FFFFFF',
        accentColor: saved?.color?.accentColor?.value || '#38BDF8',
        layerPlacement: saved?.subjectRelationship?.layerPlacement?.value || 'in-front-subject',
        distinctivenessScore: saved?.validation?.distinctivenessScore || 90,
        status: saved?.validation?.status || 'unprocessed',
        analyzedAt: saved?.metadata?.analyzedAt || null,
      };
    });

    const validationSummary = allSaved.length > 1 ? validateBlueprintBatch(allSaved) : null;

    return NextResponse.json({
      success: true,
      totalStyles: DEMO_TYPOGRAPHY_VIDEOS.length,
      analyzedCount: allSaved.length,
      styles: styleSummaries,
      validationSummary,
    });
  } catch (error) {
    console.error('[API:TYPOGRAPHY_ANALYZE] GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve typography blueprints' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { styleId, videoUrl, name, category, all, force } = body;

    // Batch analysis of all 10 demo styles
    if (all) {
      console.log('[API:TYPOGRAPHY_ANALYZE] Starting batch analysis of all 10 typography styles...');
      const result = await analyzeAllTypographyDemos();
      return NextResponse.json({
        success: true,
        analyzedCount: result.blueprints.length,
        blueprints: result.blueprints,
        validationSummary: result.summary,
      });
    }

    // Custom or Single style analysis
    const targetStyleId = styleId || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `custom-${Date.now()}`);
    const demoConfig = DEMO_TYPOGRAPHY_VIDEOS.find((d) => d.styleId === targetStyleId);

    const targetVideoUrl = videoUrl || demoConfig?.sourceVideoUrl;
    if (!targetVideoUrl) {
      return NextResponse.json(
        { error: 'Missing videoUrl or valid demo styleId for analysis' },
        { status: 400 }
      );
    }

    // Check cache unless force is requested
    if (!force) {
      const existing = getSavedStyleBlueprint(targetStyleId);
      if (existing) {
        return NextResponse.json({
          success: true,
          cached: true,
          blueprint: existing,
        });
      }
    }

    const options: VisionAnalysisOptions = {
      styleId: targetStyleId,
      name: name || demoConfig?.name,
      category: category || demoConfig?.category,
      sourceVideoUrl: targetVideoUrl,
      posterUrl: demoConfig?.posterUrl,
    };

    const blueprint = await analyzeTypographyVideo(targetVideoUrl, options);

    return NextResponse.json({
      success: true,
      cached: false,
      blueprint,
    });
  } catch (error) {
    console.error('[API:TYPOGRAPHY_ANALYZE] POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
