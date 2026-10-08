import { NextResponse } from 'next/server';

export async function GET() {
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Itnavideo</title>
    <link>https://www.itnavideo.com</link>
    <description>AI Video Generation and Transcription Platform</description>
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
