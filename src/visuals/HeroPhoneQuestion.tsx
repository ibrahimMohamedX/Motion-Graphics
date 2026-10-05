import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import {
  AccentBadge,
  FadeSlide,
  GraphiteBackground,
  PhoneFrame,
  Pop,
} from "./Shared";

import { ConnectionIcon } from "../design/icons";
import { ARCHAI } from "../design/tokens";

export type HeroPhoneQuestionProps = {
  question?: string;
  highlight?: string;
  subtitle?: string;
  badge?: string;
};

export const HeroPhoneQuestion: React.FC<HeroPhoneQuestionProps> = ({
  question = "هل الـ App",
  highlight = "رفاهية؟",
  subtitle = "ولا ضرورة للبزنس؟",
  badge = "BUSINESS QUESTION / 001",
}) => {
  const frame = useCurrentFrame();

  const lineProgress = interpolate(frame, [15, 55], [0, 1], {
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 150,
          }}
        >
          <FadeSlide>
            <AccentBadge>{badge}</AccentBadge>
          </FadeSlide>

          <FadeSlide delay={8}>
            <div
              dir="rtl"
              style={{
                marginTop: 34,
                textAlign: "center",
                fontFamily: ARCHAI.fonts.arabic,
                fontSize: 72,
                lineHeight: 1.2,
                fontWeight: 700,
                color: ARCHAI.colors.white,
              }}
            >
              {question}
              <br />
              <span style={{ color: ARCHAI.colors.cyan }}>
                {highlight}
              </span>
            </div>
          </FadeSlide>

          <FadeSlide delay={16}>
            <div
              dir="rtl"
              style={{
                marginTop: 20,
                fontFamily: ARCHAI.fonts.arabic,
                fontSize: 34,
                color: ARCHAI.colors.silver,
              }}
            >
              {subtitle}
            </div>
          </FadeSlide>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pop delay={20}>
              <PhoneFrame width={390}>
                <div
                  style={{
                    height: "100%",
                    padding: "76px 26px 26px",
                    background: ARCHAI.colors.surface,
                    fontFamily: ARCHAI.fonts.latin,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: ARCHAI.colors.muted,
                        letterSpacing: "0.1em",
                      }}
                    >
                      ARCHAI / BUSINESS APP
                    </span>

                    <ConnectionIcon size={24} active />
                  </div>

                  <div
                    style={{
                      marginTop: 34,
                      border: `1px solid ${ARCHAI.colors.border}`,
                      padding: 18,
                      background: ARCHAI.colors.card,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: ARCHAI.colors.muted,
                      }}
                    >
                      CUSTOMER EXPERIENCE
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 27,
                        fontWeight: 800,
                        color: ARCHAI.colors.white,
                      }}
                    >
                      Your Business
                    </div>

                    <div
                      style={{
                        marginTop: 20,
                        height: 5,
                        background: ARCHAI.colors.elevated,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${lineProgress * 100}%`,
                          height: "100%",
                          background: ARCHAI.colors.cyan,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    {["Products", "Orders", "Payments", "Support"].map(
                      (item) => (
                        <div
                          key={item}
                          style={{
                            padding: 15,
                            border: `1px solid ${ARCHAI.colors.border}`,
                            color: ARCHAI.colors.silver,
                            fontSize: 12,
                          }}
                        >
                          {item}
                        </div>
                      ),
                    )}
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
