import React from "react";
import { AbsoluteFill } from "remotion";
import type { SceneData } from "../data/loadScenes";

import { HeroPhoneQuestion } from "../visuals/HeroPhoneQuestion";
import { PhoneUsageCounter } from "../visuals/PhoneUsageCounter";
import { AppearanceToUtility } from "../visuals/AppearanceToUtility";
import { FragmentedCustomerJourney } from "../visuals/FragmentedCustomerJourney";

import {
  UnifiedAppJourney,
  BusinessInsightsDashboard,
  CustomerRetentionLoop,
  CompetitionPressure,
  MissedOpportunities,
  DigitalTransformation,
  CustomAppSolution,
  FinalBrandCTA,
} from "../visuals/BusinessScenes";

type SceneRendererProps = {
  scene: SceneData;
};

const COMPONENTS: Record<string, React.FC> = {
  HeroPhoneQuestion,
  PhoneUsageCounter,
  AppearanceToUtility,
  FragmentedCustomerJourney,
  UnifiedAppJourney,
  BusinessInsightsDashboard,
  CustomerRetentionLoop,
  CompetitionPressure,
  MissedOpportunities,
  DigitalTransformation,
  CustomAppSolution,
  FinalBrandCTA,
};

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
}) => {
  const Component = COMPONENTS[scene.visual.component];

  if (!Component) {
    return (
      <AbsoluteFill
        style={{
          background: "#FFFFFF",
          color: "#111111",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
          }}
        >
          Missing: {scene.visual.component}
        </div>
      </AbsoluteFill>
    );
  }

  return <Component />;
};
