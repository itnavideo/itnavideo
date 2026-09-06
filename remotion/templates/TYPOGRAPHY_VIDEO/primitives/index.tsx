import React from 'react';
import type { KineticPhrase, TypographyStyleId } from '../../../../lib/typography/types';
import { getStyleBlueprint } from '../../../../lib/typography/styleRegistry';

import { DynamicPunchPrimitive } from './DynamicPunchPrimitive';
import { Depth3DPillPrimitive } from './Depth3DPillPrimitive';
import { DubaiGoldPrimitive } from './DubaiGoldPrimitive';
import { NeonCyberLuxuryPrimitive } from './NeonCyberLuxuryPrimitive';
import { PrismProPrimitive } from './PrismProPrimitive';
import { PaperCollagePrimitive } from './PaperCollagePrimitive';
import { ElevateScriptPrimitive } from './ElevateScriptPrimitive';
import { PlatinumMinimalPrimitive } from './PlatinumMinimalPrimitive';
import { RoyalEmeraldPrimitive } from './RoyalEmeraldPrimitive';
import { SilverChromePrimitive } from './SilverChromePrimitive';
import { VelvetCrimsonPrimitive } from './VelvetCrimsonPrimitive';
import { TokyoCyberPrimitive } from './TokyoCyberPrimitive';
import { MiamiSunsetPrimitive } from './MiamiSunsetPrimitive';
import { SwissMinimalPrimitive } from './SwissMinimalPrimitive';
import { MonarchVioletPrimitive } from './MonarchVioletPrimitive';
import { ObsidianGoldPrimitive } from './ObsidianGoldPrimitive';
import { HormoziBoldPrimitive } from './HormoziBoldPrimitive';
import { BeastImpactPrimitive } from './BeastImpactPrimitive';
import { ViralRedlinePrimitive } from './ViralRedlinePrimitive';
import { CreatorHighlightPrimitive } from './CreatorHighlightPrimitive';
import { GadzhiDocumentaryPrimitive } from './GadzhiDocumentaryPrimitive';
import { VogueEditorialPrimitive } from './VogueEditorialPrimitive';
import { KeynoteExecutivePrimitive } from './KeynoteExecutivePrimitive';
import { VoxExplainerPrimitive } from './VoxExplainerPrimitive';
import { NordicCleanPrimitive } from './NordicCleanPrimitive';
import { SpatialGlassPrimitive } from './SpatialGlassPrimitive';
import { IsometricCubePrimitive } from './IsometricCubePrimitive';
import { Synthwave80sPrimitive } from './Synthwave80sPrimitive';
import { HudTelemetryPrimitive } from './HudTelemetryPrimitive';
import { MaterialExpressivePrimitive } from './MaterialExpressivePrimitive';

export function TypographyStyleRenderer({
  styleId,
  phrase,
  localFrame,
  fps,
}: {
  styleId: string;
  phrase: KineticPhrase;
  localFrame: number;
  fps: number;
}) {
  const blueprint = getStyleBlueprint(styleId);

  switch (blueprint.id) {
    case 'dynamic-punch':
      return <DynamicPunchPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'depth-3d-text':
      return <Depth3DPillPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'dubai-gold':
      return <DubaiGoldPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'neon-kinetic':
      return <NeonCyberLuxuryPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'prism-pro':
      return <PrismProPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'paper-ii':
      return <PaperCollagePrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'elevate-script':
      return <ElevateScriptPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'platinum-penthouse':
      return <PlatinumMinimalPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'royal-emerald':
      return <RoyalEmeraldPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'silver-chrome':
      return <SilverChromePrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'velvet-crimson':
      return <VelvetCrimsonPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'tokyo-cyber':
      return <TokyoCyberPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'miami-sunset':
      return <MiamiSunsetPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'swiss-minimal':
      return <SwissMinimalPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'monarch-violet':
      return <MonarchVioletPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'obsidian-gold':
      return <ObsidianGoldPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'hormozi-bold':
      return <HormoziBoldPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'beast-impact':
      return <BeastImpactPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'viral-redline':
      return <ViralRedlinePrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'creator-highlight':
      return <CreatorHighlightPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'gadzhi-documentary':
      return <GadzhiDocumentaryPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'vogue-editorial':
      return <VogueEditorialPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'keynote-executive':
      return <KeynoteExecutivePrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'vox-explainer':
      return <VoxExplainerPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'nordic-clean':
      return <NordicCleanPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'spatial-glass':
      return <SpatialGlassPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'isometric-cube':
      return <IsometricCubePrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'synthwave-80s':
      return <Synthwave80sPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'hud-telemetry':
      return <HudTelemetryPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    case 'material-expressive':
      return <MaterialExpressivePrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
    default:
      return <DynamicPunchPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
  }
}
