import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

const SFX = {
  whoosh: 'assets/sfx/compare/compare-whoosh.mp3',
  click: 'assets/sfx/compare/compare-click.mp3',
  ding: 'assets/sfx/compare/compare-ding.mp3',
  riser: 'assets/sfx/compare/compare-riser.mp3',
};

export function VideoSimpleExplainerSfx() {
  return (
    <>
      {/* Intro whoosh */}
      <Sequence from={0} durationInFrames={24}>
        <Audio src={staticFile(SFX.whoosh)} volume={0.88} />
      </Sequence>

      {/* Video frame / first subtitle beat */}
      <Sequence from={34} durationInFrames={18}>
        <Audio src={staticFile(SFX.click)} volume={0.82} />
      </Sequence>

      {/* Subtitle strip reveal */}
      <Sequence from={72} durationInFrames={20}>
        <Audio src={staticFile(SFX.whoosh)} volume={0.78} />
      </Sequence>

      {/* Title strip reveal */}
      <Sequence from={108} durationInFrames={18}>
        <Audio src={staticFile(SFX.click)} volume={0.80} />
      </Sequence>

      {/* Bottom explanation image reveal */}
      <Sequence from={145} durationInFrames={24}>
        <Audio src={staticFile(SFX.ding)} volume={0.82} />
      </Sequence>

      {/* Small energy riser */}
      <Sequence from={190} durationInFrames={30}>
        <Audio src={staticFile(SFX.riser)} volume={0.65} />
      </Sequence>
    </>
  );
}
