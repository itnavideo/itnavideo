export const PRO_VIDEO_TEMPLATES = {
  pro_motivational_01: {
    templateId: 'pro_motivational_01',
    category: 'motivational',
    backgroundColor: 'deep_black_gold',
    backgroundPalette: ['0x050506', '0x111827', '0x3a0f16'],
    fontFamily: 'Montserrat',
    fontFiles: ['Montserrat-Bold.ttf', 'Poppins-ExtraBold.ttf', 'Geist-Black.ttf'],
    animationStyle: 'fade_slide',
    textAlign: 'center',
    headlineColor: '0xf8fafc',
    accentColor: '0xfbbf24',
    shadowColor: 'black@0.70',
    overlayOpacity: 0.24,
    vignette: true,
    slowZoom: 1.04,
    safeZone: { x: 0.1, top: 0.18, bottom: 0.22 },
  },
  pro_educational_01: {
    templateId: 'pro_educational_01',
    category: 'educational',
    backgroundColor: 'navy_teal',
    backgroundPalette: ['0x0f172a', '0x0f3f46', '0x102a43'],
    fontFamily: 'Inter',
    fontFiles: ['Inter-Bold.ttf', 'Roboto-Bold.ttf', 'Geist-Black.ttf'],
    animationStyle: 'typewriter',
    textAlign: 'top_left',
    headlineColor: '0xf8fafc',
    accentColor: '0x5eead4',
    shadowColor: 'black@0.58',
    overlayOpacity: 0.2,
    vignette: false,
    slowZoom: 1.02,
    safeZone: { x: 0.09, top: 0.13, bottom: 0.24 },
  },
  pro_storytelling_01: {
    templateId: 'pro_storytelling_01',
    category: 'storytelling',
    backgroundColor: 'deep_blue_mp4',
    backgroundPalette: ['0x07111f', '0x111827', '0x0c1f3f'],
    fontFamily: 'Playfair Display',
    fontFiles: ['PlayfairDisplay-Bold.ttf', 'Merriweather-Bold.ttf', 'Geist-Black.ttf'],
    animationStyle: 'word_by_word',
    textAlign: 'bottom_center',
    headlineColor: '0xf8fafc',
    accentColor: '0x93c5fd',
    shadowColor: 'black@0.70',
    overlayOpacity: 0.22,
    vignette: true,
    slowZoom: 1.025,
    safeZone: { x: 0.1, top: 0.16, bottom: 0.24 },
  },
  pro_modern_01: {
    templateId: 'pro_modern_01',
    category: 'modern',
    backgroundColor: 'deep_blue_mp4',
    backgroundPalette: ['0x0f172a', '0x082f49', '0x111827'],
    fontFamily: 'Inter',
    fontFiles: ['Inter-Bold.ttf', 'Roboto-Bold.ttf', 'Geist-Black.ttf'],
    animationStyle: 'fade_slide',
    textAlign: 'center',
    headlineColor: '0xf8fafc',
    accentColor: '0x38bdf8',
    shadowColor: 'black@0.64',
    overlayOpacity: 0.2,
    vignette: true,
    slowZoom: 1.03,
    safeZone: { x: 0.1, top: 0.16, bottom: 0.22 },
  },
};

export function chooseProfessionalTemplate(input = {}) {
  const explicit = normalizeTemplateId(input.templateId || input.template_id);
  if (explicit && PRO_VIDEO_TEMPLATES[explicit]) return PRO_VIDEO_TEMPLATES[explicit];

  const text = [
    input.category,
    input.mood,
    input.editingStyle,
    input.selectedStyle,
    input.captionStyle,
  ].filter(Boolean).join(' ').toLowerCase();

  if (text.includes('education') || text.includes('tutorial') || text.includes('documentary')) {
    return PRO_VIDEO_TEMPLATES.pro_educational_01;
  }

  if (text.includes('story') || text.includes('song') || text.includes('cinematic') || text.includes('slow')) {
    return PRO_VIDEO_TEMPLATES.pro_storytelling_01;
  }

  if (text.includes('motivation') || text.includes('luxury') || text.includes('success') || text.includes('energy')) {
    return PRO_VIDEO_TEMPLATES.pro_motivational_01;
  }

  return PRO_VIDEO_TEMPLATES.pro_modern_01;
}

export function buildProfessionalTemplatePayload(input = {}) {
  const template = chooseProfessionalTemplate(input);
  const overlayOpacity = normalizeOverlayOpacity(input.overlayOpacity ?? input.overlay_opacity ?? template.overlayOpacity);

  return {
    template_id: template.templateId,
    category: template.category,
    background_color: input.backgroundColor || input.background_color || template.backgroundColor,
    font_family: input.fontFamily || input.font_family || template.fontFamily,
    animation_style: input.animationStyle || input.animation_style || template.animationStyle,
    text_content: input.textContent || input.text_content || '',
    text_align: template.textAlign,
    accent_color: template.accentColor,
    overlay_opacity: overlayOpacity,
  };
}

export function enrichTimelineWithProfessionalTemplate(timeline, options = {}) {
  const template = chooseProfessionalTemplate({
    templateId: options.templateId || timeline?.metadata?.template?.template_id,
    category: options.category || timeline?.metadata?.template?.category,
    mood: options.mood || timeline?.metadata?.editingStyle,
    editingStyle: options.editingStyle || timeline?.metadata?.editingStyle,
  });

  return {
    ...timeline,
    metadata: {
      ...(timeline.metadata || {}),
      template: {
        ...buildProfessionalTemplatePayload({
          templateId: template.templateId,
          mood: timeline?.metadata?.editingStyle,
          textContent: timeline?.scenes?.[0]?.textCard?.headline || '',
        }),
        ...(timeline?.metadata?.template || {}),
      },
    },
    scenes: (timeline.scenes || []).map((scene, index) => ({
      ...scene,
      proTemplate: {
        templateId: template.templateId,
        category: template.category,
        animationStyle: template.animationStyle,
        textAlign: template.textAlign,
        backgroundColor: scene.textCard?.backgroundColor || template.backgroundPalette[index % template.backgroundPalette.length],
        accentColor: scene.textCard?.accentColor || template.accentColor,
      },
      textCard: scene.textCard || buildFallbackTextCard(scene, index, template),
    })),
  };
}

function buildFallbackTextCard(scene, index, template) {
  const source = scene.prompt || scene.query || scene.role || 'Your idea becomes a video';
  const headline = getPreferredSceneHeadline(scene) || toHeadline(source);

  return {
    eyebrow: index === 0 ? template.category : `Point ${index + 1}`,
    headline,
    body: 'A clean professional scene generated from your audio.',
    backgroundColor: template.backgroundPalette[index % template.backgroundPalette.length],
    accentColor: template.accentColor,
  };
}

function getPreferredSceneHeadline(scene) {
  return normalizeHeadline(
    scene.shortHeadline ||
    scene.aiHeadline ||
    scene.headline ||
    scene.title ||
    scene.summary ||
    scene.textCard?.headline,
  );
}

function normalizeHeadline(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';

  const words = text.split(' ').filter(Boolean);
  const shortText = words.length > 6 ? words.slice(0, 6).join(' ') : text;
  return shortText.length > 56 ? `${shortText.slice(0, 53).trim()}...` : shortText;
}

function toHeadline(value) {
  const words = String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 10);

  if (!words.length) return 'Your idea becomes a video';
  const text = words.join(' ');
  return text.length > 72 ? `${text.slice(0, 69).trim()}...` : text;
}

function normalizeTemplateId(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
}

function normalizeOverlayOpacity(value) {
  const opacity = Number(value ?? 0.5);
  if (!Number.isFinite(opacity)) return 0.5;
  return Math.min(1, Math.max(0.05, opacity));
}
