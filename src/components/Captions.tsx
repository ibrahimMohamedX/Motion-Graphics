import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { ARCHAI } from "../design/tokens";

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
};

type CaptionsProps = {
  captions: Caption[];
};

const splitHighlight = (text: string) => {
  const words = text.trim().split(/\s+/);

  if (words.length <= 2) {
    return {
      normal: text,
      highlight: "",
    };
  }

  const highlightCount = words.length >= 7 ? 2 : 1;

  return {
    normal: words.slice(0, -highlightCount).join(" "),
    highlight: words.slice(-highlightCount).join(" "),
  };
};

export const Captions: React.FC<CaptionsProps> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const currentMs = (frame / fps) * 1000;

  const caption = captions.find(
    (item) => currentMs >= item.startMs && currentMs < item.endMs,
  );

  if (!caption) {
    return null;
  }

  const startFrame = Math.round((caption.startMs / 1000) * fps);

  const localFrame = Math.max(0, frame - startFrame);

  const progress = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 22,
      stiffness: 170,
      mass: 0.65,
    },
  });

  const translateY = interpolate(progress, [0, 1], [18, 0]);

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const { normal, highlight } = splitHighlight(caption.text);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingLeft: 90,
        paddingRight: 90,
        paddingBottom: height * 0.105,
      }}
    >
      <div
        dir="rtl"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: 900,

          fontFamily: ARCHAI.fonts.arabic,

          fontSize: 42,
          fontWeight: 600,
          lineHeight: 1.42,

          color: ARCHAI.colors.white,
          textAlign: "center",

          direction: "rtl",
          unicodeBidi: "plaintext",

          textShadow: `
            0 2px 4px rgba(0,0,0,0.8),
            0 0 20px rgba(0,0,0,0.45)
          `,
        }}
      >
        <span>{normal}</span>{" "}
        {highlight && (
          <span
            style={{
              color: ARCHAI.colors.cyan,
              fontWeight: 700,
              textShadow: "0 0 18px rgba(25,211,243,0.28)",
            }}
          >
            {highlight}
          </span>
        )}
      </div>

      <div
        style={{
          marginTop: 12,
          width: 42,
          height: 2,
          opacity: 0.8,
          background: ARCHAI.colors.cyan,
          boxShadow: "0 0 12px rgba(25,211,243,0.3)",
        }}
      />
    </AbsoluteFill>
  );
};
