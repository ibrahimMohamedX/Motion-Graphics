import React from "react";

import {
  SystemGraph,
  type GraphNode,
  type GraphConnection,
} from "./visuals/SystemGraph";

import { DataFlow } from "./visuals/DataFlow";
import { Transformation } from "./visuals/Transformation";

type VisualEngineProps = {
  graph?: {
    nodes: GraphNode[];
    connections: GraphConnection[];
  };

  flow?: {
    points: {
      x: number;
      y: number;
    }[];
    delay?: number;
  };

  transformation?: {
    delay?: number;
    duration?: number;
  };

  children?: React.ReactNode;
};

export const VisualEngine: React.FC<VisualEngineProps> = ({
  graph,
  flow,
  transformation,
  children,
}) => {
  const content = (
    <>
      {graph && (
        <SystemGraph nodes={graph.nodes} connections={graph.connections} />
      )}

      {flow && <DataFlow points={flow.points} delay={flow.delay} />}

      {children}
    </>
  );

  if (transformation) {
    return (
      <Transformation
        delay={transformation.delay}
        duration={transformation.duration}
      >
        {content}
      </Transformation>
    );
  }

  return <>{content}</>;
};
