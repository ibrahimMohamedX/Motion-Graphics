import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ARCHAI } from "../../design/tokens";
import type { LayoutBounds } from "../layout/LayoutEngine";

type Point = {
  x: number;
  y: number;
};

type DataPacketProps = {
  from: Point;
  to: Point;
  delay?: number;
  duration?: number;
  bounds?: LayoutBounds;
};

export const DataPacket: React.FC<DataPacketProps> = ({
  from,
  to,
  delay = 0,
  duration = 30,
  bounds,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleX = bounds ? bounds.width / 100 : 1;
  const scaleY = bounds ? bounds.height / 100 : 1;

  const fromX = from.x * scaleX;
  const fromY = from.y * scaleY;

  const toX = to.x * scaleX;
  const toY = to.y * scaleY;

  const x = interpolate(progress, [0, 1], [fromX, toX]);

  const y = interpolate(progress, [0, 1], [fromY, toY]);

  const opacity = interpolate(progress, [0, 0.06, 0.82, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 30,
        height: 30,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 7,
          top: "50%",
          width: 22,
          height: 2,
          transform: "translateY(-50%)",
          background:
            "linear-gradient(90deg, transparent, rgba(25,211,243,0.05), rgba(25,211,243,0.55))",
          filter: "blur(1px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 7,
          top: "50%",
          width: 12,
          height: 1,
          transform: "translateY(-50%)",
          background: ARCHAI.colors.cyan,
          opacity: 0.55,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 22,
          height: 22,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(25,211,243,0.42) 0%, rgba(25,211,243,0.14) 35%, transparent 72%)",
          filter: "blur(2px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 7,
          height: 7,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: ARCHAI.colors.white,
          boxShadow: `
            0 0 5px rgba(245,248,250,0.9),
            0 0 14px rgba(25,211,243,0.9),
            0 0 26px rgba(25,211,243,0.45)
          `,
        }}
      />
    </div>
  );
};
