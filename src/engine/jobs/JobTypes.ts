import type { ScenePlan } from "../planning/ScenePlanner";

export type VideoJob = {
  id: string;
  name: string;
  directory: string;
  scenePlan: ScenePlan;
  scenePlanPath: string;
  audioPath: string | null;
};
