import React from 'react';
import { interpolate } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
  StudioCard,
} from '../components/DesignSystemPrimitives';

export interface DrawingStorySceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: {
    isDark?: boolean;
    primary?: string;
    accent?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
}

const FALLBACK_DRAWING_ROTATION = [
  'dream_big_vision',
  'story_home_workspace',
  'character_journey_walking',
  'mindset_focus_lane',
  'concept_zero_to_one',
  'character_business_leader',
  'story_journey_road',
  'character_burning_passion',
  'business_target_bullseye',
  'character_thinking',
];

export function DrawingStoryScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: DrawingStorySceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const rawText = `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`.toLowerCase();
  const explicitKeyword =
    scene.vectorDrawingId ||
    ((scene as Record<string, unknown>).drawingKeyword as string | undefined);

  let resolvedKeyword = explicitKeyword;
  if (!resolvedKeyword) {
    if (/zero|shunya|start|shuruat|kadam|first step|scratch|zero se|beginning/i.test(rawText)) {
      resolvedKeyword = 'concept_zero_to_one';
    } else if (/money|paisa|paise|rupee|capital|resource|fund|salary|investment|kharcha|wealth/i.test(rawText)) {
      resolvedKeyword = 'money_growth_coins';
    } else if (/passion|junoon|fire|drive|energy|grit|mehnat|hard work|consistency|aage badhte|moving forward/i.test(rawText)) {
      resolvedKeyword = 'character_burning_passion';
    } else if (/compare|comparison|tulna|focus|distraction|apni tulna|others|lane/i.test(rawText)) {
      resolvedKeyword = 'mindset_focus_lane';
    } else if (/dream|sapna|vision|bada|reach|summit|mountain|star|hope|ambition/i.test(rawText)) {
      resolvedKeyword = 'dream_big_vision';
    } else if (/struggle|burden|challenge|hardship|mushkil|obstacle|heavy|tough|grit|effort|fail|failure|asafalta|bar bar/i.test(rawText)) {
      resolvedKeyword = 'character_struggling_burden';
    } else if (/village|cottage|roots|childhood|rural|basti|gao/i.test(rawText)) {
      resolvedKeyword = 'story_village_house';
    } else if (/city|skyline|building|corporate|downtown|shahar/i.test(rawText)) {
      resolvedKeyword = 'story_city_buildings';
    } else if (/road|highway|path|journey|future|rasta|safar|direction/i.test(rawText)) {
      resolvedKeyword = 'story_journey_road';
    } else if (/walk|traveler|moving|alone|stride|chalna|began|started|hustle/i.test(rawText)) {
      resolvedKeyword = 'character_journey_walking';
    } else if (/desk|laptop|study|late night|workspace|writing|code|skills|learning|seekhna/i.test(rawText)) {
      resolvedKeyword = 'story_home_workspace';
    } else if (/win|celebrat|success|victory|taraqqi|result|growth|achieve|safalta/i.test(rawText)) {
      resolvedKeyword = 'character_celebration';
    } else if (/doctor|medical|clinic|hospital|dawa|cure/i.test(rawText)) {
      resolvedKeyword = 'character_doctor';
    } else if (/business|founder|ceo|leader|pitch|deal|entrepreneur|company/i.test(rawText)) {
      resolvedKeyword = 'character_business_leader';
    } else if (/chart|profit|sales|revenue|scale|metric/i.test(rawText)) {
      resolvedKeyword = 'business_growth_chart';
    } else if (/target|goal|aim|focus|mission|manzil/i.test(rawText)) {
      resolvedKeyword = 'business_target_bullseye';
    } else if (/deal|partner|agreement|trust|handshake/i.test(rawText)) {
      resolvedKeyword = 'business_handshake';
    } else {
      const idx = Math.max(0, (scene.sceneNumber || 1) - 1);
      resolvedKeyword = FALLBACK_DRAWING_ROTATION[idx % FALLBACK_DRAWING_ROTATION.length];
    }
  }

  const headline = String(scene.heading || 'A PIVOTAL MOMENT').trim();
  const categoryBadge = String(scene.categoryPill || 'INSIGHT BEAT').trim().toUpperCase();
  const rawHighlight =
    scene.highlightedWords && typeof scene.highlightedWords[0] === 'string'
      ? scene.highlightedWords[0].trim()
      : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const highlightIndex = highlightWord
    ? headline.toLowerCase().indexOf(highlightWord.toLowerCase())
    : -1;
  const supportingText =
    scene.supportingText && scene.supportingText.trim().toLowerCase() !== headline.toLowerCase()
      ? scene.supportingText.trim()
      : '';

  const isReversed = !ds.layout.isVertical && (scene.sceneNumber || 0) % 2 === 1;

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="coral"
      fontFamily={bodyFont}
    >
      <div
        style={{
          width: '100%',
          maxWidth: ds.layout.isVertical ? '920px' : '1520px',
          display: 'flex',
          flexDirection: ds.layout.isVertical
            ? 'column'
            : isReversed
            ? 'row-reverse'
            : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: ds.layout.isVertical ? '28px' : '56px',
        }}
      >
        {/* Vector Illustration Stage Card */}
        <StudioCard
          tone="coral"
          elevated
          palette={palette}
          progress={ds.motion.contentSpring}
          style={{
            flex: ds.layout.isVertical ? undefined : 1.05,
            width: ds.layout.isVertical ? '100%' : 'auto',
            maxWidth: ds.layout.isVertical ? '520px' : '640px',
            minHeight: ds.layout.isVertical ? '360px' : '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px',
          }}
        >
          <VectorDrawingIcon
            keyword={resolvedKeyword}
            size={ds.layout.isVertical ? 320 : 420}
            strokeWidth={4}
            animated={true}
            frameOverride={ds.localFrame}
            theme={ds.surface.isDark ? 'dark' : 'light'}
          />
        </StudioCard>

        {/* Narrative Editorial Typography */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ds.layout.isVertical ? 'center' : 'flex-start',
            textAlign: ds.layout.isVertical ? 'center' : 'left',
            opacity: ds.motion.headerSpring,
            transform: `translateY(${interpolate(ds.motion.headerSpring, [0, 1], [22, 0])}px)`,
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <EyebrowPill
              label={categoryBadge}
              tone="coral"
              palette={palette}
              progress={ds.motion.eyebrowSpring}
            />
          </div>

          <h2
            style={{
              fontFamily: headingFont,
              fontSize: `${ds.type.displayHero.fontSize}px`,
              fontWeight: ds.type.displayHero.fontWeight,
              letterSpacing: ds.type.displayHero.letterSpacing,
              lineHeight: ds.type.displayHero.lineHeight,
              color: ds.surface.textPrimary,
              margin: supportingText ? '0 0 20px 0' : 0,
            }}
          >
            {highlightIndex !== -1 ? (
              <>
                {headline.slice(0, highlightIndex)}
                <HandwritingHighlight
                  color="#FFE600"
                  textColor="#0F172A"
                  delayFrames={8}
                  durationFrames={15}
                  type="highlighter"
                >
                  {headline.slice(highlightIndex, highlightIndex + highlightWord.length)}
                </HandwritingHighlight>
                {headline.slice(highlightIndex + highlightWord.length)}
              </>
            ) : (
              headline
            )}
          </h2>

          {supportingText && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: `${ds.type.bodyLg.fontSize}px`,
                fontWeight: 500,
                lineHeight: ds.type.bodyLg.lineHeight,
                color: ds.surface.textSecondary,
                margin: 0,
                maxWidth: '680px',
              }}
            >
              {supportingText}
            </p>
          )}
        </div>
      </div>
    </SceneCanvas>
  );
}
