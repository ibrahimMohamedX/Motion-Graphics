import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const videoName = process.argv[2];

if (!videoName) {
  console.error("Usage: node scripts/prepare-job.mjs <video-name>");
  process.exit(1);
}

if (!/^[a-zA-Z0-9_-]+$/.test(videoName)) {
  console.error(`Invalid video name: ${videoName}`);
  process.exit(1);
}

const videoDir = path.join(root, "videos", videoName);
const scenePlanPath = path.join(videoDir, "data", "scene-plan.json");

if (!fs.existsSync(videoDir)) {
  console.error(`Video job not found: ${videoDir}`);
  process.exit(1);
}

if (!fs.existsSync(scenePlanPath)) {
  console.error(`scene-plan.json not found: ${scenePlanPath}`);
  process.exit(1);
}

const scenePlan = JSON.parse(
  fs.readFileSync(scenePlanPath, "utf8"),
);

const publicJobDir = path.join(
  root,
  "public",
  "jobs",
  videoName,
);

fs.mkdirSync(publicJobDir, {
  recursive: true,
});

const assetsDir = path.join(
  videoDir,
  "assets",
);

if (fs.existsSync(assetsDir)) {
  for (const entry of fs.readdirSync(assetsDir, {
    withFileTypes: true,
  })) {
    if (!entry.isFile()) continue;

    const source = path.join(
      assetsDir,
      entry.name,
    );

    const destination = path.join(
      publicJobDir,
      entry.name,
    );

    fs.copyFileSync(source, destination);
  }
}

const audioFile = scenePlan.audio
  ? path.basename(scenePlan.audio)
  : null;

const preparedScenePlan = {
  ...scenePlan,
  audio: audioFile
    ? `jobs/${videoName}/${audioFile}`
    : null,
};

const props = {
  videoName,
  scenePlan: preparedScenePlan,
};

const propsPath = path.join(
  videoDir,
  "data",
  "studio-props.json",
);

fs.writeFileSync(
  propsPath,
  JSON.stringify(props, null, 2),
  "utf8",
);

console.log("JOB READY");
console.log(`Video: ${videoName}`);
console.log(`Scene plan: ${scenePlanPath}`);
console.log(`Props: ${propsPath}`);
console.log(`Audio: ${preparedScenePlan.audio ?? "none"}`);
