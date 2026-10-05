import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { ARCHAI } from "../../design/tokens";
import type { LayoutBounds } from "../layout/LayoutEngine";

type InterfaceProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  title?: string;
  delay?: number;
  active?: boolean;
  bounds?: LayoutBounds;
};

export const Interface: React.FC<InterfaceProps> = ({
  x = 50,
  y = 50,
  width = 100,
  height = 100,
  title = "SYSTEM",
  delay = 0,
  bounds,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const localScale = bounds ? Math.min(bounds.width, bounds.height) / 50 : 1;

  const titleSize = Math.max(11, Math.min(22, 16 * localScale));

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: `translate(-50%, -50%) translateY(${(1 - progress) * 12}px)`,
        padding: "3%",
        opacity: progress,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 12,
          background: ARCHAI.colors.surface,
          border: `1px solid ${ARCHAI.colors.border}`,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "absolute",
            left: "4%",
            right: "4%",
            top: "5%",
            height: "9%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${ARCHAI.colors.border}`,
          }}
        >
          <div
            style={{
              fontFamily: ARCHAI.fonts.latin,
              fontSize: titleSize,
              fontWeight: 700,
              color: ARCHAI.colors.white,
            }}
          >
            {title}
          </div>

          <div
            style={{
              width: "8%",
              height: "25%",
              borderRadius: 4,
              background: ARCHAI.colors.cyan,
              opacity: 0.85,
            }}
          />
        </div>

        {/* Sidebar */}
        <div
          style={{
            position: "absolute",
            left: "4%",
            top: "18%",
            bottom: "6%",
            width: "16%",
            borderRight: `1px solid ${ARCHAI.colors.border}`,
          }}
        >
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                width: "65%",
                height: "5%",
                marginBottom: "16%",
                borderRadius: 4,
                background:
                  item === 0 ? ARCHAI.colors.cyan : ARCHAI.colors.elevated,
                opacity: item === 0 ? 0.9 : 0.7,
              }}
            />
          ))}
        </div>

        {/* Main */}
        <div
          style={{
            position: "absolute",
            left: "24%",
            right: "5%",
            top: "20%",
            bottom: "7%",
          }}
        >
          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "4%",
              height: "28%",
            }}
          >
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                style={{
                  background: ARCHAI.colors.card,
                  border: `1px solid ${ARCHAI.colors.border}`,
                  borderRadius: 8,
                  padding: "10%",
                }}
              >
                <div
                  style={{
                    width: "35%",
                    height: "10%",
                    borderRadius: 3,
                    background: ARCHAI.colors.muted,
                  }}
                />

                <div
                  style={{
                    marginTop: "16%",
                    width: "60%",
                    height: "20%",
                    borderRadius: 3,
                    background:
                      item === 1 ? ARCHAI.colors.cyan : ARCHAI.colors.white,
                    opacity: 0.85,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Chart */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "60%",
              borderRadius: 8,
              background: ARCHAI.colors.card,
              border: `1px solid ${ARCHAI.colors.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "6%",
                right: "6%",
                bottom: "15%",
                height: 1,
                background: ARCHAI.colors.borderStrong,
              }}
            />

            <svg
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: "12% 6% 15%",
                width: "88%",
                height: "73%",
              }}
            >
              <path
                d="M0 32 C12 28, 18 31, 28 23 S45 27, 55 16 S72 20, 82 10 S92 13, 100 4"
                fill="none"
                stroke={ARCHAI.colors.cyan}
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
