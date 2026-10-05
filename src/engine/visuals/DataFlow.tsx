import React from "react";

import { DataPacket } from "./DataPacket";
import { SignalPath } from "./SignalPath";

type Point = {
  x: number;
  y: number;
};

type DataFlowProps = {
  points: Point[];
  delay?: number;
  loop?: boolean;
};

export const DataFlow: React.FC<DataFlowProps> = ({ points, delay = 0 }) => {
  if (points.length < 2) {
    return null;
  }

  return (
    <>
      {points.slice(0, -1).map((from, index) => {
        const to = points[index + 1];

        return (
          <React.Fragment key={index}>
            <SignalPath
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              active
              delay={delay + index * 10}
            />

            <DataPacket
              from={from}
              to={to}
              delay={delay + index * 10 + 8}
              duration={24}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
