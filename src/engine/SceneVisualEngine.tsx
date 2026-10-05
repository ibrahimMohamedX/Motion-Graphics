import React from "react";
import { AbsoluteFill } from "remotion";

import type { SceneInput } from "./planner/ScenePlanner";
import { planScene } from "./planner/ScenePlanner";
import { VisualPlanRenderer } from "./VisualPlanRenderer";

type SceneVisualEngineProps = {
  scene: SceneInput;
};

export const SceneVisualEngine: React.FC<SceneVisualEngineProps> = ({
  scene,
}) => {
  const plan = planScene(scene);

  return (
    <AbsoluteFill>
      <VisualPlanRenderer plan={plan} />
    </AbsoluteFill>
  );
};
