import React from "react";
import { SCENE_LAYOUT } from "../design/SceneLayout";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import {
  AccentBadge,
  FadeSlide,
  BlueprintBackground,
  GraphiteBackground,
  CleanDarkBackground,
  PhoneFrame,
  Pop,
} from "./Shared";

import {
  SystemIcon,
  DataIcon,
  ConnectionIcon,
  CircuitIcon,
} from "../design/icons";

import { ARCHAI } from "../design/tokens";

const ArabicTitle: React.FC<{
  children: React.ReactNode;
  cyan?: boolean;
  size?: number;
}> = ({ children, cyan = false, size = 62 }) => (
  <div
    dir="rtl"
    style={{
      fontFamily: ARCHAI.fonts.arabic,
      fontSize: size,
      lineHeight: 1.18,
      fontWeight: 700,
      color: cyan ? ARCHAI.colors.cyan : ARCHAI.colors.white,
    }}
  >
    {children}
  </div>
);

const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      padding: 22,
      border: `1px solid ${ARCHAI.colors.border}`,
      background: ARCHAI.colors.card,
    }}
  >
    {icon}

    <div
      style={{
        marginTop: 16,
        fontFamily: ARCHAI.fonts.latin,
        fontSize: 12,
        color: ARCHAI.colors.muted,
        letterSpacing: "0.08em",
      }}
    >
      {title}
    </div>

    <div
      style={{
        marginTop: 7,
        fontFamily: ARCHAI.fonts.latin,
        fontSize: 30,
        fontWeight: 800,
        color: ARCHAI.colors.white,
      }}
    >
      {value}
    </div>
  </div>
);

export type UnifiedAppJourneyProps = {
  title?: string;
  highlight?: string;
  steps?: string[];
};

export const UnifiedAppJourney: React.FC<UnifiedAppJourneyProps> = ({
  title = "Ã˜Â±Ã˜Â­Ã™â€žÃ˜Â© Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž",
  highlight = "Ã™ÂÃ™Å  App Ã™Ë†Ã˜Â§Ã˜Â­Ã˜Â¯",
  steps: stepLabels = ["Ã™â€¦Ã™â€ Ã˜ÂªÃ˜Â¬", "Ã˜Â·Ã™â€žÃ˜Â¨", "Ã˜Â¯Ã™ÂÃ˜Â¹", "Ã™â€¦Ã˜ÂªÃ˜Â§Ã˜Â¨Ã˜Â¹Ã˜Â©", "Ã˜Â¥Ã˜Â´Ã˜Â¹Ã˜Â§Ã˜Â±"],
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [8, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const icons = [
    <SystemIcon size={32} />,
    <DataIcon size={32} />,
    <CircuitIcon size={32} />,
    <ConnectionIcon size={32} />,
    <DataIcon size={32} active />,
  ];

  const steps = stepLabels.map((label, index) => [
    label,
    icons[index % icons.length],
  ]);

  return (
    <AbsoluteFill>
      <BlueprintBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 150,
          }}
        >
          <FadeSlide>
            <div style={{ textAlign: "center" }}>
              <AccentBadge>UNIFIED CUSTOMER JOURNEY</AccentBadge>

              <div style={{ marginTop: 28 }}>
                <ArabicTitle>{title}</ArabicTitle>

                <ArabicTitle cyan>{highlight}</ArabicTitle>
              </div>
            </div>
          </FadeSlide>

          <div
            style={{
              position: "absolute",
              top: SCENE_LAYOUT.visual.top,
              bottom: 420,
              left: SCENE_LAYOUT.safe.left,
              right: SCENE_LAYOUT.safe.right,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 39,
                left: 55,
                right: 55,
                height: 2,
                background: ARCHAI.colors.elevated,
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: "100%",
                  background: ARCHAI.colors.cyan,
                  boxShadow: "0 0 16px rgba(25,211,243,.4)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {steps.map(([title, icon], index) => (
                <Pop key={String(title)} delay={index * 9}>
                  <div
                    style={{
                      width: SCENE_LAYOUT.sizes.journeyItemWidth,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: SCENE_LAYOUT.sizes.journeyIcon,
                        height: SCENE_LAYOUT.sizes.journeyIcon,
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        border: `1px solid ${
                          index === 4
                            ? ARCHAI.colors.cyan
                            : ARCHAI.colors.borderStrong
                        }`,
                        background: ARCHAI.colors.card,
                      }}
                    >
                      {icon}
                    </div>

                    <div
                      dir="rtl"
                      style={{
                        marginTop: 17,
                        fontFamily: ARCHAI.fonts.arabic,
                        fontSize: 22,
                        color:
                          index === 4
                            ? ARCHAI.colors.cyan
                            : ARCHAI.colors.silver,
                      }}
                    >
                      {title}
                    </div>
                  </div>
                </Pop>
              ))}
            </div>
          </div>
        </div>
      </BlueprintBackground>
    </AbsoluteFill>
  );
};

export type BusinessInsightsDashboardProps = {
  title?: string;
  highlight?: string;
  customers?: string;
  orders?: string;
  revenueStart?: number;
  revenueEnd?: number;
  variant?: "metric-stack" | "dashboard" | "signal-chart";
};

export const BusinessInsightsDashboard: React.FC<
  BusinessInsightsDashboardProps
> = ({
  title = "Ã˜Â£Ã™â€ Ã˜Âª Ã™Æ’Ã™â€¦Ã˜Â§Ã™â€ ",
  highlight = "Ã˜Â¨Ã˜ÂªÃ™ÂÃ™â€¡Ã™â€¦ Ã˜Â¹Ã™â€¦Ã™â€žÃ˜Â§Ã˜Â¦Ã™Æ’ Ã˜Â£Ã™Æ’Ã˜ÂªÃ˜Â±",
  customers = "1,284",
  orders = "348",
  revenueStart = 4200,
  revenueEnd = 8750,
  variant = "dashboard",
}) => {
  void variant;
  const frame = useCurrentFrame();
  const revenue = Math.floor(
  interpolate(frame, [0, 70], [revenueStart, revenueEnd], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill>
      <GraphiteBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "150px 55px",
          }}
        >
          <FadeSlide>
            <div style={{ textAlign: "center" }}>
              <ArabicTitle>{title}</ArabicTitle>

              <ArabicTitle cyan>{highlight}</ArabicTitle>
            </div>
          </FadeSlide>

          <Pop delay={10}>
            <div
              style={{
                position: "absolute",
                top: SCENE_LAYOUT.visual.top,
                left: SCENE_LAYOUT.safe.left,
                right: SCENE_LAYOUT.safe.right,
                padding: 30,
                border: `1px solid ${ARCHAI.colors.border}`,
                background: ARCHAI.colors.surface,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: ARCHAI.fonts.latin,
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  BUSINESS INTELLIGENCE
                </div>

                <AccentBadge>LIVE DATA</AccentBadge>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 28,
                }}
              >
                <MetricCard
                  title="CUSTOMERS"
                  value={customers}
                  icon={<DataIcon size={32} />}
                />

                <MetricCard
                  title="ORDERS"
                  value={orders}
                  icon={<SystemIcon size={32} />}
                />

                <MetricCard
                  title="REVENUE"
                  value={`${revenue.toLocaleString()} EGP`}
                  icon={<CircuitIcon size={32} active />}
                />
              </div>

              <div
                style={{
                  marginTop: 20,
                  height: 300,
                  border: `1px solid ${ARCHAI.colors.border}`,
                  position: "relative",
                  overflow: "hidden",
                  background: ARCHAI.colors.card,
                }}
              >
                {[25, 50, 75].map((y) => (
                  <div
                    key={y}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: `${y}%`,
                      height: 1,
                      background: "rgba(255,255,255,.045)",
                    }}
                  />
                ))}

                {[35, 65, 45, 85, 70, 100].map((height, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: `${10 + index * 16}%`,
                      width: 35,
                      height: height * 1.35,
                      background:
                        index === 5
                          ? ARCHAI.colors.cyan
                          : ARCHAI.colors.elevated,
                    }}
                  />
                ))}
              </div>
            </div>
          </Pop>
        </div>
      </GraphiteBackground>
    </AbsoluteFill>
  );
};

export type CustomerRetentionLoopProps = {
  title?: string;
  highlight?: string;
  centerText?: string;
  items?: string[];
  variant?: "circular-loop" | "repeat-path" | "customer-cycle";
};

export const CustomerRetentionLoop: React.FC<
  CustomerRetentionLoopProps
> = ({
  title = "Ã™â€¦Ã˜Â´ Ã™â€¦Ã˜Â¬Ã˜Â±Ã˜Â¯",
  highlight = "Ã˜Â¨Ã™Å Ã˜Â¹Ã˜Â© Ã™Ë†Ã˜Â§Ã˜Â­Ã˜Â¯Ã˜Â©",
  centerText = "Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€¦Ã™Å Ã™â€ž Ã™Å Ã˜Â±Ã˜Â¬Ã˜Â¹Ã™â€žÃ™Æ’ Ã˜ÂªÃ˜Â§Ã™â€ Ã™Å ",
  items: itemLabels = ["Ã˜Â¹Ã™â€¦Ã™Å Ã™â€ž", "Ã˜Â´Ã˜Â±Ã˜Â§Ã˜Â¡", "Ã˜ÂªÃ™ÂÃ˜Â§Ã˜Â¹Ã™â€ž", "Ã™Ë†Ã™â€žÃ˜Â§Ã˜Â¡"],
  variant = "circular-loop",
}) => {
  void variant;
  // frame intentionally unused


  const items = [
    [itemLabels[0] ?? "Ã˜Â¹Ã™â€¦Ã™Å Ã™â€ž", <ConnectionIcon size={30} />],
    [itemLabels[1] ?? "Ã˜Â´Ã˜Â±Ã˜Â§Ã˜Â¡", <CircuitIcon size={30} />],
    [itemLabels[2] ?? "Ã˜ÂªÃ™ÂÃ˜Â§Ã˜Â¹Ã™â€ž", <DataIcon size={30} />],
    [itemLabels[3] ?? "Ã™Ë†Ã™â€žÃ˜Â§Ã˜Â¡", <SystemIcon size={30} active />],
  ];

  return (
    <AbsoluteFill>
      <GraphiteBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 165,
          }}
        >
          <FadeSlide>
            <div style={{ textAlign: "center" }}>
              <ArabicTitle>{title}</ArabicTitle>

              <ArabicTitle cyan>{highlight}</ArabicTitle>
            </div>
          </FadeSlide>

          <div
            style={{
              position: "absolute",
              top: SCENE_LAYOUT.visual.top,
              bottom: 300,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: SCENE_LAYOUT.sizes.retentionCircle,
                height: SCENE_LAYOUT.sizes.retentionCircle,
                borderRadius: "50%",
                border: "1px dashed rgba(25,211,243,.4)",
                position: "relative",
                transform: "none",
              }}
            >
              {items.map(([title, icon], index) => {
                const positions = [
                  { top: -35, left: 200 },
                  { top: 200, right: -35 },
                  { bottom: -35, left: 200 },
                  { top: 200, left: -35 },
                ];

                return (
                  <div
                    key={String(title)}
                    style={{
                      position: "absolute",
                      ...positions[index],
                      width: SCENE_LAYOUT.sizes.retentionNode,
                      height: SCENE_LAYOUT.sizes.retentionNode,
                      borderRadius: "50%",
                      border: `1px solid ${
                        index === 3
                          ? ARCHAI.colors.cyan
                          : ARCHAI.colors.borderStrong
                      }`,
                      background: ARCHAI.colors.card,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {icon}

                    <span
                      dir="rtl"
                      style={{
                        marginTop: 7,
                        fontFamily: ARCHAI.fonts.arabic,
                        fontSize: 15,
                        color: ARCHAI.colors.silver,
                      }}
                    >
                      {title}
                    </span>
                  </div>
                );
              })}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "none",
                }}
              >
                <div
                  dir="rtl"
                  style={{
                    width: SCENE_LAYOUT.sizes.retentionCenter,
                    height: SCENE_LAYOUT.sizes.retentionCenter,
                    borderRadius: "50%",
                    background: ARCHAI.colors.card,
                    border: "1px solid rgba(25,211,243,.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontFamily: ARCHAI.fonts.arabic,
                    fontSize: 29,
                    lineHeight: 1.35,
                    fontWeight: 700,
                    color: ARCHAI.colors.white,
                    boxShadow: "0 0 50px rgba(25,211,243,.08)",
                  }}
                >
                  {centerText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GraphiteBackground>
    </AbsoluteFill>
  );
};

export type CompetitionPressureProps = {
  title?: string;
  highlight?: string;
  competitors?: string[];
  yourLabel?: string;
  heights?: number[];
  variant?: "rising-bars" | "market-pressure" | "comparison-field";
};

export const CompetitionPressure: React.FC<
  CompetitionPressureProps
> = ({
  title = "Ã˜Â§Ã™â€žÃ™â€¦Ã™â€ Ã˜Â§Ã™ÂÃ˜Â³Ã˜Â©",
  highlight = "Ã˜Â¨Ã˜ÂªÃ˜Â²Ã™Å Ã˜Â¯ Ã™Æ’Ã™â€ž Ã™Å Ã™Ë†Ã™â€¦",
  competitors = ["COMPETITOR 1", "COMPETITOR 2", "COMPETITOR 3"],
  yourLabel = "YOU",
  heights = [180, 260, 350, 470],
  variant = "rising-bars",
}) => {
  void variant;
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BlueprintBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 175,
          }}
        >
          <FadeSlide>
            <div style={{ textAlign: "center" }}>
              <ArabicTitle>{title}</ArabicTitle>

              <ArabicTitle cyan>{highlight}</ArabicTitle>
            </div>
          </FadeSlide>

          <div
            style={{
              position: "absolute",
              left: SCENE_LAYOUT.safe.left,
              right: SCENE_LAYOUT.safe.right,
              top: SCENE_LAYOUT.visual.top,
              bottom: 300,
              height: "auto",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 30,
            }}
          >
            {heights.map((height, index) => {
              const h = height * progress * (SCENE_LAYOUT.sizes.competitionHeight / 470);

              return (
                <div
                  key={index}
                  style={{
                    width: SCENE_LAYOUT.sizes.competitionBarWidth,
                    height: h,
                    borderTop:
                      index === heights.length - 1 ? `3px solid ${ARCHAI.colors.cyan}`
                        : `1px solid ${ARCHAI.colors.borderStrong}`,
                    background:
                      index === heights.length - 1 ? "rgba(25,211,243,.12)" : ARCHAI.colors.card,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -35,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      fontFamily: ARCHAI.fonts.latin,
                      fontSize: 16,
                      color:
                        index === heights.length - 1 ? ARCHAI.colors.cyan : ARCHAI.colors.muted,
                    }}
                  >
                    {index === heights.length - 1 ? yourLabel : (competitors[index] ?? `COMPETITOR ${index + 1}`)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BlueprintBackground>
    </AbsoluteFill>
  );
};

export type MissedOpportunitiesProps = {
  question?: string;
  target?: number;
  label?: string;
  variant?: "counter" | "warning" | "loss-field";
};

export const MissedOpportunities: React.FC<
  MissedOpportunitiesProps
> = ({
  question = "Ã™â€šÃ˜Â¯ Ã˜Â¥Ã™Å Ã™â€¡ Ã™â€¦Ã™â€¦Ã™Æ’Ã™â€  Ã˜ÂªÃ˜Â®Ã˜Â³Ã˜Â±Ã˜Å¸",
  target = 12,
  label = "{label}",
  variant = "counter",
}) => {
  void variant;
  const frame = useCurrentFrame();

  const numericTarget =
    typeof target === "number"
      ? target
      : Number.parseFloat(String(target).replace(/[^0-9.-]/g, "")) || 0;

  const lost = Math.floor(
    interpolate(frame, [0, 75], [0, numericTarget], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <AbsoluteFill>
      <CleanDarkBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 180,
            textAlign: "center",
          }}
        >
          <FadeSlide>
            <ArabicTitle size={58}>{question}</ArabicTitle>


          </FadeSlide>

          <Pop delay={12}>
            <div
              style={{
                position: "absolute",
                top: SCENE_LAYOUT.visual.top,
                left: SCENE_LAYOUT.safe.left,
                right: SCENE_LAYOUT.safe.right,
                maxWidth: SCENE_LAYOUT.sizes.missedCardWidth,
                margin: "0 auto",
                padding: "65px 40px",
                border: "1px solid rgba(25,211,243,.2)",
                background: ARCHAI.colors.card,
              }}
            >
              <div
                style={{
                  fontFamily: ARCHAI.fonts.latin,
                  fontSize: 14,
                  letterSpacing: "0.15em",
                  color: ARCHAI.colors.muted,
                }}
              >
                MISSED OPPORTUNITIES
              </div>

              <div
                style={{
                  marginTop: 22,
                  fontFamily: ARCHAI.fonts.latin,
                  fontSize: 156,
                  lineHeight: 1,
                  fontWeight: 800,
                  color: ARCHAI.colors.cyan,
                }}
              >
                {lost}
              </div>

              <div
                dir="rtl"
                style={{
                  marginTop: 12,
                  fontFamily: ARCHAI.fonts.arabic,
                  fontSize: 27,
                  color: ARCHAI.colors.white,
                }}
              >
                {label}
              </div>
            </div>
          </Pop>
        </div>
      </CleanDarkBackground>
    </AbsoluteFill>
  );
};

export type DigitalTransformationProps = {
  title?: string;
  highlight?: string;
  leftLabel?: string;
  rightLabel?: string;
  variant?: "before-after" | "transformation-flow" | "experience-shift";
};

export const DigitalTransformation: React.FC<
  DigitalTransformationProps
> = ({
  title = "Ã˜Â­Ã™Ë†Ã™â€˜Ã™â€ž Ã˜ÂªÃ˜Â¬Ã˜Â±Ã˜Â¨Ã˜Â©",
  highlight = "Ã˜Â¹Ã™â€¦Ã™â€žÃ˜Â§Ã˜Â¦Ã™Æ’",
  leftLabel = "Ã˜ÂªÃ˜Â¬Ã˜Â±Ã˜Â¨Ã˜Â© Ã˜ÂªÃ™â€šÃ™â€žÃ™Å Ã˜Â¯Ã™Å Ã˜Â©",
  rightLabel = "Ã˜ÂªÃ˜Â¬Ã˜Â±Ã˜Â¨Ã˜Â© Ã˜Â±Ã™â€šÃ™â€¦Ã™Å Ã˜Â©",
  variant = "before-after",
}) => {
  void variant;
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [8, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BlueprintBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: 155,
          }}
        >
          <FadeSlide>
            <div style={{ textAlign: "center" }}>
              <AccentBadge>DIGITAL TRANSFORMATION</AccentBadge>

              <div style={{ marginTop: 28 }}>
                <ArabicTitle>{title}</ArabicTitle>

                <ArabicTitle cyan>{highlight}</ArabicTitle>
              </div>
            </div>
          </FadeSlide>

          <div
            style={{
              position: "absolute",
              top: SCENE_LAYOUT.visual.top,
              bottom: 420,
              left: SCENE_LAYOUT.safe.left,
              right: SCENE_LAYOUT.safe.right,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 45,
            }}
          >
            <div
              style={{
                width: SCENE_LAYOUT.sizes.transformationBox,
                height: SCENE_LAYOUT.sizes.transformationBox,
                border: "1px solid rgba(255,255,255,.1)",
                background: ARCHAI.colors.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                dir="rtl"
                style={{
                  fontFamily: ARCHAI.fonts.arabic,
                  fontSize: 29,
                  color: ARCHAI.colors.muted,
                }}
              >
                {leftLabel}
              </div>
            </div>

            <div
              style={{
                width: 100,
                height: 1,
                background: ARCHAI.colors.cyan,
                transform: `scaleX(${progress})`,
              }}
            />

            <div
              style={{
                width: SCENE_LAYOUT.sizes.transformationBox,
                height: SCENE_LAYOUT.sizes.transformationBox,
                border: "1px solid rgba(25,211,243,.4)",
                background: "rgba(25,211,243,.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                transform: `scale(${0.9 + progress * 0.1})`,
                opacity: 0.25 + progress * 0.75,
                boxShadow: "0 0 60px rgba(25,211,243,.08)",
              }}
            >
              <div
                dir="rtl"
                style={{
                  fontFamily: ARCHAI.fonts.arabic,
                  fontSize: 29,
                  fontWeight: 700,
                  color: ARCHAI.colors.cyan,
                }}
              >
                {rightLabel}
              </div>
            </div>
          </div>
        </div>
      </BlueprintBackground>
    </AbsoluteFill>
  );
};

export type CustomAppSolutionProps = {
  title?: string;
  highlight?: string;
  appName?: string;
  variant?: "phone" | "product-showcase" | "system-preview";
};

export const CustomAppSolution: React.FC<
  CustomAppSolutionProps
> = ({
  title = "Mobile Apps",
  highlight = "{highlight}",
  appName = "Your Business",
  variant = "phone",
}) => (
  <>
    {void variant}
    <AbsoluteFill>
    <GraphiteBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 140,
        }}
      >
        <FadeSlide>
          <div style={{ textAlign: "center" }}>
            <AccentBadge>ARCHAI SOLUTIONS</AccentBadge>

            <div style={{ marginTop: 28 }}>
              <div
  style={{
    fontFamily: ARCHAI.fonts.latin,
    fontSize: 54,
    fontWeight: 800,
    color: ARCHAI.colors.white,
  }}
>
  {title}
</div>

              <ArabicTitle cyan size={48}>
                {highlight}
              </ArabicTitle>
            </div>
          </div>
        </FadeSlide>

        <div
          style={{
            position: "absolute",
            top: SCENE_LAYOUT.visual.top,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pop delay={10}>
            <PhoneFrame width={SCENE_LAYOUT.sizes.phoneWidth}>
              <div
                style={{
                  height: "100%",
                  padding: "80px 25px 25px",
                  background: ARCHAI.colors.surface,
                }}
              >
                <div
                  style={{
                    fontFamily: ARCHAI.fonts.latin,
                    fontSize: 12,
                    letterSpacing: "0.12em",
                    color: ARCHAI.colors.muted,
                  }}
                >
                  CUSTOM BUSINESS SYSTEM
                </div>

                <div
                  style={{
                    marginTop: 28,
                    fontFamily: ARCHAI.fonts.latin,
                    fontSize: 34,
                    fontWeight: 800,
                    color: ARCHAI.colors.white,
                  }}
                >{appName}</div>

                <div
                  style={{
                    marginTop: 25,
                    height: 170,
                    border: "1px solid rgba(25,211,243,.28)",
                    background:
                      "linear-gradient(145deg, rgba(25,211,243,.16), rgba(25,211,243,.025))",
                  }}
                />

                <div
                  style={{
                    marginTop: 20,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                  }}
                >
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      style={{
                        height: 70,
                        border: `1px solid ${ARCHAI.colors.border}`,
                        background: ARCHAI.colors.card,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 20,
                    height: 54,
                    background: ARCHAI.colors.cyan,
                    opacity: 0.9,
                  }}
                />
              </div>
            </PhoneFrame>
          </Pop>
        </div>
      </div>
    </GraphiteBackground>
  </AbsoluteFill>
  </>
);

export type FinalBrandCTAProps = {
  title?: string;
  cta?: string;
  subtitle?: string;
  brand?: string;
  variant?: "centered" | "minimal" | "conversion";
};

export const FinalBrandCTA: React.FC<
  FinalBrandCTAProps
> = ({
  title = "Archai Solutions",
  cta = "Ã˜Â®Ã™â€žÃ™Å  Ã˜Â§Ã™â€žÃ˜Â¨Ã˜Â²Ã™â€ Ã˜Â³ Ã˜Â£Ã™â€šÃ˜Â±Ã˜Â¨ Ã™â€žÃ˜Â¹Ã™â€¦Ã™â€žÃ˜Â§Ã˜Â¦Ã™Æ’",
  subtitle = "Ã˜Â­Ã™â€žÃ™Ë†Ã™â€ž Ã˜Â±Ã™â€šÃ™â€¦Ã™Å Ã˜Â© Ã™â€¦Ã˜ÂµÃ™â€¦Ã™â€¦Ã˜Â© Ã™â€žÃ™â€ Ã˜ÂªÃ™Å Ã˜Â¬Ã˜Â© Ã˜Â­Ã™â€šÃ™Å Ã™â€šÃ™Å Ã˜Â©.",
  brand = "AS",
  variant = "centered",
}) => {
  void variant;
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 35], [0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <CleanDarkBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            transform: `scale(${scale})`,
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(25,211,243,.45)",
              background: ARCHAI.colors.card,
              color: ARCHAI.colors.cyan,
              fontFamily: ARCHAI.fonts.latin,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              boxShadow: "0 0 60px rgba(25,211,243,.1)",
            }}
          >{brand}</div>

          <div
            style={{
              marginTop: 32,
              fontFamily: ARCHAI.fonts.latin,
              fontSize: 58,
              fontWeight: 800,
              color: ARCHAI.colors.white,
            }}
          >{title}</div>

          <div
            dir="rtl"
            style={{
              marginTop: 18,
              fontFamily: ARCHAI.fonts.arabic,
              fontSize: 37,
              fontWeight: 600,
              color: ARCHAI.colors.cyan,
            }}
          >{cta}</div>

          <div
            style={{
              marginTop: 35,
              width: 300,
              height: 1,
              background: ARCHAI.colors.cyan,
              boxShadow: "0 0 18px rgba(25,211,243,.35)",
            }}
          />

          <div
            dir="rtl"
            style={{
              marginTop: 25,
              fontFamily: ARCHAI.fonts.arabic,
              fontSize: 24,
              color: ARCHAI.colors.silver,
            }}
          >{subtitle}</div>
        </div>
      </CleanDarkBackground>
    </AbsoluteFill>
  );
};





















