import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const rootDir = "/sessions/zen-peaceful-euler/mnt/AI-Motion-Graphics";
const entryPoint = path.resolve(rootDir, "src/index.ts");
const compositionId = "MyComposition";
const outputLocation = path.resolve(rootDir, "videos/agent-real-test/output/test-frame.png");

const propsPath = path.resolve(rootDir, "videos/agent-real-test/data/studio-props.json");
const props = JSON.parse(fs.readFileSync(propsPath, "utf8"));

console.log("Bundling...");
const bundled = await bundle(entryPoint, (progress) => {
    console.log(`Bundle progress: ${Math.round(progress * 100)}%`);
  });

console.log("Selecting composition...");
const composition = await selectComposition({
  serveUrl: bundled,
  id: compositionId,
  inputProps: props,
});

console.log("Rendering still frame at frame 0...");
await renderStill({
  serveUrl: bundled,
  composition,
  outputLocation,
  inputProps: props,
  frame: 0,
  browserLaunchOptions: {
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
      "--disable-software-rasterizer",
    ],
  },
});

console.log("Done!");
