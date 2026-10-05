import type { Viewport } from "./Viewport";

export type CompositionZone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CompositionZones = {
  full: CompositionZone;
  hero: CompositionZone;
  focus: CompositionZone;
  support: CompositionZone;
  data: CompositionZone;
  caption: CompositionZone;
  cta: CompositionZone;
};

export const getCompositionZones = (viewport: Viewport): CompositionZones => {
  const { safeLeft, safeTop, contentWidth, contentHeight } = viewport;

  return {
    full: {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    },

    hero: {
      x: safeLeft,
      y: safeTop,
      width: contentWidth,
      height: contentHeight * 0.32,
    },

    focus: {
      x: safeLeft,
      y: safeTop + contentHeight * 0.24,
      width: contentWidth,
      height: contentHeight * 0.42,
    },

    support: {
      x: safeLeft,
      y: safeTop + contentHeight * 0.58,
      width: contentWidth,
      height: contentHeight * 0.25,
    },

    data: {
      x: safeLeft,
      y: safeTop + contentHeight * 0.38,
      width: contentWidth,
      height: contentHeight * 0.32,
    },

    caption: {
      x: safeLeft,
      y: safeTop + contentHeight * 0.79,
      width: contentWidth,
      height: contentHeight * 0.11,
    },

    cta: {
      x: safeLeft,
      y: safeTop + contentHeight * 0.84,
      width: contentWidth,
      height: contentHeight * 0.1,
    },
  };
};
