export function validateRepetition(
  scenes: {
    id: string;
    archetype?: string;
  }[],
) {
  const warnings: string[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const current = scenes[i].archetype;

    if (!current) continue;

    const previous =
      scenes[i - 1]?.archetype;

    const previous2 =
      scenes[i - 2]?.archetype;

    if (
      current === previous &&
      current === previous2
    ) {
      warnings.push(
        `Archetype "${current}" is repeated three times around ${scenes[i].id}.`,
      );
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
