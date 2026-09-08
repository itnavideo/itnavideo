import fs from 'node:fs/promises';
import path from 'node:path';
import { validateWhiteboardLayout, autoFixWhiteboardLayout } from '../services/ai/whiteboardPlanner.js';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'renders');
const planOutput = path.join(outputDir, 'whiteboard-test-plan.json');

const sampleRawPlan = {
  title: "Modern Enterprise Operations Bottlenecks & Strategic Mitigations",
  conclusion: "Accelerate digital system alignment with scalable high-performance global micro-architectures.",
  points: [
    {
      text: "Establishing a modern high performance system of records for logistics tracking and analysis",
      startTime: 1.0,
      endTime: 1.8,
      focusStartTime: 2.0,
      focusEndTime: 5.0,
      markerColor: "#1E40AF",
      bulletType: "bullet",
      boardIndex: 0
    },
    {
      text: "Implementing micro-frontends with standard react bundler mechanisms and dynamic chunking",
      startTime: 1.4,
      endTime: 2.2,
      focusStartTime: 5.2,
      focusEndTime: 8.0,
      markerColor: "#065F46",
      bulletType: "bullet",
      boardIndex: 0
    },
    {
      text: "Optimizing database execution query visualizers for core metrics and memory leaks",
      startTime: 1.8,
      endTime: 2.6,
      focusStartTime: 8.2,
      focusEndTime: 11.0,
      markerColor: "#1E40AF",
      bulletType: "bullet",
      boardIndex: 0
    },
    {
      text: "Scaling data layer integrations across global clusters seamlessly under heavy load",
      startTime: 2.2,
      endTime: 3.0,
      focusStartTime: 11.2,
      focusEndTime: 14.0,
      markerColor: "#991B1B",
      bulletType: "bullet",
      boardIndex: 0
    },
    {
      text: "Leveraging continuous integration workflows for SaaS apps in multi-region setups",
      startTime: 2.6,
      endTime: 3.4,
      focusStartTime: 14.2,
      focusEndTime: 17.0,
      markerColor: "#1E40AF",
      bulletType: "bullet",
      boardIndex: 0
    },
    {
      text: "Securing data at rest with multi-zone customer keys and rotation compliance rules",
      startTime: 3.0,
      endTime: 3.8,
      focusStartTime: 17.2,
      focusEndTime: 20.0,
      markerColor: "#065F46",
      bulletType: "bullet",
      boardIndex: 0
    }
  ]
};

async function runTest() {
  console.log('=== PHASE 1: INITIAL PLAN VALIDATION ===');
  const initialDiag = validateWhiteboardLayout(sampleRawPlan.title, sampleRawPlan.points, sampleRawPlan.conclusion);
  console.log(`Initial Validation Result: ${initialDiag.isValid ? 'VALID' : 'INVALID'}`);
  console.log('Issues Found:', initialDiag.issues);

  console.log('\n=== PHASE 2: AUTO-FIXING WORKFLOW ===');
  const fixed = autoFixWhiteboardLayout(sampleRawPlan.title, sampleRawPlan.points, sampleRawPlan.conclusion, 30);

  console.log('\n=== PHASE 3: POST-FIX PLAN VALIDATION ===');
  const postDiag = validateWhiteboardLayout(sampleRawPlan.title, fixed.points, sampleRawPlan.conclusion);
  console.log(`Post-Fix Validation Result: ${postDiag.isValid ? 'VALID' : 'INVALID'}`);
  console.log('Issues Remaining:', postDiag.issues);
  console.log('Diagnostics:', JSON.stringify(postDiag.boardDiagnostics, null, 2));

  // Build the final render props JSON structure
  const finalPlan = {
    compositionId: "WHITEBOARD-VIDEO",
    durationSeconds: 30,
    title: sampleRawPlan.title,
    titleColor: "#0F172A",
    points: fixed.points,
    conclusion: sampleRawPlan.conclusion,
    conclusionTime: fixed.conclusionTime,
    boardStyle: "corporate-luxury"
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(planOutput, JSON.stringify(finalPlan, null, 2));
  console.log(`\nSuccessfully saved test render plan to: ${planOutput}`);
}

runTest().catch(console.error);
