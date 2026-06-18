const fs = require("fs");

const path = "app/api/reels/jobs/status/route.ts";
let text = fs.readFileSync(path, "utf8");

const oldBlock = `    console.error('Render progress read failed:', error);
    return NextResponse.json({
      ok: true,
      state: 'rendering',
      renderId,
      bucketName,
      done: false,
      progress: 0,
      outputFile: null,
      errors: [],
      message: 'Render is still processing. Checking again shortly.',
      transient: true,
    });`;

const newBlock = `    console.error('Render progress read failed:', error);
    return NextResponse.json({
      ok: true,
      state: 'rendering',
      renderId,
      bucketName,
      done: false,
      progress: 0,
      outputFile: null,
      errors: [],
      message: 'Render is still processing. Checking again shortly.',
      transient: true,
      debug:
        process.env.NODE_ENV === 'production'
          ? undefined
          : {
              errorMessage: error instanceof Error ? error.message : String(error),
              region,
              functionName,
              hasRenderId: Boolean(renderId),
              hasBucketName: Boolean(bucketName),
            },
    });`;

if (!text.includes(oldBlock)) {
  console.error("Could not find status route catch block");
  process.exit(1);
}

text = text.replace(oldBlock, newBlock);
fs.writeFileSync(path, text, "utf8");
console.log("Local status debug patch applied.");
