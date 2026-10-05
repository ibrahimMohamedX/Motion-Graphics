import type { LayoutBounds } from "./LayoutEngine";

export type LocalPoint = {
  x: number;
  y: number;
};

export const localPoint = (
  bounds: LayoutBounds,
  x: number,
  y: number,
): LocalPoint => ({
  x: bounds.x + (x / 100) * bounds.width,
  y: bounds.y + (y / 100) * bounds.height,
});

export const localSize = (
  bounds: LayoutBounds,
  width: number,
  height: number,
) => ({
  width: (width / 100) * bounds.width,
  height: (height / 100) * bounds.height,
});
