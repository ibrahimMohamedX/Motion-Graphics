import React from "react";
import { AbsoluteFill } from "remotion";

import { GraphiteBackground } from "../../design/Backgrounds";
import { ARCHAI } from "../../design/tokens";
import { planScene } from "./ScenePlanner";

const testScenes = [
  {
    id: "problem",
    narration: "البيانات متوزعة والمعلومات مش واضحة وده بيعمل مشاكل كتير.",
    purpose: "إظهار المشكلة",
  },
  {
    id: "solution",
    narration: "نظام واحد يجمع كل العمليات ويوصل البيانات ببعض.",
    purpose: "إظهار الحل",
  },
  {
    id: "data",
    narration: "من خلال تحليل البيانات تقدر تاخد قرارات أذكى.",
    purpose: "إظهار الذكاء",
  },
];

export const PlannerPreview: React.FC = () => {
  return (
    <AbsoluteFill>
      <GraphiteBackground>
        <div
          style={{
            padding: "7%",
            fontFamily: ARCHAI.fonts.latin,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              marginBottom: 40,
            }}
          >
            SCENE PLANNER
          </div>

          {testScenes.map((scene, index) => {
            const plan = planScene(scene);

            return (
              <div
                key={scene.id}
                style={{
                  marginBottom: 28,
                  padding: 24,
                  borderRadius: 12,
                  border: `1px solid ${ARCHAI.colors.border}`,
                  background: ARCHAI.colors.surface,
                }}
              >
                <div
                  style={{
                    color: ARCHAI.colors.cyan,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  SCENE {index + 1}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 25,
                    fontWeight: 700,
                  }}
                >
                  {plan.concept.toUpperCase()}
                </div>

                <div
                  style={{
                    marginTop: 12,
                    color: ARCHAI.colors.silver,
                    fontSize: 17,
                  }}
                >
                  Primitives: {plan.primitives.join(" → ")}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    color: ARCHAI.colors.silver,
                    fontSize: 17,
                  }}
                >
                  Motion: {plan.motion.join(" → ")}
                </div>
              </div>
            );
          })}
        </div>
      </GraphiteBackground>
    </AbsoluteFill>
  );
};
