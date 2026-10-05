import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

import { ARCHAI } from "../design/tokens";

export {
  GraphiteBackground,
  BlueprintBackground,
  CleanDarkBackground,
} from "../design/Backgrounds";

// ─────────────────────────────────────────────
// BACKWARD-COMPATIBILITY BACKGROUNDS
// ─────────────────────────────────────────────

export const SceneBackground: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(145deg, #10171E 0%, #0B1015 55%, #080C10 100%)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: 700,
        height: 700,
        left: "50%",
        top: "30%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(25,211,243,0.06) 0%, transparent 68%)",
      }}
    />

    {children}
  </AbsoluteFill>
);

export const Grid: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity: 0.13,
      pointerEvents: "none",
    }}
  >
    {/* Horizontal engineering lines */}
    {[25, 50, 75].map((position) => (
      <div
        key={`h-${position}`}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${position}%`,
          height: 1,
          background: "rgba(25,211,243,0.18)",
        }}
      />
    ))}

    {/* Vertical engineering lines */}
    {[25, 50, 75].map((position) => (
      <div
        key={`v-${position}`}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: 1,
          background: "rgba(25,211,243,0.18)",
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// MOTION
// ─────────────────────────────────────────────

export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
}> = ({ children, delay = 0, distance = 32, direction = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: ARCHAI.motion.spring.standard,
  });

  const offset = (1 - progress) * distance;

  let transform = "translate3d(0,0,0)";

  if (direction === "up") {
    transform = `translate3d(0, ${offset}px, 0)`;
  }

  if (direction === "down") {
    transform = `translate3d(0, ${-offset}px, 0)`;
  }

  if (direction === "left") {
    transform = `translate3d(${offset}px, 0, 0)`;
  }

  if (direction === "right") {
    transform = `translate3d(${-offset}px, 0, 0)`;
  }

  return (
    <div
      style={{
        opacity: progress,
        transform,
      }}
    >
      {children}
    </div>
  );
};

// Old API → new motion system
export const FadeSlide: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
}> = ({ children, delay = 0, distance = 40 }) => (
  <Reveal delay={delay} distance={distance} direction="up">
    {children}
  </Reveal>
);

export const ScaleReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
}> = ({ children, delay = 0, from = 0.94 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: ARCHAI.motion.spring.emphasis,
  });

  const scale = interpolate(progress, [0, 1], [from, 1]);

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};

export const Pop: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: number;
}> = ({ children, delay = 0, from = 0.92 }) => (
  <ScaleReveal delay={delay} from={from}>
    {children}
  </ScaleReveal>
);

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────

export const ArabicText: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: 400 | 500 | 600 | 700;
  color?: string;
  align?: "right" | "center" | "left";
  maxWidth?: number;
}> = ({
  children,
  size = ARCHAI.typography.body.fontSize,
  weight = 400,
  color = ARCHAI.colors.text,
  align = "right",
  maxWidth,
}) => (
  <div
    dir="rtl"
    style={{
      fontFamily: ARCHAI.fonts.arabic,
      fontSize: size,
      fontWeight: weight,
      lineHeight: 1.5,
      color,
      textAlign: align,
      direction: "rtl",
      unicodeBidi: "plaintext",
      maxWidth,
    }}
  >
    {children}
  </div>
);

export const Heading: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
}> = ({
  children,
  size = ARCHAI.typography.h1.fontSize,
  color = ARCHAI.colors.white,
  align = "left",
}) => (
  <div
    style={{
      fontFamily: ARCHAI.fonts.latin,
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.08,
      color,
      textAlign: align,
      letterSpacing: "-0.025em",
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────
// TECHNICAL GRID / NODES
// ─────────────────────────────────────────────

export const Node: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  active?: boolean;
}> = ({ x = 0, y = 0, size = 10, active = false }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: "50%",
      background: active ? ARCHAI.colors.cyan : ARCHAI.colors.silver,
      boxShadow: active ? `0 0 24px rgba(25,211,243,0.55)` : "none",
    }}
  />
);

export const SignalLine: React.FC<{
  width?: number;
  active?: boolean;
  direction?: "horizontal" | "vertical";
}> = ({ width = 200, active = false, direction = "horizontal" }) => (
  <div
    style={{
      width: direction === "horizontal" ? width : 1,
      height: direction === "vertical" ? width : 1,
      background: active ? ARCHAI.colors.cyan : "rgba(140,154,165,0.35)",
      boxShadow: active ? "0 0 14px rgba(25,211,243,0.3)" : "none",
    }}
  />
);

export const TechnicalCard: React.FC<{
  children: React.ReactNode;
  width?: number;
}> = ({ children, width = 520 }) => (
  <div
    style={{
      width,
      padding: 28,
      borderRadius: ARCHAI.radius.lg,
      background: ARCHAI.colors.card,
      border: `1px solid ${ARCHAI.colors.border}`,
      boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────
// OLD BADGE API
// ─────────────────────────────────────────────

export const AccentBadge: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "9px 16px",
      borderRadius: ARCHAI.radius.sm,
      background: "rgba(25,211,243,0.08)",
      border: "1px solid rgba(25,211,243,0.22)",
      color: ARCHAI.colors.cyan,
      fontFamily: ARCHAI.fonts.latin,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────
// PHONE
// ─────────────────────────────────────────────

export const PhoneFrame: React.FC<{
  children?: React.ReactNode;
  width?: number;
}> = ({ children, width = 470 }) => {
  const height = width * 2.02;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.105,
        background: "#05080B",
        padding: width * 0.018,
        position: "relative",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: `
          0 40px 100px rgba(0,0,0,0.55),
          0 0 50px rgba(25,211,243,0.07)
        `,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.09,
          background: ARCHAI.colors.surface,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.28,
            height: 24,
            borderRadius: 20,
            background: "#05080B",
            zIndex: 10,
          }}
        />

        {children}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ACCENT
// ─────────────────────────────────────────────

export const AccentLine: React.FC<{
  width?: number;
}> = ({ width = 90 }) => (
  <div
    style={{
      width,
      height: 3,
      background: ARCHAI.colors.cyan,
      boxShadow: "0 0 18px rgba(25,211,243,0.3)",
    }}
  />
);
