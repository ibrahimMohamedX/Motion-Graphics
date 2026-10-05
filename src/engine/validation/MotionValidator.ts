export function validateMotion(
  scenes: {
    id: string;
    visual?: {
      motion?: string[];
      beats?: {
        start: number;
        end: number;
      }[];
    };
  }[],
) {
  const errors: string[] = [];

  for (const scene of scenes) {
    const motion = scene.visual?.motion;

    if (!motion?.length) {
      errors.push(
        `${scene.id} has no motion strategy.`,
      );
    }

    const beats =
      scene.visual?.beats ?? [];

    for (const beat of beats) {
      if (beat.end <= beat.start) {
        errors.push(
          `${scene.id} contains an invalid motion beat.`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
