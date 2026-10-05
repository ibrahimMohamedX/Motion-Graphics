import type { Viewport } from "./Viewport";

export type VisualScale = "micro" | "small" | "medium" | "large" | "hero";

const SCALE = {
  micro: 0.32,
  small: 0.58,
  medium: 1,
  large: 1.45,
  hero: 2.05,
} as const;

export const visualScale = (type: VisualScale, viewport: Viewport) =>
  viewport.unit * 100 * SCALE[type];

export const visualSize = (
  base: number,
  type: VisualScale,
  viewport: Viewport,
) => base * SCALE[type] * viewport.unit;
