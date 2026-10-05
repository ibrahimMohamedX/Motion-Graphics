import type { Viewport } from "./Viewport";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const u = (value: number, viewport: Viewport) => value * viewport.unit;

export const vw = (value: number, viewport: Viewport) =>
  (value / 100) * viewport.width;

export const vh = (value: number, viewport: Viewport) =>
  (value / 100) * viewport.height;

export const responsiveFont = (
  base: number,
  viewport: Viewport,
  min = base * 0.75,
  max = base * 1.35,
) => {
  return clamp(base * viewport.unit, min, max);
};
