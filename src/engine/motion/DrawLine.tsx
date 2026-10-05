import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

type DrawLineProps = {
  width: number;
  height?: number;
  delay?: number;
  duration?: number;
  color: string;
};

export const DrawLine: React.FC<DrawLineProps> = ({
  width,
  height = 2,
  delay = 0,
  duration = 24,
  color,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: color,
          transformOrigin: "left center",
          transform: `scaleX(${progress})`,
        }}
      />
    </div>
  );
};
