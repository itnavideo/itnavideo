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

// 2p. Finance & Trading Suite (StockTicker, CandlestickChart, TradingDashboard, PortfolioChart, FinancialReport, CryptoCard)
export * from './finance';

// 2q. Geography & Cartography Suite (WorldMap, CountryMap, RouteMap, LocationPins, TerritoryMap, CompassRose)
export * from './geography';

// 2r. Editorial & Publishing Suite (Newspaper, MagazineLayout, ArticleCards, QuoteLayout, HeadlineAnimation, BreakingNewsBanner)
export * from './editorial';

// 2s. Mathematics Suite (MathEquation, GeometryShapes, GraphPlotter, MathProof, NumberLine, VennDiagram)
export * from './mathematics';

// 2t. Engineering & CAD Suite (ExplodedView, CrossSection, Blueprint, TechnicalDrawing, AssemblyDiagram, DimensionCallout)
export * from './engineering';

// 2u. E-Commerce & Retail Suite (ProductShowcase, ProductComparison, PriceTag, ProductFeatures, ShoppingInterface, FlashSaleCountdown)
export * from './ecommerce';

// 2v. Advanced Motion Graphics & VFX Suite (LiquidMorph, BlobAnimation, GlitchEffect, GlitchTransition, NeonGlow, LightSweep, ParticleSystem, NoiseTexture, GradientMesh, LiquidTransition, DistortionEffect, ChromaticAberration, ScanlineEffect, PixelSorting, WaveDistortion, ShatterEffect, DisplacementMap, LightLeak, FilmGrain, LensFlare)
export * from './vfx';

// 2w. Cinematic Documentary Suite (DocumentaryTitle, ChapterIntroduction, LocationIntroduction, EvidenceBoard, CaseFile, ArchivalPhoto, HistoricalFootageFrame, InvestigationBoard, NewspaperClipping, PhotoZoom, DateStamp, LocationCoordinates, DocumentaryTimeline, SourceCitation, InterviewFrame, DocumentaryLowerThird, CinematicCredits, MapJourney, EventReconstruction, SplitNarrative)
export * from './documentary';

// 2x. PowerPoint & Presentation Graphics Suite (SmartArt, PresentationVenn, MatrixDiagram, SWOTAnalysis, FishboneDiagram, GanttChart, PERTChart, SankeyDiagram, Treemap, SunburstChart, BubbleChart, ScatterPlot, BoxPlot, Histogram, ParetoChart, FunnelDiagram, DecisionTree, LogicTree, PyramidDiagram, HierarchicalDiagram, WaterfallDiagram, BridgeChart, ClusterDiagram, ConceptMap)
export * from './presentation';

// 2y. Technology & Computer Graphics Suite (ServerRack, CloudInfrastructure, ERDiagram, APIArchitecture, MicroservicesDiagram, SystemArchitecture, NetworkTopology, DataPipeline, WorkflowAutomation, AuthenticationFlow, EncryptionVisualization, CybersecurityDashboard, CodeDiff, GitBranchGraph, TerminalAnimation, CommandLineSequence, BrowserDevTools, SoftwareStackDiagram, AIModelArchitecture)
export * from './technology';

// 2z. Maps & Transportation Suite (WorldGlobe, TransportGlobe, GlobalTransitMap, CountryHighlight, StateMap, CityMap, FlightPath, ShippingRoute, RoadNetwork, MetroMap, RailwayMap, GPSNavigation, RouteTracker, LocationMarker, BorderHighlight, TerritoryComparison, AnimatedCompass, LatitudeLongitude, SatelliteView)
export * from './transportation';

// 2aa. Human Psychology & Business Explanation Suite (HumanBrain, BrainActivity, DecisionMakingDiagram, BehaviorLoop, HabitLoop, MotivationScale, MemoryDiagram, CustomerJourney, UserPersona, CustomerLifecycle, SalesPipeline, RevenueModel, BusinessModelCanvas, OrganizationalHierarchy, StakeholderMap, MarketSegmentation, CompetitivePositioning)
export * from './psychology';

// 2ab. Social Media & Creator Engagement Suite (YouTubeSubscribeButton, InstagramFollowCard, TikTokProfileCard, TwitterPostCard, SocialEngagementPill, PodcastBadge, StarRatingCard, VerifiedBadge, CommentOverlay, ShareNotification, LikeHeartExplosion, FollowGoalBar, LiveStreamChat, SubscriberMilestone, NotificationBell, PinnedCommentCard)
export * from './social';

// 2ac. Gaming, HUD & Cyberpunk Elements Suite (HealthBar, SpeedometerHUD, CrosshairTarget, MiniRadarMap, LevelProgressionBadge, QuestLog, ShieldMeter, InventoryGrid, AmmoCounter, BossHealthBar, KillStreakPopup, XPFloatingText, CyberpunkFrame, DamageVignette, TacticalCompass, HitMarker)
export * from './gaming';

// 2ad. Sports, Fitness & Health Tracking Suite (HeartRateMonitor, CalorieBurnCounter, RepetitionCounter, ScoreboardWidget, SpeedPaceTracker, WorkoutIntervalTimer, WaterIntakeTracker, StepGoalRing, LeaderboardRank, RestTimer, BPMVisualizer, MatchTimer, WeightProgressChart, MacroNutrientBar, GymSetTracker, ActivityRingsThreeWay)
export * from './fitness';

// 2ae. Broadcast, News & Media Lower Thirds Suite (UrgentNewsTicker, BroadcastLowerThird, FinancialTickerTape, SplitScreenInterview, LiveLocationBug, TopicDiscussionCard, FactCheckStamp, WeatherForecastBadge, PressReleaseHeader, AudiencePollOverlay, QuoteCalloutFrame, CountdownBug, ViewerWarning, SourceAttributionPill, StudioCameraRecBug, UpcomingSegmentTeaser)
export * from './broadcast';

// 2af. Education, STEM & Anatomy Laboratory Suite (DNAHelix, AtomModel, PeriodicTableCard, MicroscopeView, SolarSystemOrbit, TectonicPlates, WaterCycleDiagram, ChemicalReactionEquation, HumanSkeleton, LungsRespiratory, HeartCirculation, NeuronSynapse, PhotosynthesisDiagram, MagneticFieldLines, WaveSpectrogram, GeometricProof)
export * from './education';

// 2ag. Music, Audio & DJ Visualizer Suite (VinylTurntable, CircularAudioWaveform, CassetteTape, BoomboxGhettoBlaster, DJAudioMixer, FrequencySpectrumBars, BPMTapperMetronome, LofiVibePlayer, MicrophoneStudioBadge, GuitarChordsCard, AudioWaveformScrubber, SynthKeyboard, StereoPanMeter, SubwooferBassDrop, LoudnessLufsMeter, HeadphonesVisualizer)
export * from './music';

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
