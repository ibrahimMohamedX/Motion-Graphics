import type {
  MotionStrategy,
  SceneBeat,
  VisualPlan,
} from "../visuals/VisualGrammar";

import { SCENE_ARCHETYPE_DEFINITION_MAP } from "../scenes/SceneArchetypeRegistry";
import type { SceneArchetype } from "../scenes/SceneArchetype.types";

import {
  analyzeNarration,
  type SemanticSceneIntent,
  type VisualConcept,
} from "./SemanticPlanner";

import {
  canReuseArchetype,
  scoreArchetypeReuse,
} from "./RepetitionGuard";

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

export type PlannedScene = {
  id: string;
  start: number;
  end: number;
  narration: string;

  intent: SemanticSceneIntent;

  visual: VisualPlan & {
    visualConcept?: VisualConcept;
  };

  motion?: {
    entrance: MotionStrategy;
    body: MotionStrategy;
    emphasis?: MotionStrategy;
    exit?: MotionStrategy;
  };
};

export type ScenePlan = {
  fps: number;
  durationInSeconds: number;
  audio?: string | null;
  scenes: PlannedScene[];
};

type VisualMemory = {
  archetypesUsed: SceneArchetype[];
  variantsUsed: string[];
  motionsUsed: MotionStrategy[];
};

const ARCHETYPE_VARIANTS: Partial<
  Record<SceneArchetype, string[]>
> = {
  "unified-customer-journey": [
    "phone-flow",
    "vertical-flow",
    "radial-flow",
    "system-map",
  ],

  "fragmented-customer-journey": [
    "scattered-touchpoints",
    "branching-path",
    "disconnected-cards",
  ],

  "business-insights-dashboard": [
    "metric-stack",
    "dashboard",
    "signal-chart",
  ],

  "customer-retention-loop": [
    "circular-loop",
    "repeat-path",
    "customer-cycle",
  ],

  "competition-pressure": [
    "rising-bars",
    "market-pressure",
    "comparison-field",
  ],

  "custom-app-solution": [
    "phone",
    "product-showcase",
    "system-preview",
  ],

  "digital-transformation": [
    "before-after",
    "transformation-flow",
    "experience-shift",
  ],

  "missed-opportunities": [
    "counter",
    "warning",
    "loss-field",
  ],
};

const MOTION_PROFILES: Record<
  SemanticSceneIntent,
  {
    entrance: MotionStrategy;
    body: MotionStrategy;
    emphasis: MotionStrategy;
    exit: MotionStrategy;
  }
> = {
  hook: {
    entrance: "reveal",
    body: "emphasize",
    emphasis: "emphasize",
    exit: "resolve",
  },

  "behavior-statistic": {
    entrance: "reveal",
    body: "build",
    emphasis: "emphasize",
    exit: "resolve",
  },

  value: {
    entrance: "reveal",
    body: "transform",
    emphasis: "emphasize",
    exit: "resolve",
  },

  problem: {
    entrance: "build",
    body: "connect",
    emphasis: "flow",
    exit: "resolve",
  },

  solution: {
    entrance: "reveal",
    body: "connect",
    emphasis: "flow",
    exit: "resolve",
  },

  analytics: {
    entrance: "build",
    body: "flow",
    emphasis: "emphasize",
    exit: "resolve",
  },

  retention: {
    entrance: "reveal",
    body: "connect",
    emphasis: "flow",
    exit: "resolve",
  },

  competition: {
    entrance: "reveal",
    body: "compare",
    emphasis: "emphasize",
    exit: "resolve",
  },

  risk: {
    entrance: "reveal",
    body: "build",
    emphasis: "emphasize",
    exit: "resolve",
  },

  transformation: {
    entrance: "reveal",
    body: "transform",
    emphasis: "transform",
    exit: "resolve",
  },

  cta: {
    entrance: "reveal",
    body: "emphasize",
    emphasis: "emphasize",
    exit: "resolve",
  },
};

function getVariant(
  archetype: SceneArchetype,
  memory: VisualMemory,
): string | undefined {
  const variants =
    ARCHETYPE_VARIANTS[archetype];

  if (!variants?.length) {
    return undefined;
  }

  const unused = variants.filter(
    (variant) =>
      !memory.variantsUsed.includes(
        `${archetype}:${variant}`,
      ),
  );

  const pool =
    unused.length > 0
      ? unused
      : variants;

  return pool[
    memory.variantsUsed.length %
      pool.length
  ];
}

function selectArchetype(
  preferred: SceneArchetype[],
  narration: string,
  memory: VisualMemory,
  sceneIndex: number,
  totalScenes: number,
): SceneArchetype | null {
  if (!preferred.length) {
    return null;
  }

  const narrationLower =
    narration.toLowerCase();

  const scored = preferred.map(
    (archetype, index) => {
      const definition =
        SCENE_ARCHETYPE_DEFINITION_MAP[
          archetype
        ];

      let score = 0;

      if (definition) {
        for (const keyword of definition.bestFor) {
          if (
            narrationLower.includes(
              keyword.toLowerCase(),
            )
          ) {
            score += 3;
          }
        }
      }

      /*
       * Strong semantic preference.
       *
       * Earlier candidates are still preferred,
       * but only after semantic/repetition scoring.
       */
      score -= index * 0.05;

      /*
       * RepetitionGuard.
       */
      score -= scoreArchetypeReuse(
        archetype,
        {
          previousArchetypes:
            memory.archetypesUsed,
          currentIndex: sceneIndex,
          totalScenes,
        },
      );

      /*
       * If the archetype is inside the
       * immediate repetition window,
       * reject it completely when alternatives exist.
       */
      if (
        !canReuseArchetype(
          archetype,
          {
            previousArchetypes:
              memory.archetypesUsed,
            currentIndex: sceneIndex,
            totalScenes,
          },
        )
      ) {
        score -= 1000;
      }

      return {
        archetype,
        score,
      };
    },
  );

  scored.sort(
    (a, b) => b.score - a.score,
  );

  return (
    scored[0]?.archetype ??
    preferred[0] ??
    null
  );
}

function getMotionProfile(
  intent: SemanticSceneIntent,
): {
  entrance: MotionStrategy;
  body: MotionStrategy;
  emphasis: MotionStrategy;
  exit: MotionStrategy;
} {
  return (
    MOTION_PROFILES[intent] ??
    MOTION_PROFILES.value
  );
}

function createBeats(
  duration: number,
  motion: ReturnType<
    typeof getMotionProfile
  >,
): SceneBeat[] {
  const safeDuration =
    Math.max(0.1, duration);

  const entranceEnd =
    Math.min(
      0.7,
      safeDuration * 0.18,
    );

  const exitStart =
    Math.max(
      entranceEnd,
      safeDuration - 0.7,
    );

  const beats: SceneBeat[] = [];

  beats.push({
    id: "intro",
    start: 0,
    end: Math.max(
      0.05,
      entranceEnd,
    ),
    type: "intro",
      motion:
        motion.entrance === "build" ||
          motion.entrance === "compare"
            ? "reveal"
            : motion.entrance,
  });

  if (
    exitStart >
    entranceEnd + 0.05
  ) {
    beats.push({
      id: "statement",
      start: entranceEnd,
      end: exitStart,
      type: "statement",
      motion:
        motion.body === "build" ||
        motion.body === "compare"
          ? "reveal"
          : motion.body,
    });
  }

  if (exitStart < safeDuration) {
    beats.push({
      id: "resolution",
      start: exitStart,
      end: safeDuration,
      type: "resolution",
      motion:
        motion.exit === "build" ||
        motion.exit === "compare"
          ? "resolve"
          : motion.exit,
    });
  }

  return beats;
}
function generateProps(
  archetype: SceneArchetype,
  narration: string,
  variant?: string,
): Record<string, unknown> {
  const text = narration.trim();

  const sentences = text
    .split(/[.!?؟]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const firstSentence =
    sentences[0] ?? text;

  const words = text
    .split(/\s+/)
    .filter(
      (word) => word.length > 2,
    );

  const highlightCandidates =
    words.filter(
      (word) =>
        /^[A-Zأ-ي]/.test(word) ||
        /\d/.test(word) ||
        word.length > 8,
    );

  const highlight =
    highlightCandidates
      .slice(0, 3)
      .join(" ") ||
    firstSentence.slice(0, 40);

  const question =
    text.includes("?") ||
    text.includes("؟")
      ? text
      : `${firstSentence}؟`;

  const subtitle =
    sentences
      .slice(1, 3)
      .join(" ") || "";

  const steps =
    text
      .split(/[,،;؛]+/)
      .map((item) => item.trim())
      .filter(
        (item) =>
          item.length > 3 &&
          item.length < 50,
      )
      .slice(0, 5);

  const metrics =
    text.match(
      /\d+[.,]?\d*\s*[%٪xX×]?/g,
    ) ?? [];

  const common =
    variant
      ? { variant }
      : {};

  switch (archetype) {
    case "hero-question":
      return {
        ...common,
        question,
        highlight:
          highlight.slice(0, 40),
        subtitle:
          subtitle.slice(0, 100),
        badge: "ARCHAI",
      };

    case "usage-counter":
      return {
        ...common,
        question:
          firstSentence.slice(0, 80),
        target:
          metrics[0] ?? "1000",
        label: "تفاعل يومي",
      };

    case "appearance-to-utility":
      return {
        ...common,
        title:
          firstSentence.slice(0, 60),
        highlight:
          highlight.slice(0, 40),
        subtitle:
          subtitle.slice(0, 100),
      };

    case "fragmented-customer-journey":
      return {
        ...common,
        title:
          "رحلة العميل المجزأة",
        highlight:
          "نقاط احتكاك متعددة",
        steps:
          steps.length > 0
            ? steps
            : [
                "اكتشاف",
                "بحث",
                "مقارنة",
                "قرار",
                "شراء",
              ],
      };

    case "unified-customer-journey":
      return {
        ...common,
        title:
          "رحلة عميل موحدة",
        highlight:
          "في تطبيق واحد",
        steps:
          steps.length > 0
            ? steps
            : [
                "منتج",
                "طلب",
                "دفع",
                "متابعة",
                "إشعار",
              ],
      };

    case "business-insights-dashboard":
      return {
        ...common,
        title:
          firstSentence.slice(0, 60),
        metrics: [
          {
            label: "CUSTOMERS",
            value:
              metrics[0] ?? "1,284",
          },
          {
            label: "ORDERS",
            value:
              metrics[1] ?? "348",
          },
          {
            label: "REVENUE",
            value:
              metrics[2] ??
              "8,750 EGP",
          },
        ],
      };

    case "customer-retention-loop":
      return {
        ...common,
        title:
          firstSentence.slice(0, 60),
        highlight:
          "العميل يرجع تاني",
        steps: [
          "عميل",
          "شراء",
          "تفاعل",
          "ولاء",
        ],
      };

    case "competition-pressure":
      return {
        ...common,
        title:
          firstSentence.slice(0, 60),
        highlight:
          "المنافسة بتزيد",
        competitors: [
          "COMPETITOR 1",
          "COMPETITOR 2",
          "COMPETITOR 3",
          "YOU",
        ],
      };

    case "missed-opportunities":
      return {
        ...common,
        question:
          firstSentence.slice(0, 80),
        target:
          metrics[0] ?? "12",
        label:
          "فرص ممكن تضيع كل يوم",
      };

    case "digital-transformation":
      return {
        ...common,
        title:
          firstSentence.slice(0, 60),
        highlight:
          "تجربة رقمية",
        leftLabel: "تقليدية",
        rightLabel: "رقمية",
      };

    case "custom-app-solution":
      return {
        ...common,
        title:
          firstSentence.slice(0, 60),
        highlight:
          "مصممة مخصوص لبزنسك",
        appName:
          "Your Business",
      };

    case "brand-cta":
      return {
        ...common,
        title:
          "Archai Solutions",
        cta:
          "خلي البزنس أقرب لعملائك",
        brand: "AS",
      };

    default:
      return common;
  }
}

function createPrimitiveVisualPlan(
  concept: VisualConcept,
  intent: SemanticSceneIntent,
  sceneIndex: number,
): VisualPlan {
  const layout: VisualPlan["layout"] = {
    zone:
      intent === "cta"
        ? "cta"
        : intent === "analytics"
          ? "data"
          : intent === "hook"
            ? "hero"
            : "focus",

    scale:
      intent === "hook" ||
      intent === "cta"
        ? "hero"
        : "large",

    anchor: "center",
    alignment: "center",
    spacing: "normal",
  };

  const primitives: VisualPlan["primitives"] =
    concept === "data"
      ? [
          "dashboard",
          "metric",
          "data-packet",
        ]
      : concept === "comparison"
        ? [
            "comparison",
            "path",
          ]
        : concept === "interface"
          ? [
              "interface",
              "node",
              "data-packet",
            ]
          : [
              "node",
              "path",
              "data-packet",
            ];

  const motionSets: MotionStrategy[][] = [
    ["reveal", "connect", "flow"],
    ["build", "emphasize", "resolve"],
    ["transform", "flow", "resolve"],
  ];

  return {
    concept,
    primitives,
    motion:
      motionSets[
        sceneIndex %
          motionSets.length
      ],
    layout,
    density:
      intent === "hook" ||
      intent === "cta"
        ? "minimal"
        : "balanced",
  };
}

export const visualForSegment = (
  segment: TranscriptSegment,
  memory: VisualMemory = {
    archetypesUsed: [],
    variantsUsed: [],
    motionsUsed: [],
  },
  sceneIndex = 0,
  totalScenes = 1,
): VisualPlan & {
  visualConcept?: VisualConcept;
} => {
  const semantic =
    analyzeNarration(
      segment.text,
    );

  const archetype =
    selectArchetype(
      semantic.preferredArchetypes,
      segment.text,
      memory,
      sceneIndex,
      totalScenes,
    );

  if (!archetype) {
    return createPrimitiveVisualPlan(
      semantic.visualConcept,
      semantic.intent,
      sceneIndex,
    );
  }

  const variant =
    getVariant(
      archetype,
      memory,
    );

  const props =
    generateProps(
      archetype,
      segment.text,
      variant,
    );

  const motion =
    getMotionProfile(
      semantic.intent,
    );

  return {
    archetype,
    props,

    visualConcept:
      semantic.visualConcept,

    concept:
      semantic.visualConcept,

    primitives: [],

    motion: [
      motion.entrance,
      motion.body,
      motion.emphasis,
      motion.exit,
    ],

    layout: {
      zone:
        semantic.intent === "cta"
          ? "cta"
          : "hero",

      scale:
        semantic.intent === "hook" ||
        semantic.intent === "cta"
          ? "hero"
          : "large",

      anchor: "center",
      alignment: "center",
      spacing: "normal",
    },

    density:
      semantic.intent === "hook" ||
      semantic.intent === "cta"
        ? "minimal"
        : "balanced",

    beats: createBeats(
      Math.max(
        0.1,
        segment.end -
          segment.start,
      ),
      motion,
    ),
  };
};

export const createScenePlan = (
  segments: TranscriptSegment[],
  fps = 30,
  audio: string | null = null,
): ScenePlan => {
  const memory: VisualMemory = {
    archetypesUsed: [],
    variantsUsed: [],
    motionsUsed: [],
  };

  const totalScenes =
    segments.length;

  const scenes =
    segments.map(
      (
        segment,
        index,
      ): PlannedScene => {
        const semantic =
          analyzeNarration(
            segment.text,
          );

        const visual =
          visualForSegment(
            segment,
            memory,
            index,
            totalScenes,
          );

        const archetype =
          visual.archetype;

        if (archetype) {
          memory.archetypesUsed.push(
            archetype,
          );

          const variant =
            typeof visual.props
              ?.variant === "string"
              ? visual.props.variant
              : undefined;

          if (variant) {
            memory.variantsUsed.push(
              `${archetype}:${variant}`,
            );
          }
        }

        for (const motion of
          visual.motion ?? []) {
          memory.motionsUsed.push(
            motion,
          );
        }
        const motionProfile =
          getMotionProfile(
            semantic.intent,
          );

        return {
          id: `scene-${String(
            index + 1,
          ).padStart(2, "0")}`,

          start:
            segment.start,

          end:
            segment.end,

          narration:
            segment.text,

          intent:
            semantic.intent,

          visual,

          motion: {
            entrance:
              motionProfile.entrance,

            body:
              motionProfile.body,

            emphasis:
              motionProfile.emphasis,

            exit:
              motionProfile.exit,
          },
        };
      },
    );

  const durationInSeconds =
    scenes.length > 0
      ? Math.max(
          ...scenes.map(
            (scene) =>
              scene.end,
          ),
        )
      : 0;

  return {
    fps,
    durationInSeconds,
    audio,
    scenes,
  };
};








