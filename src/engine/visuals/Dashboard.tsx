import React from "react";
import { AbsoluteFill } from "remotion";

import { Interface } from "./Interface";
import { Metric } from "./Metric";
import type { LayoutBounds } from "../layout/LayoutEngine";

type DashboardProps = {
  title?: string;
  delay?: number;
  bounds?: LayoutBounds;
};

export const Dashboard: React.FC<DashboardProps> = ({
  title = "BUSINESS SYSTEM",
  delay = 0,
  bounds,
}) => {
  const scale = bounds ? Math.min(bounds.width, bounds.height) / 50 : 1;

  return (
    <AbsoluteFill
      style={{
        overflow: "visible",
      }}
    >
      <Interface
        x={50}
        y={53}
        width={86}
        height={54}
        title={title}
        delay={delay}
        active
      />

      <Metric
        value="+42%"
        label="Growth"
        x={26}
        y={31}
        delay={delay + 12}
        active
        bounds={{
          x: 0,
          y: 0,
          width: 50 * scale,
          height: 50 * scale,
        }}
      />

      <Metric
        value="2.4K"
        label="Active Data"
        x={50}
        y={31}
        delay={delay + 16}
        active={false}
        bounds={{
          x: 0,
          y: 0,
          width: 50 * scale,
          height: 50 * scale,
        }}
      />

      <Metric
        value="94%"
        label="Efficiency"
        x={74}
        y={31}
        delay={delay + 20}
        active
        bounds={{
          x: 0,
          y: 0,
          width: 50 * scale,
          height: 50 * scale,
        }}
      />
    </AbsoluteFill>
  );
};
