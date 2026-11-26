import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface ThreeGlobeSceneProps {
  heading?: string;
  supportingText?: string;
  statLabel?: string;
  statValue?: string;
  accentColor?: string;
  headingFont?: string;
  typographyFont?: string;
  palette?: BackgroundColorPalette;
}

const SpinningGlobeMesh: React.FC<{ rotationY: number; accent: string; isDark: boolean }> = ({
  rotationY,
  accent,
  isDark,
}) => {
  return (
    <group rotation={[0.25, rotationY, 0.1]}>
      {/* Inner core sphere */}
      <mesh>
        <sphereGeometry args={[1.65, 32, 32]} />
        <meshStandardMaterial
          color={isDark ? '#0F172A' : '#E2E8F0'}
          roughness={0.55}
          metalness={0.25}
        />
      </mesh>
      {/* Outer wireframe latitude/longitude grid */}
      <mesh scale={1.015}>
        <sphereGeometry args={[1.65, 22, 16]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.65} />
      </mesh>
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.25, 0.025, 16, 80]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};

/**
 * @remotion/three 3D WebGL Spinning Globe + Spatial Stat Card Scene.
 */
export const ThreeGlobeScene: React.FC<ThreeGlobeSceneProps> = ({
  heading = 'Global Reach & Scale',
  supportingText = 'Connecting audiences across continents in real time.',
  statLabel = 'Active Markets',
  statValue = '140+ Countries',
  accentColor = '#EA580C',
  headingFont = 'Inter, sans-serif',
  typographyFont = 'Inter, sans-serif',
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = palette?.isDark ?? false;
  const textPrimary = palette?.textPrimary ?? (isDark ? '#FFFFFF' : '#0F172A');
  const textSecondary = palette?.textSecondary ?? (isDark ? '#94A3B8' : '#475569');
  const cardBg = palette?.cardBg ?? (isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.92)');
  const cardBorder = palette?.cardBorder ?? (isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)');
  const accent = accentColor || palette?.accent || '#EA580C';

  const entry = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const rotationY = (frame / fps) * 0.55;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 100px',
        gap: '48px',
        opacity: entry,
      }}
    >
      {/* Left: Editorial Copy + Spatial Stat Card */}
      <div
        style={{
          maxWidth: '640px',
          transform: `translateX(${interpolate(entry, [0, 1], [-32, 0])}px)`,
        }}
      >
        <h2
          style={{
            fontFamily: headingFont,
            fontSize: '56px',
            fontWeight: 900,
            lineHeight: 1.12,
            color: textPrimary,
            margin: '0 0 20px',
          }}
        >
          {heading}
        </h2>
        <p
          style={{
            fontFamily: typographyFont,
            fontSize: '25px',
            fontWeight: 500,
            lineHeight: 1.48,
            color: textSecondary,
            margin: '0 0 36px',
          }}
        >
          {supportingText}
        </p>

        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            padding: '22px 32px',
            borderRadius: '22px',
            backgroundColor: cardBg,
            border: `1.5px solid ${cardBorder}`,
            boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
          }}
        >
          <span
            style={{
              fontFamily: typographyFont,
              fontSize: '15px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: accent,
              marginBottom: '6px',
            }}
          >
            {statLabel}
          </span>
          <span
            style={{
              fontFamily: headingFont,
              fontSize: '38px',
              fontWeight: 900,
              color: textPrimary,
            }}
          >
            {statValue}
          </span>
        </div>
      </div>

      {/* Right: 3D WebGL Globe Canvas */}
      <div style={{ width: '580px', height: '580px', flexShrink: 0 }}>
        <ThreeCanvas
          width={580}
          height={580}
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[5, 5, 5]} intensity={1.4} />
          <pointLight position={[-4, -3, 3]} intensity={0.8} color={accent} />
          <SpinningGlobeMesh rotationY={rotationY} accent={accent} isDark={isDark} />
        </ThreeCanvas>
      </div>
    </div>
  );
};

