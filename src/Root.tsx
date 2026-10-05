import React from "react";

import { Composition } from "remotion";

import { MyComposition } from "./Composition";

import "./index.css";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";

import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";

const FPS = 30;

const defaultProps = {
  videoName: "agent-test",

  scenePlan: {
    fps: FPS,
    durationInSeconds: 8,
    audio: null,
    scenes: [],
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      defaultProps={defaultProps}
      durationInFrames={FPS * defaultProps.scenePlan.durationInSeconds}
      fps={FPS}
      width={1080}
      height={1920}
      calculateMetadata={({ props }) => {
        const durationInSeconds = props.scenePlan?.durationInSeconds ?? 8;

        const fps = props.scenePlan?.fps ?? FPS;

        return {
          durationInFrames: Math.max(1, Math.ceil(durationInSeconds * fps)),
          fps,
        };
      }}
    />
  );
};
