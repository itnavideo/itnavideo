'use client';

import React, { useState, useRef, useEffect } from 'react';

export type TypographyStyleId =
  | 'dynamic-punch'
  | 'depth-3d-text'
  | 'dubai-gold'
  | 'neon-kinetic'
  | 'prism-pro'
  | 'paper-ii'
  | 'elevate-script'
  | 'platinum-penthouse'
  | 'royal-emerald'
  | 'silver-chrome'
  | 'velvet-crimson'
  | 'tokyo-cyber'
  | 'miami-sunset'
  | 'swiss-minimal'
  | 'monarch-violet'
  | 'obsidian-gold'
  | 'hormozi-bold'
  | 'beast-impact'
  | 'viral-redline'
  | 'creator-highlight'
  | 'gadzhi-documentary'
  | 'vogue-editorial'
  | 'keynote-executive'
  | 'vox-explainer'
  | 'nordic-clean'
  | 'spatial-glass'
  | 'isometric-cube'
  | 'synthwave-80s'
  | 'hud-telemetry'
  // Legacy aliases
  | 'prime-neon'
  | 'agent-tour'
  | 'purple-chrome';

export type TypographyCategory = 'all' | 'depth' | 'luxury' | 'kinetic' | 'minimal';

export type TypographyStyle = {
  id: TypographyStyleId;
  name: string;
  tag: string;
  category: TypographyCategory;
  description: string;
  videoSrc: string;
  posterSrc: string;
  accentColor: string;
  badgeStyle?: string;
  tags: string[];
};

function getCloudinaryVideoUrl(rawUrl: string): string {
  // Use direct Cloudinary MP4 delivery to prevent on-the-fly preview truncation
  return rawUrl;
}

function getCloudinaryPosterUrl(rawUrl: string): string {
  if (rawUrl.includes('/video/upload/')) {
    return rawUrl
      .replace('/video/upload/', '/video/upload/f_auto,q_auto,w_480,so_0.5/')
      .replace(/\.(mp4|mov|webm)$/i, '.jpg');
  }
  return rawUrl;
}

export const TYPOGRAPHY_STYLES: TypographyStyle[] = [
  {
    id: 'dynamic-punch',
    name: 'Dynamic Punch',
    tag: 'Kinetic Bold & High Energy',
    category: 'kinetic',
    description: 'Ultra-bold sans with elastic slam & electric accents',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783945650/professional-creator-after.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783945650/professional-creator-after.mp4'),
    accentColor: '#38BDF8',
    tags: ['High Energy', 'Bold Slam', 'Viral Hook'],
  },
  {
    id: 'depth-3d-text',
    name: '3D Depth & Pill',
    tag: 'Captions AI · Depth Layering',
    category: 'depth',
    description: 'Captions AI depth layering & glowing capsule container',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4'),
    accentColor: '#FACC15',
    tags: ['Behind Subject', 'Pill Callout', '3D Layering'],
  },
  {
    id: 'dubai-gold',
    name: 'Dubai 24k Gold',
    tag: 'Luxury Editorial & Shimmer',
    category: 'luxury',
    description: 'Cinzel luxury serif with 24k gold shimmer gradient',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-1475_vqqclf.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-1475_vqqclf.mp4'),
    accentColor: '#EAB308',
    tags: ['Luxury Serif', 'Gold Shimmer', 'Elite'],
  },
  {
    id: 'neon-kinetic',
    name: 'Neon Cyber Motion',
    tag: 'Electric Cyan & Magenta',
    category: 'kinetic',
    description: 'Electric cyan and magenta neon kinetic punch',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788025909/gemini_generated_video_043dd47c_ejnlad.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788025909/gemini_generated_video_043dd47c_ejnlad.mp4'),
    accentColor: '#22D3EE',
    tags: ['Neon Glow', 'Cyberpunk', 'High Voltage'],
  },
  {
    id: 'prism-pro',
    name: 'Prism Pro',
    tag: 'Captions AI · Modern Display',
    category: 'depth',
    description: 'Clean modern sans with gradient metallic shimmer',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-76814_cpmpp1.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-76814_cpmpp1.mp4'),
    accentColor: '#38BDF8',
    tags: ['Captions AI', 'Clean Glass', 'Punchy'],
  },
  {
    id: 'paper-ii',
    name: 'Paper II Collage',
    tag: 'Torn Paper Tape & Cutouts',
    category: 'kinetic',
    description: 'Torn paper tape badges & expressive kinetic collage',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-30713_i60mvm.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193725/Video-30713_i60mvm.mp4'),
    accentColor: '#FEF08A',
    tags: ['Paper Tape', 'Raw Aesthetic', 'Creator'],
  },
  {
    id: 'elevate-script',
    name: 'Elevate Script & Luxury Estate',
    tag: 'Editorial Serif · Champagne Gold & 3D Depth',
    category: 'luxury',
    description: 'Playfair italic serif in Champagne gold gradient with 3D depth & floating UI badges',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-80725_aiv5eg.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-80725_aiv5eg.mp4'),
    accentColor: '#F5D061',
    tags: ['Editorial Serif', 'Champagne Gold', 'Behind Subject', 'Glass Badges'],
  },
  {
    id: 'platinum-penthouse',
    name: 'Platinum Estate',
    tag: 'Minimal Monochrome Serif',
    category: 'minimal',
    description: 'Monochrome platinum minimalism for high-end founders',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193724/Video-99061_r2lfcy.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193724/Video-99061_r2lfcy.mp4'),
    accentColor: '#E2E8F0',
    tags: ['Platinum Minimal', 'Executive', 'Serif'],
  },
  {
    id: 'royal-emerald',
    name: 'Royal Emerald',
    tag: 'Emerald & Gold Luxury',
    category: 'luxury',
    description: 'Deep emerald & gold accents with disciplined elegance',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-14143_j4mkzn.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-14143_j4mkzn.mp4'),
    accentColor: '#10B981',
    tags: ['Emerald Accent', 'Mindset', 'Sophisticated'],
  },
  {
    id: 'silver-chrome',
    name: 'Silver Chrome',
    tag: 'Tech & Metallic Precision',
    category: 'minimal',
    description: 'Sleek metallic chrome gradients with crisp tracking',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-98200_id7qk8.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788193723/Video-98200_id7qk8.mp4'),
    accentColor: '#CBD5E1',
    tags: ['Metallic Chrome', 'Tech Minimal', 'Modern'],
  },
  {
    id: 'velvet-crimson',
    name: 'Velvet Crimson',
    tag: 'Rose Gold & Velvet Crimson Luxe',
    category: 'luxury',
    description: 'Playfair italic serif with warm rose gold gradient & deep velvet ruby glow',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942631/I_filed_for_divorce_closed_a_billion-dollar_company_and_moved_to_a_country_where_I_didn_t_spea_tm9yqa.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942631/I_filed_for_divorce_closed_a_billion-dollar_company_and_moved_to_a_country_where_I_didn_t_spea_tm9yqa.mp4'),
    accentColor: '#FB7185',
    tags: ['Rose Gold', 'Velvet Ruby', 'Editorial Luxury'],
  },
  {
    id: 'tokyo-cyber',
    name: 'Tokyo Cyber Neon',
    tag: 'Matrix Green · Terminal Hacker',
    category: 'kinetic',
    description: 'Electric lime & matrix code green with bracket framing and digital glitch beats',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Comment_ADVANTAGE_to_get_the_4_skills_that_give_you_the_upper_hand_on_wealth_while_everyone_el_nqbpyj.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Comment_ADVANTAGE_to_get_the_4_skills_that_give_you_the_upper_hand_on_wealth_while_everyone_el_nqbpyj.mp4'),
    accentColor: '#4ADE80',
    tags: ['Matrix Code', 'Terminal Hacker', 'Cyberpunk'],
  },
  {
    id: 'miami-sunset',
    name: 'Miami Sunset Kinetic',
    tag: 'Sun Gold to Hot Pink Gradient',
    category: 'kinetic',
    description: 'High-energy summer kinetic typography with dual-tone sunset glow & elastic bounce',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942635/You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942635/You_re_already_ahead_in_something.Stop_ignoring_it._That_s_your_edge._personalbranding_mhjtvu.mp4'),
    accentColor: '#F43F5E',
    tags: ['Sunset Horizon', 'Electric Coral', 'High Energy'],
  },
  {
    id: 'swiss-minimal',
    name: 'Swiss Bauhaus Studio',
    tag: 'Architectural Modernist Studio',
    category: 'minimal',
    description: 'Architectural precision with stark contrast, micro-spaced tags, and minimalist Swiss crosshairs',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4'),
    accentColor: '#FFFFFF',
    tags: ['Bauhaus Minimal', 'Architectural', 'Executive'],
  },
  {
    id: 'monarch-violet',
    name: 'Monarch Amethyst & Gold',
    tag: 'Royal Amethyst & Liquid Gold Halo',
    category: 'luxury',
    description: 'Ultra-luxury royal violet and 24k champagne gold for high-ticket finance & mindset reels',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942629/affirmationsong_affirmations_womenssecretway_dailyreminders_loveyourselfquotes_hquhqx.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942629/affirmationsong_affirmations_womenssecretway_dailyreminders_loveyourselfquotes_hquhqx.mp4'),
    accentColor: '#C084FC',
    tags: ['Royal Amethyst', '24k Gold Crest', 'Elite Mindset'],
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Noir & 3D Gold Extrusion',
    tag: 'Captions AI · 3D Behind Subject',
    category: 'depth',
    description: 'Massive 3D metallic gold bevel with behind-the-subject depth layering and dark glassmorphic badge',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1783942630/Ask_yourself_this_question.Are_you_regretting_your_mistakes..._or_learning_from_them_%EF%B8%8F_d9ekcx.mp4'),
    accentColor: '#EAB308',
    tags: ['Behind Subject', '3D Gold Bevel', 'Captions AI'],
  },
  {
    id: 'hormozi-bold',
    name: 'Hormozi Bold Punch',
    tag: 'Viral Hook & Heavy Stroke Outline',
    category: 'kinetic',
    description: 'Alex Hormozi viral punch, ultra-heavy stroke outline, tilted word pop, and neon yellow hook',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#FACC15',
    tags: ['Alex Hormozi', 'Heavy Stroke', 'High Retention', 'Viral Hook'],
  },
  {
    id: 'beast-impact',
    name: 'Beast Impact Pop',
    tag: 'MrBeast Comic 3D & Explosive Pop',
    category: 'kinetic',
    description: 'MrBeast comic 3D pop, bold drop-shadow, explosive spring bounce & tilt shake',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#38BDF8',
    tags: ['MrBeast Style', 'Comic 3D', 'Explosive Bounce', 'High Retention'],
  },
  {
    id: 'viral-redline',
    name: 'Viral Breaking Alert',
    tag: 'Urgent News Hook & Red Warning Pill',
    category: 'kinetic',
    description: 'Breaking news alert pill, red warning glowing line, and urgent high-contrast slam',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#EF4444',
    tags: ['Breaking News', 'Redline Alert', 'Urgent Hook', 'High Retention'],
  },
  {
    id: 'creator-highlight',
    name: 'Creator Highlighter',
    tag: 'Ali Abdaal · Study Highlighter Sweep',
    category: 'kinetic',
    description: 'Ali Abdaal study style, clean sans with smooth yellow marker highlighter sweep',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#FACC15',
    tags: ['Ali Abdaal', 'Yellow Highlighter', 'Paper Study', 'Clean Sans'],
  },
  {
    id: 'gadzhi-documentary',
    name: 'Gadzhi Documentary',
    tag: 'Iman Gadzhi · Cinematic Gold Serif',
    category: 'luxury',
    description: 'Iman Gadzhi documentary style, classic serif, subtle gold sheen, cinematic slow-drift, bookend rules',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#F59E0B',
    tags: ['Iman Gadzhi', 'Cinematic Serif', 'Documentary', 'Gold Sheen'],
  },
  {
    id: 'vogue-editorial',
    name: 'Vogue High-Fashion',
    tag: 'Bodoni Italic & Rose Gold Luxe',
    category: 'luxury',
    description: 'Bodoni high-contrast serif, vertical hairline accents, and chic italicized emphasis',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#F43F5E',
    tags: ['Vogue', 'High Fashion', 'Bodoni Serif', 'Rose Gold'],
  },
  {
    id: 'keynote-executive',
    name: 'Keynote Executive',
    tag: 'Apple Keynote · Frosted Glass Capsule',
    category: 'minimal',
    description: 'Apple keynote presentation, frosted glass pill, crisp sans, calm fade-up',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#38BDF8',
    tags: ['Apple Keynote', 'Frosted Capsule', 'Executive', 'Sleek Sans'],
  },
  {
    id: 'vox-explainer',
    name: 'Vox Motion Explainer',
    tag: 'Johnny Harris / Vox · Marker Box',
    category: 'minimal',
    description: 'Johnny Harris / Vox documentary style, technical coordinate badge, yellow marker box',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#EAB308',
    tags: ['Vox Explainer', 'Johnny Harris', 'Marker Box', 'Data Viz'],
  },
  {
    id: 'nordic-clean',
    name: 'Nordic Studio Sans',
    tag: 'Scandinavian Ultra-Minimalism',
    category: 'minimal',
    description: 'Scandinavian ultra-minimalism, extra-letterspaced sans, muted slate tones',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#94A3B8',
    tags: ['Nordic', 'Scandinavian', 'Ultra Minimal', 'Studio Sans'],
  },
  {
    id: 'spatial-glass',
    name: 'Spatial Vision Glass',
    tag: 'VisionOS Frosted Specular Acrylic',
    category: 'depth',
    description: 'VisionOS frosted refractive acrylic pill, specular rim light, 3D floating elevation',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#60A5FA',
    tags: ['VisionOS Glass', 'Spatial Audio', 'Specular Rim', '3D Float'],
  },
  {
    id: 'isometric-cube',
    name: 'Isometric 3D Extrusion',
    tag: 'Isometric Block 3D Shadow',
    category: 'depth',
    description: 'Angled block lettering with deep 3D shadow extrusion and spatial elevation',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#8B5CF6',
    tags: ['Isometric 3D', 'Extruded Block', 'Deep Shadow', 'Spatial'],
  },
  {
    id: 'synthwave-80s',
    name: '80s Synthwave Outrun',
    tag: 'Retro Chrome & Hot Neon Outrun',
    category: 'kinetic',
    description: 'Chrome metallic top, hot magenta neon bottom, glowing retro grid scanlines',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#EC4899',
    tags: ['Synthwave', 'Outrun', '80s Chrome', 'Hot Pink Neon'],
  },
  {
    id: 'hud-telemetry',
    name: 'Tactical HUD Telemetry',
    tag: 'Sci-Fi Targeting & Digital Readout',
    category: 'kinetic',
    description: 'Sci-fi HUD targeting reticles, coordinate stats, and digital monospace readout',
    videoSrc: getCloudinaryVideoUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    posterSrc: getCloudinaryPosterUrl('https://res.cloudinary.com/dhouh9idx/video/upload/v1788450233/professional-creator-girl-before_rwmxsd.mp4'),
    accentColor: '#0EA5E9',
    tags: ['Tactical HUD', 'Sci-Fi Telemetry', 'Monospace Scan', 'Cybernetic'],
  },
];

export function getTypographyStyle(id: string): TypographyStyle {
  const found = TYPOGRAPHY_STYLES.find((s) => s.id === id);
  if (found) return found;

  // Aliases for backward compatibility
  if (id === 'prime-neon') return TYPOGRAPHY_STYLES.find((s) => s.id === 'neon-kinetic') || TYPOGRAPHY_STYLES[0];
  if (id === 'agent-tour') return TYPOGRAPHY_STYLES.find((s) => s.id === 'depth-3d-text') || TYPOGRAPHY_STYLES[0];
  if (id === 'purple-chrome') return TYPOGRAPHY_STYLES.find((s) => s.id === 'silver-chrome') || TYPOGRAPHY_STYLES[0];

  return TYPOGRAPHY_STYLES[0];
}

const TARGET_PREVIEW_DURATION = 5.0; // Exact 5 seconds continuous loop

/**
 * Pure Video-First Style Card:
 * - Displays the pure visual video demo without any text, names, descriptions, or badges.
 * - Renders lightweight poster image when inactive.
 * - Mounts and plays video on hover/tap for 5 seconds in a seamless loop.
 * - Shows a sleek glowing border and checkmark when selected.
 */
function ReelVideoCard({
  style,
  isSelected,
  isPreviewPlaying,
  onStartHover,
  onEndHover,
  onSelect,
}: {
  style: TypographyStyle;
  isSelected: boolean;
  isPreviewPlaying: boolean;
  onStartHover: () => void;
  onEndHover: () => void;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  // Exact 5.0s loop control and time tracking
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    if (current >= TARGET_PREVIEW_DURATION) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setProgressPercent(0);
    } else {
      setProgressPercent((current / TARGET_PREVIEW_DURATION) * 100);
    }
  };

  useEffect(() => {
    if (isPreviewPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setProgressPercent(0);
    } else if (!isPreviewPlaying && videoRef.current) {
      videoRef.current.pause();
      setProgressPercent(0);
    }
  }, [isPreviewPlaying]);

  return (
    <div
      onMouseEnter={onStartHover}
      onMouseLeave={onEndHover}
      onClick={onSelect}
      className={`group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
        isSelected
          ? 'border-2 border-cyan-400 ring-4 ring-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.45)] scale-[1.02] z-10'
          : 'border-white/10 bg-zinc-950 hover:border-cyan-400/50 hover:scale-[1.01] shadow-lg'
      }`}
      style={{ aspectRatio: '9 / 16' }}
    >
      {/* ── Background Media: Video or Poster ── */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-950">
        {isPreviewPlaying ? (
          <video
            ref={videoRef}
            src={style.videoSrc}
            poster={style.posterSrc}
            autoPlay
            muted={isMuted}
            loop={false}
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
              }
            }}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={style.posterSrc}
            alt="Typography Style Preview"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.opacity = '0.3';
            }}
          />
        )}

        {/* 5-Second Playback Progress Bar */}
        {isPreviewPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 z-20 overflow-hidden pointer-events-none">
            <div
              className="h-full bg-cyan-400 transition-[width] duration-100 ease-linear shadow-[0_0_8px_#22d3ee]"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Minimal Corner Controls ── */}
      <div className="relative z-10 flex w-full items-center justify-between p-2.5 pointer-events-none">
        {/* Audio Mute/Unmute Toggle */}
        <div className="pointer-events-auto">
          {isPreviewPlaying && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? 'Unmute preview sound' : 'Mute preview sound'}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/75 border border-white/20 text-white hover:border-cyan-400 hover:text-cyan-300 transition backdrop-blur-md"
            >
              {isMuted ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Selection Checkmark Indicator */}
        {isSelected ? (
          <div className="flex items-center gap-1 rounded-full bg-cyan-400 px-2 py-0.5 text-black shadow-lg ring-2 ring-black/40">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.5L5 9L9.5 3.5" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-wider">Active</span>
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full border border-white/20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" />
        )}
      </div>

      {/* ── Centered Play Indicator on Inactive Hover ── */}
      {!isPreviewPlaying && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white/90 shadow-xl backdrop-blur-md opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

type TypographyStylePickerProps = {
  value: string;
  onChange: (value: TypographyStyleId) => void;
};

export function TypographyStylePicker({ value, onChange }: TypographyStylePickerProps) {
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TypographyCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES: { id: TypographyCategory; label: string }[] = [
    { id: 'all', label: 'All Styles' },
    { id: 'kinetic', label: 'Viral & Kinetic' },
    { id: 'luxury', label: 'Luxury & Editorial' },
    { id: 'depth', label: '3D & Depth' },
    { id: 'minimal', label: 'Minimal & Studio' },
  ];

  const filteredStyles = TYPOGRAPHY_STYLES.filter((style) => {
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative rounded-3xl border border-cyan-500/20 bg-zinc-950/90 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      {/* ── Header with Count & Subtext ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
            Typography Style Library
          </h3>
          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
            {TYPOGRAPHY_STYLES.length} Styles
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Click any style to preview or apply to your video ☝️
        </span>
      </div>

      {/* ── Filter Bar & Search ── */}
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? TYPOGRAPHY_STYLES.length
                : TYPOGRAPHY_STYLES.filter((s) => s.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] font-bold'
                    : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] ${
                    isActive ? 'bg-black/30 text-black' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instant Search Bar */}
        <div className="relative min-w-[200px] sm:w-56">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search styles..."
            className="w-full rounded-full border border-white/10 bg-zinc-900/90 py-1.5 pl-8 pr-7 text-xs text-white placeholder-zinc-500 transition-all focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Pure Video-First Style Grid ── */}
      {filteredStyles.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
          {filteredStyles.map((style) => (
            <ReelVideoCard
              key={style.id}
              style={style}
              isSelected={value === style.id}
              isPreviewPlaying={activePreviewId === style.id}
              onStartHover={() => setActivePreviewId(style.id)}
              onEndHover={() => {
                if (activePreviewId === style.id) {
                  setActivePreviewId(null);
                }
              }}
              onSelect={() => onChange(style.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-semibold text-zinc-400">No typography styles matched "{searchQuery}"</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-2 text-xs font-bold text-cyan-400 hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
