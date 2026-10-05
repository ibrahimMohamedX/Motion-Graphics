import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

import type { ScenesData } from "../data/loadScenes";
import type { TranscriptData } from "../data/transcript";

import { SceneRenderer } from "../scenes/SceneRenderer";
import { Captions } from "./Captions";

export type VideoProps = {
  videoName: string;
  scenes?: ScenesData;
};

export const VideoRenderer: React.FC<VideoProps> = ({ videoName, scenes }) => {
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(staticFile(`videos/${videoName}/data/transcript.json`))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load transcript.json: ${response.status}`);
        }

        return response.json();
      })
      .then((data: TranscriptData) => {
        if (!cancelled) {
          setTranscript(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load transcript:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [videoName]);

  if (!scenes) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
      }}
    >
      <Audio src={staticFile(`videos/${videoName}/assets/voice-over.wav`)} />

      {scenes.scenes.map((scene) => {
        const from = Math.round((scene.startMs / 1000) * 30);

        const duration = Math.max(
          1,
          Math.round((scene.durationMs / 1000) * 30),
        );

        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration}>
            <SceneRenderer scene={scene} />
          </Sequence>
        );
      })}

      {transcript && <Captions captions={transcript.captions} />}
    </AbsoluteFill>
  );
};
