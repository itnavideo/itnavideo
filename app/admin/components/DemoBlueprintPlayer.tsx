'use client';

import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { LongVideoPro } from '@/remotion/templates/LONG_VIDEO_PRO/template';
import { DemoPresetBlueprint } from '@/services/templates/templateLibrary';
import { DEFAULT_FPS, secondsToFrames } from '@/remotion/constants';

export function DemoBlueprintPlayer({ demo }: { demo: DemoPresetBlueprint }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full aspect-video bg-zinc-950 rounded-xl flex flex-col items-center justify-center text-zinc-600 text-xs font-bold border border-zinc-800">
        <span className="animate-pulse">Loading Live Video Preview...</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 relative">
      <Player
        component={LongVideoPro}
        durationInFrames={secondsToFrames(10.5, DEFAULT_FPS)}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={DEFAULT_FPS}
        style={{
          width: '100%',
          height: '100%',
        }}
        controls
        autoPlay
        loop
        inputProps={{
          durationSeconds: 10.5,
          captions: demo.sampleData.captions,
          chapterEvents: demo.sampleData.chapterEvents,
          stickerEvents: demo.sampleData.stickerEvents,
          templateConfig: demo.templateConfig,
        }}
      />
    </div>
  );
}
