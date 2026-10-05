import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  GraphiteBackground,
  Grid,
  Node,
  TechnicalCard,
  PhoneFrame,
  AccentBadge,
  AccentLine,
  ArabicText,
  Heading,
} from "./visuals/Shared";

import {
  SystemIcon,
  DataIcon,
  ConnectionIcon,
  CircuitIcon,
} from "./design/icons";

import { ARCHAI } from "./design/tokens";

const SectionLabel: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div
    style={{
      fontFamily: ARCHAI.fonts.latin,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: ARCHAI.colors.cyan,
      marginBottom: 18,
    }}
  >
    {children}
  </div>
);

const SmallRule: React.FC = () => (
  <div
    style={{
      width: 42,
      height: 2,
      background: ARCHAI.colors.cyan,
      marginTop: 18,
      boxShadow: "0 0 14px rgba(25,211,243,0.25)",
    }}
  />
);

const ColorSwatch: React.FC<{
  name: string;
  value: string;
}> = ({ name, value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 8,
        background: value,
        border: "1px solid rgba(255,255,255,0.12)",
        flexShrink: 0,
      }}
    />

    <div>
      <div
        style={{
          color: ARCHAI.colors.white,
          fontFamily: ARCHAI.fonts.latin,
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {name}
      </div>

      <div
        style={{
          color: ARCHAI.colors.muted,
          fontFamily: "monospace",
          fontSize: 12,
          marginTop: 3,
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

const AnimatedSignal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: ARCHAI.motion.spring.standard,
  });

  const x = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "relative",
        width: 520,
        height: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 49,
          width: "100%",
          height: 1,
          background: "rgba(140,154,165,0.25)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: `${x * 92}%`,
          top: 43,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: ARCHAI.colors.cyan,
          boxShadow: "0 0 24px rgba(25,211,243,0.6)",
          transform: "translateX(-50%)",
        }}
      />

      {[0, 25, 50, 75, 100].map((position) => (
        <div
          key={position}
          style={{
            position: "absolute",
            left: `${position}%`,
            top: 44,
            width: 10,
            height: 10,
            borderRadius: "50%",
            border: "1px solid rgba(140,154,165,0.5)",
            background: ARCHAI.colors.bg,
            transform: "translateX(-50%)",
          }}
        />
      ))}
    </div>
  );
};

const BlueprintSystem: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: 650,
        height: 360,
        border: `1px solid ${ARCHAI.colors.border}`,
        background: "rgba(11,16,21,0.58)",
        overflow: "hidden",
      }}
    >
      <Grid />

      <div
        style={{
          position: "absolute",
          left: 85,
          top: 80,
          width: 150,
          height: 90,
          border: "1px solid rgba(25,211,243,0.38)",
          background: "rgba(25,211,243,0.025)",
        }}
      >
        <div
          style={{
            padding: 16,
            fontFamily: ARCHAI.fonts.latin,
            fontSize: 14,
            fontWeight: 700,
            color: ARCHAI.colors.white,
          }}
        >
          INPUT
        </div>

        <div
          style={{
            paddingLeft: 16,
            color: ARCHAI.colors.muted,
            fontSize: 12,
          }}
        >
          Customer Data
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 300,
          top: 135,
          width: 150,
          height: 90,
          border: "1px solid rgba(25,211,243,0.55)",
          background: "rgba(25,211,243,0.055)",
        }}
      >
        <div
          style={{
            padding: 16,
            fontFamily: ARCHAI.fonts.latin,
            fontSize: 14,
            fontWeight: 700,
            color: ARCHAI.colors.cyan,
          }}
        >
          SYSTEM
        </div>

        <div
          style={{
            paddingLeft: 16,
            color: ARCHAI.colors.silver,
            fontSize: 12,
          }}
        >
          Intelligence Layer
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 60,
          top: 80,
          width: 150,
          height: 90,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.025)",
        }}
      >
        <div
          style={{
            padding: 16,
            fontFamily: ARCHAI.fonts.latin,
            fontSize: 14,
            fontWeight: 700,
            color: ARCHAI.colors.white,
          }}
        >
          OUTCOME
        </div>

        <div
          style={{
            paddingLeft: 16,
            color: ARCHAI.colors.muted,
            fontSize: 12,
          }}
        >
          Business Growth
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 235,
          top: 124,
          width: 65,
          height: 1,
          background: ARCHAI.colors.cyan,
          boxShadow: "0 0 12px rgba(25,211,243,0.3)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 450,
          top: 124,
          width: 80,
          height: 1,
          background: ARCHAI.colors.cyan,
          boxShadow: "0 0 12px rgba(25,211,243,0.3)",
        }}
      />

      <Node x={225} y={119} size={11} active />
      <Node x={515} y={119} size={11} active />

      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: 24,
          color: ARCHAI.colors.muted,
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
        }}
      >
        ARCHAI / SYSTEM_FLOW / 001
      </div>
    </div>
  );
};

export const DesignSystemPreview: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: ARCHAI.colors.bg,
        color: ARCHAI.colors.white,
        fontFamily: ARCHAI.fonts.latin,
        overflow: "hidden",
      }}
    >
      <GraphiteBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 1080,
              minHeight: 1350,
              margin: "0 auto",
              padding: "64px 72px 90px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 58,
              }}
            >
              <div>
                <SectionLabel>Archai Solutions</SectionLabel>

                <Heading size={58}>Design System</Heading>

                <ArabicText size={25} color={ARCHAI.colors.silver} align="left">
                  نظام بصري ذكي مبني للأنظمة والحلول الرقمية
                </ArabicText>

                <SmallRule />
              </div>

              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: ARCHAI.colors.muted,
                  textAlign: "right",
                  lineHeight: 1.7,
                }}
              >
                ARCHAI / DS-001
                <br />
                MOTION GRAPHICS
                <br />
                1080 × 1920
              </div>
            </div>

            {/* Typography */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 28,
                marginBottom: 38,
              }}
            >
              <TechnicalCard>
                <SectionLabel>Typography / Latin</SectionLabel>

                <div
                  style={{
                    fontSize: 52,
                    lineHeight: 1.05,
                    fontWeight: 800,
                    letterSpacing: "-0.035em",
                    color: ARCHAI.colors.white,
                  }}
                >
                  Intelligent
                  <br />
                  Technology
                </div>

                <div
                  style={{
                    marginTop: 18,
                    fontSize: 24,
                    lineHeight: 1.45,
                    color: ARCHAI.colors.text,
                  }}
                >
                  Built for real business.
                </div>
              </TechnicalCard>

              <TechnicalCard>
                <SectionLabel>Typography / Arabic</SectionLabel>

                <ArabicText
                  size={42}
                  weight={700}
                  color={ARCHAI.colors.white}
                  align="right"
                >
                  التكنولوجيا الذكية
                  <br />
                  لنتائج أعمال حقيقية
                </ArabicText>

                <ArabicText
                  size={23}
                  color={ARCHAI.colors.silver}
                  align="right"
                >
                  حلول رقمية مصممة حول احتياجات عملك.
                </ArabicText>
              </TechnicalCard>
            </div>

            {/* Color + Icons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 28,
                marginBottom: 38,
              }}
            >
              <TechnicalCard>
                <SectionLabel>Color System</SectionLabel>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 18,
                  }}
                >
                  <ColorSwatch name="Graphite" value={ARCHAI.colors.bg} />

                  <ColorSwatch name="Surface" value={ARCHAI.colors.surface} />

                  <ColorSwatch name="Card" value={ARCHAI.colors.card} />

                  <ColorSwatch name="Elevated" value={ARCHAI.colors.elevated} />

                  <ColorSwatch
                    name="Electric Cyan"
                    value={ARCHAI.colors.cyan}
                  />

                  <ColorSwatch
                    name="Metal Silver"
                    value={ARCHAI.colors.silver}
                  />
                </div>
              </TechnicalCard>

              <TechnicalCard>
                <SectionLabel>Icon Language</SectionLabel>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 18px 22px",
                  }}
                >
                  <SystemIcon size={52} />
                  <DataIcon size={52} />
                  <ConnectionIcon size={52} active />
                  <CircuitIcon size={52} />
                </div>

                <div
                  style={{
                    height: 1,
                    background: ARCHAI.colors.border,
                    marginBottom: 20,
                  }}
                />

                <div
                  style={{
                    color: ARCHAI.colors.silver,
                    fontSize: 16,
                    lineHeight: 1.55,
                  }}
                >
                  Minimal / geometric / technical
                  <br />
                  Cyan = active state only
                </div>
              </TechnicalCard>
            </div>

            {/* Blueprint */}
            <div style={{ marginBottom: 38 }}>
              <SectionLabel>Engineering Visual Language</SectionLabel>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <BlueprintSystem />
              </div>
            </div>

            {/* Components */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 28,
                marginBottom: 38,
              }}
            >
              <TechnicalCard>
                <SectionLabel>Interface Primitives</SectionLabel>

                <AccentBadge>INTELLIGENT SYSTEM</AccentBadge>

                <div style={{ marginTop: 24 }}>
                  <div
                    style={{
                      fontSize: 29,
                      fontWeight: 700,
                      color: ARCHAI.colors.white,
                    }}
                  >
                    Business Outcome
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 17,
                      color: ARCHAI.colors.silver,
                      lineHeight: 1.5,
                    }}
                  >
                    Clear hierarchy.
                    <br />
                    Controlled emphasis.
                    <br />
                    No visual noise.
                  </div>

                  <AccentLine width={64} />
                </div>
              </TechnicalCard>

              <TechnicalCard>
                <SectionLabel>System Signal</SectionLabel>

                <AnimatedSignal />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: ARCHAI.colors.muted,
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}
                >
                  <span>INPUT</span>
                  <span>PROCESS</span>
                  <span>DATA</span>
                  <span>OUTCOME</span>
                </div>
              </TechnicalCard>
            </div>

            {/* Phone */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 430px",
                gap: 50,
                alignItems: "center",
              }}
            >
              <div>
                <SectionLabel>Product / Mobile</SectionLabel>

                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 800,
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Technology
                  <br />
                  becomes useful
                  <br />
                  when it creates
                  <br />
                  <span
                    style={{
                      color: ARCHAI.colors.cyan,
                    }}
                  >
                    outcomes.
                  </span>
                </div>

                <ArabicText size={24} color={ARCHAI.colors.silver} align="left">
                  مش بنبيع تكنولوجيا.
                  <br />
                  بنبني حلول تحقق نتيجة.
                </ArabicText>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PhoneFrame width={270}>
                  <div
                    style={{
                      padding: "58px 22px 22px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: ARCHAI.colors.muted,
                        fontFamily: "monospace",
                      }}
                    >
                      ARCHAI / APP
                    </div>

                    <div
                      style={{
                        marginTop: 30,
                        fontSize: 27,
                        fontWeight: 800,
                        lineHeight: 1.15,
                      }}
                    >
                      Your
                      <br />
                      Business
                      <br />
                      <span
                        style={{
                          color: ARCHAI.colors.cyan,
                        }}
                      >
                        Connected.
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 28,
                        padding: 14,
                        border: `1px solid ${ARCHAI.colors.border}`,
                        background: "rgba(255,255,255,0.025)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: ARCHAI.colors.muted,
                        }}
                      >
                        ACTIVE SYSTEM
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          height: 5,
                          background: ARCHAI.colors.cyan,
                          width: "72%",
                          boxShadow: "0 0 12px rgba(25,211,243,0.35)",
                        }}
                      />
                    </div>
                  </div>
                </PhoneFrame>
              </div>
            </div>
          </div>
        </div>
      </GraphiteBackground>
    </AbsoluteFill>
  );
};
