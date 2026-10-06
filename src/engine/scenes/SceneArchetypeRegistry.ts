import type { SceneArchetype } from "./SceneArchetype.types";

export type SceneArchetypeDefinition = {
  type: SceneArchetype;
  description: string;
  bestFor: string[];
  props: string[];
};

export const SCENE_ARCHETYPE_DEFINITIONS: SceneArchetypeDefinition[] = [
  {
    type: "hero-question",
    description: "Opening business question with premium phone visual.",
    bestFor: ["hook", "question", "attention", "problem framing"],
    props: ["question", "highlight", "subtitle", "badge"],
  },
  {
    type: "usage-counter",
    description: "Animated numeric counter showing customer interaction or usage.",
    bestFor: ["statistics", "usage", "frequency", "behavior"],
    props: ["question", "target", "label"],
  },
  {
    type: "appearance-to-utility",
    description: "Transforms a visually attractive app into a useful business system.",
    bestFor: ["value explanation", "utility", "business value", "not just looks"],
    props: ["title", "highlight", "subtitle"],
  },
  {
    type: "fragmented-customer-journey",
    description: "Shows a fragmented customer journey across multiple touchpoints.",
    bestFor: ["problem", "fragmentation", "complex journey", "customer friction"],
    props: ["title", "highlight", "steps"],
  },
  {
    type: "unified-customer-journey",
    description: "Shows multiple customer actions unified inside one application.",
    bestFor: ["solution", "mobile app", "customer journey", "unified experience"],
    props: ["title", "highlight", "steps"],
  },
  {
    type: "business-insights-dashboard",
    description: "Premium analytics dashboard showing measurable business data.",
    bestFor: ["analytics", "metrics", "orders", "revenue", "customer insights"],
    props: ["title", "metrics"],
  },
  {
    type: "customer-retention-loop",
    description: "Visual loop showing repeated customer engagement and retention.",
    bestFor: ["retention", "repeat customers", "loyalty", "engagement"],
    props: ["title", "highlight", "steps"],
  },
  {
    type: "competition-pressure",
    description: "Competitive comparison showing market pressure and positioning.",
    bestFor: ["competition", "market", "competitive advantage"],
    props: ["title", "highlight", "competitors"],
  },
  {
    type: "missed-opportunities",
    description: "Animated loss/opportunity counter representing customers or opportunities being missed.",
    bestFor: ["loss", "missed customers", "missed opportunities", "risk"],
    props: ["question", "target", "label"],
  },
  {
    type: "digital-transformation",
    description: "Before/after transformation from traditional workflow to digital experience.",
    bestFor: ["transformation", "before after", "digitalization", "modernization"],
    props: ["title", "highlight", "leftLabel", "rightLabel"],
  },
  {
    type: "custom-app-solution",
    description: "Premium custom mobile application solution presentation.",
    bestFor: ["solution", "custom app", "product presentation"],
    props: ["title", "highlight", "appName"],
  },
  {
    type: "brand-cta",
    description: "Premium Archai closing frame with brand and call to action.",
    bestFor: ["cta", "closing", "contact", "conversion"],
    props: ["title", "cta", "brand"],
  },
];

export const SCENE_ARCHETYPE_DEFINITION_MAP = Object.fromEntries(
  SCENE_ARCHETYPE_DEFINITIONS.map((definition) => [
    definition.type,
    definition,
  ]),
) as Record<SceneArchetype, SceneArchetypeDefinition>;

