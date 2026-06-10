import {DescribeInstancesCommand, EC2Client, StopInstancesCommand} from '@aws-sdk/client-ec2';
import {loadEnvLocal} from './load-env-local.mjs';

loadEnvLocal();

const region = clean(process.env.REMOTION_AWS_REGION || process.env.AWS_REGION) || 'ap-south-1';
const action = process.argv[2] || 'list';
const instanceIds = process.argv.slice(3).filter(Boolean);
const accessKeyId = clean(process.env.AWS_ACCESS_KEY_ID);
const secretAccessKey = clean(process.env.AWS_SECRET_ACCESS_KEY);

const ec2 = new EC2Client({
  region,
  credentials: accessKeyId && secretAccessKey ? {accessKeyId, secretAccessKey} : undefined,
});

if (action === 'list') {
  const response = await ec2.send(new DescribeInstancesCommand({}));
  const rows = [];
  for (const reservation of response.Reservations || []) {
    for (const instance of reservation.Instances || []) {
      rows.push({
        id: instance.InstanceId,
        state: instance.State?.Name,
        type: instance.InstanceType,
        name: (instance.Tags || []).find((tag) => tag.Key === 'Name')?.Value || '',
      });
    }
  }
  if (!rows.length) {
    process.stdout.write('No EC2 instances found in this region.\n');
  } else {
    console.table(rows);
  }
} else if (action === 'stop') {
  if (!instanceIds.length) {
    throw new Error('Pass instance ids to stop. Example: node scripts/ec2-cost-control.mjs stop i-1234567890abcdef0');
  }
  await ec2.send(new StopInstancesCommand({InstanceIds: instanceIds}));
  process.stdout.write(`Stop requested for: ${instanceIds.join(', ')}\n`);
} else {
  throw new Error('Unknown action. Use "list" or "stop".');
}

function clean(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}
