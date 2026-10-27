import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { VectorDrawingIcon } from '../../../components/graphics/VectorDrawingIcon';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';

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

/**
 * DrawingStoryScene — Cinematic Vector Visual Storytelling
 *
 * Full-screen broadcast composition for character narratives, real-world struggles,
 * journeys, environments, and activities (NO website cards or presentation boxes).
 * Inspired by Vox, Johnny Harris, and documentary motion graphics.
 */
export function DrawingStoryScene({
  scene,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Plus Jakarta Sans, sans-serif',
  sceneFrame,
  palette,
}: DrawingStorySceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Enforce scene-local frame timing
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  // Spring entrance for visuals and typography
  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.85, stiffness: 120 },
  });

  const illustrationSpring = spring({
    frame: Math.max(0, currentFrame - 2),
    fps,
    config: { damping: 13, mass: 0.9, stiffness: 110 },
  });

  const textSpring = spring({
    frame: Math.max(0, currentFrame - 6),
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 130 },
  });

  // Slow, cinematic camera drift across the scene
  const cameraZoom = interpolate(currentFrame, [0, 180], [1.0, 1.04], {
    extrapolateRight: 'clamp',
  });
  const cameraPan = interpolate(currentFrame, [0, 180], [0, -12], {
    extrapolateRight: 'clamp',
  });

  // Resolve drawing keyword from scene metadata or text
  const rawText = `${scene.heading || ''} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`.toLowerCase();
  const explicitKeyword = (scene as Record<string, unknown>).drawingKeyword as string | undefined;

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
      resolvedKeyword = 'character_thinking';
    }
  }

  const isDark = palette?.isDark !== false;
  const headline = String(scene.heading || 'A PIVOTAL MOMENT').trim();
  const rawHighlight = (scene.highlightedWords && typeof scene.highlightedWords[0] === 'string')
    ? scene.highlightedWords[0].trim()
    : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const supportingText = scene.supportingText && scene.supportingText !== headline ? scene.supportingText : '';

  // Scene layout mode: alternating left/right layout based on scene number for visual variety
  const isReversed = (scene.sceneNumber || 0) % 2 === 1;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 120px',
        transform: `scale(${cameraZoom}) translateX(${cameraPan}px)`,
        transformOrigin: 'center center',
        zIndex: 10,
      }}
    >
      {/* ── Background Editorial Blueprint Texture & Ambient Light ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 87, 34, 0.12) 0%, rgba(255, 160, 0, 0.04) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 87, 34, 0.08) 0%, transparent 65%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          left: isReversed ? '60%' : '10%',
          top: '20%',
        }}
      />

      {/* ── Main Two-Column Cinematic Visual Stage (Full 16:9 Canvas) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '1680px',
          display: 'flex',
          flexDirection: isReversed ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '80px',
          zIndex: 2,
        }}
      >
        {/* Large Prominent Vector Illustration Canvas (520px - 580px wide) */}
        <div
          style={{
            flex: '0 0 580px',
            height: '580px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            opacity: illustrationSpring,
            transform: `scale(${interpolate(illustrationSpring, [0, 1], [0.86, 1])})`,
          }}
        >
          {/* Subtle Ambient Halo behind the illustration */}
          <div
            style={{
              position: 'absolute',
              width: '460px',
              height: '460px',
              borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(255, 87, 34, 0.08) 50%, transparent 75%)'
                : 'radial-gradient(circle, rgba(15, 23, 42, 0.03) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }}
          />

          <VectorDrawingIcon
            drawingId={resolvedKeyword}
            keyword={resolvedKeyword}
            size={520}
            strokeWidth={3.8}
            animated={true}
            delayFrames={3}
            drawDurationFrames={36}
            theme={isDark ? 'dark' : 'light'}
            color={isDark ? '#F8FAFC' : '#0F172A'}
          />
        </div>

        {/* Narrative Editorial Typography Column */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            opacity: textSpring,
            transform: `translateY(${interpolate(textSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Subtle Section Marker */}
          <div
            style={{
              marginBottom: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                width: '32px',
                height: '3px',
                backgroundColor: '#FF5722',
                borderRadius: '2px',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: headingFont,
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isDark ? '#FFA000' : '#FF5722',
              }}
            >
              INSIGHT BEAT
            </span>
          </div>

          {/* Big Bold Headline */}
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: isDark ? '#FFFFFF' : '#0F172A',
              margin: 0,
              letterSpacing: '-0.025em',
              maxWidth: '920px',
              textShadow: isDark
                ? '0 4px 24px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.8)'
                : 'none',
            }}
          >
            {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
              <>
                {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
                <HandwritingHighlight
                  text={highlightWord.toUpperCase()}
                  variant="underline"
                  color="#FF5722"
                  delayFrames={12}
                  drawDurationFrames={22}
                />
                {headline.slice(
                  headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
                )}
              </>
            ) : (
              headline
            )}
          </h2>

          {/* Narrative Supporting Sentence (Direct text on canvas, no web card) */}
          {supportingText && (
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: '26px',
                lineHeight: 1.5,
                color: isDark ? '#CBD5E1' : '#475569',
                marginTop: '24px',
                marginBottom: 0,
                fontWeight: 500,
                maxWidth: '850px',
                textShadow: isDark ? '0 2px 12px rgba(0, 0, 0, 0.85)' : 'none',
              }}
            >
              {supportingText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrawingStoryScene;
