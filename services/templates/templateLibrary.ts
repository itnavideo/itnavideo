export type AspectRatio = '9:16' | '16:9' | '1:1' | 'universal';

export interface CaptionThemePreset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  styles: {
    fontFamily?: string;
    fontSize?: number;
    activeTextColor: string;
    inactiveTextColor: string;
    textShadow?: string;
    backgroundColor?: string;
    borderRadius?: number;
    padding?: string;
    animation: 'glow' | 'pill' | 'neon' | 'slide-up';
  };
}

export interface StickerPackPreset {
  id: string;
  name: string;
  description: string;
  category: 'stickman' | 'tech-icons' | 'emojis' | 'diagrams';
  stickers: Array<{
    id: string;
    name: string;
    src: string; // URL or staticFile path
    keywords: string[];
  }>;
}

export interface LayoutFramePreset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  layoutType: 'split' | 'code-window' | 'pip-bubble' | 'floating-card';
  containerStyle: {
    borderColor?: string;
    borderWidth?: number;
    boxShadow?: string;
    borderRadius?: number;
    backgroundColor?: string;
  };
}

export interface LowerThirdPreset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  badgeStyle: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'center-bottom';
    fontFamily?: string;
  };
}

export interface ProgressBarPreset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  height: number;
  position: 'top' | 'bottom';
  barColor: string;
  backgroundColor: string;
  glow?: boolean;
}

export interface SfxPackPreset {
  id: string;
  name: string;
  description: string;
  sfx: {
    pop?: string;
    whoosh?: string;
    click?: string;
    transition?: string;
  };
}

// Master Universal Template Library Registry
export const UNIVERSAL_CAPTION_THEMES: CaptionThemePreset[] = [
  {
    id: 'glow-viral',
    name: 'Glow Viral Yellow',
    description: 'High-energy glowing yellow active word highlight for viral retention.',
    aspectRatio: 'universal',
    styles: {
      fontSize: 52,
      activeTextColor: '#FFD700',
      inactiveTextColor: '#FFFFFF',
      textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.9)',
      animation: 'glow',
    },
  },
  {
    id: 'box-pill',
    name: 'Dark Box Pill',
    description: 'Clean solid dark pill background behind active spoken words.',
    aspectRatio: 'universal',
    styles: {
      fontSize: 48,
      activeTextColor: '#00FFCC',
      inactiveTextColor: '#E0E0E0',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderRadius: 12,
      padding: '8px 16px',
      animation: 'pill',
    },
  },
  {
    id: 'neon-cyber',
    name: 'Cyberpunk Neon',
    description: 'High-contrast cyan & magenta glowing text effect for tech videos.',
    aspectRatio: 'universal',
    styles: {
      fontSize: 50,
      activeTextColor: '#00F0FF',
      inactiveTextColor: '#A0A0A0',
      textShadow: '0 0 15px #00F0FF, 0 0 30px #FF007F',
      animation: 'neon',
    },
  },
  {
    id: 'minimal-lower-third',
    name: 'Minimal Podcast Subtitle',
    description: 'Sleek, modern lower-third subtitle bar for clean podcasts and documentaries.',
    aspectRatio: '16:9',
    styles: {
      fontSize: 40,
      activeTextColor: '#FFFFFF',
      inactiveTextColor: '#888888',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderRadius: 8,
      padding: '12px 24px',
      animation: 'slide-up',
    },
  },
];

export const UNIVERSAL_STICKER_PACKS: StickerPackPreset[] = [
  {
    id: 'stickman-dev',
    name: 'Stickman Creator & Dev Pack',
    description: 'Animated stickman character drawings for coding, ideas, confusion, graphs, and excitement.',
    category: 'stickman',
    stickers: [
      { id: 'stickman-idea', name: 'Idea Lightbulb', src: 'assets/stickman/idea.png', keywords: ['idea', 'think', 'thought', 'solution'] },
      { id: 'stickman-code', name: 'Coding on Laptop', src: 'assets/stickman/coding.png', keywords: ['code', 'developer', 'programming', 'laptop'] },
      { id: 'stickman-graph', name: 'Graph Going Up', src: 'assets/stickman/graph.png', keywords: ['growth', 'analytics', 'chart', 'profit'] },
      { id: 'stickman-confused', name: 'Confused Question', src: 'assets/stickman/confused.png', keywords: ['question', 'problem', 'confused', 'why'] },
      { id: 'stickman-happy', name: 'Success / Celebration', src: 'assets/stickman/happy.png', keywords: ['success', 'win', 'happy', 'great'] },
    ],
  },
  {
    id: 'tech-icons',
    name: 'Tech & Vector Motion Icons',
    description: 'Clean vector icons for software, databases, servers, and code callouts.',
    category: 'tech-icons',
    stickers: [
      { id: 'tech-terminal', name: 'Terminal Window', src: 'assets/reusable/icons/terminal.png', keywords: ['terminal', 'command', 'cli'] },
      { id: 'tech-database', name: 'Database Stack', src: 'assets/reusable/icons/database.png', keywords: ['database', 'data', 'sql'] },
      { id: 'tech-rocket', name: 'Rocket Launch', src: 'assets/reusable/icons/rocket.png', keywords: ['launch', 'fast', 'speed', 'scale'] },
    ],
  },
];

export const UNIVERSAL_LAYOUT_FRAMES: LayoutFramePreset[] = [
  {
    id: 'split-16x9',
    name: '16:9 Split Screen Frame',
    description: 'Speaker on left half + B-roll / media / chart container on right half.',
    aspectRatio: '16:9',
    layoutType: 'split',
    containerStyle: {
      borderColor: '#3B82F6',
      borderWidth: 2,
      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
      borderRadius: 16,
      backgroundColor: '#0F172A',
    },
  },
  {
    id: 'code-window-dark',
    name: 'VS Code Dark Frame',
    description: 'Glowing dark mode window wrapper for code snippets and terminal recordings.',
    aspectRatio: 'universal',
    layoutType: 'code-window',
    containerStyle: {
      borderColor: '#1E293B',
      borderWidth: 1,
      boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 15px rgba(59, 130, 246, 0.4)',
      borderRadius: 12,
      backgroundColor: '#1E1E1E',
    },
  },
  {
    id: 'pip-bubble',
    name: 'Picture-in-Picture Bubble',
    description: 'Rounded floating speaker bubble in bottom-left or bottom-right corner.',
    aspectRatio: 'universal',
    layoutType: 'pip-bubble',
    containerStyle: {
      borderColor: '#10B981',
      borderWidth: 3,
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      borderRadius: 9999,
    },
  },
];

export const UNIVERSAL_LOWER_THIRDS: LowerThirdPreset[] = [
  {
    id: 'chapter-badge',
    name: 'Animated Chapter Badge',
    description: 'Top-left or side banner displaying topic step numbers ("01. Mindset", "02. Execution").',
    aspectRatio: 'universal',
    badgeStyle: {
      backgroundColor: '#1E1B4B',
      textColor: '#FFFFFF',
      accentColor: '#6366F1',
      position: 'top-left',
    },
  },
  {
    id: 'speaker-tag',
    name: 'Speaker Designation Tag',
    description: 'Lower-third sleek name & title banner for founders and commentators.',
    aspectRatio: '16:9',
    badgeStyle: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      textColor: '#F8FAFC',
      accentColor: '#38BDF8',
      position: 'bottom-left',
    },
  },
];

export const UNIVERSAL_PROGRESS_BARS: ProgressBarPreset[] = [
  {
    id: 'bottom-neon-bar',
    name: 'Bottom Neon Line Progress',
    description: 'Thin glowing progress line at the bottom edge of the video.',
    aspectRatio: 'universal',
    height: 6,
    position: 'bottom',
    barColor: '#38BDF8',
    backgroundColor: 'rgba(255,255,255,0.1)',
    glow: true,
  },
  {
    id: 'top-timer-bar',
    name: 'Top Solid Progress Bar',
    description: 'Clean progress bar at the top edge.',
    aspectRatio: 'universal',
    height: 8,
    position: 'top',
    barColor: '#F59E0B',
    backgroundColor: 'rgba(0,0,0,0.3)',
    glow: false,
  },
];

export interface TemplateLibraryConfig {
  captionThemeId?: string;
  stickerPackId?: string;
  layoutFrameId?: string;
  lowerThirdId?: string;
  progressBarId?: string;
}

export function getCaptionThemePreset(id?: string): CaptionThemePreset {
  return UNIVERSAL_CAPTION_THEMES.find((t) => t.id === id) || UNIVERSAL_CAPTION_THEMES[0];
}

export function getStickerPackPreset(id?: string): StickerPackPreset {
  return UNIVERSAL_STICKER_PACKS.find((s) => s.id === id) || UNIVERSAL_STICKER_PACKS[0];
}

export function getLayoutFramePreset(id?: string): LayoutFramePreset {
  return UNIVERSAL_LAYOUT_FRAMES.find((f) => f.id === id) || UNIVERSAL_LAYOUT_FRAMES[0];
}

export function getLowerThirdPreset(id?: string): LowerThirdPreset {
  return UNIVERSAL_LOWER_THIRDS.find((l) => l.id === id) || UNIVERSAL_LOWER_THIRDS[0];
}

export function getProgressBarPreset(id?: string): ProgressBarPreset {
  return UNIVERSAL_PROGRESS_BARS.find((p) => p.id === id) || UNIVERSAL_PROGRESS_BARS[0];
}

export interface DemoPresetBlueprint {
  id: string;
  title: string;
  category: 'explainer' | 'podcast' | 'code-tutorial';
  description: string;
  sampleTopic: string;
  aspectRatio: AspectRatio;
  templateConfig: TemplateLibraryConfig;
  sampleData: {
    captions: Array<{
      start: number;
      end: number;
      text: string;
      words?: Array<{ word: string; start: number; end: number }>;
    }>;
    chapterEvents: Array<{
      id: string;
      title: string;
      subtitle?: string;
      stepNumber?: number;
      start: number;
      end: number;
    }>;
    stickerEvents: Array<{
      id: string;
      stickerId: string;
      start: number;
      end: number;
      position?: 'top-right' | 'top-left' | 'center-right' | 'center-left' | 'bottom-right';
    }>;
  };
}

export const UNIVERSAL_DEMO_PRESETS: DemoPresetBlueprint[] = [
  {
    id: 'demo-tech-explainer',
    title: 'Computer Science Explainer',
    category: 'explainer',
    description: '16:9 Explainer layout with active word highlights, stickman graphics, step badges, and bottom progress line.',
    sampleTopic: 'How Memory Allocation Works (Stack vs Heap)',
    aspectRatio: '16:9',
    templateConfig: {
      captionThemeId: 'glow-viral',
      stickerPackId: 'stickman-dev',
      layoutFrameId: 'split-16x9',
      lowerThirdId: 'chapter-badge',
      progressBarId: 'bottom-neon-bar',
    },
    sampleData: {
      captions: [
        {
          start: 0,
          end: 3.5,
          text: 'In programming, RAM memory is divided into two primary regions: Stack and Heap.',
          words: [
            { word: 'In', start: 0, end: 0.3 },
            { word: 'programming,', start: 0.3, end: 0.8 },
            { word: 'RAM', start: 0.8, end: 1.1 },
            { word: 'memory', start: 1.1, end: 1.5 },
            { word: 'is', start: 1.5, end: 1.7 },
            { word: 'divided', start: 1.7, end: 2.1 },
            { word: 'into', start: 2.1, end: 2.4 },
            { word: 'Stack', start: 2.4, end: 2.8 },
            { word: 'and', start: 2.8, end: 3.0 },
            { word: 'Heap.', start: 3.0, end: 3.5 },
          ],
        },
        {
          start: 3.5,
          end: 7.0,
          text: 'Stack handles fast, static function variables automatically allocated at compile time.',
        },
        {
          start: 7.0,
          end: 10.5,
          text: 'Heap handles dynamic runtime objects, managed manually or via Garbage Collection.',
        },
      ],
      chapterEvents: [
        { id: 'c1', title: 'Memory Overview', subtitle: 'Stack vs Heap Breakdown', stepNumber: 1, start: 0, end: 3.5 },
        { id: 'c2', title: 'The Stack Structure', subtitle: 'Fast LIFO Memory Allocation', stepNumber: 2, start: 3.5, end: 7.0 },
        { id: 'c3', title: 'The Heap & GC', subtitle: 'Dynamic Objects & Memory Cleanup', stepNumber: 3, start: 7.0, end: 10.5 },
      ],
      stickerEvents: [
        { id: 's1', stickerId: 'stickman-idea', start: 0.5, end: 3.2, position: 'center-right' },
        { id: 's2', stickerId: 'stickman-code', start: 3.8, end: 6.8, position: 'center-right' },
        { id: 's3', stickerId: 'stickman-graph', start: 7.2, end: 10.2, position: 'center-right' },
      ],
    },
  },
  {
    id: 'demo-founder-podcast',
    title: 'Founder Podcast & Story',
    category: 'podcast',
    description: 'Clean lower-third subtitles, speaker designation tag, top progress timer, and subtle stickman reactions.',
    sampleTopic: '0 to 1M Users Founder Story',
    aspectRatio: 'universal',
    templateConfig: {
      captionThemeId: 'minimal-lower-third',
      stickerPackId: 'stickman-dev',
      layoutFrameId: 'pip-bubble',
      lowerThirdId: 'speaker-tag',
      progressBarId: 'top-timer-bar',
    },
    sampleData: {
      captions: [
        { start: 0, end: 3.0, text: 'When we launched our AI tool, the first 6 months were completely silent.' },
        { start: 3.0, end: 6.5, text: 'Then we pivoted from complex settings to a one-click template library.' },
        { start: 6.5, end: 10.0, text: 'In 90 days, organic word of mouth took us to over one million active creators.' },
      ],
      chapterEvents: [
        { id: 'p1', title: 'Akram Editor', subtitle: 'Founder Story & Initial Struggles', start: 0, end: 3.0 },
        { id: 'p2', title: 'The Pivot Strategy', subtitle: 'Simplifying UI & One-Click Presets', start: 3.0, end: 6.5 },
        { id: 'p3', title: 'Hyper Growth Phase', subtitle: '1,000,000+ Active Users', start: 6.5, end: 10.0 },
      ],
      stickerEvents: [
        { id: 'ps1', stickerId: 'stickman-confused', start: 0.5, end: 2.8, position: 'top-right' },
        { id: 'ps2', stickerId: 'stickman-idea', start: 3.2, end: 6.2, position: 'top-right' },
        { id: 'ps3', stickerId: 'stickman-happy', start: 6.8, end: 9.8, position: 'top-right' },
      ],
    },
  },
  {
    id: 'demo-code-tutorial',
    title: 'Code & Terminal Walkthrough',
    category: 'code-tutorial',
    description: 'VS Code dark window frame, cyan neon captions, tech icons, and step badges.',
    sampleTopic: 'Building a High-Speed REST API in Express',
    aspectRatio: '16:9',
    templateConfig: {
      captionThemeId: 'neon-cyber',
      stickerPackId: 'tech-icons',
      layoutFrameId: 'code-window-dark',
      lowerThirdId: 'chapter-badge',
      progressBarId: 'bottom-neon-bar',
    },
    sampleData: {
      captions: [
        { start: 0, end: 3.5, text: 'To build a high-performance Node API, start by initializing an Express server instance.' },
        { start: 3.5, end: 7.0, text: 'Attach JSON middleware and define your async route handlers with error boundaries.' },
        { start: 7.0, end: 10.5, text: 'Deploy your serverless function bundle with automated edge caching.' },
      ],
      chapterEvents: [
        { id: 't1', title: 'Express Setup', subtitle: 'Initialize App Instance', stepNumber: 1, start: 0, end: 3.5 },
        { id: 't2', title: 'Route Handlers', subtitle: 'Async Middleware & Validation', stepNumber: 2, start: 3.5, end: 7.0 },
        { id: 't3', title: 'Edge Deployment', subtitle: 'Serverless Deploy & Caching', stepNumber: 3, start: 7.0, end: 10.5 },
      ],
      stickerEvents: [
        { id: 'ts1', stickerId: 'tech-terminal', start: 0.5, end: 3.2, position: 'top-right' },
        { id: 'ts2', stickerId: 'tech-database', start: 3.8, end: 6.8, position: 'top-right' },
        { id: 'ts3', stickerId: 'tech-rocket', start: 7.2, end: 10.2, position: 'top-right' },
      ],
    },
  },
];

export function getDemoPresetBlueprint(id?: string): DemoPresetBlueprint {
  return UNIVERSAL_DEMO_PRESETS.find((d) => d.id === id) || UNIVERSAL_DEMO_PRESETS[0];
}

