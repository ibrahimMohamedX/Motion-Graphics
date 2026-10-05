import React from "react";

import {
  SCENE_ARCHETYPE_DEFINITIONS,
  SCENE_ARCHETYPE_DEFINITION_MAP,
} from "./SceneArchetypeRegistry";

import {
  HeroPhoneQuestion,
  PhoneUsageCounter,
  AppearanceToUtility,
  FragmentedCustomerJourney,
} from "../../visuals";

import {
  UnifiedAppJourney,
  BusinessInsightsDashboard,
  CustomerRetentionLoop,
  CompetitionPressure,
  MissedOpportunities,
  DigitalTransformation,
  CustomAppSolution,
  FinalBrandCTA,
} from "../../visuals/BusinessScenes";

export type SceneArchetype =
  | "hero-question"
  | "usage-counter"
  | "appearance-to-utility"
  | "fragmented-customer-journey"
  | "unified-customer-journey"
  | "business-insights-dashboard"
  | "customer-retention-loop"
  | "competition-pressure"
  | "missed-opportunities"
  | "digital-transformation"
  | "custom-app-solution"
  | "brand-cta";

export type SceneArchetypeProps = Record<string, unknown>;

export type ArchetypeScene = {
  type: SceneArchetype;
  props?: SceneArchetypeProps;
};

type SceneComponent = React.ComponentType<{
  props?: SceneArchetypeProps;
}>;

const wrap =
  (Component: React.ComponentType<SceneArchetypeProps>): SceneComponent =>
  ({ props }) =>
    <Component {...props} />;

export const SCENE_ARCHETYPE_REGISTRY: Record<
  SceneArchetype,
  SceneComponent
> = {
  "hero-question": wrap(HeroPhoneQuestion),
  "usage-counter": wrap(PhoneUsageCounter),
  "appearance-to-utility": wrap(AppearanceToUtility),
  "fragmented-customer-journey": wrap(FragmentedCustomerJourney),
  "unified-customer-journey": wrap(UnifiedAppJourney),
  "business-insights-dashboard": wrap(BusinessInsightsDashboard),
  "customer-retention-loop": wrap(CustomerRetentionLoop),
  "competition-pressure": wrap(CompetitionPressure),
  "missed-opportunities": wrap(MissedOpportunities),
  "digital-transformation": wrap(DigitalTransformation),
  "custom-app-solution": wrap(CustomAppSolution),
  "brand-cta": wrap(FinalBrandCTA),
};

export {
  SCENE_ARCHETYPE_DEFINITIONS,
  SCENE_ARCHETYPE_DEFINITION_MAP,
};

export const isSceneArchetype = (
  value: unknown,
): value is SceneArchetype =>
  typeof value === "string" &&
  value in SCENE_ARCHETYPE_REGISTRY;
