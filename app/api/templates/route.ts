import { NextResponse } from 'next/server';
import { PRO_VIDEO_TEMPLATES } from '@/services/rendering/proVideoTemplates';

export const runtime = 'nodejs';

// Cache configuration: Templates baar-baar change nahi hote, 
// isliye hum ise 1 ghante ke liye cache kar sakte hain speed badhane ke liye.
export const revalidate = 3600; 

export async function GET() {
  try {
    const templates = Object.values(PRO_VIDEO_TEMPLATES).map((template) => ({
      id: String(template.templateId || ''),
      name: String(template.name || 'Untitled Template'), // UI mein dikhane ke liye name zaroori hai
      category: String(template.category || 'General'),
      style: {
        backgroundColor: String(template.backgroundColor || '#000000'),
        accentColor: String(template.accentColor || '#ffffff'),
        fontFamily: String(template.fontFamily || 'Geist-Black'),
        textAlign: String(template.textAlign || 'center'),
      },
      config: {
        animation: String(template.animationStyle || 'fade'),
        overlayOpacity: Number(template.overlayOpacity || 0.5),
      }
    }));

    return NextResponse.json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error: any) {
    console.error('[Templates Route] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load templates' 
    }, { status: 500 });
  }
}