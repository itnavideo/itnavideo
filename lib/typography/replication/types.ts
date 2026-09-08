/**
 * Multi-Content Style Robustness & Dual-Layer Fidelity Validation Types
 */

import type { AdvancedStyleBlueprint } from '../blueprintSchema';
import type { TypographyStyleId } from '../types';

export type ContentScenarioId =
  | 'short-phrase'
  | 'normal-sentence'
  | 'long-sentence'
  | 'multi-line'
  | 'keyword-emphasis'
  | 'multi-emphasis'
  | 'fast-rhythm'
  | 'slow-rhythm';

export type AspectRatioType = '9:16' | '16:9' | '1:1';

export interface ScenarioWord {
  word: string;
  start: number;
  end: number;
  highlight?: boolean;
}

export interface ScenarioKineticPhrase {
  id: string;
  leadText?: string;
  heroText?: string;
  subText?: string;
  extraText?: string;
  start: number;
  end: number;
  highlightType?: string;
  animationPreset?: string;
  emphasisWords?: string[];
  styleVariant?: string;
  size?: 'compact' | 'large' | 'oversized';
  position?: 'top' | 'center' | 'bottom-mid' | 'bottom' | 'left' | 'right' | 'auto';
}

export interface ContentScenario {
  id: ContentScenarioId;
  name: string;
  description: string;
  purpose: string;
  text: string;
  durationSeconds: number;
  words: ScenarioWord[];
  phrases: ScenarioKineticPhrase[];
  aspectRatios: AspectRatioType[];
}

export interface DimensionFidelityScores {
  typography: number; // 0-100
  composition: number; // 0-100
  motion: number; // 0-100
  color: number; // 0-100
  layering: number; // 0-100
  timing: number; // 0-100
}

export interface ScenarioFidelityScore {
  scenarioId: ContentScenarioId;
  scenarioName: string;
  fidelityScore: number; // 0-100
  complianceScore: number; // 0-100
  dimensionScores: DimensionFidelityScores;
  whatMatched: string[];
  whatFailed: string[];
  generatedVideoUrl?: string;
  generatedFrameUrls?: string[];
}

export interface StyleRobustnessReport {
  overallScore: number; // 0-100
  minScore: number;
  maxScore: number;
  averageScore: number;
  variance: number; // standard deviation
  worstCaseScenario: {
    scenarioId: ContentScenarioId;
    scenarioName: string;
    score: number;
    failureReason: string;
  };
  bestCaseScenario: {
    scenarioId: ContentScenarioId;
    scenarioName: string;
    score: number;
  };
  primaryWeakness: string;
  recommendedFix: string;
  scenarioScores: Record<ContentScenarioId, ScenarioFidelityScore>;
}

export type PipelineBottleneck =
  | 'analyzer'
  | 'blueprint'
  | 'planner'
  | 'renderer'
  | 'timing'
  | 'layering'
  | 'none';

export type DiagnosticCase =
  | 'Case A: Renderer Implementation Failure'
  | 'Case B: Blueprint Extraction / Interpretation Mismatch'
  | 'Case C: Highly Faithful Style Replication'
  | 'Case D: Visual Convergence Despite Blueprint Deviation';

export interface PipelineDiagnosis {
  caseType: DiagnosticCase;
  bottleneck: PipelineBottleneck;
  explanation: string;
  recommendedFix: string;
  engineeringThreshold: 'Excellent (90-100)' | 'Strong (80-89)' | 'Acceptable (70-79)' | 'Weak (60-69)' | 'Failed (<60)';
}

export interface HumanReviewStatus {
  status: 'unreviewed' | 'approved' | 'needs-review' | 'failed';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface StyleReplicationReport {
  styleId: string;
  styleName: string;
  category: string;
  referenceVideoUrl: string;
  blueprintComplianceScore: number; // 0-100 (Layer A)
  visualStyleFidelityScore: number; // 0-100 (Layer B)
  styleRobustnessScore: number; // 0-100 (Multi-content stability)
  overallScore: number; // 0-100 weighted
  dimensionScores: DimensionFidelityScores;
  robustness: StyleRobustnessReport;
  whatMatched: string[];
  whatFailed: string[];
  diagnosis: PipelineDiagnosis;
  humanReview: HumanReviewStatus;
  primaryGeneratedVideoUrl: string;
  referenceFrameUrls: string[];
  generatedFrameUrls: string[];
  timestamp: string;
}

export interface BatchReplicationSummary {
  totalStylesTested: number;
  averageComplianceScore: number;
  averageFidelityScore: number;
  averageRobustnessScore: number;
  stylesMeetingThreshold: number; // >= 80
  stylesFlaggedForReview: number;
  reports: Record<string, StyleReplicationReport>;
  timestamp: string;
}
