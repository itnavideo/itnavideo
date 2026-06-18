import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene } from './Scene';
import { SCENES } from './constants';

export const AutoDrawComposition = () => {
  return (
    <AbsoluteFill className="bg-white">
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.duration}
        >
          <Scene 
            title={scene.title}
            subtitle={scene.subtitle}
            points={scene.points}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};