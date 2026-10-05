import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type {
  MotionStrategy,
  SceneBeat,
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

function getActiveBeat(
  beats: SceneBeat[] | undefined,
  frame: number,
  fps: number,
): SceneBeat | undefined {
  if (!beats?.length) return undefined;

  const time = frame / fps;

  return (
    beats.find((beat) => time >= beat.start && time < beat.end) ??
    beats[beats.length - 1]
  );
}

/**
 * IMPORTANT:
 * Motion is intentionally subtle.
 *
 * We do NOT scale the entire scene aggressively anymore.
 * Scene-level motion should only control opacity / very small movement.
 * Individual visual components should own their detailed animation.
 */
function getSceneMotionStyle(
  motion: MotionStrategy | undefined,
  frame: number,
  fps: number,
  beat: SceneBeat | undefined,
): React.CSSProperties {
  if (!beat) {
    return {};
  }

  const startFrame = Math.round(beat.start * fps);

  const endFrame = Math.max(startFrame + 1, Math.round(beat.end * fps));

  const beatFrame = frame - startFrame;

  const beatDuration = endFrame - startFrame;

  const progress = interpolate(
    beatFrame,
    [0, Math.min(18, beatDuration)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  switch (motion ?? beat.motion) {
    case "reveal":
      return {
        transform: `translateY(${(1 - progress) * 18}px)`,
      };

    case "connect":
      return {
        transform: `translateX(${(1 - progress) * -18}px)`,
      };

    case "flow":
      return {
        transform: `translateX(${(1 - progress) * 24}px)`,
      };

    case "transform":
      return {
        transform: `translateY(${(1 - progress) * 12}px)`,
      };

    case "resolve":
      return {
        transform: `translateY(${(1 - progress) * 10}px)`,
      };

    case "emphasize":
      return {};

    default:
      return {};
  }
}

export const VisualPlanRenderer: React.FC<VisualPlanRendererProps> = ({
  plan,
}) => {
  const frame = useCurrentFrame();

  const { fps } = useVideoConfig();

  const activeBeat = getActiveBeat(plan.beats, frame, fps);

  const activeMotion = activeBeat?.motion ?? plan.motion?.[0];

  const sceneMotion = getSceneMotionStyle(activeMotion, frame, fps, activeBeat);

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
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            ...sceneMotion,
          }}
        >
          <VisualStage>
            <ArchetypeSceneRenderer
              archetype={plan.archetype}
              sceneProps={plan.props}
            />
          </VisualStage>
        </div>
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
