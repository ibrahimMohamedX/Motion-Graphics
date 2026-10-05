import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { ARCHAI } from "../../design/tokens";
import type { LayoutBounds } from "../layout/LayoutEngine";

type MetricProps = {
  value: string;
  label: string;
  detail?: string;
  x?: number;
  y?: number;
  delay?: number;
  active?: boolean;
  align?: "left" | "center" | "right";
  bounds?: LayoutBounds;
};

export const Metric: React.FC<MetricProps> = ({
  value,
  label,
  detail,
  x = 50,
  y = 50,
  delay = 0,
  active = true,
  align = "center",
  bounds,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const localScale = bounds ? Math.min(bounds.width, bounds.height) / 50 : 1;

  const valueSize = Math.max(28, Math.min(92, 76 * localScale));

  const labelSize = Math.max(13, Math.min(30, 22 * localScale));

  const detailSize = Math.max(11, Math.min(22, 16 * localScale));

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) translateY(${(1 - progress) * 30}px)`,
        opacity: progress,
        textAlign: align,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          fontFamily: ARCHAI.fonts.latin,
          fontSize: valueSize,
          lineHeight: 0.95,
          fontWeight: 800,
          letterSpacing: "-0.045em",
          color: active ? ARCHAI.colors.cyan : ARCHAI.colors.white,
          textShadow: active ? "0 0 30px rgba(25,211,243,.18)" : "none",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 10,
          fontFamily: ARCHAI.fonts.arabic,
          fontSize: labelSize,
          lineHeight: 1.25,
          fontWeight: 600,
          color: ARCHAI.colors.white,
        }}
      >
        {label}
      </div>

      {detail && (
        <div
          style={{
            marginTop: 6,
            fontFamily: ARCHAI.fonts.arabic,
            fontSize: detailSize,
            lineHeight: 1.3,
            color: ARCHAI.colors.silver,
          }}
        >
          {detail}
        </div>
      )}
    </div>
  );
};
