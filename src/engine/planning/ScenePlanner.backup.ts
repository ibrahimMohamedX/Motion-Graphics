import type {
  MotionStrategy,
  VisualPlan,
} from "../visuals/VisualGrammar";

import {
  SCENE_ARCHETYPE_DEFINITION_MAP,
  type SceneArchetype,
} from "../scenes/SceneArchetype";

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
  intent:
    | "hook"
    | "problem"
    | "explanation"
    | "solution"
    | "benefit"
    | "comparison"
    | "cta";
  visual: VisualPlan;
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

const INTENT_TO_ARCHETYPE: Record<
  PlannedScene["intent"],
  SceneArchetype[]
> = {
  hook: ["hero-question", "usage-counter"],

  problem: [
    "fragmented-customer-journey",
    "appearance-to-utility",
    "missed-opportunities",
  ],

  explanation: [
    "appearance-to-utility",
    "digital-transformation",
  ],

  solution: [
    "unified-customer-journey",
    "custom-app-solution",
    "digital-transformation",
  ],

  benefit: [
    "business-insights-dashboard",
    "customer-retention-loop",
    "appearance-to-utility",
  ],

  comparison: [
    "competition-pressure",
    "digital-transformation",
  ],

  cta: [
    "brand-cta",
    "custom-app-solution",
  ],
};

const INTENT_PATTERNS: Record<
  PlannedScene["intent"],
  RegExp[]
> = {
  hook: [
    /ليه|لماذا|ازاي|إزاي|هل|تخيل|عمرك|why|how|imagine|سؤال|question/i,
    /مشكلة|مشكل|تبدأ|start|beginning|opening/i,
  ],

  problem: [
    /مشكلة|مشاكل|صعوبة|صعب|خسارة|بتخسر|يضيع|ضياع|problem|loss|difficult|pain|issue|error|failing|broken|عطل/i,
    /منافسة|منافس|competition|competitor|pressure|ضغط|تهديد/i,
    /مفقود|مضيع|missed|مفقودة|lost|فرصة|opportunity|تخسر|lose/i,
  ],

  solution: [
    /حل|حلول|نظام|أنظمة|تطبيق|تطبيقات|منصة|تقنية|ذكاء|system|solution|platform|technology|app|application|software|منتج|product|أداة|tool|service|خدمة/i,
    /بناء|بنيت|build|بنية|architecture|معمارية|تصميم|design|تطوير|develop/i,
  ],

  benefit: [
    /ميزة|فوائد|زيادة|نمو|مبيعات|عملاء|ربح|efficiency|growth|sales|customers|revenue|profit|تحسين|improvement|أداء|performance|كفاءة|نتيجة|نتائج|roi|توفير|save/i,
    /ولاء|احتفاظ|retention|تكرار|repeat|عودة|return|engagement|تفاعل/i,
    /بيانات|تحليل|analytics|insight|insights|intelligence|metric|metrics|dashboard|business|أرقام|إحصائيات/i,
  ],

  comparison: [
    /قبل|بعد|بدل|مقابل|before|after|versus|vs|مقارنة|compare|comparison|فرق|difference|أفضل|better|احسن|تحسين/i,
  ],

  cta: [
    /تواصل|كلمني|ابدأ|اطلب|راسل|احجز|contact|start|message|begin|get|started|الآن|now|اليوم|today|اتصل|call|موقع|website|رابط|link/i,
  ],

  explanation: [
    /كيف|ازاي|إزاي|يعمل|works|آلية|mechanism|عملية|process|خطوات|steps|مراحل|stages|شرح|explain|تفصيل|detail|طريقة|method|approach/i,
  ],
};

const inferIntent = (
  text: string,
): PlannedScene["intent"] => {
  const value = text.toLowerCase();

  for (const [intent, patterns] of Object.entries(
    INTENT_PATTERNS,
  )) {
    for (const pattern of patterns) {
      if (pattern.test(value)) {
        return intent as PlannedScene["intent"];
      }
    }
  }

  return "explanation";
};

const selectArchetype = (
  intent: PlannedScene["intent"],
  narration: string,
  memory: VisualMemory,
): SceneArchetype | null => {
  const candidates = INTENT_TO_ARCHETYPE[intent] ?? [];

  if (candidates.length === 0) {
    return null;
  }

  const narrationLower = narration.toLowerCase();

  const scored = candidates.map((archetype, index) => {
    const definition =
      SCENE_ARCHETYPE_DEFINITION_MAP[archetype];

    let score = 0;

    if (definition) {
      for (const keyword of definition.bestFor) {
        if (
          narrationLower.includes(
            keyword.toLowerCase(),
          )
        ) {
          score += 2;
        }

        if (
          keyword.toLowerCase() === intent
        ) {
          score += 3;
        }
      }
    }

    // Strong penalty for immediate repetition.
    const wasUsed =
      memory.archetypesUsed.includes(archetype);

    if (wasUsed) {
      score -= 8;
    }

    // Additional penalty when this archetype was used
    // recently in the same video.
    const lastIndex =
      memory.archetypesUsed.lastIndexOf(
        archetype,
      );

    if (lastIndex >= 0) {
      score -= Math.max(
        1,
        5 - (memory.archetypesUsed.length - lastIndex),
      );
    }

    // Slight preference for earlier declared candidates
    // when semantic scores are equal.
    score -= index * 0.05;

    return {
      archetype,
      score,
    };
  });

  scored.sort(
    (a, b) => b.score - a.score,
  );

  return scored[0]?.archetype ?? candidates[0];
};

const getVariant = (
  archetype: SceneArchetype,
  memory: VisualMemory,
): string | undefined => {
  const variants: Partial<
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

  const available =
    variants[archetype];

  if (!available?.length) {
    return undefined;
  }

  const unused = available.filter(
    (variant) =>
      !memory.variantsUsed.includes(
        `${archetype}:${variant}`,
      ),
  );

  const pool =
    unused.length > 0
      ? unused
      : available;

  return pool[
    memory.variantsUsed.length %
      pool.length
  ];
};

const getMotionProfile = (
  intent: PlannedScene["intent"],
  sceneIndex: number,
): MotionStrategy[] => {
  const profiles: Record<
    PlannedScene["intent"],
    MotionStrategy[][]
  > = {
    hook: [
      ["reveal", "emphasize", "resolve"],
      ["connect", "flow", "resolve"],
    ],

    problem: [
      ["build", "emphasize", "resolve"],
      ["reveal", "compare", "resolve"],
    ],

    explanation: [
      ["build", "connect", "flow"],
      ["reveal", "connect", "transform"],
    ],

    solution: [
      ["reveal", "connect", "resolve"],
      ["transform", "flow", "resolve"],
    ],

    benefit: [
      ["build", "emphasize", "flow"],
      ["reveal", "flow", "resolve"],
    ],

    comparison: [
      ["compare", "emphasize", "resolve"],
      ["reveal", "compare", "resolve"],
    ],

    cta: [
      ["reveal", "emphasize", "resolve"],
    ],
  };

  const options =
    profiles[intent];

  return options[
    sceneIndex % options.length
  ];
};

const generateArchetypeProps = (
  archetype: SceneArchetype,
  narration: string,
  variant?: string,
): Record<string, unknown> => {
  const text = narration.trim();

  const sentences = text
    .split(/[.!?؟]/)
    .filter(
      (sentence) =>
        sentence.trim().length > 0,
    );

  const firstSentence =
    sentences[0]?.trim() ?? text;

  const words = text
    .split(/\s+/)
    .filter(
      (word) => word.length > 2,
    );

  const highlights = words.filter(
    (word) =>
      /^[A-Zأ-ي]/.test(word) ||
      /\d/.test(word) ||
      word.length > 8,
  );

  const highlight =
    highlights.slice(0, 3).join(" ") ||
    firstSentence.slice(0, 40);

  const question = text.includes("?")
    ? text
    : `${firstSentence}?`;

  const subtitle =
    sentences.slice(1, 3).join(" ") || "";

  const stepCandidates = text
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

  const common = variant
    ? { variant }
    : {};

  switch (archetype) {
    case "hero-question":
      return {
        ...common,
        question,
        highlight: highlight.slice(0, 40),
        subtitle: subtitle.slice(0, 100),
        badge: "ARCHAI",
      };

    case "usage-counter":
      return {
        ...common,
        question: firstSentence.slice(0, 80),
        target: metrics[0] || "1000",
        label: "تفاعل يومي",
      };

    case "appearance-to-utility":
      return {
        ...common,
        title: firstSentence.slice(0, 60),
        highlight: highlight.slice(0, 40),
        subtitle: subtitle.slice(0, 100),
      };

    case "fragmented-customer-journey":
      return {
        ...common,
        title: "رحلة العميل المجزأة",
        highlight: "نقاط احتكاك متعددة",
        steps:
          stepCandidates.length > 0
            ? stepCandidates
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
        title: "رحلة عميل موحدة",
        highlight: "في تطبيق واحد",
        steps:
          stepCandidates.length > 0
            ? stepCandidates
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
        title: firstSentence.slice(0, 60),
        metrics: [
          {
            label: "CUSTOMERS",
            value: metrics[0] || "1,284",
            icon: "DataIcon",
          },
          {
            label: "ORDERS",
            value: metrics[1] || "348",
            icon: "SystemIcon",
          },
          {
            label: "REVENUE",
            value:
              metrics[2] || "8,750 EGP",
            icon: "CircuitIcon",
          },
        ],
      };

    case "customer-retention-loop":
      return {
        ...common,
        title: firstSentence.slice(0, 60),
        highlight: "العميل يرجع تاني",
        items: [
          "عميل",
          "شراء",
          "تفاعل",
          "ولاء",
        ],
      };

    case "competition-pressure":
      return {
        ...common,
        title: firstSentence.slice(0, 60),
        highlight: "المنافسة بتزيد",
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
        question: firstSentence.slice(0, 80),
        target: metrics[0] || "12",
        label: "فرص ممكن تضيع كل يوم",
      };

    case "digital-transformation":
      return {
        ...common,
        title: firstSentence.slice(0, 60),
        highlight: "تجربة رقمية",
        leftLabel: "تقليدية",
        rightLabel: "رقمية",
      };

    case "custom-app-solution":
      return {
        ...common,
        title: firstSentence.slice(0, 60),
        highlight: "مصممة مخصوص لبزنسك",
        appName: "Your Business",
      };

    case "brand-cta":
      return {
        ...common,
        title: "Archai Solutions",
        cta: "خلي البزنس أقرب لعملائك",
        brand: "AS",
      };

    default:
      return common;
  }
};

const createPrimitiveVisualPlan = (
  intent: PlannedScene["intent"],
  sceneIndex: number,
): VisualPlan => {
  const layouts: Record<
    string,
    VisualPlan["layout"]
  > = {
    hook: {
      zone: "hero",
      scale: "hero",
      anchor: "center",
      alignment: "center",
      spacing: "normal",
    },

    problem: {
      zone: "focus",
      scale: "large",
      anchor: "center",
      alignment: "center",
      spacing: "wide",
    },

    solution: {
      zone: "focus",
      scale: "large",
      anchor: "center",
      alignment: "center",
      spacing: "normal",
    },

    benefit: {
      zone: "data",
      scale: "large",
      anchor: "center",
      alignment: "center",
      spacing: "normal",
    },

    comparison: {
      zone: "focus",
      scale: "large",
      anchor: "center",
      alignment: "center",
      spacing: "wide",
    },

    cta: {
      zone: "cta",
      scale: "large",
      anchor: "center",
      alignment: "center",
      spacing: "normal",
    },

    explanation: {
      zone: "focus",
      scale: "medium",
      anchor: "center",
      alignment: "center",
      spacing: "normal",
    },
  };

  const concepts: Record<
    string,
    VisualPlan["concept"]
  > = {
    hook: "problem",
    problem: "problem",
    solution: "solution",
    benefit: "growth",
    comparison: "comparison",
    cta: "outcome",
    explanation: "system",
  };

  const primitivesMap: Record<
    string,
    VisualPlan["primitives"]
  > = {
    hook: [
      "node",
      "path",
      "data-packet",
    ],

    problem: [
      "comparison",
      "node",
      "path",
    ],

    solution: [
      "interface",
      "node",
      "data-packet",
    ],

    benefit: [
      "dashboard",
      "metric",
      "data-packet",
    ],

    comparison: [
      "comparison",
      "path",
    ],

    cta: [
      "interface",
      "metric",
      "node",
    ],

    explanation: [
      "node",
      "path",
      "data-packet",
    ],
  };

  const profiles: MotionStrategy[][] = [
    ["reveal", "connect", "flow"],
    ["build", "emphasize", "resolve"],
    ["transform", "flow", "resolve"],
  ];

  return {
    concept:
      concepts[intent] ?? "system",

    primitives:
      primitivesMap[intent] ??
      ["node", "path", "data-packet"],

    motion:
      profiles[
        sceneIndex % profiles.length
      ],

    layout:
      layouts[intent] ?? {
        zone: "focus",
        scale: "medium",
        anchor: "center",
        alignment: "center",
        spacing: "normal",
      },

    density: "balanced",
  };
};

export const visualForSegment = (
  segment: TranscriptSegment,
  memory: VisualMemory = {
    archetypesUsed: [],
    variantsUsed: [],
    motionsUsed: [],
  },
  sceneIndex = 0,
): VisualPlan => {
  const intent = inferIntent(
    segment.text,
  );

  const archetype =
    selectArchetype(
      intent,
      segment.text,
      memory,
    );

  const motion =
    getMotionProfile(
      intent,
      sceneIndex,
    );

  if (archetype) {
    const variant =
      getVariant(
        archetype,
        memory,
      );

    const props =
      generateArchetypeProps(
        archetype,
        segment.text,
        variant,
      );

    return {
      archetype,
      props,
      concept: "system",
      primitives: [],
      motion,
      layout: {
        zone: "hero",
        scale: "hero",
        anchor: "center",
        alignment: "center",
        spacing: "normal",
      },
      density: "minimal",
    };
  }

  return {
    ...createPrimitiveVisualPlan(
      intent,
      sceneIndex,
    ),
    motion,
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

  const scenes = segments.map(
    (
      segment,
      index,
    ): PlannedScene => {
      const visual =
        visualForSegment(
          segment,
          memory,
          index,
        );

      const archetype =
        visual.archetype;

      if (archetype) {
        memory.archetypesUsed.push(
          archetype,
        );

        const variant =
          typeof visual.props?.variant ===
          "string"
            ? visual.props.variant
            : undefined;

        if (variant) {
          memory.variantsUsed.push(
            `${archetype}:${variant}`,
          );
        }
      }

      for (const motion of visual.motion) {
        memory.motionsUsed.push(
          motion,
        );
      }

      return {
        id: `scene-${String(
          index + 1,
        ).padStart(2, "0")}`,

        start: segment.start,
        end: segment.end,

        narration: segment.text,

        intent: inferIntent(
          segment.text,
        ),

        visual,
      };
    },
  );

  const durationInSeconds =
    scenes.length > 0
      ? Math.max(
          ...scenes.map(
            (scene) => scene.end,
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

