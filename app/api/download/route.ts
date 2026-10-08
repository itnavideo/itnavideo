import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get("url");
    let filename = searchParams.get("filename") || "Itnavideo-Export.mp4";

    if (!mediaUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Ensure valid filename format
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Fetch the binary stream from S3 / cloud storage server-side
    const response = await fetch(mediaUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch media file: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Detect Content-Type safely
    let contentType = response.headers.get("content-type");
    if (!contentType || contentType === "application/octet-stream") {
      if (cleanFilename.endsWith(".mp3") || mediaUrl.includes(".mp3")) {
        contentType = "audio/mpeg";
      } else if (cleanFilename.endsWith(".wav") || mediaUrl.includes(".wav")) {
        contentType = "audio/wav";
      } else {
        contentType = "video/mp4";
      }
    }

    // Stream binary directly to browser with forced download attachment header
    return new NextResponse(response.body as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${cleanFilename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Download proxy endpoint error:", error);
    return NextResponse.json({ error: "Download proxy failed" }, { status: 500 });
  }
}
