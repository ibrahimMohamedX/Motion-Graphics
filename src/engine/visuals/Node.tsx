import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ARCHAI } from "../../design/tokens";
import type { LayoutBounds } from "../layout/LayoutEngine";

type NodeProps = {
  x: number;
  y: number;
  size?: number;
  scale?: "micro" | "small" | "medium" | "large" | "hero";
  active?: boolean;
  delay?: number;
  label?: string;
  bounds?: LayoutBounds;
};

const SCALE_MULTIPLIER = {
  micro: 0.45,
  small: 0.7,
  medium: 1,
  large: 1.35,
  hero: 1.8,
} as const;

export const Node: React.FC<NodeProps> = ({
  x,
  y,
  size = 14,
  scale = "medium",
  active = false,
  delay = 0,
  label,
  bounds,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scaleMultiplier = SCALE_MULTIPLIER[scale];

  const baseSize = bounds
    ? Math.min(bounds.width, bounds.height) * (size / 100)
    : size;

  const nodeSize = Math.max(4, baseSize * scaleMultiplier);

  const opacity = interpolate(progress, [0, 0.35, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nodeScale = interpolate(progress, [0, 0.7, 1], [0.72, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowOpacity = active ? 0.85 : 0.35;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: nodeSize,
        height: nodeSize,
        transform: `translate(-50%, -50%) scale(${nodeScale})`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -nodeSize * 0.8,
          borderRadius: "50%",
          background: `radial-gradient(
            circle,
            rgba(25,211,243,${glowOpacity * 0.3}) 0%,
            rgba(25,211,243,${glowOpacity * 0.12}) 35%,
            transparent 72%
          )`,
          filter: "blur(3px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: -nodeSize * 0.35,
          borderRadius: "50%",
          border: `1px solid ${
            active ? ARCHAI.colors.cyanBorder : ARCHAI.colors.border
          }`,
          opacity: active ? 0.9 : 0.55,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: active ? ARCHAI.colors.cyan : ARCHAI.colors.white,
          boxShadow: active
            ? `
              0 0 8px rgba(25,211,243,0.95),
              0 0 20px rgba(25,211,243,0.55),
              0 0 38px rgba(25,211,243,0.25)
            `
            : `
              0 0 5px rgba(245,248,250,0.7),
              0 0 12px rgba(25,211,243,0.25)
            `,
        }}
      />

      {label && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `calc(100% + ${nodeSize * 0.9}px)`,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            color: ARCHAI.colors.silver,
            fontFamily: ARCHAI.fonts.latin,
            fontSize: Math.max(11, nodeSize * 0.7),
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
