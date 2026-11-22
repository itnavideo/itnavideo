/**
 * ITNAVIDEO REMOTION LIBRARY — POWERPOINT & PRESENTATION GRAPHICS SUITE (24 COMPONENTS)
 * ====================================================================================
 * Production-ready executive presentation, consulting frameworks, and statistical graphics:
 * - SmartArt: Classic executive SmartArt multi-stage cyclical/chevron process flow
 * - PresentationVenn: 3-circle executive overlapping Venn diagram with center synergy badge
 * - MatrixDiagram: 2x2 Boston Consulting Group (BCG) / Eisenhower priority matrix
 * - SWOTAnalysis: 4-quadrant strategic SWOT board (Strengths, Weaknesses, Opportunities, Threats)
 * - FishboneDiagram: Ishikawa root-cause fishbone diagram with central problem spine & causal ribs
 * - GanttChart: Project management Gantt timeline chart with animated phase bars & durations
 * - PERTChart: Critical Path Method (CPM) / PERT network chart with task nodes & red critical path
 * - SankeyDiagram: Capital & user conversion flow Sankey diagram with bezier curves
 * - Treemap: Hierarchical nested rectangle market share treemap with proportional area sizing
 * - SunburstChart: Concentric radial sunburst breakdown with inner core & outer subcategory segments
 * - BubbleChart: 3-dimensional data bubble chart with animated scale expansion
 * - ScatterPlot: Statistical XY distribution scatter plot with linear regression trendline
 * - BoxPlot: Tukey box-and-whisker plot displaying min, Q1, median, Q3, max
 * - Histogram: Statistical frequency distribution histogram with bin columns
 * - ParetoChart: 80/20 rule Pareto analysis chart combining defect bars & cumulative percentages
 * - FunnelDiagram: Executive conversion pipeline funnel with stage drop-off metrics
 * - DecisionTree: Decision tree with decision squares, chance circles & expected value payoffs
 * - LogicTree: MECE (Mutually Exclusive, Collectively Exhaustive) McKinsey issue tree
 * - PyramidDiagram: 4-tier strategic executive pyramid with layered slice animations
 * - HierarchicalDiagram: Corporate organizational chart / taxonomy tree with parent-child links
 * - WaterfallDiagram: Financial bridge waterfall chart showing starting revenue to net profit
 * - BridgeChart: Strategic target-variance bridge chart showing gap analysis between Current & Goal
 * - ClusterDiagram: Brainstorming idea cluster diagram with central theme & surrounding clouds
 * - ConceptMap: Cognitive concept map with proposition-labeled relationship arrows
 */

export { SmartArt } from './SmartArt';
export type { SmartArtProps, SmartArtStep } from './SmartArt';

export { PresentationVenn } from './PresentationVenn';
export type { PresentationVennProps, VennCircle } from './PresentationVenn';

export { MatrixDiagram } from './MatrixDiagram';
export type { MatrixDiagramProps, MatrixItem } from './MatrixDiagram';

export { SWOTAnalysis } from './SWOTAnalysis';
export type { SWOTAnalysisProps, SWOTSection } from './SWOTAnalysis';

export { FishboneDiagram } from './FishboneDiagram';
export type { FishboneDiagramProps, FishboneBranch } from './FishboneDiagram';

export { GanttChart } from './GanttChart';
export type { GanttChartProps, GanttTask } from './GanttChart';

export { PERTChart } from './PERTChart';
export type { PERTChartProps, PERTNode, PERTConnection } from './PERTChart';

export { SankeyDiagram } from './SankeyDiagram';
export type { SankeyDiagramProps, SankeyFlow } from './SankeyDiagram';

export { Treemap } from './Treemap';
export type { TreemapProps, TreemapNode } from './Treemap';

export { SunburstChart } from './SunburstChart';
export type { SunburstChartProps, SunburstSegment } from './SunburstChart';

export { BubbleChart } from './BubbleChart';
export type { BubbleChartProps, BubblePoint } from './BubbleChart';

export { ScatterPlot } from './ScatterPlot';
export type { ScatterPlotProps, DataPoint } from './ScatterPlot';

export { BoxPlot } from './BoxPlot';
export type { BoxPlotProps, BoxPlotGroup } from './BoxPlot';

export { Histogram } from './Histogram';
export type { HistogramProps, HistogramBin } from './Histogram';

export { ParetoChart } from './ParetoChart';
export type { ParetoChartProps, ParetoItem } from './ParetoChart';

export { FunnelDiagram } from './FunnelDiagram';
export type { FunnelDiagramProps, FunnelStage } from './FunnelDiagram';

export { DecisionTree } from './DecisionTree';
export type { DecisionTreeProps, DecisionBranch } from './DecisionTree';

export { LogicTree } from './LogicTree';
export type { LogicTreeProps, LogicBranch } from './LogicTree';

export { PyramidDiagram } from './PyramidDiagram';
export type { PyramidDiagramProps, PyramidTier } from './PyramidDiagram';

export { HierarchicalDiagram } from './HierarchicalDiagram';
export type { HierarchicalDiagramProps, HierarchyNode } from './HierarchicalDiagram';

export { WaterfallDiagram } from './WaterfallDiagram';
export type { WaterfallDiagramProps, WaterfallStep } from './WaterfallDiagram';

export { BridgeChart } from './BridgeChart';
export type { BridgeChartProps, BridgeInitiative } from './BridgeChart';

export { ClusterDiagram } from './ClusterDiagram';
export type { ClusterDiagramProps, ClusterNode } from './ClusterDiagram';

export { ConceptMap } from './ConceptMap';
export type { ConceptMapProps, ConceptRelation } from './ConceptMap';
