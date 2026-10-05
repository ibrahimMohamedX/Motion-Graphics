export type SceneData = {
  id: string;
  startMs: number;
  endMs: number;
  durationMs: number;
  purpose: string;
  narration: {
    text: string;
    startMs: number;
    endMs: number;
  };
  visual: {
    primary: string;
    supporting: string[];
    metaphor: string;
    component: string;
    assetType: string;
  };
  onScreenText: string[];
  animation: {
    component: string;
    duration: string;
    entrance: string;
    emphasis: string;
    motion: string;
  };
  transition: string;
  emphasis: string;
  assets: string[];
  brandElements: string[];
};

export type ScenesData = {
  version: number;
  engine: string;
  source: string;
  durationMs: number;
  durationSeconds: number;
  language: string;
  sceneCount: number;
  designPrinciples: string[];
  scenes: SceneData[];
};

export async function loadScenes(
  videoName: string,
): Promise<ScenesData> {
  const response = await fetch(
    `/videos/${videoName}/data/scenes.json`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load scenes.json: ${response.status}`,
    );
  }

  return response.json();
}
