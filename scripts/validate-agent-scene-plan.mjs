import fs from "node:fs";
import path from "node:path";

const ALLOWED = {
  intents: ["hook","problem","explanation","solution","benefit","comparison","cta"],
  archetypes: ["hero-question","usage-counter","appearance-to-utility","fragmented-customer-journey","unified-customer-journey","business-insights-dashboard","customer-retention-loop","competition-pressure","missed-opportunities","digital-transformation","custom-app-solution","brand-cta"],
  concepts: ["system","data","connection","transformation","comparison","growth","problem","solution","interface","outcome"],
  primitives: ["node","path","data-packet","phone","interface","dashboard","metric","system","comparison","orbit"],
  motions: ["build","connect","flow","transform","reveal","compare","emphasize","resolve"],
  zones: ["hero","focus","support","data","caption","cta","full"],
  scales: ["micro","small","medium","large","hero"],
  anchors: ["top","center","bottom","left","right"],
  alignments: ["start","center","end"],
  spacing: ["tight","normal","wide"],
  densities: ["minimal","balanced","dense"],
};

const errors = [];
const fail = (fp, msg) => errors.push({path: fp, message: msg});
const isObject = v => typeof v === "object" && v !== null && !Array.isArray(v);
const isString = v => typeof v === "string";
const isNumber = v => typeof v === "number" && Number.isFinite(v);
const isStringArray = v => Array.isArray(v) && v.every(i => typeof i === "string");
const isAllowed = (v, a) => a.includes(v);
const requireString = (o, k, fp) => { if (!isString(o[k]) || o[k].trim() === "") fail(fp, "must be a non-empty string"); };
const requireNumber = (o, k, fp) => { if (!isNumber(o[k])) fail(fp, "must be a finite number"); };

const validatePrimitiveVisual = (visual, fp) => {
  requireString(visual, "concept", `${fp}.visual.concept`);
  if (isString(visual.concept) && !isAllowed(visual.concept, ALLOWED.concepts)) fail(`${fp}.visual.concept`, `invalid "${visual.concept}"`);
  if (!isStringArray(visual.primitives)) fail(`${fp}.visual.primitives`, "array of strings required");
  else { if (visual.primitives.length === 0) fail(`${fp}.visual.primitives`, "at least one"); visual.primitives.forEach((p,i)=>{ if (!isAllowed(p, ALLOWED.primitives)) fail(`${fp}.visual.primitives[${i}]`, `invalid "${p}"`); }); }
  if (!isStringArray(visual.motion)) fail(`${fp}.visual.motion`, "array of strings required");
  else { if (visual.motion.length === 0) fail(`${fp}.visual.motion`, "at least one"); visual.motion.forEach((m,i)=>{ if (!isAllowed(m, ALLOWED.motions)) fail(`${fp}.visual.motion[${i}]`, `invalid "${m}"`); }); }
  if (!isObject(visual.layout)) fail(`${fp}.visual.layout`, "object required");
  else { const L = visual.layout; ["zone","scale","anchor","alignment","spacing"].forEach(k => requireString(L, k, `${fp}.visual.layout.${k}`)); if (isString(L.zone) && !isAllowed(L.zone, ALLOWED.zones)) fail(`${fp}.visual.layout.zone`, `invalid "${L.zone}"`); if (isString(L.scale) && !isAllowed(L.scale, ALLOWED.scales)) fail(`${fp}.visual.layout.scale`, `invalid "${L.scale}"`); if (isString(L.anchor) && !isAllowed(L.anchor, ALLOWED.anchors)) fail(`${fp}.visual.layout.anchor`, `invalid "${L.anchor}"`); if (isString(L.alignment) && !isAllowed(L.alignment, ALLOWED.alignments)) fail(`${fp}.visual.layout.alignment`, `invalid "${L.alignment}"`); if (isString(L.spacing) && !isAllowed(L.spacing, ALLOWED.spacing)) fail(`${fp}.visual.layout.spacing`, `invalid "${L.spacing}"`); }
  requireString(visual, "density", `${fp}.visual.density`);
  if (isString(visual.density) && !isAllowed(visual.density, ALLOWED.densities)) fail(`${fp}.visual.density`, `invalid "${visual.density}"`);
};

const validateArchetypeVisual = (visual, fp) => {
  if (!isString(visual.archetype) || visual.archetype.trim() === "") { fail(`${fp}.visual.archetype`, "non-empty string required"); return; }
  if (!isAllowed(visual.archetype, ALLOWED.archetypes)) fail(`${fp}.visual.archetype`, `invalid "${visual.archetype}"`);
  if (visual.props !== undefined && !isObject(visual.props)) fail(`${fp}.visual.props`, "object when provided");
};

const validateVisual = (visual, fp) => {
  if (!isObject(visual)) { fail(`${fp}.visual`, "object required"); return; }
  const hasArchetype = isString(visual.archetype) && visual.archetype.trim() !== "";
  const hasPrimitive = visual.concept !== undefined || visual.primitives !== undefined || visual.motion !== undefined || visual.layout !== undefined || visual.density !== undefined;
  if (hasArchetype) { validateArchetypeVisual(visual, fp); if (hasPrimitive) fail(`${fp}.visual`, "archetype cannot have primitive fields"); return; }
  if (!hasPrimitive) { fail(`${fp}.visual`, "archetype or primitive required"); return; }
  validatePrimitiveVisual(visual, fp);
};

const validateScene = (scene, i) => {
  const fp = `scenes[${i}]`;
  if (!isObject(scene)) { fail(fp, "object required"); return; }
  requireString(scene, "id", `${fp}.id`);
  requireNumber(scene, "start", `${fp}.start`);
  requireNumber(scene, "end", `${fp}.end`);
  requireString(scene, "narration", `${fp}.narration`);
  requireString(scene, "intent", `${fp}.intent`);
  if (isString(scene.intent) && !isAllowed(scene.intent, ALLOWED.intents)) fail(`${fp}.intent`, `invalid "${scene.intent}"`);
  if (isNumber(scene.start) && isNumber(scene.end) && scene.end <= scene.start) fail(`${fp}.end`, "end > start");
  if (isNumber(scene.start) && scene.start < 0) fail(`${fp}.start`, "start >= 0");
  validateVisual(scene.visual, fp);
};

const validateScenePlan = (plan) => {
  if (!isObject(plan)) { fail("root", "object required"); return; }
  requireNumber(plan, "fps", "fps");
  requireNumber(plan, "durationInSeconds", "durationInSeconds");
  if (isNumber(plan.fps) && plan.fps <= 0) fail("fps", "> 0");
  if (isNumber(plan.durationInSeconds) && plan.durationInSeconds <= 0) fail("durationInSeconds", "> 0");
  if (!Array.isArray(plan.scenes)) { fail("scenes", "array required"); return; }
  if (plan.scenes.length === 0) { fail("scenes", "at least one"); return; }
  let prevEnd = 0;
  plan.scenes.forEach((s, i) => {
    validateScene(s, i);
    if (!isObject(s)) return;
    if (isNumber(s.start) && isNumber(s.end)) {
      if (i === 0 && s.start > 0.05) fail(`scenes[${i}].start`, "first scene near 0");
      if (i > 0 && s.start < prevEnd - 0.05) fail(`scenes[${i}].start`, "overlaps previous");
      prevEnd = Math.max(prevEnd, s.end);
      if (isNumber(plan.durationInSeconds) && s.end > plan.durationInSeconds + 0.05) fail(`scenes[${i}].end`, "exceeds duration");
    }
  });
};

const testPath = "/sessions/hopeful-amazing-goodall/mnt/AI-Motion-Graphics/videos/agent-real-test/data/scene-plan.json";
const raw = fs.readFileSync(testPath, "utf8");
const plan = JSON.parse(raw);

validateScenePlan(plan);

if (errors.length > 0) {
  console.error(`\nValidation failed: ${errors.length} error(s)\n`);
  errors.forEach(e => console.error(`- ${e.path}: ${e.message}`));
  process.exit(1);
}

console.log("\n✅ Scene plan validation passed.");
console.log(`File: ${testPath}`);
console.log(`FPS: ${plan.fps} | Duration: ${plan.durationInSeconds}s | Scenes: ${plan.scenes.length}`);
const arch = plan.scenes.filter(s => isObject(s.visual) && isString(s.visual.archetype)).length;
const prim = plan.scenes.filter(s => isObject(s.visual) && !isString(s.visual.archetype)).length;
console.log(`Archetype: ${arch} | Primitive fallback: ${prim}`);
plan.scenes.forEach((s, i) => {
  const a = isObject(s.visual) && isString(s.visual.archetype) ? s.visual.archetype : "primitive";
  console.log(`  Scene ${i+1}: [${s.start}s-${s.end}s] intent="${s.intent}" archetype="${a}"`);
});
process.exit(0);