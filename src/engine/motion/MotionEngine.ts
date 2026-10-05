import {
  Easing,
  interpolate,
} from "remotion";

export function reveal(
  frame: number,
  duration = 18,
) {
  return interpolate(
    frame,
    [0, duration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
}

export function slideUp(
  frame: number,
  duration = 18,
  distance = 32,
) {
  const progress = reveal(frame, duration);

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
}

export function slideLeft(
  frame: number,
  duration = 18,
  distance = 36,
) {
  const progress = reveal(frame, duration);

  return {
    opacity: progress,
    transform: `translateX(${(1 - progress) * -distance}px)`,
  };
}

export function slideRight(
  frame: number,
  duration = 18,
  distance = 36,
) {
  const progress = reveal(frame, duration);

  return {
    opacity: progress,
    transform: `translateX(${(1 - progress) * distance}px)`,
  };
}

export function scaleIn(
  frame: number,
  duration = 16,
  from = 0.92,
) {
  const progress = reveal(frame, duration);

  return {
    opacity: progress,
    transform: `scale(${from + (1 - from) * progress})`,
  };
}

export function settle(
  frame: number,
  duration = 18,
) {
  const progress = reveal(frame, duration);

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * 8}px)`,
  };
}

export function pulse(
  frame: number,
  duration = 12,
) {
  const progress = interpolate(
    frame,
    [0, duration / 2, duration],
    [1, 1.04, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    },
  );

  return {
    transform: `scale(${progress})`,
  };
}
