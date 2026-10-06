import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const videoName = process.argv[2] ?? "agent-real-test";

const videoDir = path.join(root, "videos", videoName);
const transcriptPath = path.join(
  videoDir,
  "data",
  "transcript.json",
);
const outputPath = path.join(
  videoDir,
  "data",
  "scene-plan.json",
);

if (!fs.existsSync(transcriptPath)) {
  console.error(`Transcript not found: ${transcriptPath}`);
  process.exit(1);
}

const transcript = JSON.parse(
  fs.readFileSync(transcriptPath, "utf8"),
);

const captions = Array.isArray(transcript.captions)
  ? transcript.captions
  : [];

if (!captions.length) {
  console.error("No captions found.");
  process.exit(1);
}

const segments = captions.map((caption) => ({
  start: caption.startMs / 1000,
  end: caption.endMs / 1000,
  text: String(caption.text ?? "").trim(),
}));

const { createScenePlan } = await import(
  "../src/engine/planning/ScenePlanner.ts"
);

const audioPath = path.join(
  videoDir,
  "assets",
  "voice-over.wav",
);

const audio = fs.existsSync(audioPath)
  ? "voice-over.wav"
  : null;

const scenePlan = createScenePlan(
  segments,
  30,
  audio,
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(scenePlan, null, 2),
  "utf8",
);

console.log("");
console.log("=== GENERATE SCENE PLAN ===");
console.log("");
console.log(`Video: ${videoName}`);
console.log(`Scenes: ${scenePlan.scenes.length}`);
console.log(`Duration: ${scenePlan.durationInSeconds}s`);
console.log(`Audio: ${scenePlan.audio ?? "none"}`);
console.log("");

console.log("Scene mapping:");

for (const scene of scenePlan.scenes) {
  console.log(
    `${scene.id} | ` +
    `${scene.start.toFixed(2)}-${scene.end.toFixed(2)}s | ` +
    `${scene.intent} | ` +
    `${scene.visual.archetype ?? "primitive"}`,
  );
}

console.log("");
console.log(`Written to: ${outputPath}`);
console.log("");

