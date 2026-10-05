import type {
  VisualLayout,
  VisualScale,
  LayoutZone,
} from "../visuals/VisualGrammar";

export type LayoutBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const SCALE_FACTOR: Record<VisualScale, number> = {
  micro: 0.28,
  small: 0.42,
  medium: 0.58,
  large: 0.78,
  hero: 0.92,
};

const ZONE_BOUNDS: Record<LayoutZone, LayoutBounds> = {
  hero: {
    x: 10,
    y: 18,
    width: 80,
    height: 62,
  },

  focus: {
    x: 12,
    y: 20,
    width: 76,
    height: 58,
  },

  support: {
    x: 15,
    y: 24,
    width: 70,
    height: 48,
  },

  data: {
    x: 10,
    y: 18,
    width: 80,
    height: 64,
  },

  caption: {
    x: 10,
    y: 72,
    width: 80,
    height: 18,
  },

  cta: {
    x: 10,
    y: 24,
    width: 80,
    height: 52,
  },

  full: {
    x: 5,
    y: 5,
    width: 90,
    height: 90,
  },
};

const getScaleMultiplier = (scale: VisualScale): number => SCALE_FACTOR[scale];

const applyAlignment = (
  bounds: LayoutBounds,
  alignment: VisualLayout["alignment"],
): LayoutBounds => {
  if (alignment === "start") {
    return bounds;
  }

  if (alignment === "end") {
    return {
      ...bounds,
      x: bounds.x + bounds.width * 0.08,
    };
  }

  return bounds;
};

const applyAnchor = (
  bounds: LayoutBounds,
  anchor: VisualLayout["anchor"],
): LayoutBounds => {
  switch (anchor) {
    case "top":
      return {
        ...bounds,
        y: Math.max(6, bounds.y - 8),
      };

    case "bottom":
      return {
        ...bounds,
        y: Math.min(82, bounds.y + 8),
      };

    case "left":
      return {
        ...bounds,
        x: Math.max(4, bounds.x - 6),
      };

    case "right":
      return {
        ...bounds,
        x: Math.min(82, bounds.x + 6),
      };

    case "center":
    default:
      return bounds;
  }
};

export const resolveLayout = (
  layout: VisualLayout,
  primitiveIndex = 0,
  primitiveCount = 1,
): LayoutBounds => {
  const base = ZONE_BOUNDS[layout.zone];

  const scale = getScaleMultiplier(layout.scale);

  const width = base.width * scale;
  const height = base.height * scale;

  let bounds: LayoutBounds = {
    x: base.x + (base.width - width) / 2,
    y: base.y + (base.height - height) / 2,
    width,
    height,
  };

  bounds = applyAlignment(bounds, layout.alignment);
  bounds = applyAnchor(bounds, layout.anchor);

  if (primitiveCount > 1) {
    const step =
      layout.spacing === "tight" ? 3 : layout.spacing === "wide" ? 8 : 5;

    const offset = primitiveIndex * step;

    bounds = {
      ...bounds,
      y: Math.min(86 - bounds.height, bounds.y + offset),
    };
  }

  return bounds;
};
