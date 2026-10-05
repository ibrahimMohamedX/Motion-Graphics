import type { VideoJob } from "./JobTypes";

export const createVideoJob = (
  id: string,
  directory: string,
  scenePlanPath: string,
  scenePlan: import("../planning/ScenePlanner").ScenePlan,
): VideoJob => ({
  id,
  name: id,
  directory,
  scenePlan,
  scenePlanPath,
  audioPath: scenePlan.audio ?? null,
});
