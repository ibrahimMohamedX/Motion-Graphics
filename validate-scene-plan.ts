import { validateVideoPlan } from "./src/engine/validation/VideoPlanValidator";
import * as fs from "fs";

const scenePlanPath = "/sessions/trusting-admiring-bell/mnt/AI-Motion-Graphics/videos/mobile-app-business/data/scene-plan.json";
const scenePlan = JSON.parse(fs.readFileSync(scenePlanPath, "utf-8"));

const result = validateVideoPlan(scenePlan);

console.log("=== VALIDATION RESULT ===");
console.log("Valid:", result.valid);
console.log("\nErrors:");
result.errors.forEach((e: string) => console.log("  -", e));
console.log("\nWarnings:");
result.warnings.forEach((w: string) => console.log("  -", w));
console.log("\nChecks:");
Object.entries(result.checks).forEach(([key, value]) => console.log(`  ${key}:`, value));