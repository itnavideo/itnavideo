"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileAudio, Loader2, Music2, Upload, XCircle } from "lucide-react";

type ConvertState = "idle" | "ready" | "converting" | "done" | "error";

const BITRATE = 320;

export default function WavToMp3Client() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ConvertState>("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [outputName, setOutputName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fileSize = useMemo(() => {
    if (!file) return "";
    const mb = file.size / (1024 * 1024);
    return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
  }, [file]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  function resetOutput() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");
    setOutputName("");
  }

  function chooseFile(nextFile: File | null) {
    resetOutput();
    setMessage("");

    if (!nextFile) {
      setFile(null);
      setState("idle");
      return;
    }

    const isWav =
      nextFile.type === "audio/wav" ||
      nextFile.type === "audio/x-wav" ||
      nextFile.name.toLowerCase().endsWith(".wav");

    if (!isWav) {
      setFile(null);
      setState("error");
      setMessage("Please upload a valid WAV audio file.");
      return;
    }

    setFile(nextFile);
    setState("ready");
  }

  async function convertToMp3() {
    if (!file) return;

    try {
      resetOutput();
      setState("converting");
      setMessage("Reading WAV file...");

      const arrayBuffer = await file.arrayBuffer();

      let audioBuffer: AudioBuffer;
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        setMessage("Decoding audio...");
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
        await audioContext.close?.();
      } catch (decodeError) {
        // Fallback: try parsing raw PCM WAV manually
        setMessage("Standard decode failed. Trying raw WAV parser...");
        const parsed = parseWavManually(arrayBuffer);
        if (!parsed) {
          throw new Error("This WAV format is not supported. Try re-exporting it as 16-bit PCM WAV.");
        }
        audioBuffer = parsed;
      }

      setMessage("Encoding high-quality MP3...");
      const mp3Blob = await encodeMp3(audioBuffer, BITRATE);

      const url = URL.createObjectURL(mp3Blob);
      const name = file.name.replace(/\.[^.]+$/, "") + ".mp3";

      setDownloadUrl(url);
      setOutputName(name);
      setState("done");
      setMessage("Your MP3 is ready.");
    } catch (error) {
      console.error("WAV to MP3 conversion failed:", error);
      setState("error");
      setMessage(
        error instanceof Error
          ? `Could not convert this WAV file. ${error.message}`
          : "Could not convert this WAV file. Please try another WAV file.",
      );
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-4 shadow-2xl shadow-brand-mint/10 sm:p-6">
      <div className="rounded-[1.55rem] border border-white/10 bg-black/45 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-mint">
              WAV to MP3
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">Free Converter</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-zinc-400">
              Converts locally in your browser.
            </p>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brand-mint/25 bg-brand-mint/10 text-brand-mint">
            <Music2 size={26} />
          </div>
        </div>

        <label className="mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-brand-mint/30 bg-brand-mint/[0.06] p-6 text-center transition hover:bg-brand-mint/[0.1]">
          <input
            ref={inputRef}
            accept=".wav,audio/wav,audio/x-wav"
            className="hidden"
            onChange={(event: ChangeEvent<HTMLInputElement>) => chooseFile(event.target.files?.[0] || null)}
            type="file"
          />
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-black/40 text-brand-mint">
            <Upload size={28} />
          </div>
          <p className="mt-5 text-lg font-black text-white">
            {file ? file.name : "Upload WAV file"}
          </p>
          <p className="mt-2 text-sm font-bold text-zinc-500">
            {file ? fileSize : "Drag or click to choose a .wav file"}
          </p>
        </label>

        {file ? (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex min-w-0 items-center gap-3">
              <FileAudio className="shrink-0 text-brand-mint" size={22} />
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{file.name}</p>
                <p className="text-xs font-bold text-zinc-500">{fileSize} • WAV audio</p>
              </div>
            </div>
            <button
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              onClick={() => {
                chooseFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              type="button"
            >
              <XCircle size={18} />
            </button>
          </div>
        ) : null}

        {message ? (
          <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
            state === "error"
              ? "border-red-400/25 bg-red-500/10 text-red-200"
              : "border-white/10 bg-white/[0.04] text-zinc-300"
          }`}>
            {message}
          </p>
        ) : null}

        <button
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-brand-mint disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!file || state === "converting"}
          onClick={convertToMp3}
          type="button"
        >
          {state === "converting" ? <Loader2 className="animate-spin" size={18} /> : null}
          {state === "converting" ? "Converting..." : "Convert to 320kbps MP3"}
        </button>

        {downloadUrl ? (
          <a
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-mint/30 bg-brand-mint/10 px-5 py-4 text-sm font-black text-brand-mint transition hover:bg-brand-mint hover:text-black"
            download={outputName}
            href={downloadUrl}
          >
            <Download size={18} />
            Download MP3
          </a>
        ) : null}
      </div>
    </section>
  );
}

async function encodeMp3(audioBuffer: AudioBuffer, bitrate: number) {
  // Load lamejs via script tag — the npm package breaks with modern bundlers
  await loadLameScript();

  const Mp3Encoder = (window as any).lamejs?.Mp3Encoder;
  if (!Mp3Encoder) {
    throw new Error("MP3 encoder could not load. Please refresh and try again.");
  }

  const channels = Math.min(2, audioBuffer.numberOfChannels);
  const sampleRate = audioBuffer.sampleRate;
  const encoder = new Mp3Encoder(channels, sampleRate, bitrate);
  const blockSize = 1152;
  const mp3Data: Uint8Array[] = [];

  const left = floatTo16BitPcm(audioBuffer.getChannelData(0));
  const right = channels > 1
    ? floatTo16BitPcm(audioBuffer.getChannelData(1))
    : null;

  for (let i = 0; i < left.length; i += blockSize) {
    const leftChunk = left.subarray(i, i + blockSize);
    const mp3Buffer = right
      ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + blockSize))
      : encoder.encodeBuffer(leftChunk);

    if (mp3Buffer.length > 0) {
      mp3Data.push(new Uint8Array(mp3Buffer));
    }
  }

  const end = encoder.flush();
  if (end.length > 0) {
    mp3Data.push(new Uint8Array(end));
  }

  return new Blob(mp3Data, { type: "audio/mpeg" });
}

function loadLameScript(): Promise<void> {
  if ((window as any).lamejs?.Mp3Encoder) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-lamejs]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), {once: true});
      existing.addEventListener('error', () => reject(new Error('Failed to load MP3 encoder')), {once: true});
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js';
    script.setAttribute('data-lamejs', 'true');
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load MP3 encoder from CDN'));
    document.head.appendChild(script);
  });
}

function floatTo16BitPcm(input: Float32Array) {
  const output = new Int16Array(input.length);

  for (let i = 0; i < input.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, input[i] || 0));
    output[i] = Math.round(sample < 0 ? sample * 0x8000 : sample * 0x7fff);
  }

  return output;
}

function parseWavManually(buffer: ArrayBuffer): AudioBuffer | null {
  try {
    const view = new DataView(buffer);

    // Check RIFF header
    const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    if (riff !== 'RIFF') return null;

    const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
    if (wave !== 'WAVE') return null;

    // Find fmt chunk
    let offset = 12;
    let channels = 1;
    let sampleRate = 44100;
    let bitsPerSample = 16;
    let dataOffset = 0;
    let dataSize = 0;

    while (offset < view.byteLength - 8) {
      const chunkId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
      const chunkSize = view.getUint32(offset + 4, true);

      if (chunkId === 'fmt ') {
        const audioFormat = view.getUint16(offset + 8, true);
        if (audioFormat !== 1 && audioFormat !== 3) return null; // Only PCM (1) or IEEE float (3)
        channels = view.getUint16(offset + 10, true);
        sampleRate = view.getUint32(offset + 12, true);
        bitsPerSample = view.getUint16(offset + 22, true);
      }

      if (chunkId === 'data') {
        dataOffset = offset + 8;
        dataSize = chunkSize;
        break;
      }

      offset += 8 + chunkSize;
      if (chunkSize % 2 !== 0) offset += 1; // padding byte
    }

    if (!dataOffset || !dataSize) return null;

    const bytesPerSample = bitsPerSample / 8;
    const numSamples = Math.floor(dataSize / (bytesPerSample * channels));

    // Create offline AudioBuffer-like object
    const channelData: Float32Array[] = [];
    for (let ch = 0; ch < channels; ch++) {
      channelData.push(new Float32Array(numSamples));
    }

    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < channels; ch++) {
        const byteOffset = dataOffset + (i * channels + ch) * bytesPerSample;
        let sample = 0;

        if (bitsPerSample === 16) {
          sample = view.getInt16(byteOffset, true) / 32768;
        } else if (bitsPerSample === 24) {
          const b0 = view.getUint8(byteOffset);
          const b1 = view.getUint8(byteOffset + 1);
          const b2 = view.getUint8(byteOffset + 2);
          const int24 = (b2 << 24 | b1 << 16 | b0 << 8) >> 8;
          sample = int24 / 8388608;
        } else if (bitsPerSample === 32) {
          sample = view.getFloat32(byteOffset, true);
        } else if (bitsPerSample === 8) {
          sample = (view.getUint8(byteOffset) - 128) / 128;
        }

        channelData[ch][i] = Math.max(-1, Math.min(1, sample));
      }
    }

    // Create a mock AudioBuffer interface
    const mockBuffer = {
      numberOfChannels: channels,
      sampleRate,
      length: numSamples,
      duration: numSamples / sampleRate,
      getChannelData: (channel: number) => channelData[channel] || channelData[0],
    } as unknown as AudioBuffer;

    return mockBuffer;
  } catch {
    return null;
  }
}

