export type MotionTheme = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

export type ProcessFlowSchema = {
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
  theme?: MotionTheme;
};

export type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type FeatureHighlightsSchema = {
  title: string;
  subtitle?: string;
  features: FeatureItem[];
  theme?: MotionTheme;
};

export type StatItem = {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

export type StatisticsSchema = {
  title: string;
  subtitle?: string;
  stats: StatItem[];
  theme?: MotionTheme;
};

export type ComparisonItem = {
  id: string;
  feature: string;
  isPositive: boolean;
};

export type ComparisonSchema = {
  title: string;
  leftTitle: string;
  rightTitle: string;
  leftItems: ComparisonItem[];
  rightItems: ComparisonItem[];
  theme?: MotionTheme;
};

export type TextImageLayoutSchema = {
  title: string;
  description: string;
  imageSrc?: string;
  theme?: MotionTheme;
};
