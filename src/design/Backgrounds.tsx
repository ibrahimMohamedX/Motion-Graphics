import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { ARCHAI } from "./tokens";

type BackgroundProps = {
  children?: React.ReactNode;
};

const Atmosphere: React.FC<{
  opacity?: number;
}> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [0, 180, 360], [42, 58, 42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          top: "30%",
          width: 900,
          height: 900,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(25,211,243,0.075) 0%, rgba(25,211,243,0.025) 28%, transparent 68%)",
          opacity,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "-15%",
          bottom: "-20%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(25,211,243,0.025) 0%, transparent 68%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

export const GraphiteBackground: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(145deg, #10171E 0%, #0B1015 55%, #080C10 100%)",
        overflow: "hidden",
      }}
    >
      <Atmosphere />

      {children}
    </AbsoluteFill>
  );
};

export const BlueprintBackground: React.FC<BackgroundProps> = ({
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: ARCHAI.colors.bg,
        overflow: "hidden",
      }}
    >
      {/* Major blueprint lines */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "25%",
          height: 1,
          background: "rgba(25,211,243,0.09)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1,
          background: "rgba(25,211,243,0.07)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "75%",
          height: 1,
          background: "rgba(25,211,243,0.09)",
        }}
      />

      {/* Vertical blueprint lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "25%",
          width: 1,
          background: "rgba(25,211,243,0.09)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 1,
          background: "rgba(25,211,243,0.07)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "75%",
          width: 1,
          background: "rgba(25,211,243,0.09)",
        }}
      />

      <Atmosphere opacity={0.65} />

      {children}
    </AbsoluteFill>
  );
};

export const CleanDarkBackground: React.FC<BackgroundProps> = ({
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(145deg, #17212A 0%, #10171E 42%, #0B1015 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          right: -180,
          top: -140,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(25,211,243,0.055) 0%, transparent 68%)",
        }}
      />

      {children}
    </AbsoluteFill>
  );
};
