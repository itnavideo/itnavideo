export type ProfessionalTemplatePayload = {
  template_id: string;
  category: string;
  background_color: string;
  font_family: string;
  animation_style: string;
  text_content: string;
  text_align: string;
  accent_color: string;
  overlay_opacity: number;
};

export const PRO_VIDEO_TEMPLATES: Record<string, Record<string, unknown>>;
export function buildProfessionalTemplatePayload(input?: Record<string, unknown>): ProfessionalTemplatePayload;
export function chooseProfessionalTemplate(input?: Record<string, unknown>): Record<string, unknown>;
export function enrichTimelineWithProfessionalTemplate(timeline: any, options?: Record<string, unknown>): any;
