import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  staticFile,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {PremiumAudioLayer, type PremiumSoundCue, type PremiumStyleLock} from '../../components/PremiumAudioLayer';
import {PremiumVisualTreatment, type PremiumVisualStyleLock} from '../../components/PremiumVisualTreatment';
import {resolveFont} from '../../utils/fonts';
import {DEFAULT_FPS, secondsToFrames} from '../../constants';

// Self-hosted fonts (Lambda-safe). Titles/VS use a heavy display face; captions/handle a clean sans.
const DISPLAY_FONT = resolveFont('Anton');
const TEXT_FONT = resolveFont('Montserrat');

type CompareImageInput = string | {url?: string; src?: string; imageUrl?: string};

type CompareOverlay = {
  start?: number;
  end?: number;
  text?: string;
  body?: string;
  title?: string;
  stickerPose?: string;
  pose?: string;
};

type CompareCaption = {
  start?: number;
  end?: number;
  text?: string;
  lines?: string[];
};

type CompareProps = {
  audioUrl?: string;
  mediaUrl?: string;
  sourceAudioUrl?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  renderWindowSeconds?: number;

  comparisonImageUrls?: string[];
  comparisonImages?: CompareImageInput[];

  compareLeftTitle?: string;
  compareRightTitle?: string;
  leftTitle?: string;
  rightTitle?: string;

  creatorHandle?: string;
  // Visual theme + comparison tone + optional winner highlight
  themeId?: 'light' | 'dark' | 'bold' | string;
  tone?: 'versus' | 'goodBad' | string;
  winner?: 'left' | 'right' | 'none' | string;
  imageStyle?: 'rounded' | 'circle' | 'phone' | 'tilted' | 'polaroid' | string;
  stickerStyle?: '2d' | 'cartoon' | 'explainer' | string;
  stickerScale?: number;
  stickerOffsetX?: number;
  stickerOffsetY?: number;

  overlayTimeline?: CompareOverlay[];
  captions?: CompareCaption[];
  transcriptSegments?: CompareCaption[];
  segments?: CompareCaption[];
  transcript?: string;
  sourceScript?: string;
  topicTitle?: string;
  premiumEditing?: boolean;
  styleLock?: PremiumStyleLock & PremiumVisualStyleLock;
  soundCues?: PremiumSoundCue[];
};

const STICKER_SETS = {
  'character-1': {
    welcome: '/assets/stickman/compare_characters/character-1/normal.png',
    left: '/assets/stickman/compare_characters/character-1/left.png',
    right: '/assets/stickman/compare_characters/character-1/right.png',
    thinking: '/assets/stickman/compare_characters/character-1/normal.png',
    warning: '/assets/stickman/compare_characters/character-1/normal.png',
    success: '/assets/stickman/compare_characters/character-1/normal.png',
  },
  'character-2': {
    welcome: '/assets/stickman/compare_characters/character-2/normal.png',
    left: '/assets/stickman/compare_characters/character-2/left.png',
    right: '/assets/stickman/compare_characters/character-2/right.png',
    thinking: '/assets/stickman/compare_characters/character-2/normal.png',
    warning: '/assets/stickman/compare_characters/character-2/normal.png',
    success: '/assets/stickman/compare_characters/character-2/normal.png',
  },
  'character-3': {
    welcome: '/assets/stickman/compare_characters/character-3/normal.png',
    left: '/assets/stickman/compare_characters/character-3/left.png',
    right: '/assets/stickman/compare_characters/character-3/right.png',
    thinking: '/assets/stickman/compare_characters/character-3/normal.png',
    warning: '/assets/stickman/compare_characters/character-3/normal.png',
    success: '/assets/stickman/compare_characters/character-3/normal.png',
  },
  'character-4': {
    welcome: '/assets/stickman/compare_characters/character-4/normal.png',
    left: '/assets/stickman/compare_characters/character-4/left.png',
    right: '/assets/stickman/compare_characters/character-4/right.png',
    thinking: '/assets/stickman/compare_characters/character-4/normal.png',
    warning: '/assets/stickman/compare_characters/character-4/normal.png',
    success: '/assets/stickman/compare_characters/character-4/normal.png',
  },
  'casual-guy-3d': {
    welcome: '/visuals/compare_explainer/casual-guy-3d.jpg',
    left: '/visuals/compare_explainer/casual-guy-3d.jpg',
    right: '/visuals/compare_explainer/casual-guy-3d.jpg',
    thinking: '/visuals/compare_explainer/casual-guy-3d.jpg',
    warning: '/visuals/compare_explainer/casual-guy-3d.jpg',
    success: '/visuals/compare_explainer/casual-guy-3d.jpg',
  },
  'doctor-pro-3d': {
    welcome: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    left: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    right: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    thinking: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    warning: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    success: '/visuals/compare_explainer/doctor-pro-3d.jpg',
  },
  'hijab-teacher-3d': {
    welcome: '/visuals/compare_explainer/hijab-teacher-3d.jpg',
    left: '/visuals/compare_explainer/hijab-teacher-3d.jpg',
    right: '/visuals/compare_explainer/hijab-teacher-3d.jpg',
    thinking: '/visuals/compare_explainer/hijab-teacher-3d.jpg',
    warning: '/visuals/compare_explainer/hijab-teacher-3d.jpg',
    success: '/visuals/compare_explainer/hijab-teacher-3d.jpg',
  },
  'action-hero-3d': {
    welcome: '/visuals/compare_explainer/action-hero-3d.jpg',
    left: '/visuals/compare_explainer/action-hero-3d.jpg',
    right: '/visuals/compare_explainer/action-hero-3d.jpg',
    thinking: '/visuals/compare_explainer/action-hero-3d.jpg',
    warning: '/visuals/compare_explainer/action-hero-3d.jpg',
    success: '/visuals/compare_explainer/action-hero-3d.jpg',
  },
  'genz-creator-3d': {
    welcome: '/visuals/compare_explainer/genz-creator-3d.jpg',
    left: '/visuals/compare_explainer/genz-creator-3d.jpg',
    right: '/visuals/compare_explainer/genz-creator-3d.jpg',
    thinking: '/visuals/compare_explainer/genz-creator-3d.jpg',
    warning: '/visuals/compare_explainer/genz-creator-3d.jpg',
    success: '/visuals/compare_explainer/genz-creator-3d.jpg',
  },
  'student-researcher-3d': {
    welcome: '/visuals/compare_explainer/student-researcher-3d.jpg',
    left: '/visuals/compare_explainer/student-researcher-3d.jpg',
    right: '/visuals/compare_explainer/student-researcher-3d.jpg',
    thinking: '/visuals/compare_explainer/student-researcher-3d.jpg',
    warning: '/visuals/compare_explainer/student-researcher-3d.jpg',
    success: '/visuals/compare_explainer/student-researcher-3d.jpg',
  },
  'kid-and-dog-3d': {
    welcome: '/visuals/compare_explainer/kid-and-dog-3d.jpg',
    left: '/visuals/compare_explainer/kid-and-dog-3d.jpg',
    right: '/visuals/compare_explainer/kid-and-dog-3d.jpg',
    thinking: '/visuals/compare_explainer/kid-and-dog-3d.jpg',
    warning: '/visuals/compare_explainer/kid-and-dog-3d.jpg',
    success: '/visuals/compare_explainer/kid-and-dog-3d.jpg',
  },
  'young-creator-3d': {
    welcome: '/visuals/compare_explainer/young-creator-3d.jpg',
    left: '/visuals/compare_explainer/young-creator-3d.jpg',
    right: '/visuals/compare_explainer/young-creator-3d.jpg',
    thinking: '/visuals/compare_explainer/young-creator-3d.jpg',
    warning: '/visuals/compare_explainer/young-creator-3d.jpg',
    success: '/visuals/compare_explainer/young-creator-3d.jpg',
  },
  'arab-boy-3d': {
    welcome: '/visuals/compare_explainer/arab-boy-3d.jpg',
    left: '/visuals/compare_explainer/arab-boy-3d.jpg',
    right: '/visuals/compare_explainer/arab-boy-3d.jpg',
    thinking: '/visuals/compare_explainer/arab-boy-3d.jpg',
    warning: '/visuals/compare_explainer/arab-boy-3d.jpg',
    success: '/visuals/compare_explainer/arab-boy-3d.jpg',
  },
  '3d-presenter-man': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-welcome.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-left.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-right.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-thinking.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-warning.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/3d-presenter-man/teacher-success.png',
  },
  '2d-presenter-man': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-welcome.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-left.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-right.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-thinking.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-warning.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-success.png',
  },
  explainer: {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/follow_va2q5r.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_bpwhjf.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_m7jftk.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/thinking-expression_byji0y.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/confused-expression_bv6y5t.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/explaining-comparison_vsa1pm.png',
    surprised: 'https://storage.googleapis.com/itnavideo-media-assets/confused-expression_bv6y5t.png',
    explaining: 'https://storage.googleapis.com/itnavideo-media-assets/explaining-comparison_vsa1pm.png',
    celebrating: 'https://storage.googleapis.com/itnavideo-media-assets/explaining-comparison_vsa1pm.png',
    comparing: 'https://storage.googleapis.com/itnavideo-media-assets/explaining-comparison_vsa1pm.png',
  },
  '2d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_kyluu4.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_ktwk5b.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_tb29qr.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_inn0yf.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_iiwd2l.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_db4evw.png',
  },
  cartoon: {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_sjcy1r.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_bunomk.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_xr5hay.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_c3khzq.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_iv4upv.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_dvy0cc.png',
  },
  'girl-teacher': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_kyluu4.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_ktwk5b.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_tb29qr.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_inn0yf.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_iiwd2l.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_db4evw.png',
  },
  'girl-teacher-3d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_kyluu4.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_ktwk5b.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_tb29qr.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_inn0yf.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_iiwd2l.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_db4evw.png',
  },
  'grandpa-teacher-3d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_sjcy1r.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_bunomk.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_xr5hay.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_c3khzq.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_iv4upv.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_dvy0cc.png',
  },
  'young-presenter-3d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_dacv9l.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_te40rz.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_jzbeqy.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_wsfaez.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_gp48r7.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_fqpcdh.png',
  },
  'teacher-2d-pro': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_ncwgmb.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_flqzkv.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_eo6jvh.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_yvmnhx.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_bu3umj.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_ivvs73.png',
  },
  'chibi-boy-3d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_znwyxb.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_xtxtru.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_fa6nod.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_zxhrne.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_bhiq6f.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_bllvr8.png',
  },
  'corporate-woman-3d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_bzk5ci.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_jpgbbz.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_ghnb3q.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_lz2muv.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_n0wskt.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_k74q00.png',
  },
  'indian-teacher-woman': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_rh3u14.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_j91eib.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_dycbqb.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_j6v7ei.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_deetfg.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_b8trqq.png',
  },
  'doctor-3d-half': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_ouesss.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_ickwyy.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_lyohoe.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_f6styf.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_jonj5e.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_ca1oo5.png',
  },
  'banker-3d-half': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_k5vjsq.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_qwszxp.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_p6wt4c.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_oltui7.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_h8xcvs.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_mgw6t7.png',
  },
  'news-anchor-3d-half': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_sjzeku.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_awz9o7.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_etvpwj.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_rrmto6.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_rvqzue.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_moan7e.png',
  },
  'lawyer-girl-3d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_lbbsiz.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_juciof.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_ou0nmp.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_jgxnwo.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_jb7yfx.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_frbnix.png',
  },
  'shia-moulana-3d': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-welcome_ji20db.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-left_c9s7s1.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-right_e2zb8t.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-thinking_rwcasc.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-warning_lg27hi.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/teacher-success_ynaf6z.png',
  },
  '2d-sketch-artist': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-welcome.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-left.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-right.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-thinking.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-warning.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-success.png',
  },
  '2d-vector-creator': {
    welcome: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-welcome.png',
    left: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-left.png',
    right: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-right.png',
    thinking: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-thinking.png',
    warning: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-warning.png',
    success: 'https://storage.googleapis.com/itnavideo-media-assets/Templates/Compare-Explainer/Characters/2d-presenter-man/teacher-success.png',
  },
  'doctor-pro-real': {
    welcome: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    left: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    right: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    thinking: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    warning: '/visuals/compare_explainer/doctor-pro-3d.jpg',
    success: '/visuals/compare_explainer/doctor-pro-3d.jpg',
  },
  'student-researcher-real': {
    welcome: '/visuals/compare_explainer/student-researcher-3d.jpg',
    left: '/visuals/compare_explainer/student-researcher-3d.jpg',
    right: '/visuals/compare_explainer/student-researcher-3d.jpg',
    thinking: '/visuals/compare_explainer/student-researcher-3d.jpg',
    warning: '/visuals/compare_explainer/student-researcher-3d.jpg',
    success: '/visuals/compare_explainer/student-researcher-3d.jpg',
  },
  'tech-founder-real': {
    welcome: '/visuals/compare_explainer/casual-guy-3d.jpg',
    left: '/visuals/compare_explainer/casual-guy-3d.jpg',
    right: '/visuals/compare_explainer/casual-guy-3d.jpg',
    thinking: '/visuals/compare_explainer/casual-guy-3d.jpg',
    warning: '/visuals/compare_explainer/casual-guy-3d.jpg',
    success: '/visuals/compare_explainer/casual-guy-3d.jpg',
  },
} as const;

type StickerSet = Record<'welcome' | 'left' | 'right' | 'thinking' | 'warning' | 'success', string> & Partial<Record<'surprised' | 'explaining' | 'celebrating' | 'comparing', string>>;

// Sticker body type determines sizing in the render
type StickerBodyType = 'full_body' | 'half_body' | 'upper_body';

const STICKER_BODY_TYPE: Record<string, StickerBodyType> = {
  'character-1': 'full_body',
  'character-2': 'full_body',
  'character-3': 'full_body',
  'character-4': 'full_body',
  'casual-guy-3d': 'full_body',
  'doctor-pro-3d': 'half_body',
  'hijab-teacher-3d': 'full_body',
  'action-hero-3d': 'full_body',
  'genz-creator-3d': 'full_body',
  'student-researcher-3d': 'full_body',
  'kid-and-dog-3d': 'full_body',
  'young-creator-3d': 'full_body',
  'arab-boy-3d': 'full_body',
  '2d-sketch-artist': 'full_body',
  '2d-vector-creator': 'full_body',
  'doctor-pro-real': 'half_body',
  'student-researcher-real': 'full_body',
  'tech-founder-real': 'full_body',
  '2d': 'full_body',
  'cartoon': 'full_body',
  'explainer': 'full_body',
  'girl-teacher': 'full_body',
  'girl-teacher-3d': 'full_body',
  'grandpa-teacher-3d': 'half_body',
  'young-presenter-3d': 'full_body',
  'teacher-2d-pro': 'full_body',
  'chibi-boy-3d': 'full_body',
  'corporate-woman-3d': 'full_body',
  'indian-teacher-woman': 'full_body',
  'doctor-3d-half': 'half_body',
  'banker-3d-half': 'half_body',
  'news-anchor-3d-half': 'half_body',
  'lawyer-girl-3d': 'full_body',
  'shia-moulana-3d': 'full_body',
  '3d-presenter-man': 'full_body',
  '2d-presenter-man': 'full_body',
};

// Size config per body type — sized for strong mobile visibility in 1080x1920 reels without clipping head
const STICKER_SIZE_CONFIG: Record<StickerBodyType, {width: number; maxHeight: number; scale: number}> = {
  full_body: {width: 640, maxHeight: 760, scale: 1.0},
  half_body: {width: 680, maxHeight: 720, scale: 1.0},
  upper_body: {width: 700, maxHeight: 680, scale: 1.0},
};

const COMPARE_LAYOUT = {
  handleTop: 50,
  titleTop: 110,
  titleHeight: 88,
  imageTop: 220,
  imageHeight: 420,
  captionTop: 670,
  captionHeight: 125,
  stickerTop: 840,
  stickerBottom: 0,
} as const;

// --- Visual themes (background + caption + handle styling) ---
type CompareTheme = {
  background: string;
  dots: [string, string];
  dotsOpacity: number;
  glow: string;
  handle: string;
  captionBg: string;
  captionText: string;
  captionBorder: string;
  bottomFade: string;
  boxBg: string;
  hookBg: string;
  hookText: string;
  hookSub: string;
};

const COMPARE_THEMES: Record<string, CompareTheme> = {
  light: {
    background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 30%, #f0f4ff 70%, #e8eeff 100%)',
    dots: ['#5B6FFF', '#9B82FF'],
    dotsOpacity: 0.03,
    glow: 'rgba(91,111,255,0.08)',
    handle: '#64748b',
    captionBg: 'rgba(255,255,255,0.92)',
    captionText: '#0f172a',
    captionBorder: 'rgba(61,82,255,0.15)',
    bottomFade: 'rgba(232,238,255,0.95)',
    boxBg: '#ffffff',
    hookBg: 'linear-gradient(160deg, #eef2ff 0%, #ffffff 55%, #e8eeff 100%)',
    hookText: '#0f172a',
    hookSub: '#475569',
  },
  dark: {
    background: 'linear-gradient(180deg, #0B1120 0%, #131C31 45%, #0B1120 100%)',
    dots: ['#3D52FF', '#7C5CFC'],
    dotsOpacity: 0.07,
    glow: 'rgba(124,92,252,0.14)',
    handle: '#64748b',
    captionBg: 'rgba(15,23,42,0.86)',
    captionText: '#f1f5f9',
    captionBorder: 'rgba(255,255,255,0.14)',
    bottomFade: 'rgba(8,12,22,0.96)',
    boxBg: '#0f172a',
    hookBg: 'linear-gradient(160deg, #0B1120 0%, #1E293B 60%, #0B1120 100%)',
    hookText: '#ffffff',
    hookSub: '#94a3b8',
  },
  bold: {
    background: 'linear-gradient(180deg, #1E1B4B 0%, #312E81 48%, #4C1D95 100%)',
    dots: ['#A78BFA', '#F0ABFC'],
    dotsOpacity: 0.06,
    glow: 'rgba(167,139,250,0.18)',
    handle: '#c4b5fd',
    captionBg: 'rgba(255,255,255,0.95)',
    captionText: '#1E1B4B',
    captionBorder: 'rgba(167,139,250,0.4)',
    bottomFade: 'rgba(30,27,75,0.95)',
    boxBg: '#ffffff',
    hookBg: 'linear-gradient(160deg, #312E81 0%, #4C1D95 60%, #1E1B4B 100%)',
    hookText: '#ffffff',
    hookSub: '#ddd6fe',
  },
};

// --- Comparison tone (per-side accent colors) ---
type SideColor = {main: string; soft: string; glowPrefix: string; shadow: string};
const COMPARE_TONES: Record<string, {left: SideColor; right: SideColor}> = {
  // Neutral "A vs B" — both sides feel equal/positive
  versus: {
    left: {main: '#3D52FF', soft: '#5B6FFF', glowPrefix: 'rgba(61,82,255,', shadow: 'rgba(61,82,255,0.15)'},
    right: {main: '#7C5CFC', soft: '#9B82FF', glowPrefix: 'rgba(124,92,252,', shadow: 'rgba(124,92,252,0.15)'},
  },
  // Good vs bad — green (recommended) vs red (avoid)
  goodBad: {
    left: {main: '#16A34A', soft: '#22C55E', glowPrefix: 'rgba(22,163,74,', shadow: 'rgba(22,163,74,0.16)'},
    right: {main: '#DC2626', soft: '#F87171', glowPrefix: 'rgba(220,38,38,', shadow: 'rgba(220,38,38,0.16)'},
  },
};

const resolveTheme = (id?: string): CompareTheme => COMPARE_THEMES[String(id || 'light')] || COMPARE_THEMES.light;
const resolveTone = (id?: string) => COMPARE_TONES[String(id || 'versus')] || COMPARE_TONES.versus;

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const getTitleFontSize = (title: string) => {
  const len = (title || '').trim().length;
  if (len > 32) return 26;
  if (len > 22) return 30;
  if (len > 14) return 36;
  return 42;
};

const getHookTitleFontSize = (title: string) => {
  const len = (title || '').trim().length;
  if (len > 24) return 50;
  if (len > 16) return 64;
  if (len > 10) return 78;
  return 92;
};

const resolveAsset = (value: string) => {
  if (!value) return staticFile('assets/reusable/backgrounds/cinematic-studio-bg.png');
  const trimmed = value.trim();
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  return staticFile(trimmed.replace(/^\/+/, ''));
};

const pickImage = (input?: CompareImageInput) => {
  if (!input) return '';
  if (typeof input === 'string') return input;
  return input.url || input.src || input.imageUrl || '';
};

const cleanText = (value: string, max = 70) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
};

const getActiveOverlay = (items: CompareOverlay[] = [], frame: number, fps: number) => {
  const time = frame / fps;
  return items.find((item) => time >= Number(item.start || 0) && time <= Number(item.end || 999)) || items[0];
};

const getActiveCaption = (items: CompareCaption[] = [], frame: number, fps: number) => {
  const time = frame / fps;
  return items.find((item) => time >= Number(item.start || 0) && time <= Number(item.end || 999)) || items[0];
};


const makeShortSubtitle = (value: string) => {
  const words = cleanText(value, 78).split(/\s+/).filter(Boolean);

  if (words.length <= 5) return words.join(' ');

  const maxWords = 6;
  const selected = words.slice(0, 12);
  const first = selected.slice(0, maxWords).join(' ');
  const second = selected.slice(maxWords, maxWords * 2).join(' ');

  return second ? `${first}\n${second}` : first;
};


function cleanHinglishSubtitle(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\bkaaphee\b/gi, "kaafi")
    .replace(/\bkyaa\b/gi, "kya")
    .replace(/\bsavaal\b/gi, "sawaal")
    .replace(/\brahataa\b/gi, "rehta")
    .replace(/\brahata\b/gi, "rehta")
    .replace(/\bmen\b/gi, "mein")
    .replace(/\bmein mein\b/gi, "mein")
    .replace(/\blogon ke man mein\b/gi, "logon ke mann mein")
    .replace(/\bSir\b/g, "sir")
    .replace(/[\u0900-\u097F]/g, "");
}

const getCaptionText = (
  overlay: CompareOverlay | undefined,
  caption: CompareCaption | undefined,
) => {
  // Empty-safe: only render real transcript/overlay text. No placeholder filler
  // (avoids an odd Hinglish line appearing on English or silent sections).
  const captionText = caption?.text || caption?.lines?.join(' ') || overlay?.text || overlay?.body || overlay?.title || '';
  const cleaned = cleanHinglishSubtitle(makeShortSubtitle(captionText));
  return cleaned.trim();
};

const VisualBox = ({
  image,
  side,
  colors,
  boxBg,
  isActive = false,
  isOppositeActive = false,
  imageStyle = 'rounded',
}: {
  image: string;
  side: 'left' | 'right';
  colors: SideColor;
  boxBg: string;
  isActive?: boolean;
  isOppositeActive?: boolean;
  imageStyle?: string;
}) => {
  const src = resolveAsset(image);
  const frame = useCurrentFrame();
  const imgZoom = 1 + Math.sin(frame / 120 + (side === 'right' ? 1.5 : 0)) * 0.015;
  const glowOpacity = isActive ? 0.22 + Math.sin(frame / 18) * 0.08 : 0;
  const activeScale = isActive ? 1.04 : isOppositeActive ? 0.98 : 1;
  const activeOpacity = isOppositeActive ? 0.74 : 1;
  const activeFilter = isOppositeActive ? 'saturate(0.85) brightness(0.92)' : 'none';

  // Frame style configurations
  const frameStyles: Record<string, React.CSSProperties> = {
    rounded: {
      borderRadius: 24,
      border: `4px solid ${isActive ? colors.main : colors.soft}`,
      overflow: 'hidden',
    },
    circle: {
      borderRadius: '50%',
      border: `5px solid ${isActive ? colors.main : colors.soft}`,
      overflow: 'hidden',
      width: 380,
      height: 380,
    },
    phone: {
      borderRadius: 36,
      border: `8px solid #1E293B`,
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.1)',
    },
    tilted: {
      borderRadius: 16,
      border: `3px solid ${isActive ? colors.main : colors.soft}`,
      overflow: 'hidden',
      transform: `scale(${activeScale}) perspective(800px) rotateY(${side === 'left' ? 5 : -5}deg) rotateX(2deg)`,
    },
    polaroid: {
      borderRadius: 6,
      border: 'none',
      overflow: 'hidden',
      background: '#FFFFFF',
      padding: '12px 12px 52px 12px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.1)',
    },
  };

  const currentFrame = frameStyles[imageStyle] || frameStyles.rounded;
  const isCircle = imageStyle === 'circle';
  const isPolaroid = imageStyle === 'polaroid';
  const isTilted = imageStyle === 'tilted';
  const boxWidth = isCircle ? 380 : 488;
  const boxHeight = isCircle ? 380 : COMPARE_LAYOUT.imageHeight;

  return (
    <div
      style={{
        position: 'relative',
        width: boxWidth,
        height: boxHeight,
        background: isPolaroid ? '#FFFFFF' : boxBg,
        boxShadow: isActive
          ? `0 20px 48px ${colors.glowPrefix}0.42), 0 0 0 3px ${colors.main}`
          : `0 12px 32px ${colors.shadow}, 0 4px 12px rgba(0,0,0,0.08)`,
        transform: isTilted ? currentFrame.transform : `scale(${activeScale})`,
        opacity: activeOpacity,
        filter: activeFilter,
        transition: 'transform 0.3s, box-shadow 0.3s, opacity 0.3s',
        ...currentFrame,
        ...(isTilted ? {} : { transform: `scale(${activeScale})` }),
      }}
    >
      {/* Phone notch */}
      {imageStyle === 'phone' && (
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 60, height: 6, borderRadius: 3, background: '#334155', zIndex: 5 }} />
      )}

      {/* Main image */}
      <div
        style={{
          position: 'absolute',
          inset: isPolaroid ? '12px 12px 52px 12px' : isCircle ? 0 : 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isPolaroid ? '#F8FAFC' : isCircle ? 'transparent' : '#0B1120',
          borderRadius: isCircle ? '50%' : isPolaroid ? 4 : 14,
          overflow: 'hidden',
        }}
      >
        {/* Adaptive blurred backdrop to eliminate empty letterbox gutters */}
        {!isCircle && (
          <Img
            src={src}
            style={{
              position: 'absolute',
              inset: -24,
              width: 'calc(100% + 48px)',
              height: 'calc(100% + 48px)',
              objectFit: 'cover',
              objectPosition: 'center center',
              filter: 'blur(22px) brightness(0.55) saturate(1.25)',
              transform: 'scale(1.2)',
              opacity: 0.85,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Sharp foreground contained image */}
        <Img
          src={src}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            objectFit: isCircle ? 'cover' : 'contain',
            objectPosition: 'center center',
            transform: `scale(${imgZoom})`,
            filter: isCircle ? 'none' : 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))',
          }}
        />
      </div>

      {/* Polaroid label */}
      {isPolaroid && (
        <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 20, fontWeight: 800, color: '#1E293B', fontFamily: 'Georgia, serif' }}>
          {side === 'left' ? 'Option A' : 'Option B'}
        </div>
      )}

      {/* Corner badge (skip for polaroid/circle) */}
      {imageStyle !== 'polaroid' && imageStyle !== 'circle' && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            [side]: 12,
            width: 36,
            height: 36,
            borderRadius: 10,
            background: colors.main,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 4,
          }}
        >
          {side === 'left' ? 'A' : 'B'}
        </div>
      )}

      {/* Active glow overlay */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: isCircle ? '50%' : isPolaroid ? 6 : 16,
          background: `radial-gradient(ellipse at center, ${colors.glowPrefix}${glowOpacity}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};


const STICKER_POSES = {
  welcome: 'sticker_welcome_intro_explainer',
  leftSideExplainer: 'sticker_pointing_left_side_explainer',
  rightSideExplainer: 'sticker_pointing_right_side_explainer',
  thinking: 'sticker_thinking_analysis_explainer',
  warning: 'sticker_warning_issue_explainer',
  success: 'sticker_success_conclusion_explainer',
  surprised: 'sticker_questioning_surprised_explainer',
  explaining: 'sticker_general_explaining_key_point',
  celebrating: 'sticker_happy_celebrating_outro',
  comparing: 'sticker_comparing_both_sides_explainer',
} as const;

type StickerPoseKey = typeof STICKER_POSES[keyof typeof STICKER_POSES];

const STICKER_POSE_ASSET_ALIASES: Record<string, keyof StickerSet> = {
  sticker_welcome: 'welcome',
  sticker_welcome_intro_explainer: 'welcome',
  sticker_left: 'left',
  sticker_right: 'right',
  left: 'left',
  right: 'right',
  sticker_pointing_left_side_explainer: 'left',
  sticker_pointing_right_side_explainer: 'right',
  welcome: 'welcome',
  sticker_thinking_analysis_explainer: 'thinking',
  thinking: 'thinking',
  sticker_warning_issue_explainer: 'warning',
  warning: 'warning',
  sticker_success_conclusion_explainer: 'success',
  success: 'success',
  sticker_questioning_surprised_explainer: 'surprised',
  surprised: 'thinking',
  sticker_general_explaining_key_point: 'explaining',
  explaining: 'success',
  sticker_happy_celebrating_outro: 'celebrating',
  celebrating: 'success',
  sticker_comparing_both_sides_explainer: 'comparing',
  comparing: 'thinking',
};

const CANONICAL_POSE_ALIASES: Record<string, StickerPoseKey> = {
  welcome: STICKER_POSES.welcome,
  sticker_welcome: STICKER_POSES.welcome,
  sticker_welcome_intro_explainer: STICKER_POSES.welcome,
  sticker_left: STICKER_POSES.leftSideExplainer,
  left: STICKER_POSES.leftSideExplainer,
  sticker_pointing_left_side_explainer: STICKER_POSES.leftSideExplainer,
  sticker_right: STICKER_POSES.rightSideExplainer,
  right: STICKER_POSES.rightSideExplainer,
  sticker_pointing_right_side_explainer: STICKER_POSES.rightSideExplainer,
  thinking: STICKER_POSES.thinking,
  sticker_thinking_analysis_explainer: STICKER_POSES.thinking,
  warning: STICKER_POSES.warning,
  sticker_warning_issue_explainer: STICKER_POSES.warning,
  success: STICKER_POSES.success,
  sticker_success_conclusion_explainer: STICKER_POSES.success,
  surprised: STICKER_POSES.surprised,
  sticker_questioning_surprised_explainer: STICKER_POSES.surprised,
  explaining: STICKER_POSES.explaining,
  sticker_general_explaining_key_point: STICKER_POSES.explaining,
  celebrating: STICKER_POSES.celebrating,
  sticker_happy_celebrating_outro: STICKER_POSES.celebrating,
  comparing: STICKER_POSES.comparing,
  sticker_comparing_both_sides_explainer: STICKER_POSES.comparing,
};

const normalizeStickerPoseId = (value?: string): StickerPoseKey | undefined => {
  const pose = String(value || '').trim().toLowerCase();
  if (!pose) return undefined;
  return CANONICAL_POSE_ALIASES[pose];
};

const resolveStickerAssetPose = (set: StickerSet, poseKey: StickerPoseKey): keyof StickerSet => {
  const setByKey = set as Record<string, string>;
  const exactAssetKey = STICKER_POSE_ASSET_ALIASES[poseKey];
  if (exactAssetKey && setByKey[exactAssetKey]) return exactAssetKey;

  // Fallback: map extended poses to basic poses that ALL sticker sets have
  const EXTENDED_TO_BASIC: Record<string, keyof StickerSet> = {
    explaining: 'success',      // explaining → success (confident pointing pose)
    celebrating: 'success',     // celebrating → success
    comparing: 'thinking',      // comparing → thinking (analytical pose)
    surprised: 'thinking',      // surprised → thinking
  };

  // Try the extended-to-basic fallback
  if (exactAssetKey && EXTENDED_TO_BASIC[exactAssetKey]) {
    const basicKey = EXTENDED_TO_BASIC[exactAssetKey];
    if (setByKey[basicKey]) return basicKey;
  }

  // Try legacy pose lookup
  const legacyPose = Object.entries(CANONICAL_POSE_ALIASES).find(([, canonical]) => canonical === poseKey)?.[0];
  if (legacyPose && setByKey[legacyPose]) return legacyPose as keyof StickerSet;

  // Final fallback based on pose intent
  if (poseKey.includes('left')) return 'left';
  if (poseKey.includes('right')) return 'right';
  if (poseKey.includes('warning') || poseKey.includes('issue')) return 'warning';
  if (poseKey.includes('success') || poseKey.includes('conclusion') || poseKey.includes('celebrating') || poseKey.includes('explaining')) return 'success';
  if (poseKey.includes('thinking') || poseKey.includes('comparing') || poseKey.includes('questioning')) return 'thinking';

  return 'welcome';
};

const normalizeForMatch = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s?]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const containsAny = (text: string, words: string[]) =>
  words.some((word) => {
    const clean = normalizeForMatch(word);
    return clean.length > 1 && text.includes(clean);
  });

/**
 * Intent-based sticker pose selection.
 *
 * The sticker acts as an active presenter who reacts to the script context.
 * Priority order (first match wins):
 *   1. Intro (first ~1.5s) → sticker_welcome_intro_explainer
 *   2. Outro (last ~2.8s) → sticker_happy_celebrating_outro
 *   3. Important rule / confidence keywords → sticker_general_explaining_key_point
 *   4. Warning / mistake keywords → sticker_warning_issue_explainer
 *   5. Question / confusion keywords → sticker_questioning_surprised_explainer or sticker_thinking_analysis_explainer
 *   6. Right-topic keywords → sticker_pointing_right_side_explainer
 *   7. Left-topic keywords → sticker_pointing_left_side_explainer
 *   8. Contextual fallback: alternate based on video progress (not rigid 3s)
 *
 * IMPORTANT: Keywords are chosen to be SPECIFIC enough that they don't trigger
 * on every caption. Common words like "kya", "difference", "compare" are avoided
 * as standalone triggers because they appear in nearly every Hinglish comparison.
 */
const getActiveStickerPose = ({
  currentTime,
  durationSeconds,
  overlay,
  caption,
  leftTitle,
  rightTitle,
}: {
  currentTime: number;
  durationSeconds: number;
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
}): StickerPoseKey => {
  const explicitPose = normalizeStickerPoseId(overlay?.stickerPose || overlay?.pose);
  if (explicitPose) return explicitPose;

  // Legacy jobs without a planned overlay still get a gentle intro/outro fallback.
  if (currentTime < 1.5) return STICKER_POSES.welcome;
  if (durationSeconds > 0 && currentTime >= Math.max(0, durationSeconds - 2.8)) return STICKER_POSES.celebrating;

  const text = normalizeForMatch(
    [
      overlay?.title,
      overlay?.text,
      overlay?.body,
      caption?.text,
      caption?.lines?.join(' '),
    ]
      .filter(Boolean)
      .join(' '),
  );

  const left = normalizeForMatch(leftTitle);
  const right = normalizeForMatch(rightTitle);

  // --- Intent keyword groups ---
  // RULE: Only use phrases/words that are SPECIFIC enough to indicate intent.
  // Avoid single common words that appear in every Hinglish comparison sentence.

  // Question/confusion: ONLY trigger on actual question patterns, not generic compare words
  const questionPhrases = [
    'what is the difference',
    'difference kya hai',
    'kya difference hai',
    'kya farq hai',
    'farq kya hai',
    'which is better',
    'kaunsa better hai',
    'kaunsa behtar',
    'konsa sahi hai',
    'which one should',
    'confused about',
    'socho zara',
    'think about it',
    'let me ask',
    'sawaal ye hai',
    'doubt hai',
    'samajh nahi aata',
    'confusing hai',
    'pata nahi',
    'how do we know',
    'kaise pata kare',
  ];

  // Left-side topic: the actual left title + contextual "first/pehla" phrases
  const leftPhrases = [
    left,
    `${left} ka matlab`,
    `${left} means`,
    `${left} hai`,
    'pehla option',
    'pehle wala',
    'first option',
    'first word',
    'first meaning',
    'iska matlab',
    'ye word',
    'yeh word',
    'this word means',
    'left side',
    'option a',
  ];

  // Right-side topic: the actual right title + contextual "second/dusra" phrases
  const rightPhrases = [
    right,
    `${right} ka matlab`,
    `${right} means`,
    `${right} hai`,
    'dusra option',
    'doosra wala',
    'second option',
    'second word',
    'second meaning',
    'uska matlab',
    'wo word',
    'woh word',
    'that word means',
    'right side',
    'option b',
    'on the other hand',
    'jabki ye',
    'lekin ye',
    'whereas this',
  ];

  // Warning/mistake: only specific warning language
  const warningPhrases = [
    'galat hai',
    'wrong answer',
    'wrong use',
    'mat karo',
    'avoid karo',
    'kabhi mat',
    'never use',
    'common mistake',
    'log galti',
    'ye galti',
    'careful here',
    'savdhan',
    'khabardar',
    'beware of',
    'warning',
    'danger',
    'scam',
    'fraud',
    'nuksan',
    'dhoka',
    'trap hai',
  ];

  // Success/conclusion: specific conclusion language
  const successPhrases = [
    'final answer',
    'sahi answer',
    'correct answer',
    'conclusion',
    'to sum up',
    'in short',
    'so basically',
    'toh basically',
    'yaad rakho',
    'remember this',
    'important rule',
    'rule hai ki',
    'simple rule',
    'easy trick',
    'asaan tarika',
    'shortcut hai',
    'ab samjh gaye',
    'clear hai na',
    'got it',
    'samajh gaye',
    'that is the answer',
    'yahi answer hai',
    'benefit hai',
    'profit hai',
    'winner hai',
    'best hai',
    'done',
    'thumbs up',
  ];

  // --- Priority-based intent matching ---

  // Has a question mark? Strong signal for surprised or thinking
  if (text.includes('?')) return STICKER_POSES.surprised;

  // Important rule / confident explanation → explaining (sticker points up with authority)
  if (containsAny(text, successPhrases)) return STICKER_POSES.explaining;

  // Warning / mistake → alert pose
  if (containsAny(text, warningPhrases)) return STICKER_POSES.warning;

  // Question / confusion → thinking pose (only specific question phrases)
  if (containsAny(text, questionPhrases)) return STICKER_POSES.thinking;

  // If BOTH titles appear in the same caption, it's likely an intro/comparison statement
  // → use comparing (hands weighing both options)
  const hasLeft = left.length > 1 && text.includes(left);
  const hasRight = right.length > 1 && text.includes(right);
  if (hasLeft && hasRight) return STICKER_POSES.comparing;

  // Talking about right-side topic → sticker points to the right-side comparison item.
  if (right.length > 1 && containsAny(text, rightPhrases)) return STICKER_POSES.rightSideExplainer;

  // Talking about left-side topic → sticker points to the left-side comparison item.
  if (left.length > 1 && containsAny(text, leftPhrases)) return STICKER_POSES.leftSideExplainer;

  // --- Smart contextual fallback ---
  // When no keywords match, use video progress zones to create a natural
  // presenter arc that follows the typical compare video structure:
  //   intro → explain left → compare → explain right → conclusion
  const progress = durationSeconds > 0 ? currentTime / durationSeconds : 0.5;

  if (progress < 0.12) {
    // Early section: intro zone → welcome
    return STICKER_POSES.welcome;
  } else if (progress < 0.28) {
    return STICKER_POSES.leftSideExplainer;
  } else if (progress < 0.55) {
    return STICKER_POSES.comparing;
  } else if (progress < 0.78) {
    return STICKER_POSES.rightSideExplainer;
  } else {
    return STICKER_POSES.success;
  }
};

const StickerPresenter = ({
  overlay,
  caption,
  leftTitle,
  rightTitle,
  stickerStyle,
  stickerScale = 1,
  stickerOffsetX = 0,
  stickerOffsetY = 0,
  customStickerSet,
}: {
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
  stickerStyle?: string;
  stickerScale?: number;
  stickerOffsetX?: number;
  stickerOffsetY?: number;
  customStickerSet?: StickerSet;
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const selectedStickerStyle =
    (stickerStyle && stickerStyle in STICKER_SETS) ? stickerStyle as keyof typeof STICKER_SETS : '3d-presenter-man';

  const set: StickerSet = customStickerSet || STICKER_SETS[selectedStickerStyle] || STICKER_SETS['3d-presenter-man'];

  const currentTime = frame / fps;
  const durationSeconds = durationInFrames / fps;

  const poseKey = getActiveStickerPose({
    currentTime,
    durationSeconds,
    overlay,
    caption,
    leftTitle,
    rightTitle,
  });

  // Bounce animation: detect pose transitions using time-based sampling.
  // Check the pose at a slightly earlier time to see if it differs from current.
  const checkBehindTime = Math.max(0, currentTime - 0.4);
  const prevPoseKey = getActiveStickerPose({
    currentTime: checkBehindTime,
    durationSeconds,
    overlay,
    caption,
    leftTitle,
    rightTitle,
  });

  // If pose just changed (current differs from 0.4s ago), trigger bounce
  const poseJustChanged = poseKey !== prevPoseKey;
  // Calculate how many frames into this pose segment we are
  // Use a simple spring from frame 0 when pose changes
  const poseDurationFrames = poseJustChanged ? Math.min(frame, 12) : 99;
  const poseBounce = poseDurationFrames < 12
    ? spring({frame: poseDurationFrames, fps, config: {damping: 7, mass: 0.4, stiffness: 180}})
    : 1;

  const resolvedPoseKey = resolveStickerAssetPose(set, poseKey);
  const src = (set as Record<string, string>)[resolvedPoseKey] || set.welcome;

  // Size based on sticker body type
  const bodyType = STICKER_BODY_TYPE[selectedStickerStyle] || 'full_body';
  const sizeConfig = STICKER_SIZE_CONFIG[bodyType];

  // Presenter remains centered in one lower-safe zone; direction is carried by the selected pose art.
  const STICKER_WIDTH = sizeConfig.width;
  const STICKER_MAX_HEIGHT = sizeConfig.maxHeight;
  const safeStickerScale = clampNumber(Number(stickerScale) || 1, 0.72, 1.05);
  const safeStickerOffsetX = clampNumber(Number(stickerOffsetX) || 0, -110, 110);
  const safeStickerOffsetY = clampNumber(Number(stickerOffsetY) || 0, -36, 46);

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Entrance: smooth spring scale-up
  const pop = interpolate(frame, [0, 8, 18, 28], [0.7, 1.05, 0.98, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Idle breathing — subtle but visible life pulse
  const breathCycle = frame / (1.5 * fps);
  const idleY = Math.sin(breathCycle) * 6;
  const breathScale = 1 + Math.sin(breathCycle) * 0.012; // subtle 1.2% scale pulse

  // Gentle head tilt — makes character feel expressive
  const rotate = Math.sin(frame / (2.33 * fps)) * 0.6;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: COMPARE_LAYOUT.stickerTop,
        bottom: COMPARE_LAYOUT.stickerBottom,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: enterOpacity,
        transform: `translate(${safeStickerOffsetX}px, ${safeStickerOffsetY + idleY}px) scale(${safeStickerScale * pop * breathScale}) rotate(${rotate}deg)`,
        transformOrigin: '50% 100%',
      }}
    >
      <Img
        src={resolveAsset(src)}
        alt="sticker presenter"
        style={{
          width: STICKER_WIDTH,
          maxHeight: STICKER_MAX_HEIGHT,
          objectFit: 'contain',
          filter: 'drop-shadow(0 18px 28px rgba(0,0,0,0.55)) drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
        }}
      />
    </div>
  );
};

const WinnerCrown = ({side}: {side: 'left' | 'right'}) => (
  <div
    style={{
      position: 'absolute',
      top: -24,
      [side === 'left' ? 'left' : 'right']: 12,
      fontSize: 32,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
      zIndex: 20,
    }}
  >
    👑
  </div>
);

// Full-screen opening hook card. Shown for first ~1.85s.
const OpeningCard = ({
  leftTitle,
  rightTitle,
  topic,
  theme,
  leftColor,
  rightColor,
  opacity,
}: {
  leftTitle: string;
  rightTitle: string;
  topic: string;
  theme: CompareTheme;
  leftColor: SideColor;
  rightColor: SideColor;
  opacity: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 12, mass: 0.4, stiffness: 150}, from: 0.86, to: 1});
  const leftSize = getHookTitleFontSize(leftTitle);
  const rightSize = getHookTitleFontSize(rightTitle);
  return (
    <AbsoluteFill
      style={{
        background: theme.hookBg,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        padding: 60,
        textAlign: 'center',
        transform: `scale(${pop})`,
      }}
    >
      <div style={{fontFamily: TEXT_FONT, fontSize: 30, fontWeight: 800, letterSpacing: 6, textTransform: 'uppercase', color: theme.hookSub, marginBottom: 26}}>
        Comparison
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: '100%', maxWidth: 960}}>
        <div style={{fontFamily: DISPLAY_FONT, fontSize: leftSize, lineHeight: 1.02, textTransform: 'uppercase', color: leftColor.main, letterSpacing: -1.5, wordBreak: 'break-word'}}>
          {leftTitle}
        </div>
        <div style={{fontFamily: DISPLAY_FONT, fontSize: 52, color: '#FF7A2F', letterSpacing: 2}}>VS</div>
        <div style={{fontFamily: DISPLAY_FONT, fontSize: rightSize, lineHeight: 1.02, textTransform: 'uppercase', color: rightColor.main, letterSpacing: -1.5, wordBreak: 'break-word'}}>
          {rightTitle}
        </div>
      </div>
      {topic ? (
        <div style={{fontFamily: TEXT_FONT, fontSize: 32, fontWeight: 700, color: theme.hookText, marginTop: 40, maxWidth: 840, lineHeight: 1.25}}>
          {topic}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const CONFETTI_PIECES = Array.from({length: 28}, (_, i) => {
  const seed = (i * 37) % 100;
  return {
    x: (i * 34) % 980 + 50,
    speed: 7 + (seed % 9),
    delay: (i * 2.5) % 20,
    size: 14 + (seed % 14),
    color: ['#FACC15', '#FF7A2F', '#38BDF8', '#4ADE80', '#F472B6', '#A78BFA', '#F59E0B'][i % 7],
    rotationSpeed: 5 + (seed % 10),
  };
});

const WinnerCelebrationRays = ({color}: {color: string}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: '38%',
        left: '50%',
        width: 820,
        height: 820,
        transform: `translate(-50%, -50%) rotate(${frame * 0.9}deg)`,
        background: `radial-gradient(circle, ${color}38 0%, transparent 68%)`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

const WinnerConfetti = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 12}}>
      {CONFETTI_PIECES.map((p, i) => {
        const activeFrame = Math.max(0, frame - p.delay);
        const y = (activeFrame * p.speed) % 1920;
        const rot = activeFrame * p.rotationSpeed;
        const opacity = interpolate(y, [0, 180, 1720, 1920], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.size,
              height: p.size * 0.6,
              borderRadius: 3,
              backgroundColor: p.color,
              transform: `rotate(${rot}deg) rotateX(${rot * 1.4}deg)`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// Full-screen closing card. Announces the winner (if set) and the follow CTA.
const ClosingCard = ({
  leftTitle,
  rightTitle,
  winner,
  handle,
  theme,
  leftColor,
  rightColor,
  opacity,
}: {
  leftTitle: string;
  rightTitle: string;
  winner: 'left' | 'right' | 'none';
  handle: string;
  theme: CompareTheme;
  leftColor: SideColor;
  rightColor: SideColor;
  opacity: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 13, mass: 0.4, stiffness: 150}, from: 0.9, to: 1});
  const winnerTitle = winner === 'left' ? leftTitle : winner === 'right' ? rightTitle : '';
  const winnerColor = winner === 'right' ? rightColor : leftColor;
  const winnerFontSize = getHookTitleFontSize(winnerTitle);
  return (
    <AbsoluteFill
      style={{
        background: theme.hookBg,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        padding: 60,
        textAlign: 'center',
        transform: `scale(${pop})`,
      }}
    >
      {winner !== 'none' ? (
        <>
          <WinnerCelebrationRays color={winnerColor.main} />
          <WinnerConfetti />
          <div style={{fontSize: 76, marginBottom: 8, zIndex: 10, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'}}>👑</div>
          <div style={{fontFamily: TEXT_FONT, fontSize: 30, fontWeight: 800, letterSpacing: 6, textTransform: 'uppercase', color: theme.hookSub, marginBottom: 18, zIndex: 10}}>
            Winner
          </div>
          <div style={{fontFamily: DISPLAY_FONT, fontSize: winnerFontSize, lineHeight: 1.02, textTransform: 'uppercase', color: winnerColor.main, letterSpacing: -1.5, zIndex: 10, maxWidth: 940, wordBreak: 'break-word'}}>
            {winnerTitle}
          </div>
        </>
      ) : (
        <>
          <div style={{fontFamily: TEXT_FONT, fontSize: 30, fontWeight: 800, letterSpacing: 6, textTransform: 'uppercase', color: theme.hookSub, marginBottom: 18}}>
            Which one wins?
          </div>
          <div style={{fontFamily: DISPLAY_FONT, fontSize: Math.min(68, getHookTitleFontSize(leftTitle)), lineHeight: 1.05, textTransform: 'uppercase', color: theme.hookText, letterSpacing: -1.5, maxWidth: 940, wordBreak: 'break-word'}}>
            <span style={{color: leftColor.main}}>{leftTitle}</span>
            <span style={{color: '#FF7A2F', margin: '0 18px'}}>vs</span>
            <span style={{color: rightColor.main}}>{rightTitle}</span>
          </div>
        </>
      )}
      <div
        style={{
          marginTop: 52,
          fontFamily: TEXT_FONT,
          fontSize: 38,
          fontWeight: 800,
          color: '#ffffff',
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F00 100%)',
          padding: '16px 44px',
          borderRadius: 999,
          boxShadow: '0 10px 30px rgba(255,107,53,0.35)',
          zIndex: 10,
        }}
      >
        Follow {handle}
      </div>
    </AbsoluteFill>
  );
};

export const CompareExplainer = (props: CompareProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const uploadedImages = (props.comparisonImageUrls && props.comparisonImageUrls.length)
    ? props.comparisonImageUrls
    : (((props.comparisonImages || (props as any).imageSources || []).map(pickImage).filter(Boolean)));

  const leftImage = uploadedImages[0] || 'assets/reusable/images/2d/budgeting.png';
  const rightImage = uploadedImages[1] || 'assets/reusable/images/2d/credit card debt.png';

  const leftTitle = cleanText(props.compareLeftTitle || props.leftTitle || 'Left', 40);
  const rightTitle = cleanText(props.compareRightTitle || props.rightTitle || 'Right', 40);
  const leftTitleFontSize = getTitleFontSize(leftTitle);
  const rightTitleFontSize = getTitleFontSize(rightTitle);

  // Theme + tone + optional winner
  const theme = resolveTheme(props.themeId);
  const tone = resolveTone(props.tone);
  const leftColor = tone.left;
  const rightColor = tone.right;
  const winner: 'left' | 'right' | 'none' =
    props.winner === 'left' || props.winner === 'right' ? props.winner : 'none';

  const audioUrl = props.audioUrl || props.mediaUrl || props.sourceAudioUrl || '';
  const activeOverlay = getActiveOverlay(props.overlayTimeline || [], frame, fps);
  const activeCaption = getActiveCaption(props.captions || props.transcriptSegments || props.segments || [], frame, fps);

  const caption = getCaptionText(activeOverlay, activeCaption);

  // Determine which image is "active" (being discussed) based on sticker pose
  const currentTime = frame / fps;
  const durationSeconds = Number(props.durationSeconds || props.sourceDurationSeconds || props.renderWindowSeconds || 45);

  // Opening hook card (first ~1.85s) and closing CTA card (last ~2.6s)
  const totalFrames = Math.max(1, secondsToFrames(durationSeconds, fps));
  const hookText = cleanText(props.topicTitle || '', 46);
  const hookDurationFrames = Math.round(1.85 * fps);
  const showHook = frame < hookDurationFrames;
  const hookOpacity = interpolate(
    frame,
    [0, Math.round(fps * 0.25), Math.round(fps * 1.5), hookDurationFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const closingStart = Math.max(totalFrames - Math.round(2.6 * fps), Math.round(totalFrames * 0.72));
  const showClosing = frame >= closingStart;
  const closingOpacity = interpolate(frame, [closingStart, closingStart + Math.round(fps * 0.4)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const currentPose = getActiveStickerPose({
    currentTime,
    durationSeconds,
    overlay: activeOverlay,
    caption: activeCaption,
    leftTitle,
    rightTitle,
  });
  const leftActive = currentPose === STICKER_POSES.leftSideExplainer;
  const rightActive = currentPose === STICKER_POSES.rightSideExplainer;

  const captionScale = spring({
    frame: frame % Math.round(3 * fps), // reset spring every ~3s for each new caption
    fps,
    config: {damping: 12, mass: 0.35, stiffness: 140},
    from: 0.92,
    to: 1,
  });

  // Entry animations for title labels
  const leftLabelEntry = spring({frame, fps, config: {damping: 13, mass: 0.4, stiffness: 130}, from: -1, to: 0});
  const rightLabelEntry = spring({frame: Math.max(0, frame - Math.round(fps * 0.13)), fps, config: {damping: 13, mass: 0.4, stiffness: 130}, from: 1, to: 0});

  // Image box slide-in
  const leftImageEntry = spring({frame: Math.max(0, frame - Math.round(fps * 0.26)), fps, config: {damping: 14, mass: 0.4, stiffness: 120}});
  const rightImageEntry = spring({frame: Math.max(0, frame - Math.round(fps * 0.4)), fps, config: {damping: 14, mass: 0.4, stiffness: 120}});

  const activeImageStyle = props.imageStyle || (props as any).compareImageStyle || 'rounded';

  // VS badge pop
  const vsBadgePop = spring({frame: Math.max(0, frame - Math.round(fps * 0.53)), fps, config: {damping: 8, mass: 0.3, stiffness: 200}});
  const vsPulse = 1 + Math.sin(frame / (fps * 1.33)) * 0.03; // subtle periodic pulse
  const shockwaveFrame = Math.max(0, frame - Math.round(fps * 0.53));
  const shockwaveScale = interpolate(shockwaveFrame, [0, 22], [0.8, 2.4], {extrapolateRight: 'clamp'});
  const shockwaveOpacity = interpolate(shockwaveFrame, [0, 4, 22], [0, 0.75, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: theme.background,
        fontFamily: TEXT_FONT,
        overflow: 'hidden',
      }}
    >
      {/* Subtle background pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: theme.dotsOpacity,
        background: `radial-gradient(circle at 20% 20%, ${theme.dots[0]} 1px, transparent 1px), radial-gradient(circle at 80% 80%, ${theme.dots[1]} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {/* Top accent glow */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${theme.glow} 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }} />

      {audioUrl ? <Audio src={resolveAsset(audioUrl)} volume={1} /> : null}
      <PremiumAudioLayer
        enabled={props.premiumEditing !== false}
        styleLock={props.styleLock}
        soundCues={props.soundCues}
      />

      {/* Creator handle */}
      <div
        style={{
          position: 'absolute',
          top: COMPARE_LAYOUT.handleTop,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: TEXT_FONT,
            fontSize: 20,
            fontWeight: 800,
            color: (theme as any).handleText || '#FFFFFF',
            background: (theme as any).handleBg || (theme as any).handle || 'rgba(0,0,0,0.6)',
            border: `1px solid ${(theme as any).handleBorder || 'rgba(255,255,255,0.2)'}`,
            padding: '7px 22px',
            borderRadius: 999,
            letterSpacing: 2,
            textTransform: 'uppercase',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {props.creatorHandle || '@itnavideo'}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: COMPARE_LAYOUT.titleTop,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            width: 488,
            height: COMPARE_LAYOUT.titleHeight,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${leftColor.main} 0%, ${leftColor.soft} 100%)`,
            border: winner === 'left' ? '2px solid #FACC15' : 'none',
            boxShadow: winner === 'left'
              ? `0 8px 28px ${leftColor.glowPrefix}0.35), 0 0 0 3px rgba(250,204,21,0.35)`
              : `0 8px 24px ${leftColor.glowPrefix}0.25), 0 2px 6px rgba(0,0,0,0.08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 24px',
            position: 'relative',
            transform: `translateX(${leftLabelEntry * 80}px) translateY(${Math.sin(frame / 18) * 2}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: -16,
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#ffffff',
              border: 'none',
              color: leftColor.main,
              fontSize: 20,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            A
          </div>
          {winner === 'left' ? <WinnerCrown side="left" /> : null}
          <div
            style={{
              textAlign: 'center',
              fontFamily: DISPLAY_FONT,
              fontSize: leftTitleFontSize,
              lineHeight: 1.05,
              maxHeight: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              fontWeight: 750,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: -1,
              textShadow: '0 4px 0 rgba(0,0,0,0.32)',
              wordBreak: 'break-word',
            }}
          >
            {leftTitle}
          </div>
        </div>

        <div
          style={{
            width: 488,
            height: COMPARE_LAYOUT.titleHeight,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${rightColor.main} 0%, ${rightColor.soft} 100%)`,
            border: winner === 'right' ? '2px solid #FACC15' : 'none',
            boxShadow: winner === 'right'
              ? `0 8px 28px ${rightColor.glowPrefix}0.35), 0 0 0 3px rgba(250,204,21,0.35)`
              : `0 8px 24px ${rightColor.glowPrefix}0.25), 0 2px 6px rgba(0,0,0,0.08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 24px',
            position: 'relative',
            transform: `translateX(${rightLabelEntry * 80}px) translateY(${Math.cos(frame / 18) * 2}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: -16,
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#ffffff',
              border: 'none',
              color: rightColor.main,
              fontSize: 20,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            B
          </div>
          {winner === 'right' ? <WinnerCrown side="right" /> : null}
          <div
            style={{
              textAlign: 'center',
              fontFamily: DISPLAY_FONT,
              fontSize: rightTitleFontSize,
              lineHeight: 1.05,
              maxHeight: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              fontWeight: 750,
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: -1,
              textShadow: '0 4px 0 rgba(0,0,0,0.32)',
              wordBreak: 'break-word',
            }}
          >
            {rightTitle}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: COMPARE_LAYOUT.imageTop,
          left: 44,
          right: 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{opacity: leftImageEntry, transform: `translateX(${(1 - leftImageEntry) * -40}px)`}}>
          <VisualBox
            image={leftImage}
            side="left"
            colors={leftColor}
            boxBg={theme.boxBg}
            isActive={leftActive}
            isOppositeActive={rightActive}
            imageStyle={activeImageStyle}
          />
        </div>
        <div style={{opacity: rightImageEntry, transform: `translateX(${(1 - rightImageEntry) * 40}px)`}}>
          <VisualBox
            image={rightImage}
            side="right"
            colors={rightColor}
            boxBg={theme.boxBg}
            isActive={rightActive}
            isOppositeActive={leftActive}
            imageStyle={activeImageStyle}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 395,
          left: '50%',
          width: 78,
          height: 78,
          borderRadius: 18,
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F00 100%)',
          border: '3px solid #ffffff',
          transform: `translateX(-50%) scale(${vsBadgePop * vsPulse})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: DISPLAY_FONT,
          fontSize: 26,
          fontWeight: 900,
          color: '#ffffff',
          zIndex: 5,
          boxShadow: '0 8px 24px rgba(255,107,53,0.3), 0 2px 6px rgba(0,0,0,0.1)',
          letterSpacing: 1,
        }}
      >
        {shockwaveOpacity > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: -12,
              borderRadius: 24,
              border: '3px solid #FF8F00',
              transform: `scale(${shockwaveScale})`,
              opacity: shockwaveOpacity,
              pointerEvents: 'none',
            }}
          />
        ) : null}
        VS
      </div>

      {caption ? (
        <div
          style={{
            position: 'absolute',
            top: COMPARE_LAYOUT.captionTop,
            left: 72,
            right: 72,
            height: COMPARE_LAYOUT.captionHeight,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            color: theme.captionText,
            fontFamily: TEXT_FONT,
            fontSize: 40,
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: -0.8,
            background: theme.captionBg,
            backdropFilter: 'blur(12px)',
            border: `2px solid ${theme.captionBorder}`,
            borderRadius: 20,
            padding: '18px 28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
            transform: `scale(${captionScale})`,
            zIndex: 25,
          }}
        >
          {caption}
        </div>
      ) : null}

      <StickerPresenter
        overlay={activeOverlay}
        caption={activeCaption}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        stickerStyle={props.stickerStyle}
        stickerScale={Number(props.stickerScale) || 1}
        stickerOffsetX={Number(props.stickerOffsetX) || 0}
        stickerOffsetY={Number(props.stickerOffsetY) || 0}
        customStickerSet={(props as any).customStickerSet}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 100,
          background: `linear-gradient(0deg, ${theme.bottomFade}, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Opening hook card — big "A vs B" question to stop the scroll */}
      {showHook ? (
        <OpeningCard
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          topic={hookText}
          theme={theme}
          leftColor={leftColor}
          rightColor={rightColor}
          opacity={hookOpacity}
        />
      ) : null}

      {/* Closing card — winner + follow CTA */}
      {showClosing ? (
        <ClosingCard
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          winner={winner}
          handle={props.creatorHandle || '@itnavideo'}
          theme={theme}
          leftColor={leftColor}
          rightColor={rightColor}
          opacity={closingOpacity}
        />
      ) : null}

      <PremiumVisualTreatment enabled={props.premiumEditing !== false} styleLock={props.styleLock} />
    </AbsoluteFill>
  );
};

const getCompareDurationSeconds = (props: CompareProps) => {
  const requested =
    Number(props.durationSeconds) ||
    Number(props.sourceDurationSeconds) ||
    Number(props.renderWindowSeconds) ||
    60;
  return Math.max(1, Math.min(180, requested));
};

export const CompareExplainerComposition = () => (
  <Composition
    id="comparisonImages"
    component={CompareExplainer}
    durationInFrames={secondsToFrames(180, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920};
    }}
  />
);

export const Compare2DPreviewComposition = () => (
  <Composition
    id="COMPARE-2D-PREVIEW"
    component={CompareExplainer}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: '2d',
    }}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920};
    }}
  />
);

export const CompareCartoonPreviewComposition = () => (
  <Composition
    id="COMPARE-CARTOON-PREVIEW"
    component={CompareExplainer}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: 'cartoon',
    }}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920};
    }}
  />
);

export const CompareExplainerPreviewComposition = () => (
  <Composition
    id="COMPARE-EXPLAINER-PREVIEW"
    component={CompareExplainer}
    durationInFrames={secondsToFrames(60, DEFAULT_FPS)}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={{
      stickerStyle: 'explainer',
    }}
    calculateMetadata={({props}) => {
      const durationSeconds = getCompareDurationSeconds(props as CompareProps);
      return {durationInFrames: secondsToFrames(durationSeconds, DEFAULT_FPS), fps: DEFAULT_FPS, width: 1080, height: 1920};
    }}
  />
);






