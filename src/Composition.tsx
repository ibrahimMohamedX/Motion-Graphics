import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";

import { SceneComposer } from "./engine/SceneComposer";
import type { ScenePlan } from "./engine/planning/ScenePlanner";

export type VideoInputProps = {
  videoName: string;
  scenePlan: ScenePlan;
};

export const MyComposition: React.FC<VideoInputProps> = ({ scenePlan }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <SceneComposer plan={scenePlan} fps={fps} />

      {scenePlan.audio && (
        <Sequence
          durationInFrames={Math.ceil(scenePlan.durationInSeconds * fps)}
        >
          <Audio src={staticFile(scenePlan.audio)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
