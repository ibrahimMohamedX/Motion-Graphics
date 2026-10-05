import type { SceneArchetype } from "../scenes/SceneArchetype";

type SelectionContext = {
  previousArchetypes: SceneArchetype[];
  currentIndex: number;
  totalScenes: number;
};

const MAX_RECENT_REUSE = 3;

export function canReuseArchetype(
  archetype: SceneArchetype,
  context: SelectionContext,
): boolean {
  const recent =
    context.previousArchetypes.slice(
      -MAX_RECENT_REUSE,
    );

  if (!recent.includes(archetype)) {
    return true;
  }

  if (
    context.currentIndex -
      context.previousArchetypes.lastIndexOf(
        archetype,
      ) >= 4
  ) {
    return true;
  }

  return false;
}

export function scoreArchetypeReuse(
  archetype: SceneArchetype,
  context: SelectionContext,
): number {
  const recent =
    context.previousArchetypes.slice(-5);

  const count = recent.filter(
    (item) => item === archetype,
  ).length;

  return count * 100;
}
