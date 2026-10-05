import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { ARCHAI } from "../../design/tokens";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  distance = 40,
  direction = "up",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: ARCHAI.motion.spring.standard,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const offset = (1 - progress) * distance;

  let x = 0;
  let y = 0;

  if (direction === "up") y = offset;
  if (direction === "down") y = -offset;
  if (direction === "left") x = offset;
  if (direction === "right") x = -offset;

  return (
    <div
      style={{
        opacity,
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
};
