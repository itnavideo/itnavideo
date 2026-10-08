import {
  CreateRoleCommand,
  GetRoleCommand,
  IAMClient,
  PutRolePolicyCommand,
  UpdateAssumeRolePolicyCommand,
} from '@aws-sdk/client-iam';
import {getRolePolicy} from '@remotion/lambda';
import {loadEnvLocal} from './load-env-local.mjs';

loadEnvLocal();

const roleName = 'remotion-lambda-role';
const accessKeyId = clean(process.env.AWS_ACCESS_KEY_ID);
const secretAccessKey = clean(process.env.AWS_SECRET_ACCESS_KEY);
const iam = new IAMClient({
  region: 'us-east-1',
  credentials: accessKeyId && secretAccessKey ? {accessKeyId, secretAccessKey} : undefined,
});

const assumeRolePolicyDocument = JSON.stringify({
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {Service: 'lambda.amazonaws.com'},
      Action: 'sts:AssumeRole',
    },
  ],
});

let roleExists = false;
try {
  await iam.send(new GetRoleCommand({RoleName: roleName}));
  roleExists = true;
} catch {
  roleExists = false;
}

if (!roleExists) {
  await iam.send(
    new CreateRoleCommand({
      RoleName: roleName,
      AssumeRolePolicyDocument: assumeRolePolicyDocument,
      Description: 'Execution role for Remotion Lambda renders',
    }),
  );
  process.stdout.write(`Created IAM role ${roleName}.\n`);
} else {
  await iam.send(
    new UpdateAssumeRolePolicyCommand({
      RoleName: roleName,
      PolicyDocument: assumeRolePolicyDocument,
    }),
  );
  process.stdout.write(`Updated trust policy for IAM role ${roleName}.\n`);
}

await iam.send(
  new PutRolePolicyCommand({
    RoleName: roleName,
    PolicyName: 'remotion-lambda-role-policy',
    PolicyDocument: getRolePolicy(),
  }),
);

process.stdout.write(`Attached Remotion Lambda inline policy to ${roleName}.\n`);
process.stdout.write('AWS may need a few seconds for IAM propagation before deploying Lambda.\n');

function clean(value) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}
