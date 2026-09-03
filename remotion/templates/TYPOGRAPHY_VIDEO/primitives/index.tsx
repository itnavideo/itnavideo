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
    default:
      return <DynamicPunchPrimitive phrase={phrase} localFrame={localFrame} fps={fps} blueprint={blueprint} />;
  }
}
