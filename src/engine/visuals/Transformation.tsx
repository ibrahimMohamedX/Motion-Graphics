import React from "react";

import { interpolate, useCurrentFrame } from "remotion";

type TransformationProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromScale?: number;
  fromOpacity?: number;
};

export const Transformation: React.FC<TransformationProps> = ({
  children,
  delay = 0,
  duration = 30,
  fromScale = 0.75,
  fromOpacity = 0,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [fromScale, 1]);

  const opacity = interpolate(progress, [0, 1], [fromOpacity, 1]);

  const blur = interpolate(progress, [0, 1], [12, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  );
};
