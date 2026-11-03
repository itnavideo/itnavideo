const https = require('https');

const videos = [
  { name: "Video 1: $290k Breakdown", url: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3,w_640/v1793719251/vidssave.com_How_I_Made_290_000_Making_1_Video_a_Month_Full_Breakdown_360P_r9phpx.jpg" },
  { name: "Video 2: Health Insurance", url: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3,w_640/v1793719239/vidssave.com_Health_Insurance_Policy_For_Family___Health_Insurance_2027_360P_idknyg.jpg" },
  { name: "Video 3: $290k 7 Days", url: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3,w_640/v1793719074/vidssave.com_I_Made_2_90_000_in_just_7_days_WITH_PROOF_480P_co6hl1.jpg" },
  { name: "Video 4: 5000 Invest SIP", url: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3,w_640/v1793719062/vidssave.com_5_000_%E0%A4%95%E0%A4%B9%E0%A4%AA%E0%A4%B0_%E0%A4%A8%E0%A4%BF%E0%A4%B5%E0%A5%87%E0%A4%B6_%E0%A4%95%E0%A4%B0%E0%A5%87%E0%A4%82__FD_SIP_%E0%A4%AF%E0%A4%BE_%E0%A4%95%E0%A5%81%E0%A4%9B_%E0%A4%94%E0%A4%B0__360P_fbqlyn.jpg" },
  { name: "Video 5: Thumbnails 81%", url: "https://res.cloudinary.com/dhouh9idx/video/upload/so_3,w_640/v1793719025/vidssave.com_give_me_10_minutes_I_ll_make_your_thumbnails_81_better_360P_mwrxam.jpg" },
];

async function check() {
  for (const v of videos) {
    await new Promise((res) => {
      https.get(v.url, (response) => {
        console.log(`${v.name} -> HTTP ${response.statusCode}, size: ${response.headers['content-length']} bytes`);
        res();
      }).on('error', (e) => {
        console.error(`${v.name} error:`, e.message);
        res();
      });
    });
  }
}

check();

