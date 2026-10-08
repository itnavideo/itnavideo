/**
 * CLI Runner: Multi-Content Style Robustness & Fidelity Validation Suite
 *
 * Usage:
 *   node scripts/run-replication-test.mjs
 *   node scripts/run-replication-test.mjs dynamic-punch
 */

import {
  runStyleReplicationTest,
  runAllStylesReplicationTest,
} from '../services/ai/typographyReplication/replicationRunner.ts';

const targetStyle = process.argv[2];

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║   REAL-WORLD STYLE REPLICATION & ROBUSTNESS TEST SUITE       ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (targetStyle && targetStyle !== 'all') {
    console.log(`Running replication validation for single style: ${targetStyle}\n`);
    const report = await runStyleReplicationTest(targetStyle);

    console.log('\n================================================================');
    console.log(`   STYLE REPLICATION REPORT: ${report.styleName} (${report.styleId})`);
    console.log('================================================================');
    console.log(`  Overall Score:               ${report.overallScore}/100`);
    console.log(`  Blueprint Compliance (Layer A): ${report.blueprintComplianceScore}/100`);
    console.log(`  Visual Style Fidelity (Layer B): ${report.visualStyleFidelityScore}/100`);
    console.log(`  Multi-Content Robustness:    ${report.styleRobustnessScore}/100`);
    console.log(`  Threshold Status:            ${report.diagnosis.engineeringThreshold}\n`);

    console.log('Dimension Breakdown (Layer B):');
    console.log(`  - Typography:   ${report.dimensionScores.typography}/100`);
    console.log(`  - Composition:  ${report.dimensionScores.composition}/100`);
    console.log(`  - Motion:       ${report.dimensionScores.motion}/100`);
    console.log(`  - Color:        ${report.dimensionScores.color}/100`);
    console.log(`  - Layering:     ${report.dimensionScores.layering}/100`);
    console.log(`  - Timing/Rhythm:${report.dimensionScores.timing}/100\n`);

    console.log('Multi-Content Scenario Breakdown:');
    for (const [id, sc] of Object.entries(report.robustness.scenarioScores)) {
      console.log(`  - ${(sc.scenarioName + ':').padEnd(38)} ${sc.fidelityScore}/100`);
    }

    console.log(`\nRobustness Statistics:`);
    console.log(`  - Min Score:    ${report.robustness.minScore}/100 (${report.robustness.worstCaseScenario.scenarioName})`);
    console.log(`  - Max Score:    ${report.robustness.maxScore}/100 (${report.robustness.bestCaseScenario.scenarioName})`);
    console.log(`  - Average:      ${report.robustness.averageScore}/100`);
    console.log(`  - Variance:     ±${report.robustness.variance}`);
    console.log(`  - Primary Weakness: ${report.robustness.primaryWeakness}`);
    console.log(`  - Recommended Fix:  ${report.robustness.recommendedFix}\n`);

    console.log('What Matched:');
    report.whatMatched.slice(0, 4).forEach((m) => console.log(`  ✓ ${m}`));

    if (report.whatFailed.length > 0) {
      console.log('\nWhat Failed:');
      report.whatFailed.slice(0, 3).forEach((f) => console.log(`  ✗ ${f}`));
    }

    console.log(`\nPipeline Diagnosis:`);
    console.log(`  - Case:         ${report.diagnosis.caseType}`);
    console.log(`  - Bottleneck:   ${report.diagnosis.bottleneck}`);
    console.log(`  - Explanation:  ${report.diagnosis.explanation}`);
    console.log(`  - Fix:          ${report.diagnosis.recommendedFix}\n`);
    return;
  }

  const summary = await runAllStylesReplicationTest();

  console.log('\n================================================================');
  console.log('   10-STYLE BENCHMARK SCORECARD                                 ');
  console.log('================================================================');
  console.log('Style ID                Compliance   Fidelity   Robustness   Overall   Threshold');
  console.log('─────────────────────────────────────────────────────────────────────────────');

  for (const report of Object.values(summary.reports)) {
    const id = report.styleId.padEnd(23);
    const comp = `${report.blueprintComplianceScore}%`.padEnd(12);
    const fid = `${report.visualStyleFidelityScore}%`.padEnd(11);
    const rob = `${report.styleRobustnessScore}%`.padEnd(13);
    const ovr = `${report.overallScore}%`.padEnd(10);
    const thr = report.diagnosis.engineeringThreshold.split(' ')[0];
    console.log(`${id} ${comp} ${fid} ${rob} ${ovr} ${thr}`);
  }

  console.log('─────────────────────────────────────────────────────────────────────────────');
  console.log(`Average:                ${summary.averageComplianceScore}%        ${summary.averageFidelityScore}%        ${summary.averageRobustnessScore}%`);
  console.log(`Production Ready:       ${summary.stylesMeetingThreshold} / ${summary.totalStylesTested} styles (>=80% threshold)`);
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('[CLI_REPLICATION_ERROR]', err);
  process.exit(1);
});
