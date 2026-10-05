import type { CSSProperties } from "react";

export const VERTICAL_VIEWPORT = {
  width: 1080,
  height: 1920,

  safe: {
    top: 120,
    bottom: 140,
    left: 64,
    right: 64,
  },

  zones: {
    header: {
      top: 120,
      height: 220,
    },

    primary: {
      top: 360,
      height: 700,
    },

    secondary: {
      top: 1080,
      height: 360,
    },

    caption: {
      top: 1460,
      height: 150,
    },

    cta: {
      top: 1640,
      height: 140,
    },
  },
} as const;

export type VerticalZone = keyof typeof VERTICAL_VIEWPORT.zones;

export function verticalZone(zone: VerticalZone): CSSProperties {
  const value = VERTICAL_VIEWPORT.zones[zone];

  return {
    position: "absolute",
    left: VERTICAL_VIEWPORT.safe.left,
    right: VERTICAL_VIEWPORT.safe.right,
    top: value.top,
    height: value.height,
  };
}

export function verticalCenter(
  width: number,
  height: number,
): CSSProperties {
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width,
    height,
    transform: "translate(-50%, -50%)",
  };
}
