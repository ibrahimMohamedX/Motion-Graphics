import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { ARCHAI } from "../../design/tokens";
import type { LayoutBounds } from "../layout/LayoutEngine";

type ComparisonProps = {
  leftTitle: string;
  rightTitle: string;
  leftValue?: string;
  rightValue?: string;
  delay?: number;
  x?: number;
  y?: number;
  bounds?: LayoutBounds;
};

export const Comparison: React.FC<ComparisonProps> = ({
  leftTitle,
  rightTitle,
  leftValue,
  rightValue,
  delay = 0,
  x = 50,
  y = 52,
  bounds,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const localScale = bounds ? Math.min(bounds.width, bounds.height) / 50 : 1;

  const titleSize = Math.max(13, Math.min(28, 22 * localScale));

  const valueSize = Math.max(26, Math.min(62, 52 * localScale));

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: "90%",
        height: "64%",
        transform: `
          translate(-50%, -50%)
          translateY(${(1 - progress) * 35}px)
        `,
        opacity: progress,
        display: "grid",
        gridTemplateColumns: "1fr 1px 1fr",
        overflow: "hidden",
        borderRadius: 16,
        border: `1px solid ${ARCHAI.colors.border}`,
        background: "rgba(16,23,30,.8)",
      }}
    >
      <div
        style={{
          padding: "8% 9%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: ARCHAI.fonts.arabic,
            fontSize: titleSize,
            fontWeight: 600,
            color: ARCHAI.colors.silver,
          }}
        >
          {leftTitle}
        </div>

        {leftValue && (
          <div
            style={{
              marginTop: 12,
              fontFamily: ARCHAI.fonts.latin,
              fontSize: valueSize,
              fontWeight: 800,
              color: ARCHAI.colors.text,
              letterSpacing: "-.04em",
            }}
          >
            {leftValue}
          </div>
        )}
      </div>

      <div
        style={{
          width: 1,
          height: "70%",
          alignSelf: "center",
          background:
            "linear-gradient(transparent, rgba(140,154,165,.35), transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          padding: "8% 9%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(25,211,243,.07), transparent)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "35%",
            height: 2,
            background: ARCHAI.colors.cyan,
            boxShadow: "0 0 20px rgba(25,211,243,.5)",
          }}
        />

        <div
          style={{
            fontFamily: ARCHAI.fonts.arabic,
            fontSize: titleSize,
            fontWeight: 700,
            color: ARCHAI.colors.cyan,
          }}
        >
          {rightTitle}
        </div>

        {rightValue && (
          <div
            style={{
              marginTop: 12,
              fontFamily: ARCHAI.fonts.latin,
              fontSize: valueSize,
              fontWeight: 800,
              color: ARCHAI.colors.white,
              letterSpacing: "-.04em",
            }}
          >
            {rightValue}
          </div>
        )}
      </div>
    </div>
  );
};
