import { TYPOGRAPHY_STYLES } from '../lib/typography/typographyStylesData';
import { ADVANCED_STYLE_BLUEPRINTS } from '../lib/typography/styleRegistry';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

console.log('=== KINETIC TYPOGRAPHY COMPREHENSIVE AUDIT ===\n');

console.log(`1. Total Registered Typography Styles: ${TYPOGRAPHY_STYLES.length}`);

TYPOGRAPHY_STYLES.forEach((style, index) => {
  const bp: any = ADVANCED_STYLE_BLUEPRINTS[style.id];
  console.log(`\n[${index + 1}/${TYPOGRAPHY_STYLES.length}] Style ID: "${style.id}" ("${style.name}")`);
  console.log(`  Category: ${style.category} | Accent Color: ${style.accentColor}`);
  console.log(`  Tags: ${style.tags.join(', ')}`);

  if (bp) {
    console.log(`  Blueprint Found: Yes`);
    console.log(`  Hero Font: ${bp.typography?.heroFont || 'N/A'}`);
    console.log(`  Lead Font: ${bp.typography?.leadFont || 'N/A'}`);
    console.log(`  Animation Preset: ${bp.animationPreset || 'N/A'}`);
    console.log(`  Background Setup: ${bp.colorScheme?.background || 'N/A'}`);
  } else {
    console.log(`  Blueprint Found: Fallback to styleRegistry default`);
  }
});
