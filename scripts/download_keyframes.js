const fs = require('fs');
const https = require('https');
const path = require('path');

const scratchDir = "C:\\Users\\user\\.gemini\\antigravity\\brain\\d047ad33-17c1-4d36-bc00-54a3cf680c1f\\scratch";
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

const frames = [2, 5, 10, 18];

async function downloadFrames() {
  for (const s of frames) {
    const url = `https://res.cloudinary.com/dhouh9idx/video/upload/so_${s},w_800/v1793719251/vidssave.com_How_I_Made_290_000_Making_1_Video_a_Month_Full_Breakdown_360P_r9phpx.jpg`;
    const outPath = path.join(scratchDir, `video1_sec_${s}.jpg`);
    await new Promise((res) => {
      const file = fs.createWriteStream(outPath);
      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Saved frame at ${s}s to ${outPath}`);
          res();
        });
      }).on('error', (e) => {
        console.error(e);
        res();
      });
    });
  }
}

downloadFrames();

