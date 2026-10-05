import React from "react";
import { AbsoluteFill } from "remotion";

import { Node } from "./Node";
import { SignalPath } from "./SignalPath";

import { useViewport, percentPosition } from "../layout";

export type GraphNode = {
  id: string;

  // Percentage based coordinates.
  // 0-100 inside the safe content area.
  x: number;
  y: number;

  label?: string;
  active?: boolean;

  scale?: "micro" | "small" | "medium" | "large" | "hero";
};

export type GraphConnection = {
  from: string;
  to: string;
  active?: boolean;
};

type SystemGraphProps = {
  nodes: GraphNode[];
  connections: GraphConnection[];
  showLabels?: boolean;
};

export const SystemGraph: React.FC<SystemGraphProps> = ({
  nodes,
  connections,
  showLabels = true,
}) => {
  const viewport = useViewport();

  const resolved = nodes.map((node) => ({
    ...node,
    position: percentPosition(viewport, node.x, node.y),
  }));

  const resolvedMap = new Map(resolved.map((node) => [node.id, node]));

  return (
    <AbsoluteFill>
      {connections.map((connection, index) => {
        const from = resolvedMap.get(connection.from);
        const to = resolvedMap.get(connection.to);

        if (!from || !to) {
          return null;
        }

        return (
          <SignalPath
            key={`${connection.from}-${connection.to}`}
            x1={from.position.x}
            y1={from.position.y}
            x2={to.position.x}
            y2={to.position.y}
            delay={index * 6}
            active={connection.active}
            curved
          />
        );
      })}

      {resolved.map((node, index) => (
        <Node
          key={node.id}
          x={node.position.x}
          y={node.position.y}
          size={14}
          scale={node.scale ?? "medium"}
          active={node.active}
          delay={index * 6}
          label={showLabels ? node.label : undefined}
        />
      ))}
    </AbsoluteFill>
  );
};
