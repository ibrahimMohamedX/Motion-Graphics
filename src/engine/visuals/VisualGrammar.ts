export type VisualConcept =
  | "system"
  | "data"
  | "connection"
  | "transformation"
  | "comparison"
  | "growth"
  | "problem"
  | "solution"
  | "interface"
  | "outcome";

export type VisualPrimitive =
  | "node"
  | "path"
  | "data-packet"
  | "phone"
  | "interface"
  | "dashboard"
  | "metric"
  | "system"
  | "comparison"
  | "orbit";

export type MotionStrategy =
  | "build"
  | "connect"
  | "flow"
  | "transform"
  | "reveal"
  | "compare"
  | "emphasize"
  | "resolve";

export type LayoutZone =
  | "hero"
  | "focus"
  | "support"
  | "data"
  | "caption"
  | "cta"
  | "full";

export type VisualScale = "micro" | "small" | "medium" | "large" | "hero";

export type VisualLayout = {
  zone: LayoutZone;
  scale: VisualScale;

  anchor: "top" | "center" | "bottom" | "left" | "right";

  alignment: "start" | "center" | "end";

  spacing: "tight" | "normal" | "wide";
};

export type SceneBeat = {
  id: string;
  start: number;
  end: number;
  type:
    | "intro"
    | "statement"
    | "emphasis"
    | "transition"
    | "resolution";
  text?: string;
  motion:
    | "reveal"
    | "emphasize"
    | "connect"
    | "flow"
    | "transform"
    | "resolve";
};
export type VisualPlan = {
  archetype?: import("../scenes/SceneArchetype").SceneArchetype;
  props?: Record<string, unknown>;
  concept: VisualConcept;
  primitives: VisualPrimitive[];
  motion: MotionStrategy[];
  layout: VisualLayout;
  emphasis?: string;
  density: "minimal" | "balanced" | "dense";
  beats?: SceneBeat[];
};






