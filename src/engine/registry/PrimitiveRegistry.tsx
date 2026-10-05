import React from "react";

import { Node } from "../visuals/Node";
import { SignalPath } from "../visuals/SignalPath";
import { DataPacket } from "../visuals/DataPacket";
import { Metric } from "../visuals/Metric";
import { Dashboard } from "../visuals/Dashboard";
import { Comparison } from "../visuals/Comparison";
import { Orbit } from "../visuals/Orbit";
import { Interface } from "../visuals/Interface";

import type { LayoutBounds } from "../layout/LayoutEngine";

export type PrimitiveRenderContext = {
  delay: number;
  active?: boolean;
  bounds: LayoutBounds;
};

export type PrimitiveRenderer = (
  context: PrimitiveRenderContext,
) => React.ReactNode;

export const PRIMITIVE_REGISTRY: Record<string, PrimitiveRenderer> = {
  node: ({ delay, active, bounds }) => (
    <Node
      x={50}
      y={50}
      size={14}
      scale="large"
      active={active}
      delay={delay}
      bounds={bounds}
    />
  ),

  path: ({ delay, active, bounds }) => (
    <SignalPath
      x1={20}
      y1={50}
      x2={80}
      y2={50}
      delay={delay}
      active={active}
      curved
      bounds={bounds}
    />
  ),

  "data-packet": ({ delay, bounds }) => (
    <DataPacket
      from={{ x: 20, y: 50 }}
      to={{ x: 80, y: 50 }}
      delay={delay}
      duration={24}
      bounds={bounds}
    />
  ),

  metric: ({ delay, bounds }) => (
    <Metric
      x={50}
      y={50}
      value="94%"
      label="PERFORMANCE"
      delay={delay}
      bounds={bounds}
    />
  ),

  dashboard: ({ delay, bounds }) => (
    <Dashboard title="INTELLIGENCE" delay={delay} bounds={bounds} />
  ),

  comparison: ({ delay, bounds }) => (
    <Comparison
      leftTitle="BEFORE"
      rightTitle="AFTER"
      leftValue="42"
      rightValue="94"
      x={50}
      y={50}
      delay={delay}
      bounds={bounds}
    />
  ),

  orbit: ({ delay, bounds }) => (
    <Orbit
      centerLabel="SYSTEM"
      delay={delay}
      bounds={bounds}
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
  ),

  interface: ({ delay, bounds }) => (
    <Interface
      x={50}
      y={50}
      width={90}
      height={90}
      title="SYSTEM"
      delay={delay}
      bounds={bounds}
    />
  ),
};
