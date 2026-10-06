import type { MotionStrategy } from "../visuals/VisualGrammar";

export type MotionConfig = {
  delay: number;
  duration: number;
};

export const MOTION_REGISTRY: Record<MotionStrategy, MotionConfig> = {
  build: {
    delay: 0,
    duration: 18,
  },
connect: {
    delay: 4,
    duration: 16,
  },

  flow: {
    delay: 6,
    duration: 24,
  },

  transform: {
    delay: 8,
    duration: 20,
  },

  reveal: {
    delay: 0,
    duration: 18,
  },

  compare: {
    delay: 6,
    duration: 20,
  },

  emphasize: {
    delay: 12,
    duration: 12,
  },

  resolve: {
    delay: 16,
    duration: 18,
  },
};


