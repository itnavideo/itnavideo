import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
} from 'remotion';
import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { FloatingBrowserWindow } from './components/FloatingBrowserWindow';
import { PhoneMockup916 } from './components/PhoneMockup916';
import { AnimatedCursor } from './components/AnimatedCursor';
import { KineticCalloutPill } from './components/KineticCalloutPill';

const { fontFamily: JAKARTA_FONT } = loadJakarta('normal', {
  weights: ['400', '600', '700', '800'],
  ignoreTooManyRequestsWarning: true,
});
const { fontFamily: INTER_FONT } = loadInter('normal', {
  weights: ['400', '600', '700'],
  ignoreTooManyRequestsWarning: true,
});

export interface SaasProductDemoProps {
  durationSeconds?: number;
  productName?: string;
  tagline?: string;
}

export const SaasProductDemoTemplate: React.FC<SaasProductDemoProps> = ({
  durationSeconds = 90,
  productName = 'Itnavideo',
  tagline = 'Automate Video Creation with Pure AI',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTime = frame / fps;

  // ── 5 CHOREOGRAPHED SCENES TIMINGS ──────────────────────────────────────────
  // Scene 1: 0s - 15s  (The Problem Hook & The Old vs New Split)
  // Scene 2: 15s - 40s (16:9 Cinema Explainer Studio)
  // Scene 3: 40s - 65s (9:16 Shorts & Kinetic Captions Engine)
  // Scene 4: 65s - 80s (100% AWS Lambda Cloud Architecture)
  // Scene 5: 80s - 90s (10+ Studios Hub & Founder YC Callout)

  // ── SCENE 1: HOOK & SPLIT (0s - 15s) ────────────────────────────────────────
  const isScene1 = currentTime < 15;
  const s1Spring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  // ── SCENE 2: 16:9 CINEMA (15s - 40s) ────────────────────────────────────────
  const isScene2 = currentTime >= 15 && currentTime < 40;
  const s2LocalFrame = Math.max(0, frame - 15 * fps);
  const s2Spring = spring({ frame: s2LocalFrame, fps, config: { damping: 14, stiffness: 100 } });

  // Animated cursor path for Scene 2 (Upload audio -> Click Start Generate)
  const s2CursorX = interpolate(s2LocalFrame, [0, 45, 90, 150], [960, 480, 480, 1200], {
    extrapolateRight: 'clamp',
  });
  const s2CursorY = interpolate(s2LocalFrame, [0, 45, 90, 150], [700, 480, 480, 720], {
    extrapolateRight: 'clamp',
  });
  const s2IsClicking = s2LocalFrame > 85 && s2LocalFrame < 105;

  // ── SCENE 3: 9:16 SHORTS & KINETIC CAPTIONS (40s - 65s) ────────────────────
  const isScene3 = currentTime >= 40 && currentTime < 65;
  const s3LocalFrame = Math.max(0, frame - 40 * fps);
  const s3Spring = spring({ frame: s3LocalFrame, fps, config: { damping: 14, stiffness: 100 } });

  // Animated cursor clicking through 3 styles in Scene 3
  const styleCycleIndex = Math.min(2, Math.floor(s3LocalFrame / 60));
  const activeStyleNames = ['Hormozi Viral Pop', 'MrBeast Shorts Impact', 'Submagic Glow'];
  const s3ActiveStyle = activeStyleNames[styleCycleIndex];

  // ── SCENE 4: AWS LAMBDA CLOUD SPEED (65s - 80s) ────────────────────────────
  const isScene4 = currentTime >= 65 && currentTime < 80;
  const s4LocalFrame = Math.max(0, frame - 65 * fps);

  // ── SCENE 5: 10+ STUDIOS SUITE & FINALE (80s - 90s) ────────────────────────
  const isScene5 = currentTime >= 80;
  const s5LocalFrame = Math.max(0, frame - 80 * fps);
  const s5Spring = spring({ frame: s5LocalFrame, fps, config: { damping: 12, stiffness: 140 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#080A10',
        fontFamily: `${JAKARTA_FONT}, system-ui, sans-serif`,
        color: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Background Ambient Gradients */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1200,
          height: 600,
          background: 'radial-gradient(circle, rgba(255, 87, 34, 0.18) 0%, rgba(255, 87, 34, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          right: '10%',
          width: 800,
          height: 500,
          background: 'radial-gradient(circle, rgba(255, 160, 0, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Global Brand Watermark Header */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 64,
          right: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Flame Play Mark */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255,87,34,0.4)',
            }}
          >
            <span style={{ fontSize: 18, color: '#FFFFFF', transform: 'translateX(1px)' }}>▶</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>
            Itna<span style={{ color: '#FF5722' }}>Video</span>
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              backgroundColor: 'rgba(255, 87, 34, 0.15)',
              border: '1px solid rgba(255, 87, 34, 0.3)',
              color: '#FF7043',
              padding: '3px 8px',
              borderRadius: 6,
            }}
          >
            YC DEMO 2026
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>10+ AI Video Studios</span>
          <span style={{ fontSize: 14, color: '#10B981', fontWeight: 700 }}>● AWS Lambda 100% Cloud</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCENE 1: THE PROBLEM & SPLIT COMPARISON (0s - 15s)                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isScene1 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 100px 40px',
            transform: `scale(${interpolate(s1Spring, [0, 1], [0.92, 1])})`,
            opacity: interpolate(currentTime, [14.2, 15], [1, 0], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Main Headline */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: '#FF5722',
                letterSpacing: 2,
                textTransform: 'uppercase',
                backgroundColor: 'rgba(255, 87, 34, 0.12)',
                border: '1px solid rgba(255, 87, 34, 0.25)',
                padding: '6px 16px',
                borderRadius: 999,
              }}
            >
              The Problem with Video Creation
            </span>
            <h1
              style={{
                fontSize: 68,
                fontWeight: 900,
                letterSpacing: -1.5,
                lineHeight: 1.1,
                marginTop: 18,
              }}
            >
              Video Editing is <span style={{ color: '#EF4444' }}>Painful & Slow.</span>
              <br />
              We Made It <span style={{ color: '#FF5722' }}>Instant With Pure AI.</span>
            </h1>
          </div>

          {/* Split Comparison Cards */}
          <div style={{ display: 'flex', gap: 36, width: '100%', maxWidth: 1200 }}>
            {/* Left Card: Traditional 6 Hours */}
            <div
              style={{
                flex: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '2px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 24,
                padding: 36,
                boxShadow: '0 20px 50px -10px rgba(239, 68, 68, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 28, color: '#EF4444' }}>✕</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#EF4444' }}>
                  Traditional Timeline Workflow
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <li style={{ color: '#CBD5E1', fontSize: 18 }}>• 4 to 6 hours splicing clips & keyframing</li>
                <li style={{ color: '#CBD5E1', fontSize: 18 }}>• Hunting for matching stock footage & B-roll</li>
                <li style={{ color: '#CBD5E1', fontSize: 18 }}>• Heavy laptop rendering freezes cheap machines</li>
                <li style={{ color: '#CBD5E1', fontSize: 18 }}>• Manual subtitle alignment word-by-word</li>
              </ul>
            </div>

            {/* Right Card: Itnavideo 60 Seconds */}
            <div
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 87, 34, 0.08)',
                border: '2px solid rgba(255, 87, 34, 0.5)',
                borderRadius: 24,
                padding: 36,
                boxShadow: '0 20px 50px -10px rgba(255, 87, 34, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 28, color: '#10B981' }}>✓</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#FF7043' }}>
                  Itnavideo Cloud Engine
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <li style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>• Just upload audio or voiceover</li>
                <li style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>• AI auto-assembles scenes & B-roll</li>
                <li style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>• 100% AWS Lambda parallel cloud render</li>
                <li style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>• 32 kinetic subtitle presets word-synced</li>
              </ul>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCENE 2: 16:9 CINEMA EXPLAINER DEMO (15s - 40s)                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isScene2 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 80,
            transform: `scale(${interpolate(s2Spring, [0, 1], [0.94, 1])})`,
          }}
        >
          <KineticCalloutPill
            badge="Studio 1"
            title="16:9 Faceless Video Creator"
            sub="Drop 2-min audio → Instant YouTube Widescreen Explainer"
            startFrame={15 * fps + 5}
            x={120}
            y={100}
            color="#FF5722"
          />

          <FloatingBrowserWindow
            width={1440}
            height={800}
            url="itnavideo.com/dashboard/faceless-video"
            tiltAngle={2}
          >
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              {/* Left Sidebar: Audio Upload & Settings */}
              <div
                style={{
                  width: 440,
                  backgroundColor: '#0F121C',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>
                    Upload Voiceover Audio
                  </h3>
                  <div
                    style={{
                      border: '2px dashed rgba(255, 87, 34, 0.4)',
                      borderRadius: 16,
                      backgroundColor: 'rgba(255, 87, 34, 0.04)',
                      padding: '36px 20px',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: 36 }}>🎙️</span>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>
                      founder_voiceover.mp3 (2:15)
                    </div>
                    <div style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>
                      ✓ Transcribed via Groq Whisper Cloud
                    </div>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700, marginBottom: 8 }}>
                      PIPELINE PROGRESS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>✓ 1. Speech Transcription (0.4s)</div>
                      <div style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>✓ 2. Storyboard & Scene Planning</div>
                      <div style={{ fontSize: 13, color: '#FF7043', fontWeight: 700 }}>⚡ 3. Matching B-roll & SFX</div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FF5722',
                    borderRadius: 12,
                    padding: '14px 20px',
                    textAlign: 'center',
                    fontWeight: 900,
                    fontSize: 16,
                    boxShadow: '0 8px 24px rgba(255, 87, 34, 0.4)',
                  }}
                >
                  Generate 16:9 Video →
                </div>
              </div>

              {/* Right Canvas: 16:9 Video Player Preview */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 32,
                  backgroundColor: '#06080D',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: 16,
                    border: '2px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/dhouh9idx/image/upload/v1792945592/file_000000004290821180a71f25ad75480e_nztpwe.png"
                    alt="Faceless Video Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      left: 20,
                      right: 20,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      borderRadius: 12,
                      padding: '12px 20px',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#FACC15' }}>
                      “Rule #1: Never risk capital on untested assets...”
                    </span>
                    <span style={{ fontSize: 11, color: '#10B981', fontWeight: 800 }}>
                      1080p 60 FPS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FloatingBrowserWindow>

          {/* Gliding Mouse Cursor */}
          <AnimatedCursor
            x={s2CursorX}
            y={s2CursorY}
            isClicking={s2IsClicking}
            clickFrame={15 * fps + 85}
          />
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCENE 3: 9:16 SHORTS & KINETIC CAPTIONS ENGINE (40s - 65s)          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isScene3 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 120px 40px',
            gap: 80,
            transform: `scale(${interpolate(s3Spring, [0, 1], [0.94, 1])})`,
          }}
        >
          {/* Left: 9:16 Phone Mockup with Real Video */}
          <PhoneMockup916
            width={380}
            height={760}
            activeStyleName={s3ActiveStyle}
            videoSrc="/visuals/homepage/autocaption.mp4"
          />

          {/* Right: 32 Kinetic Typography Presets Showcase */}
          <div style={{ flex: 1, maxWidth: 680 }}>
            <KineticCalloutPill
              badge="Studio 2"
              title="Auto Caption & Shorts Engine"
              sub="32 word-synced kinetic animation presets"
              startFrame={40 * fps + 5}
              x={0}
              y={-40}
              color="#FFA000"
            />

            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -1, lineHeight: 1.15, marginTop: 40 }}>
              Word-Synced Kinetic Subtitles.
              <br />
              <span style={{ color: '#FFA000' }}>Zero Manual Keyframing.</span>
            </h2>
            <p style={{ fontSize: 18, color: '#94A3B8', marginTop: 16, lineHeight: 1.5 }}>
              Creators choose from 32 distinct creator styles. Speech timestamps from Groq Whisper sync every single word with spring physics, highlight fills, and active glow.
            </p>

            {/* 4-Box Style Selector Demo */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginTop: 28,
              }}
            >
              {[
                'Hormozi Viral Pop',
                'MrBeast Shorts Impact',
                'Submagic Glow',
                'Ali Abdaal Modern',
                'Devane Luxury Serif',
                'Podcast Studio Master',
              ].map((name) => {
                const isSelected = name === s3ActiveStyle;
                return (
                  <div
                    key={name}
                    style={{
                      backgroundColor: isSelected ? '#FBDD6B' : '#18181B',
                      color: isSelected ? '#000000' : '#FFFFFF',
                      border: `1.5px solid ${isSelected ? '#FACC15' : '#27272A'}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                      fontSize: 13,
                      fontWeight: isSelected ? 800 : 600,
                      textAlign: 'center',
                      boxShadow: isSelected ? '0 8px 20px rgba(250, 204, 21, 0.3)' : 'none',
                    }}
                  >
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCENE 4: 100% AWS LAMBDA CLOUD SPEED (65s - 80s)                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isScene4 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 100px 40px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: '#10B981',
              letterSpacing: 2,
              textTransform: 'uppercase',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '6px 16px',
              borderRadius: 999,
            }}
          >
            The Architectural Moat
          </span>
          <h2 style={{ fontSize: 60, fontWeight: 900, letterSpacing: -1, marginTop: 18 }}>
            Zero Local Freezes. <span style={{ color: '#10B981' }}>100% AWS Lambda Cloud.</span>
          </h2>
          <p style={{ fontSize: 20, color: '#94A3B8', maxWidth: 840, marginTop: 14, lineHeight: 1.5 }}>
            Most video editors overheat laptops and lock up cheaper machines. Itnavideo executes 100% of render compute on AWS Lambda serverless containers, distributing 1080p video rendering across hundreds of cloud nodes simultaneously.
          </p>

          {/* Architecture Pipeline Cards */}
          <div style={{ display: 'flex', gap: 24, marginTop: 40, width: '100%', maxWidth: 1100 }}>
            {[
              { step: '1', title: 'Phone Audio', desc: 'Lightweight mono speech upload', icon: '📱' },
              { step: '2', title: 'Groq Whisper', desc: 'Millisecond cloud transcription', icon: '⚡' },
              { step: '3', title: 'AWS Lambda', desc: 'Parallel Remotion render nodes', icon: '☁️' },
              { step: '4', title: '1080p MP4', desc: 'Instant download link in seconds', icon: '🎬' },
            ].map((node) => (
              <div
                key={node.step}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1.5px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 20,
                  padding: 24,
                  textAlign: 'center',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 8 }}>{node.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{node.title}</div>
                <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>{node.desc}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SCENE 5: 10+ STUDIOS SUITE & YC CALL TO ACTION (80s - 90s)          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isScene5 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 100px 40px',
            textAlign: 'center',
            transform: `scale(${interpolate(s5Spring, [0, 1], [0.94, 1])})`,
          }}
        >
          {/* Logo Brand Mark */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(255,87,34,0.5)',
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 36, color: '#FFFFFF', transform: 'translateX(2px)' }}>▶</span>
          </div>

          <h2 style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1.5 }}>
            Itna<span style={{ color: '#FF5722' }}>Video</span>
          </h2>
          <p style={{ fontSize: 24, color: '#CBD5E1', maxWidth: 800, marginTop: 12, lineHeight: 1.4 }}>
            The all-in-one AI video engine for creators, educators, and media agencies worldwide.
          </p>

          <div
            style={{
              marginTop: 32,
              backgroundColor: '#FF5722',
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 800,
              padding: '16px 40px',
              borderRadius: 999,
              boxShadow: '0 10px 30px rgba(255, 87, 34, 0.45)',
            }}
          >
            Try Free at Itnavideo.com
          </div>

          <div style={{ marginTop: 20, fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
            Applying to Y Combinator Summer 2026 • Founders: rohi@itnavideo.com
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const SaasProductDemoComposition = () => (
  <Composition
    id="SAAS-PRODUCT-DEMO"
    component={SaasProductDemoTemplate}
    durationInFrames={2700} // 90 seconds @ 30 FPS
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      durationSeconds: 90,
      productName: 'Itnavideo',
      tagline: 'Automate Video Creation with Pure AI',
    }}
  />
);
