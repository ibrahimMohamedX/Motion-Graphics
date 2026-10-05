import fs from "node:fs";

const file = process.argv[2];

if (!file) {
  console.error(
    "Usage: node scripts/validate-scene-plan.mjs <scene-plan.json>",
  );
  process.exit(1);
}

const plan = JSON.parse(
  fs.readFileSync(file, "utf8"),
);

const scenes = plan.scenes ?? [];

const errors = [];
const warnings = [];

if (!scenes.length) {
  errors.push("No scenes found.");
}

const sorted = [...scenes].sort(
  (a, b) => a.start - b.start,
);

for (let i = 0; i < sorted.length; i++) {
  const scene = sorted[i];

  if (scene.end <= scene.start) {
    errors.push(
      `${scene.id}: invalid duration`,
    );
  }

  if (!scene.visual) {
    errors.push(
      `${scene.id}: missing visual plan`,
    );
  }

  if (
    !scene.visual?.archetype &&
    !scene.visual?.primitives?.length
  ) {
    errors.push(
      `${scene.id}: no visual renderer`,
    );
  }

  const next = sorted[i + 1];

  if (next) {
    const gap = next.start - scene.end;

    if (gap > 0.001) {
      errors.push(
        `${scene.id} → ${next.id}: ${gap.toFixed(3)}s gap`,
      );
    }

    if (gap < -0.001) {
      errors.push(
        `${scene.id} → ${next.id}: overlap`,
      );
    }
  }

  if (
    scene.visual?.archetype ===
      sorted[i - 1]?.visual?.archetype &&
    scene.visual?.archetype ===
      sorted[i - 2]?.visual?.archetype
  ) {
    warnings.push(
      `${scene.id}: same archetype repeated 3 times`,
    );
  }
}

if (
  sorted.length &&
  sorted[0].start > 0.001
) {
  errors.push(
    `Timeline does not start at 0. Starts at ${sorted[0].start}s`,
  );
}

if (
  sorted.length &&
  plan.durationInSeconds &&
  sorted[sorted.length - 1].end <
    plan.durationInSeconds - 0.05
) {
  errors.push(
    `Timeline ends early at ${sorted[sorted.length - 1].end}s`,
  );
}

console.log("");
console.log("=== MOTION VIDEO QA ===");
console.log("");

console.log(
  errors.length === 0
    ? "✓ timeline"
    : "✗ timeline",
);

console.log(
  errors.some((e) =>
    e.includes("no visual"),
  )
    ? "✗ visual coverage"
    : "✓ visual coverage",
);

console.log(
  warnings.length === 0
    ? "✓ repetition"
    : "⚠ repetition",
);

console.log("");

if (errors.length) {
  console.error("ERRORS:");

  for (const error of errors) {
    console.error(`  ✗ ${error}`);
  }
}

if (warnings.length) {
  console.warn("WARNINGS:");

  for (const warning of warnings) {
    console.warn(`  ⚠ ${warning}`);
  }
}

console.log("");

if (errors.length) {
  process.exit(1);
}

console.log("✓ Scene plan is renderable.");
