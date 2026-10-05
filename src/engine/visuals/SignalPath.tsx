import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ARCHAI } from "../../design/tokens";
import type { LayoutBounds } from "../layout/LayoutEngine";

type SignalPathProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
  duration?: number;
  active?: boolean;
  curved?: boolean;
  bounds?: LayoutBounds;
};

export const SignalPath: React.FC<SignalPathProps> = ({
  x1,
  y1,
  x2,
  y2,
  delay = 0,
  duration = 18,
  active = false,
  curved = false,
  bounds,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleX = bounds ? bounds.width / 100 : 1;
  const scaleY = bounds ? bounds.height / 100 : 1;

  const px1 = x1 * scaleX;
  const py1 = y1 * scaleY;
  const px2 = x2 * scaleX;
  const py2 = y2 * scaleY;

  const midX = (px1 + px2) / 2;
  const distanceY = Math.abs(py2 - py1);

  const curveOffset = Math.max(20, Math.min(90, distanceY * 0.8 + 30));

  const controlY =
    py1 < py2
      ? Math.min(py1, py2) - curveOffset
      : Math.max(py1, py2) + curveOffset;

  const path = curved
    ? `M ${px1} ${py1} Q ${midX} ${controlY} ${px2} ${py2}`
    : `M ${px1} ${py1} L ${px2} ${py2}`;

  const opacity = interpolate(progress, [0, 0.15, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const strokeWidth = active ? 2 : 1.25;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <path
        d={path}
        fill="none"
        stroke={active ? ARCHAI.colors.cyan : ARCHAI.colors.silver}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity * (active ? 0.8 : 0.35)}
        strokeDasharray="4 7"
        strokeDashoffset={(1 - progress) * 100}
      />

      {active && (
        <path
          d={path}
          fill="none"
          stroke={ARCHAI.colors.cyan}
          strokeWidth={strokeWidth * 3}
          strokeLinecap="round"
          opacity={opacity * 0.08}
          filter="blur(3px)"
        />
      )}
    </svg>
  );
};
