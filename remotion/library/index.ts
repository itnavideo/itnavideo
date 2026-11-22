/**
 * ITNAVIDEO REMOTION COMPONENT LIBRARY (remotion/library)
 * ============================================================================
 * Central unified entry point for all reusable Remotion video components across
 * 16:9 widescreen and 9:16 vertical formats in Itnavideo.
 * 
 * Modular Categories:
 * 1. primitives       — Safe-zone canvas, background grids, headers, studio cards, and tokens
 * 2. graphics         — Mockup frames, handwriting highlights, arrows, vector icons, whiteboard hands
 * 3. infographics     — Roadmaps, circular org charts, scorecards, shelf layouts, table of contents
 * 4. scenes           — 23 full-bleed scene blueprints (Hook, Stat, Quote, Workflow, Comparison, etc.)
 * 5. motionTemplates  — Comparison panels, feature grids, horizontal process flows, odometer counters
 * 6. typography       — Word-level kinetic captioning, luxury editorial styles, subtitle renderers
 * 7. overlays         — Watermarks, progress bars, YouTube subscribe CTAs, lower thirds, virtual camera
 * 8. assets           — 88 curated high-retention storytelling deck assets
 * 9. registry         — Master component metadata catalog, category search, and filtering
 */

// 1. Primitives
export * from './primitives';

// 2. Graphics & Frames
export * from './graphics';

// 2b. Animated Charts Suite (Bar, Line, Pie, Donut, Area, Radar)
export * from './charts';

// 2c. Animated Diagrams Suite (Flowchart, Tree, Org, MindMap, Network, Cycle)
export * from './diagrams';

// 2d. Animated Timelines & Process Suite (Timeline, ProcessSteps, Roadmap, Milestone, HistoryTimeline)
export * from './timelines';

// 2e. Animated Comparisons Suite (ComparisonTable, BeforeAfter, ProsCons, Splitscreen, RankingList)
export * from './comparisons';

// 2f. Animated Radial Graphics Suite (RadialChart, CircularProgress, DonutProgress, RadialDiagram)
export * from './radial';

// 2g. Animated Business Graphics Suite (FunnelChart, PyramidChart, WaterfallChart, GaugeChart)
export * from './business';

// 2h. Animated Network Graphics Suite (NodeGraph, ConnectionLine, NetworkMap, HierarchyGraph)
export * from './network';

// 2i. Animated Statistics Suite (Counter, Percentage, KPIWidget, ProgressBar, StatCard)
export * from './statistics';

// 2j. Animated UI Mockups Suite (Browser, Mobile, Dashboard, CodeEditor, Terminal, Notification, ChatBubble, SearchBar, PricingCard, LoginForm, CursorPoint, Tooltip)
export * from './ui-mockups';

// 2k. Animated Motion & Animation VFX Suite (Fade, Slide, Scale, Rotate, Spring, Stagger, Reveal, Mask, Typewriter, WordHighlight, TextScramble, PathDraw, Morph, Parallax, CameraZoom, CameraPan)
export * from './motion';

// 2l. Media & Visual Suite (VideoImage, ImageGallery, VideoPlayer, BackgroundVideo, AudioWaveform, SpectrumVisualizer, Avatar, MapPin, Screenshot, DeviceFrame, VisualBackground, Texture)
export * from './media';

// 2m. SVG Vector Graphics Suite (SVGPath, SVGLine, SVGCircle, SVGPolygon, SVGGradient, SVGMask, SVGClipPath, SVGFilter, SVGPattern, SVGMarker, SVGArrow, SVGConnector)
export * from './svg';

// 2n. 3D & Isometric Suite (ThreeDObject, IsometricBuilding, ThreeDGlobe, ThreeDDevice, ThreeDLayers, IsometricGrid, ThreeDCard)
export * from './isometric';

// 2o. Scientific & STEM Suite (MoleculeModel, AtomDiagram, DNAStructure, HumanAnatomy, PhysicsDiagram, CellDiagram, CircuitDiagram)
export * from './scientific';

// 3. Infographics
export * from './infographics';

// 4. Scene Compositions (23 Scenes)
export * from './scenes';

// 5. Motion Graphics Templates
export * from './motion-templates';

// 6. Typography & Subtitles
export * from './typography';

// 7. Overlays, Timers & Camera
export * from './overlays';

// 8. Storytelling Deck Assets (88 Assets)
export * from './assets';

// 9. Component Registry & Metadata
export * from './registry';
