import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CameraRigProps {
  title?: string;
  rigType?: '3-axis-gimbal' | 'steadicam' | 'techno-arm';
  pitchAngle?: number;
  yawAngle?: number;
  rollAngle?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CameraRig: React.FC<CameraRigProps> = ({
  title = '3-Axis Motorized Camera Rig',
  rigType = '3-axis-gimbal',
  pitchAngle = 12,
  yawAngle = 24,
  rollAngle = -4,
  primaryColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const rotPitch = interpolate(Math.sin(frame * 0.05), [-1, 1], [-pitchAngle, pitchAngle]);
  const rotYaw = interpolate(Math.cos(frame * 0.04), [-1, 1], [-yawAngle, yawAngle]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        perspective: 800,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 20 : 28,
          opacity: anim,
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>✇ STABILIZATION SYSTEM</span>
          <span>•</span>
          <span>3-AXIS GIMBAL RIG</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* 3D Gimbal Rig Visualizer */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0c0d12',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer Yaw Ring (Z-axis) */}
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transform: `rotate(${rotYaw}deg)`,
          }}
        />

        {/* Pitch Ring (X-axis) */}
        <div
          style={{
            position: 'absolute',
            width: 170,
            height: 170,
            borderRadius: '50%',
            border: `2px dashed ${primaryColor}`,
            transform: `rotate(${rotPitch}deg)`,
          }}
        />

        {/* Center Camera Body */}
        <div
          style={{
            width: 90,
            height: 60,
            borderRadius: 8,
            background: '#18181b',
            border: `2px solid ${primaryColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 25px ${primaryColor}40`,
            transform: `rotate(${rotPitch * 0.7}deg)`,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#09090b',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: primaryColor }} />
          </div>
        </div>

        {/* Telemetry HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            display: 'flex',
            gap: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#7dd3fc',
          }}
        >
          <span>PITCH: {rotPitch.toFixed(1)}°</span>
          <span>YAW: {rotYaw.toFixed(1)}°</span>
          <span>MOTOR: 100% STABLE</span>
        </div>
      </div>
    </div>
  );
};
