import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { FadeSlide, GraphiteBackground, PhoneFrame, Pop } from "./Shared";

import { DataIcon } from "../design/icons";
import { ARCHAI } from "../design/tokens";

export type PhoneUsageCounterProps = {
  question?: string;
  target?: string | number;
  label?: string;
};

export const PhoneUsageCounter: React.FC<PhoneUsageCounterProps> = ({
  question = "عميلك بيفتح موبايله كام مرة في اليوم؟",
  target = 47,
  label = "تفاعل يومي",
}) => {
  const frame = useCurrentFrame();

  const targetNumber =
    typeof target === "number"
      ? target
      : Number(target) || 47;

  const count = Math.floor(
    interpolate(frame, [5, 70], [0, targetNumber], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const progress =
    targetNumber > 0
      ? count / targetNumber
      : 0;

  return (
    <AbsoluteFill>
      <GraphiteBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 175,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FadeSlide>
            <div
              dir="rtl"
              style={{
                textAlign: "center",
                fontFamily: ARCHAI.fonts.arabic,
                fontSize: 42,
                fontWeight: 600,
                color: ARCHAI.colors.white,
                maxWidth: 820,
              }}
            >
              {question}
            </div>
          </FadeSlide>

          <div
            style={{
              marginTop: 70,
            }}
          >
            <Pop delay={12}>
              <PhoneFrame width={380}>
                <div
                  style={{
                    height: "100%",
                    padding: "95px 28px 30px",
                    background: ARCHAI.colors.surface,
                    textAlign: "center",
                  }}
                >
                  <DataIcon size={42} active />

                  <div
                    style={{
                      marginTop: 18,
                      fontFamily: ARCHAI.fonts.latin,
                      fontSize: 13,
                      letterSpacing: "0.14em",
                      color: ARCHAI.colors.muted,
                    }}
                  >
                    CUSTOMER TOUCHPOINTS
                  </div>

                  <div
                    style={{
                      marginTop: 24,
                      fontFamily: ARCHAI.fonts.latin,
                      fontSize: 128,
                      lineHeight: 0.9,
                      fontWeight: 800,
                      color: ARCHAI.colors.white,
                    }}
                  >
                    {count}
                  </div>

                  <div
                    style={{
                      marginTop: 15,
                      fontFamily: ARCHAI.fonts.arabic,
                      fontSize: 23,
                      color: ARCHAI.colors.silver,
                    }}
                  >
                    {label}
                  </div>

                  <div
                    style={{
                      marginTop: 48,
                      height: 4,
                      background: ARCHAI.colors.elevated,
                    }}
                  >
                    <div
                      style={{
                        width: `${progress * 100}%`,
                        height: "100%",
                        background: ARCHAI.colors.cyan,
                        boxShadow:
                          "0 0 16px rgba(25,211,243,.4)",
                      }}
                    />
                  </div>
                </div>
              </PhoneFrame>
            </Pop>
          </div>
        </div>
      </GraphiteBackground>
    </AbsoluteFill>
  );
};
