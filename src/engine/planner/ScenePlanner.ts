import type { VisualPlan } from "../visuals/VisualGrammar";
import {
  createScenePlan,
  type TranscriptSegment,
  type ScenePlan,
  visualForSegment,
} from "../planning/ScenePlanner";

// Re-export types from the authoritative planner
export type {
  TranscriptSegment,
  PlannedScene,
  ScenePlan,
} from "../planning/ScenePlanner";

/**
 * Legacy SceneInput type for backward compatibility with SceneVisualEngine.
 * @deprecated Use TranscriptSegment and createScenePlan for new code.
 */
export type SceneInput = {
  id: string;
  narration?: string;
  purpose?: string;
  durationMs?: number;
};

/**
 * Legacy planScene function for backward compatibility with SceneVisualEngine.
 * Converts SceneInput to a TranscriptSegment and uses the new visualForSegment.
 * @deprecated Use createScenePlan with TranscriptSegment[] for new code.
 */
export const planScene = (scene: SceneInput): VisualPlan => {
  const text = `${scene.narration ?? ""} ${scene.purpose ?? ""}`;

  const segment: TranscriptSegment = {
    start: 0,
    end: (scene.durationMs ?? 5000) / 1000,
    text,
  };

  return visualForSegment(segment);
};

/**
 * Legacy createScenePlan wrapper that accepts SceneInput[] for backward compatibility.
 * @deprecated Use createScenePlan with TranscriptSegment[] for new code.
 */
export const createScenePlanLegacy = (
  scenes: SceneInput[],
  fps = 30,
  audio: string | null = null
): ScenePlan => {
  const segments: TranscriptSegment[] = scenes.map((scene) => ({
    start: 0,
    end: (scene.durationMs ?? 5000) / 1000,
    text: `${scene.narration ?? ""} ${scene.purpose ?? ""}`,
  }));

  return createScenePlan(segments, fps, audio);
};