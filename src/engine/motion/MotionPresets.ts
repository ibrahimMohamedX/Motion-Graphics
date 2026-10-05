export type MotionPreset =
  | "fade-in"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "count-up"
  | "draw"
  | "pulse"
  | "settle"
  | "flow";

export const MOTION_PRESETS = {
  "fade-in": {
    duration: 16,
  },

  "slide-up": {
    duration: 18,
    distance: 32,
  },

  "slide-left": {
    duration: 18,
    distance: 36,
  },

  "slide-right": {
    duration: 18,
    distance: 36,
  },

  "scale-in": {
    duration: 16,
    from: 0.92,
  },

  "count-up": {
    duration: 24,
  },

  draw: {
    duration: 24,
  },

  pulse: {
    duration: 12,
  },

  settle: {
    duration: 18,
  },

  flow: {
    duration: 24,
    distance: 40,
  },
} as const;
