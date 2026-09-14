"use client";

import React, { useState, useEffect } from "react";
import { ImageToVideoStudio } from "@/components/dashboard/ImageToVideoStudio";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ITNAVIDEO_LIBRARY_BGM } from "@/components/dashboard/ImageToVideoStudio";

export default function ImageToVideoAIPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State management for ImageToVideoStudio
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageToVideoImages, setImageToVideoImages] = useState<File[]>([]);
  const [imageToVideoBgmEnabled, setImageToVideoBgmEnabled] = useState<boolean>(true);
  const [imageToVideoLibraryBgmUrl, setImageToVideoLibraryBgmUrl] = useState<string>(
    ITNAVIDEO_LIBRARY_BGM && ITNAVIDEO_LIBRARY_BGM.length > 0 ? ITNAVIDEO_LIBRARY_BGM[0].url : ""
  );
  const [imageToVideoBgm, setImageToVideoBgm] = useState<File | null>(null);
  const [imageToVideoBgmVolume, setImageToVideoBgmVolume] = useState<number>(0.15);
  const [topicTitle, setTopicTitle] = useState("");
  const [imageToVideoSubtitleStyle, setImageToVideoSubtitleStyle] = useState<string>("parallax-modern");
  const [imageToVideoCameraMotion, setImageToVideoCameraMotion] = useState<string>("ken-burns");
  const [imageToVideoFitMode, setImageToVideoFitMode] = useState<"blur-fill" | "cover">("cover");
  const [jobStatus, setJobStatus] = useState({ state: "idle", message: "" });
  const [audioCleanOptions, setAudioCleanOptions] = useState({
    removeSilence: true,
    removeFillers: true,
    removeRepeats: true,
    removeFalseStarts: true,
    noiseReduction: true,
    volumeNormalize: true,
    trimEnds: true,
    playbackSpeed: 1.0,
  });
  const [imageToVideoAssetMode, setImageToVideoAssetMode] = useState<"upload" | "library" | "ai-generate">("library");
  const [imageToVideoStockUrls, setImageToVideoStockUrls] = useState<string[]>([]);
  const [imageToVideoVisualStyle, setImageToVideoVisualStyle] = useState<"2d" | "3d" | "realistic">("realistic");
  const [imageToVideoCharacterFile, setImageToVideoCharacterFile] = useState<File | null>(null);
  const [imageToVideoCharacterDnaHint, setImageToVideoCharacterDnaHint] = useState<string>("");
  const [userCredits, setUserCredits] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, router, user]);

  const handleAddImageToVideoImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageToVideoImages((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const handleRemoveImageToVideoImage = (index: number) => {
    setImageToVideoImages((prev) => prev.filter((_, i) => i !== index));
  };

  const startRenderJob = () => {
    setJobStatus({ state: "uploading", message: "Preparing your video..." });
    // In a real app, this would trigger the actual upload/render pipeline
    setTimeout(() => {
      setJobStatus({ state: "idle", message: "" });
      alert("Render simulation complete");
    }, 2000);
  };

  if (loading || !user) return <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-zinc-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-white/10 bg-[#07090E]/80 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-xl">
        <Link
          href="/dashboard"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white">Image to Video AI</h1>
          <p className="text-[11px] sm:text-xs font-medium text-zinc-400">Turn voice & images into cinematic 16:9 videos</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto w-full">
        <div className="w-full mx-auto">
          <ImageToVideoStudio
            selectedAudio={selectedFile}
            onSelectAudio={setSelectedFile}
            imageFiles={imageToVideoImages}
            onAddImages={handleAddImageToVideoImages}
            onRemoveImage={handleRemoveImageToVideoImage}
            bgmEnabled={imageToVideoBgmEnabled}
            onChangeBgmEnabled={setImageToVideoBgmEnabled}
            selectedLibraryBgmUrl={imageToVideoLibraryBgmUrl}
            onChangeSelectedLibraryBgmUrl={setImageToVideoLibraryBgmUrl}
            bgmFile={imageToVideoBgm}
            onSelectBgm={setImageToVideoBgm}
            bgmVolume={imageToVideoBgmVolume}
            onChangeBgmVolume={setImageToVideoBgmVolume}
            topicTitle={topicTitle}
            onChangeTopicTitle={setTopicTitle}
            subtitleStyle={imageToVideoSubtitleStyle}
            onChangeSubtitleStyle={setImageToVideoSubtitleStyle}
            cameraMotionPreset={imageToVideoCameraMotion}
            onChangeCameraMotionPreset={setImageToVideoCameraMotion}
            fitMode={imageToVideoFitMode}
            onChangeFitMode={setImageToVideoFitMode}
            isRendering={jobStatus.state === "starting" || jobStatus.state === "rendering" || jobStatus.state === "uploading"}
            onStartRender={startRenderJob}
            userCredits={userCredits}
            audioCleanOptions={audioCleanOptions}
            setAudioCleanOptions={setAudioCleanOptions}
            userId={user?.id}
            assetSourceMode={imageToVideoAssetMode}
            onChangeAssetSourceMode={setImageToVideoAssetMode}
            selectedStockAssetUrls={imageToVideoStockUrls}
            onChangeSelectedStockAssetUrls={setImageToVideoStockUrls}
            visualStyle={imageToVideoVisualStyle}
            onChangeVisualStyle={setImageToVideoVisualStyle}
            characterImageFile={imageToVideoCharacterFile}
            onSelectCharacterImage={setImageToVideoCharacterFile}
            characterDnaHint={imageToVideoCharacterDnaHint}
            onChangeCharacterDnaHint={setImageToVideoCharacterDnaHint}
          />
        </div>
      </main>
    </div>
  );
}
