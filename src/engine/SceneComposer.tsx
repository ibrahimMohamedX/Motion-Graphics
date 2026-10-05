import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

import type { ScenePlan } from "./planning/ScenePlanner";
import { VisualPlanRenderer } from "./VisualPlanRenderer";
import { planSceneBeats } from "./planning/BeatPlanner";

type SceneComposerProps = {
  plan: ScenePlan;
  fps: number;
};

export const SceneComposer: React.FC<SceneComposerProps> = ({ plan, fps }) => {
  return (
    <AbsoluteFill>
      {plan.scenes.map((scene) => {
        const from = Math.max(0, Math.round(scene.start * fps));

        const duration = Math.max(
          1,
          Math.round((scene.end - scene.start) * fps),
        );

        const sceneDuration = Math.max(0.1, scene.end - scene.start);

        const beats =
          scene.visual.beats ??
          planSceneBeats({
            start: 0,
            end: sceneDuration,
          });

        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration}>
            <VisualPlanRenderer
              plan={{
                ...scene.visual,
                beats,
              }}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
