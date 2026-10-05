export type VisualCoverageScene = {
  id: string;
  start: number;
  end: number;
  archetype?: string;
  primitives?: unknown[];
};

export function validateVisualCoverage(
  scenes: VisualCoverageScene[],
) {
  const errors: string[] = [];

  for (const scene of scenes) {
    const hasArchetype =
      Boolean(scene.archetype);

    const hasPrimitives =
      Array.isArray(scene.primitives) &&
      scene.primitives.length > 0;

    if (!hasArchetype && !hasPrimitives) {
      errors.push(
        `${scene.id} has no visual renderer.`,
      );
    }

    if (scene.end <= scene.start) {
      errors.push(
        `${scene.id} has no visual duration.`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
