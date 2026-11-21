/**
 * Verified Top-Creator Style Profiles (`constants/creatorStyleProfiles.ts`)
 * =========================================================================
 * Reverse-engineered visual archetypes extracted via Cloud REA from top viral creators.
 * Informs the AI Scene Planner regarding layout distribution, typography, colors, and SFX.
 */

export interface CreatorStyleProfile {
  id: string;
  name: string;
  channel: string;
  referenceUrl: string;
  description: string;
  visualArchetype: 'productivity_masterclass' | 'investigative_documentary' | 'dark_luxury_story' | 'visual_essay';
  recommendedBackground: string;
  headingFont: string;
  bodyFont: string;
  cutCadenceSeconds: { min: number; max: number };
  layoutDistribution: {
    presentationInfographics: number; // percentage (e.g. 45%)
    editorialConceptCards: number;     // percentage (e.g. 30%)
    brollAndMedia: number;             // percentage (e.g. 15%)
    typographyAndQuotes: number;       // percentage (e.g. 10%)
  };
  preferredInfographics: string[];
  sfxPalette: {
    cardReveal: string;
    diagramFlow: string;
    emphasis: string;
    outro: string;
  };
}

export const CREATOR_STYLE_PROFILES: Record<string, CreatorStyleProfile> = {
  'ali_abdaal_productivity': {
    id: 'ali_abdaal_productivity',
    name: 'Ali Abdaal Productivity & Life Architecture',
    channel: 'Ali Abdaal (5.8M Subs)',
    referenceUrl: 'https://youtu.be/Y0-xv7bNVvU',
    description: 'Clean digital stationery, Notion-style card decks, life area shelves, and quarterly roadmap execution.',
    visualArchetype: 'productivity_masterclass',
    recommendedBackground: 'warm-cream', // #FAF6F2 with soft #EFE7DF gradient
    headingFont: 'Lora, "Playfair Display", Georgia, serif',
    bodyFont: 'Inter, "Plus Jakarta Sans", sans-serif',
    cutCadenceSeconds: { min: 3.2, max: 4.8 },
    layoutDistribution: {
      presentationInfographics: 45,
      editorialConceptCards: 30,
      brollAndMedia: 15,
      typographyAndQuotes: 10,
    },
    preferredInfographics: [
      'horizontal_shelves',    // 4 Life Pillars: Health, Wealth, Relationships, Growth
      'curved_roadmap',        // Q1-Q4 Quests & Progression
      'scorecard_dashboard',   // Weekly Blueprint & Habit Scorecards
      'mission_vision',        // Present Purpose vs Future Horizon
      'horizontal_process',    // 3-Step Execution Prompt
    ],
    sfxPalette: {
      cardReveal: 'pop_bubble',
      diagramFlow: 'paper_slide',
      emphasis: 'chime_bell',
      outro: 'bell_chime',
    },
  },
};

