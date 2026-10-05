import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { ARCHAI } from "../../design/tokens";
import type { LayoutBounds } from "../layout/LayoutEngine";

export type OrbitItem = {
  label: string;
  angle: number;
  active?: boolean;
};

type OrbitProps = {
  centerLabel?: string;
  items: OrbitItem[];
  delay?: number;
  bounds?: LayoutBounds;
};

export const Orbit: React.FC<OrbitProps> = ({
  centerLabel = "SYSTEM",
  items,
  delay = 0,
  bounds,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const localScale = bounds ? Math.min(bounds.width, bounds.height) / 50 : 1;

  const labelSize = Math.max(9, Math.min(16, 13 * localScale));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "76%",
          aspectRatio: "1 / 1",
          maxWidth: "92%",
          maxHeight: "92%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0%",
            border: `1px solid ${ARCHAI.colors.border}`,
            borderRadius: "50%",
            opacity: progress,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: "15%",
            border: "1px solid rgba(25,211,243,0.12)",
            borderRadius: "50%",
            opacity: progress,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "20%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: ARCHAI.colors.card,
            border: `1px solid ${ARCHAI.colors.cyanBorder}`,
            boxShadow: "0 0 35px rgba(25,211,243,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: progress,
          }}
        >
          <span
            style={{
              fontFamily: ARCHAI.fonts.latin,
              fontSize: labelSize,
              fontWeight: 700,
              color: ARCHAI.colors.white,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {centerLabel}
          </span>
        </div>

        {items.map((item, index) => {
          const angle = (item.angle * Math.PI) / 180;

          const radius = 36;

          const x = 50 + Math.cos(angle) * radius;

          const y = 50 + Math.sin(angle) * radius;

          const itemProgress = interpolate(
            frame,
            [delay + index * 4, delay + 16 + index * 4],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: `${radius}%`,
                  height: 1,
                  transformOrigin: "0 50%",
                  transform: `rotate(${item.angle}deg) scaleX(${itemProgress})`,
                  background: item.active
                    ? "rgba(25,211,243,0.32)"
                    : "rgba(255,255,255,0.08)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: "11%",
                  minWidth: 18,
                  aspectRatio: "1 / 1",
                  transform: `translate(-50%, -50%) scale(${itemProgress})`,
                  borderRadius: "50%",
                  background: item.active
                    ? ARCHAI.colors.cyan
                    : ARCHAI.colors.card,
                  border: `1px solid ${
                    item.active
                      ? ARCHAI.colors.cyan
                      : ARCHAI.colors.borderStrong
                  }`,
                  boxShadow: item.active
                    ? "0 0 20px rgba(25,211,243,0.35)"
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "28%",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    background: item.active
                      ? ARCHAI.colors.bg
                      : ARCHAI.colors.silver,
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y + 9}%`,
                  transform: `translate(-50%, -50%) translateY(${
                    (1 - itemProgress) * 8
                  }px)`,
                  opacity: itemProgress,
                  fontFamily: ARCHAI.fonts.latin,
                  fontSize: labelSize,
                  fontWeight: 600,
                  color: item.active
                    ? ARCHAI.colors.cyan
                    : ARCHAI.colors.silver,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.04em",
                }}
              >
                {item.label}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
