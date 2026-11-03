import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrowserMockupFrame } from '../components/BrowserMockupFrame';
import { DecodingCardMockup } from '../components/DecodingCardMockup';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface ScreenshotSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function ScreenshotScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
  sceneFrame,
  palette,
}: ScreenshotSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame !== undefined ? sceneFrame : frame;

  const isPortrait = height > width;
  const s = Math.min(width, height) / 1080;
  const isDark = palette?.isDark ?? true;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';

  const entrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  // Subtle floating motion
  const ambientFloat = Math.sin((currentFrame / fps) * 2) * (3 * s);

  const scale = interpolate(entrance, [0, 1], [0.92, 1.0]);
  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';

  const headline = scene.heading || 'HIGH IMPACT NICHE BREAKTHROUGH';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';

  const contextString = `${headline} ${scene.supportingText || ''} ${scene.narrationSegment?.text || ''}`;
  const isDigitalProductContext =
    /ebook|book|pdf|guide|blueprint|digital product|course|stripe|gumroad|sales|\$506|\$|revenue|passive income/i.test(
      contextString
    );
  const isAiPromptContext =
    /prompt|claude|chatgpt|gpt|ai tool|generative|midjourney|prompting/i.test(
      contextString
    ) && !isDigitalProductContext;
  const isYoutubeContext =
    /youtube|channel|video|thumbnail|views|subscribers|creator|niche|faceless/i.test(
      contextString
    );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isPortrait ? `${160 * s}px ${45 * s}px ${180 * s}px` : `${50 * s}px ${80 * s}px`,
        zIndex: 15,
        backgroundColor: bg,
        opacity: entrance,
        transform: `translateY(${ambientFloat}px) scale(${scale})`,
        fontFamily: bodyFont,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {isDigitalProductContext ? (
        <div
          style={{
            display: 'flex',
            flexDirection: isPortrait ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isPortrait ? `${24 * s}px` : `${48 * s}px`,
            width: '100%',
            maxWidth: isPortrait ? '520px' : '1080px',
          }}
        >
          {/* Ebook Mockup */}
          <DecodingCardMockup
            type="ebook_mockup"
            title={headline}
            viewCount={scene.supportingText || '13-PAGE BLUEPRINT'}
            channelName={scene.quoteAuthor || 'CREATOR ASSET'}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />

          {/* Revenue Proof Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${16 * s}px`, alignItems: isPortrait ? 'center' : 'flex-start', width: isPortrait ? '100%' : 'auto' }}>
            <DecodingCardMockup
              type="stripe_toast"
              title={`Payment Received: ${scene.statValue || '+$27.00'}`}
              viewCount="Stripe • Verified Transaction"
              fontFamily={bodyFont}
            />

            <div
              style={{
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF',
                border: '2px solid rgba(255, 87, 34, 0.35)',
                borderRadius: `${20 * s}px`,
                padding: `${20 * s}px ${28 * s}px`,
                boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(255, 87, 34, 0.15)',
                width: isPortrait ? '100%' : 'auto',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: `${12 * s}px`,
                  fontWeight: 900,
                  color: '#FF7043',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: `${6 * s}px`,
                }}
              >
                VERIFIED DIGITAL SALES
              </div>
              <div
                style={{
                  fontSize: isPortrait ? `${40 * s}px` : `${48 * s}px`,
                  fontWeight: 900,
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                }}
              >
                {scene.statValue || '$506,000'}
              </div>
              <div style={{ fontSize: `${14 * s}px`, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, marginTop: `${6 * s}px` }}>
                {scene.supportingText || 'Generated from single digital product'}
              </div>
            </div>
          </div>
        </div>
      ) : isAiPromptContext ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${20 * s}px`, width: '100%', maxWidth: '520px' }}>
          <DecodingCardMockup
            type="ai_prompt_box"
            title={scene.supportingText || headline}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />
        </div>
      ) : isYoutubeContext ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${20 * s}px`, width: '100%', maxWidth: '520px' }}>
          <DecodingCardMockup
            type="search_bar"
            title={headline}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />

          <DecodingCardMockup
            type="thumbnail_mockup"
            imageSrc={activeMediaUrl}
            title={headline}
            channelName={scene.supportingText ? scene.supportingText.slice(0, 24) : 'Strategic Blueprint'}
            viewCount="1.4M views • High Velocity"
            duration="14:28"
            tiltAngle={-2.2}
            highlightWord={highlightWord}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: isPortrait ? '520px' : '1080px', height: isPortrait ? `${440 * s}px` : `${580 * s}px` }}>
          <BrowserMockupFrame
            src={activeMediaUrl}
            title={headline}
            urlAddress="https://www.itnavideo.com/dashboard"
            zoomEffect="browser-scroll"
          />
        </div>
      )}
    </div>
  );
}

export default ScreenshotScene;
