import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { FadeSlide, GraphiteBackground, PhoneFrame } from "./Shared";

import { SystemIcon, DataIcon } from "../design/icons";
import { ARCHAI } from "../design/tokens";

export type AppearanceToUtilityProps = {
  title?: string;
  highlight?: string;
  subtitle?: string;
};

export const AppearanceToUtility: React.FC<
  AppearanceToUtilityProps
> = ({
  title = "مش مجرد",
  highlight = "شكل حلو",
  subtitle = "القيمة الحقيقية في اللي بيحصل بعده",
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [12, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GraphiteBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 170,
          }}
        >
          <FadeSlide>
            <div
              dir="rtl"
              style={{
                textAlign: "center",
                fontFamily: ARCHAI.fonts.arabic,
              }}
            >
              <div
                style={{
                  fontSize: 68,
                  fontWeight: 700,
                  color: ARCHAI.colors.white,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 68,
                  fontWeight: 700,
                  color: ARCHAI.colors.cyan,
                }}
              >
                {highlight}
              </div>

              <div
                style={{
                  marginTop: 18,
                  fontSize: 28,
                  color: ARCHAI.colors.silver,
                }}
              >
                {subtitle}
              </div>
            </div>
          </FadeSlide>

          <div
            style={{
              position: "absolute",
              top: 620,
              left: 70,
              right: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 45,
            }}
          >
            <div
              style={{
                opacity: 1 - progress * 0.7,
                transform: `scale(${1 - progress * 0.1})`,
              }}
            >
              <PhoneFrame width={300}>
                <div
                  style={{
                    height: "100%",
                    padding: "75px 24px",
                    background: ARCHAI.colors.card,
                  }}
                >
                  <SystemIcon size={38} />

                  <div
                    style={{
                      marginTop: 25,
                      height: 150,
                      border: `1px solid ${ARCHAI.colors.border}`,
                    }}
                  />

                  <div
                    style={{
                      marginTop: 20,
                      height: 14,
                      width: "75%",
                      background: ARCHAI.colors.elevated,
                    }}
                  />
                </div>
              </PhoneFrame>
            </div>

            <div
              style={{
                width: 90,
                height: 1,
                background: ARCHAI.colors.cyan,
                transform: `scaleX(${progress})`,
                boxShadow:
                  "0 0 16px rgba(25,211,243,.35)",
              }}
            />

            <div
              style={{
                opacity: 0.15 + progress * 0.85,
                transform: `scale(${0.88 + progress * 0.12})`,
              }}
            >
              <PhoneFrame width={300}>
                <div
                  style={{
                    height: "100%",
                    padding: "75px 24px",
                    background: ARCHAI.colors.surface,
                  }}
                >
                  <DataIcon size={38} active />

                  <div
                    style={{
                      marginTop: 22,
                      height: 145,
                      background:
                        "linear-gradient(145deg, rgba(25,211,243,.2), rgba(25,211,243,.03))",
                      border:
                        "1px solid rgba(25,211,243,.25)",
                    }}
                  />

                  <div
                    style={{
                      marginTop: 20,
                      fontFamily: ARCHAI.fonts.latin,
                      fontSize: 22,
                      fontWeight: 700,
                      color: ARCHAI.colors.white,
                    }}
                  >
                    Useful System
                  </div>
                </div>
              </PhoneFrame>
            </div>
          </div>
        </div>
      </GraphiteBackground>
    </AbsoluteFill>
  );
};
