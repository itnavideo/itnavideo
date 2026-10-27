import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrowserMockupFrame } from '../components/BrowserMockupFrame';
import { DecodingCardMockup } from '../components/DecodingCardMockup';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ScreenshotSceneProps {
  scene: SceneBlueprintItem;
  mediaUrl?: string;
  headingFont?: string;
  bodyFont?: string;
}

export function ScreenshotScene({
  scene,
  mediaUrl,
  headingFont = 'Montserrat, Inter, system-ui, sans-serif',
  bodyFont = 'Inter, system-ui, sans-serif',
}: ScreenshotSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1.0]);
  const activeMediaUrl = mediaUrl || scene.visualAssetRequirement || '';

  const headline = scene.heading || 'HIGH IMPACT NICHE BREAKTHROUGH';
  const highlightWord = (scene.highlightedWords && scene.highlightedWords[0]) || '';

  // Determine contextual mockup presentation
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
        padding: '50px 80px',
        zIndex: 15,
        opacity: entrance,
        transform: `scale(${scale})`,
        fontFamily: bodyFont,
      }}
    >
      {isDigitalProductContext ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '64px',
            width: '100%',
            maxWidth: '1100px',
          }}
        >
          {/* Left: 3D Ebook Mockup with Spine Depth */}
          <DecodingCardMockup
            type="ebook_mockup"
            title={headline}
            viewCount={scene.supportingText || '13-PAGE BLUEPRINT'}
            channelName={scene.quoteAuthor || 'CREATOR ASSET'}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />

          {/* Right: Revenue Proof Card & Live Stripe Toasts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', alignItems: 'flex-start' }}>
            <DecodingCardMockup
              type="stripe_toast"
              title={`Payment Received: ${scene.statValue || '+$27.00'}`}
              viewCount="Stripe • Customer purchased Ebook"
              fontFamily={bodyFont}
            />

            {/* High-Impact Proof Metric Display */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.94)',
                border: '2px solid rgba(255, 87, 34, 0.35)',
                borderRadius: '24px',
                padding: '28px 36px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(255, 87, 34, 0.25)',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: '#FF7043',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                VERIFIED DIGITAL SALES
              </div>
              <div
                style={{
                  fontSize: '52px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                }}
              >
                {scene.statValue || '$506,000'}
              </div>
              <div style={{ fontSize: '15px', color: '#94A3B8', fontWeight: 600, marginTop: '8px' }}>
                {scene.supportingText || 'Generated from a single 13-page digital product'}
              </div>
            </div>
          </div>
        </div>
      ) : isAiPromptContext ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <DecodingCardMockup
            type="ai_prompt_box"
            title={scene.supportingText || headline}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />
        </div>
      ) : isYoutubeContext ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* YouTube Search Bar typing above */}
          <DecodingCardMockup
            type="search_bar"
            title={headline}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />

          {/* YouTube Tilted Video Thumbnail Card */}
          <DecodingCardMockup
            type="thumbnail_mockup"
            imageSrc={activeMediaUrl}
            title={headline}
            channelName={scene.supportingText ? scene.supportingText.slice(0, 24) : 'Decoding Niche'}
            viewCount="1.4M views • 2 weeks ago"
            duration="14:28"
            tiltAngle={-2.8}
            highlightWord={highlightWord}
            accentColor="#FF5722"
            fontFamily={headingFont}
          />
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '1200px', height: '620px' }}>
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
