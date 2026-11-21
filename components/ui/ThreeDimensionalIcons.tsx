import React from 'react';

/**
 * Photorealistic Dimensional 3D Vector Icons (Zero-Compute, Pure Vector SVGs)
 * 
 * Specially engineered for Itnavideo dashboard cards, badges, and studio showcases:
 * - Ultra-lightweight (zero Three.js/WebGL GPU load, perfect for 4GB RAM machines)
 * - Uses volumetric radial gradients, specular highlights, and ambient depth drop-shadows
 * - Functional buttons continue using 2D crisp Lucide vector icons
 */

interface ThreeDIconProps {
  size?: number;
  className?: string;
}

/** 3D Cinema Camera with Glass Lens & Studio Light Reflections */
export function ThreeDCameraIcon({ size = 32, className = '' }: ThreeDIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Volumetric Body Gradients */}
        <linearGradient id="camBodyGrad" x1="12" y1="18" x2="48" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2A2A38" />
          <stop offset="50%" stopColor="#181824" />
          <stop offset="100%" stopColor="#0E0E17" />
        </linearGradient>
        <linearGradient id="camTopPlate" x1="18" y1="12" x2="42" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        {/* Glass Lens Gradients */}
        <radialGradient id="camLensGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#0284C7" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#0F172A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <linearGradient id="camLensBevel" x1="28" y1="20" x2="52" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        {/* Ambient Glow */}
        <filter id="camDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#EA580C" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Camera Body with 3D Depth */}
      <rect x="10" y="20" width="36" height="28" rx="8" fill="url(#camBodyGrad)" stroke="#3F3F56" strokeWidth="1.5" filter="url(#camDropShadow)" />
      
      {/* Matte Metallic Highlight Rim */}
      <path d="M 12 28 C 12 22, 16 21, 22 21 L 42 21" stroke="white" strokeOpacity="0.25" strokeWidth="1.2" strokeLinecap="round" />

      {/* Top Handle / Mic Mount */}
      <rect x="18" y="14" width="20" height="7" rx="3.5" fill="url(#camTopPlate)" />
      <circle cx="23" cy="17.5" r="1.5" fill="#FED7AA" />
      <circle cx="33" cy="17.5" r="1.5" fill="#FED7AA" />

      {/* Cinema Lens Cylinder (Extruded 3D) */}
      <circle cx="34" cy="34" r="14" fill="url(#camLensBevel)" stroke="#64748B" strokeWidth="1" />
      <circle cx="34" cy="34" r="11" fill="url(#camLensGlow)" />
      
      {/* Glass Reflection Highlight */}
      <ellipse cx="30" cy="30" rx="4" ry="2.5" transform="rotate(-35 30 30)" fill="white" fillOpacity="0.6" />
      <circle cx="36" cy="36" r="1.5" fill="white" fillOpacity="0.4" />

      {/* Record LED Lamp */}
      <circle cx="16" cy="27" r="2.5" fill="#EF4444" />
      <circle cx="16" cy="27" r="1" fill="#FCA5A5" />

      {/* Tape Reel / Side Knob */}
      <rect x="44" y="28" width="10" height="12" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
      <circle cx="49" cy="34" r="2" fill="#EA580C" />
    </svg>
  );
}

/** 3D Film Clapperboard with Angled Slate & Striped Depth */
export function ThreeDClapperboardIcon({ size = 32, className = '' }: ThreeDIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="clapBoardGrad" x1="10" y1="26" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1E2E" />
          <stop offset="100%" stopColor="#0B0B12" />
        </linearGradient>
        <linearGradient id="clapStickGrad" x1="8" y1="12" x2="54" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <filter id="clapShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#F97316" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Lower Main Board with Screen Ratio Lines */}
      <rect x="10" y="24" width="44" height="30" rx="6" fill="url(#clapBoardGrad)" stroke="#374151" strokeWidth="1.5" filter="url(#clapShadow)" />
      
      {/* Slate Production Fields */}
      <rect x="14" y="30" width="16" height="8" rx="2" fill="#111827" stroke="#374151" strokeWidth="0.8" />
      <rect x="34" y="30" width="16" height="8" rx="2" fill="#111827" stroke="#374151" strokeWidth="0.8" />
      <line x1="14" y1="44" x2="50" y2="44" stroke="#4B5563" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="48" x2="38" y2="48" stroke="#374151" strokeWidth="1" strokeLinecap="round" />

      {/* Upper Clapper Stick with Zebra Stripes */}
      <g transform="rotate(-12 12 24)">
        <rect x="8" y="14" width="46" height="9" rx="3" fill="url(#clapStickGrad)" stroke="#7C2D12" strokeWidth="1" />
        <path d="M 16 14 L 21 23 L 26 23 L 21 14 Z" fill="white" fillOpacity="0.95" />
        <path d="M 28 14 L 33 23 L 38 23 L 33 14 Z" fill="white" fillOpacity="0.95" />
        <path d="M 40 14 L 45 23 L 50 23 L 45 14 Z" fill="white" fillOpacity="0.95" />
      </g>

      {/* Hinge Pin */}
      <circle cx="11" cy="24" r="3" fill="#D1D5DB" stroke="#4B5563" strokeWidth="1" />
      <circle cx="11" cy="24" r="1.2" fill="#1F2937" />
    </svg>
  );
}

/** 3D Studio Condenser / Vintage Microphone with Metallic Grill & Halos */
export function ThreeDMicrophoneIcon({ size = 32, className = '' }: ThreeDIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Metallic Capsule Gradients */}
        <linearGradient id="micGrillGrad" x1="22" y1="10" x2="42" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="35%" stopColor="#F97316" />
          <stop offset="70%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
        <radialGradient id="micHalo" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="micStandGrad" x1="28" y1="36" x2="36" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <filter id="micShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#F97316" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Ambient Sound Halo */}
      <circle cx="32" cy="24" r="20" fill="url(#micHalo)" />

      {/* 3D Microphone Capsule Head */}
      <rect x="22" y="10" width="20" height="24" rx="10" fill="url(#micGrillGrad)" stroke="#FED7AA" strokeWidth="1" filter="url(#micShadow)" />
      
      {/* Specular Capsule Highlight Rim */}
      <path d="M 25 15 C 25 12, 27 12, 32 12" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />

      {/* Metallic Acoustic Mesh Lines */}
      <line x1="22" y1="18" x2="42" y2="18" stroke="#7C2D12" strokeWidth="1" />
      <line x1="22" y1="22" x2="42" y2="22" stroke="#7C2D12" strokeWidth="1" />
      <line x1="22" y1="26" x2="42" y2="26" stroke="#7C2D12" strokeWidth="1" />
      <line x1="32" y1="12" x2="32" y2="32" stroke="#FED7AA" strokeOpacity="0.4" strokeWidth="1" />

      {/* Studio Cradle / Shockmount Ring */}
      <path d="M 16 26 C 16 38, 48 38, 48 26" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Heavy Base & Stem */}
      <path d="M 32 37 L 32 50" stroke="url(#micStandGrad)" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="32" cy="52" rx="14" ry="4" fill="url(#micStandGrad)" stroke="#475569" strokeWidth="1" />
      <ellipse cx="32" cy="51" rx="10" ry="2.5" fill="#0F172A" />
    </svg>
  );
}

/** 3D Golden Enterprise Coin with Volumetric Rim & Embossed Star */
export function ThreeDCoinIcon({ size = 20, className = '' }: ThreeDIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="coinFace" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        <linearGradient id="coinRim" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#B45309" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Coin Extrusion */}
      <circle cx="16" cy="16" r="13" fill="url(#coinRim)" filter="url(#coinShadow)" />
      
      {/* Front Face Coin Disc */}
      <circle cx="16" cy="15" r="11" fill="url(#coinFace)" stroke="#FEF08A" strokeWidth="0.8" />
      
      {/* Embossed Center Star / Currency Emblem */}
      <path
        d="M 16 9.5 L 17.5 13.5 L 21.5 14 L 18.5 16.8 L 19.5 21 L 16 18.8 L 12.5 21 L 13.5 16.8 L 10.5 14 L 14.5 13.5 Z"
        fill="#78350F"
        fillOpacity="0.45"
      />
      <path
        d="M 16 9 L 17.5 13 L 21.5 13.5 L 18.5 16.3 L 19.5 20.5 L 16 18.3 L 12.5 20.5 L 13.5 16.3 L 10.5 13.5 L 14.5 13 Z"
        fill="#FEF08A"
      />

      {/* Specular Arc Glint */}
      <path d="M 8 13 C 9 9, 13 7, 18 7" stroke="white" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.75" />
    </svg>
  );
}

/** 3D Glowing Prismatic Gem / Diamond with Facet Refractions */
export function ThreeDGemIcon({ size = 20, className = '' }: ThreeDIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gemTop" x1="8" y1="8" x2="24" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
        <linearGradient id="gemBottom" x1="16" y1="15" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#6B21A8" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>
        <filter id="gemGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#A855F7" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Gem Crown / Upper Facets */}
      <polygon points="10,13 16,7 22,13 26,13 16,15 6,13" fill="url(#gemTop)" stroke="#E9D5FF" strokeWidth="0.8" filter="url(#gemGlow)" />
      
      {/* Gem Pavilion / Lower Point */}
      <polygon points="6,13 16,15 26,13 16,26" fill="url(#gemBottom)" stroke="#9333EA" strokeWidth="0.8" />
      <polygon points="12,14 16,15 20,14 16,25" fill="#E9D5FF" fillOpacity="0.35" />

      {/* Prismatic Specular Glint */}
      <circle cx="16" cy="8" r="1.5" fill="white" />
    </svg>
  );
}

/** 3D Launch Rocket with Chrome Cone & Fiery Propulsion */
export function ThreeDRocketIcon({ size = 24, className = '' }: ThreeDIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="rocketBody" x1="10" y1="6" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="rocketCone" x1="16" y1="4" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <radialGradient id="rocketPlume" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Fiery Exhaust Plume */}
      <path d="M 14 23 Q 16 30 16 31 Q 16 30 18 23 Z" fill="url(#rocketPlume)" />

      {/* Left & Right Fins */}
      <path d="M 12 18 L 8 22 L 12 21 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="0.6" />
      <path d="M 20 18 L 24 22 L 20 21 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="0.6" />

      {/* Aerodynamic Fuselage Body */}
      <path d="M 16 4 Q 21 11 20 22 L 12 22 Q 11 11 16 4 Z" fill="url(#rocketBody)" stroke="#CBD5E1" strokeWidth="0.8" />
      
      {/* Orange Nose Cone */}
      <path d="M 16 4 Q 19 8 19 11 L 13 11 Q 13 8 16 4 Z" fill="url(#rocketCone)" />

      {/* Cabin Porthole Glass */}
      <circle cx="16" cy="14" r="2.5" fill="#0284C7" stroke="#38BDF8" strokeWidth="0.8" />
      <circle cx="15.2" cy="13.2" r="0.8" fill="white" />
    </svg>
  );
}
