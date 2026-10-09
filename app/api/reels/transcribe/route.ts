import { NextResponse } from "next/server";
import { createReadUrl } from "@/lib/gcs/mediaStorage";
import { transcribeMediaUrlWithGroq, transcribeMediaBlobWithGroq } from "@/services/ai/groqTranscription";
import { transcribeMediaWithGeminiFallback } from "@/services/ai/geminiTranscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentTypeHeader = request.headers.get("content-type") || "";

    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const fileName = String(formData.get("fileName") || file?.name || "uploaded_media.mp4");
      const spokenLanguage = String(formData.get("spokenLanguage") || "auto").trim();

      if (!file || file.size === 0) {
        return NextResponse.json(
          { ok: false, error: "Missing audio or video file in request." },
          { status: 400 }
        );
      }

      console.log(`[Transcribe API] In-memory Groq transcription for direct file upload: ${fileName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

      let result;
      try {
        result = await transcribeMediaBlobWithGroq({
          blob: file,
          fileName,
          contentType: file.type || undefined,
          language: spokenLanguage,
        });
      } catch (groqErr: any) {
        console.warn("[Transcribe API] Direct Groq transcription failed:", groqErr?.message);
        throw new Error(groqErr?.message || "Groq Whisper transcription failed.");
      }

      return NextResponse.json({
        ok: true,
        transcript: result.transcript || "",
        words: result.words || [],
        segments: result.segments || [],
        warning: result.warning,
      });
    }

    // JSON body with mediaKey
    const body = await request.json().catch(() => ({}));
    const mediaKey = String(body.mediaKey || "").trim();
    const spokenLanguage = String(body.spokenLanguage || "auto").trim();
    const fileName = String(body.fileName || "uploaded_media.mp4").trim();

    if (!mediaKey) {
      return NextResponse.json(
        { ok: false, error: "Missing mediaKey or file for transcription." },
        { status: 400 }
      );
    }

    const mediaUrl = await createReadUrl(mediaKey);
    let result;
    try {
      result = await transcribeMediaUrlWithGroq({
        mediaUrl,
        fileName,
        language: spokenLanguage,
      });
    } catch (groqError: any) {
      console.warn("[Transcribe API] Groq Whisper URL transcription failed, trying Gemini fallback:", groqError?.message);
      result = await transcribeMediaWithGeminiFallback({
        mediaUrl,
        fileName,
      });
    }

    if (!result) {
      throw new Error("Both Groq Whisper and Gemini transcription failed.");
    }

    return NextResponse.json({
      ok: true,
      transcript: result.transcript || "",
      words: result.words || [],
      segments: result.segments || [],
      warning: result.warning,
    });
  } catch (error: any) {
    console.error("[Transcribe API Error]:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to transcribe media." },
      { status: 500 }
    );
  }
}
