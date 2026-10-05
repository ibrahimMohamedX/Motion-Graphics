import { validateTimeline } from "./TimelineValidator";
import { validateVisualCoverage } from "./VisualCoverageValidator";
import { validateRepetition } from "./RepetitionValidator";
import { validateMotion } from "./MotionValidator";

export function validateVideoPlan(plan: any) {
  const timeline = validateTimeline(
    plan.scenes,
    plan.durationInSeconds,
  );

  const coverage =
    validateVisualCoverage(
      plan.scenes.map((scene: any) => ({
        id: scene.id,
        start: scene.start,
        end: scene.end,
        archetype: scene.visual?.archetype,
        primitives: scene.visual?.primitives,
      })),
    );

  const repetition =
    validateRepetition(
      plan.scenes.map((scene: any) => ({
        id: scene.id,
        archetype: scene.visual?.archetype,
      })),
    );

  const motion =
    validateMotion(plan.scenes);

  const errors = [
    ...timeline.errors,
    ...coverage.errors,
    ...motion.errors,
  ];

  const warnings = [
    ...timeline.warnings,
    ...repetition.warnings,
  ];

  return {
    valid: errors.length === 0,
    errors,
    warnings,

    checks: {
      timeline: timeline.valid,
      visualCoverage: coverage.valid,
      repetition: repetition.valid,
      motion: motion.valid,
    },
  };
}
