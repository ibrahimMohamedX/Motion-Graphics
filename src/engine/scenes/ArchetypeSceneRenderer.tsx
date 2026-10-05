import React from "react";

import {
  isSceneArchetype,
  SCENE_ARCHETYPE_REGISTRY,
} from "./SceneArchetype";

type Props = {
  archetype?: unknown;
  sceneProps?: Record<string, unknown>;
};

const FallbackScene: React.FC<{
  archetype?: unknown;
}> = ({ archetype }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0B1015",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          border: "1px solid rgba(25,211,243,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            color: "#19D3F3",
            fontFamily: "Manrope, sans-serif",
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          ARCHAI
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 32,
            color: "#56636D",
            fontFamily: "Manrope, sans-serif",
            fontSize: 16,
          }}
        >
          Visual fallback: {String(archetype ?? "unknown")}
        </div>
      </div>
    </div>
  );
};

export const ArchetypeSceneRenderer: React.FC<Props> = ({
  archetype,
  sceneProps,
}) => {
  if (!isSceneArchetype(archetype)) {
    return (
      <FallbackScene
        archetype={archetype}
      />
    );
  }

  const Component =
    SCENE_ARCHETYPE_REGISTRY[archetype];

  if (!Component) {
    return (
      <FallbackScene
        archetype={archetype}
      />
    );
  }

  return (
    <Component props={sceneProps} />
  );
};
