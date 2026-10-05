import fs from "node:fs";
import path from "node:path";

const ALLOWED = {
  intents: [
    "hook", "problem", "explanation", "solution", "benefit", "comparison", "cta",
  ],
  archetypes: [
    "hero-question", "usage-counter", "appearance-to-utility",
    "fragmented-customer-journey", "unified-customer-journey",
    "business-insights-dashboard", "customer-retention-loop",
    "competition-pressure", "missed-opportunities",
    "digital-transformation", "custom-app-solution", "brand-cta",
  ],
  concepts: [
    "system", "data", "connection", "transformation", "comparison",
    "growth", "problem", "solution", "interface", "outcome",
  ],
  primitives: [
    "node", "path", "data-packet", "phone", "interface",
    "dashboard", "metric", "system", "comparison", "orbit",
  ],
  motions: [
    "build", "connect", "flow", "transform", "reveal",
    "compare", "emphasize", "resolve",
  ],
  zones: [
    "hero", "focus", "support", "data", "caption", "cta", "full",
  ],
  scales: ["micro", "small", "medium", "large", "hero"],
  anchors: ["top", "center", "bottom", "left", "right"],
  alignments: ["start", "center", "end"],
  spacing: ["tight", "normal", "wide"],
  densities: ["minimal", "balanced", "dense"],
};

const errors = [];
const fail = (fieldPath, message) => errors.push({ path: fieldPath, message });
const isObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
const isString = (v) => typeof v === "string";
const isNumber = (v) => typeof v === "number" && Number.isFinite(v);
const isStringArray = (v) => Array.isArray(v) && v.every((i) => typeof i === "string");
const isAllowed = (v, a) => a.includes(v);

const requireString = (obj, key, fp) => {
  if (!isString(obj[key]) || obj[key].trim() === "") fail(fp, "must be a non-empty string");
};
const requireNumber = (obj, key, fp) => {
  if (!isNumber(obj[key])) fail(fp, "must be a finite number");
};

const validatePrimitiveVisual = (visual, scenePath) => {
  requireString(visual, "concept", `${scenePath}.visual.concept`);
  if (isString(visual.concept) && !isAllowed(visual.concept, ALLOWED.concepts))
    fail(`${scenePath}.visual.concept`, `invalid value "${visual.concept}"`);

  if (!isStringArray(visual.primitives)) fail(`${scenePath}.visual.primitives`, "must be an array of strings");
  else {
    if (visual.primitives.length === 0) fail(`${scenePath}.visual.primitives`, "must contain at least one primitive");
    visual.primitives.forEach((p, i) => {
      if (!isAllowed(p, ALLOWED.primitives)) fail(`${scenePath}.visual.primitives[${i}]`, `invalid primitive "${p}"`);
    });
  }

  if (!isStringArray(visual.motion)) fail(`${scenePath}.visual.motion`, "must be an array of strings");
  else {
    if (visual.motion.length === 0) fail(`${scenePath}.visual.motion`, "must contain at least one motion strategy");
    visual.motion.forEach((m, i) => {
      if (!isAllowed(m, ALLOWED.motions)) fail(`${scenePath}.visual.motion[${i}]`, `invalid motion "${m}"`);
    });
  }

  if (!isObject(visual.layout)) fail(`${scenePath}.visual.layout`, "must be an object");
  else {
    const L = visual.layout;
    requireString(L, "zone", `${scenePath}.visual.layout.zone`);
    requireString(L, "scale", `${scenePath}.visual.layout.scale`);
    requireString(L, "anchor", `${scenePath}.visual.layout.anchor`);
    requireString(L, "alignment", `${scenePath}.visual.layout.alignment`);
    requireString(L, "spacing", `${scenePath}.visual.layout.spacing`);
    if (isString(L.zone) && !isAllowed(L.zone, ALLOWED.zones)) fail(`${scenePath}.visual.layout.zone`, `invalid zone "${L.zone}"`);
    if (isString(L.scale) && !isAllowed(L.scale, ALLOWED.scales)) fail(`${scenePath}.visual.layout.scale`, `invalid scale "${L.scale}"`);
    if (isString(L.anchor) && !isAllowed(L.anchor, ALLOWED.anchors)) fail(`${scenePath}.visual.layout.anchor`, `invalid anchor "${L.anchor}"`);
    if (isString(L.alignment) && !isAllowed(L.alignment, ALLOWED.alignments)) fail(`${scenePath}.visual.layout.alignment`, `invalid alignment "${L.alignment}"`);
    if (isString(L.spacing) && !isAllowed(L.spacing, ALLOWED.spacing)) fail(`${scenePath}.visual.layout.spacing`, `invalid spacing "${L.spacing}"`);
  }

  requireString(visual, "density", `${scenePath}.visual.density`);
  if (isString(visual.density) && !isAllowed(visual.density, ALLOWED.densities))
    fail(`${scenePath}.visual.density`, `invalid density "${visual.density}"`);
};

const validateArchetypeVisual = (visual, scenePath) => {
  if (!isString(visual.archetype) || visual.archetype.trim() === "") {
    fail(`${scenePath}.visual.archetype`, "must be a non-empty string");
    return;
  }
  if (!isAllowed(visual.archetype, ALLOWED.archetypes))
    fail(`${scenePath}.visual.archetype`, `invalid archetype "${visual.archetype}"`);
  if (visual.props !== undefined && !isObject(visual.props))
    fail(`${scenePath}.visual.props`, "must be an object when provided");
};

const validateVisual = (visual, scenePath) => {
  if (!isObject(visual)) { fail(`${scenePath}.visual`, "must be an object"); return; }
  const hasArchetype = isString(visual.archetype) && visual.archetype.trim() !== "";
  const hasPrimitive = visual.concept !== undefined || visual.primitives !== undefined || visual.motion !== undefined || visual.layout !== undefined || visual.density !== undefined;
  if (hasArchetype) {
    validateArchetypeVisual(visual, scenePath);
    if (hasPrimitive) fail(`${scenePath}.visual`, "archetype visual must not also contain primitive-plan fields");
    return;
  }
  if (!hasPrimitive) { fail(`${scenePath}.visual`, "must contain either an archetype or a primitive visual plan"); return; }
  validatePrimitiveVisual(visual, scenePath);
};

const validateScene = (scene, index) => {
  const fp = `scenes[${index}]`;
  if (!isObject(scene)) { fail(fp, "must be an object"); return; }
  requireString(scene, "id", `${fp}.id`);
  requireNumber(scene, "start", `${fp}.start`);
  requireNumber(scene, "end", `${fp}.end`);
  requireString(scene, "narration", `${fp}.narration`);
  requireString(scene, "intent", `${fp}.intent`);
  if (isString(scene.intent) && !isAllowed(scene.intent, ALLOWED.intents)) fail(`${fp}.intent`, `invalid intent "${scene.intent}"`);
  if (isNumber(scene.start) && isNumber(scene.end) && scene.end <= scene.start) fail(`${fp}.end`, "must be greater than start");
  if (isNumber(scene.start) && scene.start < 0) fail(`${fp}.start`, "cannot be negative");
  validateVisual(scene.visual, fp);
};

const validateScenePlan = (plan) => {
  if (!isObject(plan)) { fail("root", "scene plan must be an object"); return; }
  requireNumber(plan, "fps", "fps");
  requireNumber(plan, "durationInSeconds", "durationInSeconds");
  if (isNumber(plan.fps) && plan.fps <= 0) fail("fps", "must be greater than zero");
  if (isNumber(plan.durationInSeconds) && plan.durationInSeconds <= 0) fail("durationInSeconds", "must be greater than zero");
  if (!Array.isArray(plan.scenes)) { fail("scenes", "must be an array"); return; }
  if (plan.scenes.length === 0) { fail("scenes", "must contain at least one scene"); return; }
  let prevEnd = 0;
  plan.scenes.forEach((s, i) => {
    validateScene(s, i);
    if (!isObject(s)) return;
    if (isNumber(s.start) && isNumber(s.end)) {
      if (i === 0 && s.start > 0.05) fail(`scenes[${i}].start`, "first scene should start at or near 0");
      if (i > 0 && s.start < prevEnd - 0.05) fail(`scenes[${i}].start`, "scene overlaps the previous scene");
      prevEnd = Math.max(prevEnd, s.end);
      if (isNumber(plan.durationInSeconds) && s.end > plan.durationInSeconds + 0.05) fail(`scenes[${i}].end`, "scene exceeds durationInSeconds");
    }
  });
};

// Load and validate test file
const testPath = path.resolve("/sessions/hopeful-amazing-goodall/mnt/AI-Motion-Graphics/scripts/test-scene-plan.json");
const raw = fs.readFileSync(testPath, "utf8");
const plan = JSON.parse(raw);

validateScenePlan(plan);

if (errors.length > 0) {
  console.error(`\nValidation failed: ${errors.length} error(s)\n`);
  errors.forEach(e => console.error(`- ${e.path}: ${e.message}`));
  console.error("");
  process.exit(1);
}

console.log("\n✅ Scene plan validation passed.");
console.log(`File: ${testPath}`);
console.log(`FPS: ${plan.fps}`);
console.log(`Duration: ${plan.durationInSeconds}s`);
console.log(`Scenes: ${plan.scenes.length}`);
const archCount = plan.scenes.filter(s => isObject(s.visual) && isString(s.visual.archetype)).length;
console.log(`Archetype scenes: ${archCount}`);
const primCount = plan.scenes.filter(s => isObject(s.visual) && !isString(s.visual.archetype)).length;
console.log(`Primitive fallback scenes: ${primCount}`);
console.log("");

plan.scenes.forEach((s, i) => {
  const arch = isObject(s.visual) && isString(s.visual.archetype) ? s.visual.archetype : "primitive";
  console.log(`  Scene ${i+1}: intent="${s.intent}" archetype="${arch}"`);
});

console.log("\n🎉 All archetype mappings validated successfully!");
process.exit(0);