import fs from 'fs';

const content = fs.readFileSync('components/dashboard/autocaption/AutoCaptionDualTabStudio.tsx', 'utf8');

// Find sections for caption styles, kinetics, and controls
const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Search for technical words like "Cinematic", "Dynamic", "Natural", or style definitions
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('wordClickSound') || lines[i].includes('autoDucking') || lines[i].includes('captionPosition') || lines[i].includes('captionFontSize')) {
    console.log(`L${i+1}: ${lines[i].trim()}`);
  }
}
