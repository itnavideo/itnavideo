import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = path.join(process.cwd(), 'public', 'caption-tests', 'whiteboard');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const mp4Path = path.join(outputDir, 'whiteboard-30s-test.mp4').replace(/\\/g, '/');
const stillPath = path.join(outputDir, 'whiteboard-still-frame45.png').replace(/\\/g, '/');
const propsPath = path.join(outputDir, 'test-props.json').replace(/\\/g, '/');

const testProps = {
  durationSeconds: 30,
  title: 'Executive AI Strategy',
  titleColor: '#0F172A',
  points: [
    {
      text: 'Target core bottleneck',
      startTime: 1.0,
      endTime: 6.5,
      focusStartTime: 1.0,
      focusEndTime: 6.5,
      markerColor: '#1E3A8A',
      bulletType: 'number',
      icon: 'lightbulb',
      drawingId: 'science_lightbulb_idea',
      boardIndex: 0,
      focusType: 'circle',
    },
    {
      text: 'Validate executive metrics',
      startTime: 7.0,
      endTime: 13.5,
      focusStartTime: 7.0,
      focusEndTime: 13.5,
      markerColor: '#0F766E',
      bulletType: 'number',
      icon: 'checkmark',
      drawingId: 'business_target_bullseye',
      boardIndex: 0,
      focusType: 'underline',
    },
    {
      text: 'Scale distribution fast',
      startTime: 14.0,
      endTime: 21.0,
      focusStartTime: 14.0,
      focusEndTime: 21.0,
      markerColor: '#B91C1C',
      bulletType: 'number',
      icon: 'arrow',
      drawingId: 'business_growth_chart',
      boardIndex: 1,
      focusType: 'box',
    },
    {
      text: 'Automate growth workflow',
      startTime: 21.5,
      endTime: 28.0,
      focusStartTime: 21.5,
      focusEndTime: 28.0,
      markerColor: '#1E3A8A',
      bulletType: 'number',
      icon: 'star',
      drawingId: 'process_curved_arrow',
      boardIndex: 1,
      focusType: 'arrow',
    },
  ],
  conclusion: 'Strategy alignment complete.',
  conclusionTime: 28.2,
};

fs.writeFileSync(propsPath, JSON.stringify(testProps, null, 2), 'utf-8');

console.log('Rendering Whiteboard PNG still at frame 45...');
execSync(`npx remotion still remotion/index.tsx WHITEBOARD-VIDEO "${stillPath}" --frame=45 --props="${propsPath}" --overwrite`, { stdio: 'pipe' });
console.log('✅ Still rendered:', stillPath);

console.log('Rendering 30s 1080x1920 MP4 Whiteboard Video...');
execSync(`npx remotion render remotion/index.tsx WHITEBOARD-VIDEO "${mp4Path}" --props="${propsPath}"`, { stdio: 'pipe' });
console.log('✅ 30s MP4 rendered:', mp4Path);

if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
