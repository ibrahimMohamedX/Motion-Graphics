import React from "react";
import { AbsoluteFill } from "remotion";

import { GraphiteBackground } from "../design/Backgrounds";
import { ARCHAI } from "../design/tokens";
import { VisualEngine } from "./VisualEngine";
import { Dashboard } from "./visuals/Dashboard";
import { Comparison } from "./visuals/Comparison";
import { Orbit } from "./visuals/Orbit";

export const EnginePreview: React.FC = () => {
  return (
    <AbsoluteFill>
      <GraphiteBackground>
        {/* Header */}
        <div
          style={{
            position: "absolute",
            left: "7%",
            right: "7%",
            top: "4%",
            height: "10%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: ARCHAI.fonts.latin,
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: ARCHAI.colors.white,
            }}
          >
            VISUAL ENGINE
          </div>

          <div
            style={{
              marginTop: 8,
              fontFamily: ARCHAI.fonts.arabic,
              fontSize: "clamp(14px, 1.8vw, 21px)",
              color: ARCHAI.colors.silver,
            }}
          >
            Reusable Visual Primitives
          </div>
        </div>

        {/* Main composition */}
        <div
          style={{
            position: "absolute",
            left: "7%",
            right: "7%",
            top: "16%",
            bottom: "5%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "3%",
          }}
        >
          {/* System */}
          <div
            style={{
              position: "relative",
              minWidth: 0,
              minHeight: 0,
              borderRadius: 16,
              border: `1px solid ${ARCHAI.colors.border}`,
              background: "rgba(16,23,30,0.55)",
              overflow: "hidden",
            }}
          >
            <VisualEngine
              graph={{
                nodes: [
                  {
                    id: "input",
                    x: 8,
                    y: 50,
                    label: "INPUT",
                    scale: "medium",
                  },
                  {
                    id: "core",
                    x: 50,
                    y: 30,
                    label: "CORE",
                    active: true,
                    scale: "large",
                  },
                  {
                    id: "data",
                    x: 50,
                    y: 70,
                    label: "DATA",
                    scale: "medium",
                  },
                  {
                    id: "outcome",
                    x: 92,
                    y: 50,
                    label: "OUTCOME",
                    active: true,
                    scale: "medium",
                  },
                ],
                connections: [
                  {
                    from: "input",
                    to: "core",
                    active: true,
                  },
                  {
                    from: "data",
                    to: "core",
                    active: true,
                  },
                  {
                    from: "core",
                    to: "outcome",
                    active: true,
                  },
                ],
              }}
            />
          </div>

          {/* Orbit */}
          <div
            style={{
              position: "relative",
              minWidth: 0,
              minHeight: 0,
              borderRadius: 16,
              border: `1px solid ${ARCHAI.colors.border}`,
              background: "rgba(16,23,30,0.55)",
              overflow: "hidden",
            }}
          >
            <Orbit
              centerLabel="SYSTEM"
              items={[
                {
                  label: "DATA",
                  angle: -90,
                  active: true,
                },
                {
                  label: "PROCESS",
                  angle: 0,
                },
                {
                  label: "SIGNAL",
                  angle: 90,
                  active: true,
                },
                {
                  label: "OUTPUT",
                  angle: 180,
                },
              ]}
            />
          </div>

          {/* Comparison */}
          <div
            style={{
              position: "relative",
              minWidth: 0,
              minHeight: 0,
              borderRadius: 16,
              border: `1px solid ${ARCHAI.colors.border}`,
              background: "rgba(16,23,30,0.55)",
              overflow: "hidden",
            }}
          >
            <Comparison
              leftTitle="BEFORE"
              rightTitle="AFTER"
              leftValue="42"
              rightValue="94"
              x={50}
              y={50}
              delay={8}
            />
          </div>

          {/* Dashboard */}
          <div
            style={{
              position: "relative",
              minWidth: 0,
              minHeight: 0,
              borderRadius: 16,
              border: `1px solid ${ARCHAI.colors.border}`,
              background: "rgba(16,23,30,0.55)",
              overflow: "hidden",
            }}
          >
            <Dashboard title="INTELLIGENCE" delay={14} />
          </div>
        </div>
      </GraphiteBackground>
    </AbsoluteFill>
  );
};
