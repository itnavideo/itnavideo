import { NextResponse } from "next/server";
import { uploadTemporaryMediaObject, createReadUrl } from "@/lib/aws/mediaStorage";
import { transcribeMediaUrlWithGroq } from "@/services/ai/groqTranscription";
import { transcribeMediaWithGeminiFallback } from "@/services/ai/geminiTranscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentTypeHeader = request.headers.get("content-type") || "";

    let mediaUrl = "";
    let fileName = "uploaded_audio.mp3";
    let spokenLanguage = "auto";

    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      fileName = String(formData.get("fileName") || file?.name || "uploaded_audio.mp3");
      spokenLanguage = String(formData.get("spokenLanguage") || "auto").trim();

      if (!file) {
        return NextResponse.json(
          { ok: false, error: "Missing audio file in request." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const { key } = await uploadTemporaryMediaObject({
        body: buffer,
        contentType: file.type || "audio/mpeg",
        fileName: `transcribe-${Date.now()}-${fileName}`,
        mode: "audio",
        userId: "anonymous",
        purpose: "transcription",
      });
      mediaUrl = await createReadUrl(key);
    } else {
      const body = await request.json().catch(() => ({}));
      const mediaKey = String(body.mediaKey || "").trim();
      spokenLanguage = String(body.spokenLanguage || "auto").trim();
      fileName = String(body.fileName || "uploaded_media.mp4").trim();

      if (!mediaKey) {
        return NextResponse.json(
          { ok: false, error: "Missing mediaKey or file for transcription." },
          { status: 400 }
        );
      }

      mediaUrl = await createReadUrl(mediaKey);
    }

    let result;
    try {
      result = await transcribeMediaUrlWithGroq({
        mediaUrl,
        fileName,
      });
    } catch (groqError: any) {
      console.warn("[Transcribe API] Groq Whisper failed, trying Gemini fallback:", groqError?.message);
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
