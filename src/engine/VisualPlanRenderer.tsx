import React from "react";
import {
  AbsoluteFill,
} from "remotion";

import type {
  VisualPlan,
} from "./visuals/VisualGrammar";

import { ArchetypeSceneRenderer } from "./scenes/ArchetypeSceneRenderer";
import { PRIMITIVE_REGISTRY } from "./registry/PrimitiveRegistry";
import { MOTION_REGISTRY } from "./registry/MotionRegistry";
import { resolveLayout } from "./layout/LayoutEngine";
import { VisualStage } from "./layout/VisualStage";

type VisualPlanRendererProps = {
  plan: VisualPlan;
};

/**
 * IMPORTANT:
 * Motion is intentionally subtle.
 *
 * We do NOT scale the entire scene aggressively anymore.
 * Scene-level motion should only control opacity / very small movement.
 * Individual visual components should own their detailed animation.
 */
export const VisualPlanRenderer: React.FC<VisualPlanRendererProps> = ({
  plan,
}) => {


  /*
   * ARCHETYPE SCENE
   *
   * Important:
   * Do NOT apply large scale transforms here.
   * The actual archetype is responsible for its own element motion.
   */
  if (plan.archetype) {
    return (
      <AbsoluteFill>
        <VisualStage>
          <ArchetypeSceneRenderer
            archetype={plan.archetype}
            sceneProps={plan.props}
          />
        </VisualStage>
      </AbsoluteFill>
    );
  }

  /*
   * PRIMITIVE MODE
   */
  return (
    <AbsoluteFill>
      {(plan.primitives ?? []).map((primitive, index) => {
        const renderer = PRIMITIVE_REGISTRY[primitive];

        if (!renderer) {
          return null;
        }

        const motions = plan.motion ?? [];

        const motion = MOTION_REGISTRY[
          motions[index % Math.max(motions.length, 1)]
        ] ?? {
          delay: index * 4,
          duration: 18,
        };

        const bounds = resolveLayout(
          plan.layout,
          index,
          plan.primitives.length,
        );

        return (
          <div
            key={`${primitive}-${index}`}
            style={{
              position: "absolute",
              left: `${bounds.x}%`,
              top: `${bounds.y}%`,
              width: `${bounds.width}%`,
              height: `${bounds.height}%`,
            }}
          >
            <VisualStage>
              {renderer({
                delay: motion.delay + index * 3,
                active: index === plan.primitives.length - 1,
                bounds,
              })}
            </VisualStage>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};





