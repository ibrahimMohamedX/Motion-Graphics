import type { Viewport } from "./Viewport";

export type Position = {
  x: number;
  y: number;
};

export const percentPosition = (
  viewport: Viewport,
  xPercent: number,
  yPercent: number,
): Position => ({
  x:
    viewport.safeLeft +
    viewport.contentWidth * (xPercent / 100),

  y:
    viewport.safeTop +
    viewport.contentHeight * (yPercent / 100),
});

export const centerPosition = (
  viewport: Viewport,
): Position => ({
  x: viewport.centerX,
  y: viewport.centerY,
});

export const zonePosition = (
  zone: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  xPercent = 50,
  yPercent = 50,
): Position => ({
  x: zone.x + zone.width * (xPercent / 100),
  y: zone.y + zone.height * (yPercent / 100),
});
