export type TimelineScene = {
  id: string;
  start: number;
  end: number;
};

export type TimelineValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function validateTimeline(
  scenes: TimelineScene[],
  duration: number,
): TimelineValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!scenes.length) {
    errors.push("Timeline contains no scenes.");

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  const sorted = [...scenes].sort(
    (a, b) => a.start - b.start,
  );

  if (sorted[0].start > 0.001) {
    errors.push(
      `Timeline starts at ${sorted[0].start}s instead of 0s.`,
    );
  }

  for (let i = 0; i < sorted.length; i++) {
    const scene = sorted[i];

    if (scene.end <= scene.start) {
      errors.push(
        `${scene.id} has invalid duration.`,
      );
    }

    if (scene.start < 0) {
      errors.push(
        `${scene.id} starts before 0.`,
      );
    }

    if (scene.end > duration + 0.001) {
      errors.push(
        `${scene.id} exceeds video duration.`,
      );
    }

    const next = sorted[i + 1];

    if (!next) continue;

    const gap = next.start - scene.end;

    if (gap > 0.001) {
      errors.push(
        `Black-frame gap detected between ${scene.id} and ${next.id}: ${gap.toFixed(3)}s.`,
      );
    }

    if (gap < -0.001) {
      errors.push(
        `Scene overlap detected between ${scene.id} and ${next.id}.`,
      );
    }
  }

  const last = sorted[sorted.length - 1];

  if (
    Math.abs(last.end - duration) > 0.05
  ) {
    warnings.push(
      `Timeline ends at ${last.end}s while video duration is ${duration}s.`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
