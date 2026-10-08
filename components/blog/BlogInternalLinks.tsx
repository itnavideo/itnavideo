import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface PublicTopicLink {
  label: string;
  href: string;
  category?: string;
}

export function getPublicTopicLink(dashboardType?: string, category?: string, title?: string): PublicTopicLink {
  const dt = (dashboardType || '').toLowerCase();
  const cat = (category || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (dt.includes('caption') || dt.includes('subtitle') || cat.includes('caption') || t.includes('caption') || t.includes('subtitle')) {
    return {
      label: 'Auto Caption Generator',
      href: '/auto-caption-generator',
      category: 'Captions & Subtitles',
    };
  }

  if (dt.includes('image-to-video') || dt.includes('imagetovideo') || cat.includes('image') || t.includes('image to video')) {
    return {
      label: 'Image to Video AI',
      href: '/image-to-video-ai',
      category: 'Image to Video',
    };
  }

  if (dt.includes('whiteboard') || cat.includes('whiteboard') || t.includes('whiteboard') || t.includes('sketch')) {
    return {
      label: 'Whiteboard Animation Generator',
      href: '/whiteboard-video',
      category: 'Whiteboard Explainers',
    };
  }

  if (dt.includes('faceless') || cat.includes('faceless') || t.includes('faceless')) {
    return {
      label: 'Faceless Video Generator',
      href: '/faceless-video',
      category: 'Faceless Videos',
    };
  }

  if (dt.includes('compare') || cat.includes('compare') || t.includes('compare') || t.includes('versus')) {
    return {
      label: 'Compare Explainer Generator',
      href: '/compare-explainer',
      category: 'Compare Explainers',
    };
  }

  if (dt.includes('youtube') || cat.includes('youtube') || t.includes('youtube subtitle')) {
    return {
      label: 'YouTube Subtitle Generator',
      href: '/youtube-subtitle-generator',
      category: 'YouTube Captions',
    };
  }

  if (dt.includes('clip') || cat.includes('clip') || t.includes('shorts clip') || t.includes('podcast clip')) {
    return {
      label: 'Long Video to Shorts Clips',
      href: '/long-video-clips',
      category: 'Video Clips',
    };
  }

  if (dt.includes('promo') || cat.includes('promo') || t.includes('teaser') || t.includes('promo')) {
    return {
      label: 'Long Video Promo Generator',
      href: '/long-video-promo',
      category: 'Video Teasers',
    };
  }

  if (dt.includes('audio') || dt.includes('clean') || cat.includes('audio') || t.includes('audio clean') || t.includes('silence')) {
    return {
      label: 'AI Audio Cleaner',
      href: '/tools/ai-audio-cleaner',
      category: 'Audio Optimization',
    };
  }

  if (dt.includes('typography') || cat.includes('typography') || t.includes('typography') || t.includes('kinetic')) {
    return {
      label: 'Typography Video Generator',
      href: '/typography-video',
      category: 'Kinetic Typography',
    };
  }

  return {
    label: 'AI Video Creation Studios',
    href: '/video-types',
    category: 'Video Creation',
  };
}

interface BlogInternalLinksProps {
  topicLink: PublicTopicLink;
}

export const BlogInternalLinks: React.FC<BlogInternalLinksProps> = ({ topicLink }) => {
  return (
    <div className="my-12 border-y border-slate-200/80 py-8 font-sans">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
        Explore ItnaVideo
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-[#FF6D00] transition-colors"
        >
          <span>ItnaVideo Homepage</span>
          <ArrowRight size={14} className="text-slate-400 group-hover:text-[#FF6D00] group-hover:translate-x-0.5 transition-all" />
        </Link>
        <Link
          href={topicLink.href}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#FF6D00] hover:text-[#FF8F00] transition-colors"
        >
          <span>Explore {topicLink.label}</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
