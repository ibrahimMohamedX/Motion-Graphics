import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { FadeSlide, BlueprintBackground } from "./Shared";

import { DataIcon, ConnectionIcon, SystemIcon } from "../design/icons";

import { ARCHAI } from "../design/tokens";

const Step: React.FC<{
  title: string;
  index: number;
  icon: React.ReactNode;
}> = ({ title, index, icon }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [index * 12, index * 12 + 18],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const x = interpolate(
    frame,
    [index * 12, index * 12 + 18],
    [index % 2 === 0 ? -35 : 35, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        width: 250,
        padding: "26px 20px",
        border: `1px solid ${ARCHAI.colors.border}`,
        background: ARCHAI.colors.card,
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div>{icon}</div>

      <div
        dir="rtl"
        style={{
          fontFamily: ARCHAI.fonts.arabic,
          fontSize: 24,
          fontWeight: 600,
          color: ARCHAI.colors.white,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export type FragmentedCustomerJourneyProps = {
  title?: string;
  highlight?: string;
  steps?: string[];
};

export const FragmentedCustomerJourney: React.FC<
  FragmentedCustomerJourneyProps
> = ({
  title = "رحلة العميل",
  highlight = "معقدة زيادة عن اللزوم",
  steps = ["اكتشاف", "موقع", "رسالة", "قرار"],
}) => (
  <AbsoluteFill>
    <BlueprintBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 165,
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
                fontSize: 64,
                fontWeight: 700,
                color: ARCHAI.colors.white,
              }}
            >
              {title}
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 34,
                color: ARCHAI.colors.cyan,
              }}
            >
              {highlight}
            </div>
          </div>
        </FadeSlide>

        <div
          style={{
            position: "absolute",
            top: 570,
            left: 80,
            right: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <Step
              title={steps[0] ?? "اكتشاف"}
              index={0}
              icon={<DataIcon size={38} />}
            />

            <div
              style={{
                width: 70,
                height: 1,
                background: ARCHAI.colors.cyan,
              }}
            />

            <Step
              title={steps[1] ?? "موقع"}
              index={1}
              icon={<SystemIcon size={38} />}
            />
          </div>

          <div
            style={{
              height: 50,
              width: 1,
              background: ARCHAI.colors.cyan,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <Step
              title={steps[2] ?? "رسالة"}
              index={2}
              icon={<ConnectionIcon size={38} />}
            />

            <div
              style={{
                width: 70,
                height: 1,
                background: ARCHAI.colors.cyan,
              }}
            />

            <Step
              title={steps[3] ?? "قرار"}
              index={3}
              icon={<SystemIcon size={38} active />}
            />
          </div>
        </div>
      </div>
    </BlueprintBackground>
  </AbsoluteFill>
);
