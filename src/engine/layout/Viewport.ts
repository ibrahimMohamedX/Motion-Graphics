import { useVideoConfig } from "remotion";

export type Viewport = {
  width: number;
  height: number;
  unit: number;

  safeLeft: number;
  safeRight: number;
  safeTop: number;
  safeBottom: number;

  contentWidth: number;
  contentHeight: number;

  centerX: number;
  centerY: number;
};

export const useViewport = (): Viewport => {
  const { width, height } = useVideoConfig();

  const horizontalSafe = width * 0.07;
  const verticalSafe = height * 0.08;

  return {
    width,
    height,

    // Base design unit.
    // 1000 units = shortest viewport dimension.
    unit: Math.min(width, height) / 1000,

    safeLeft: horizontalSafe,
    safeRight: width - horizontalSafe,

    safeTop: verticalSafe,
    safeBottom: height - verticalSafe,

    contentWidth: width - horizontalSafe * 2,
    contentHeight: height - verticalSafe * 2,

    centerX: width / 2,
    centerY: height / 2,
  };
};
