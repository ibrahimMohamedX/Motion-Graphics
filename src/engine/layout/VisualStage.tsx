import React, { createContext, useContext } from "react";

type VisualStageContextValue = {
  width: number;
  height: number;
};

const VisualStageContext = createContext<VisualStageContextValue | null>(null);

type VisualStageProps = {
  children: React.ReactNode;
};

export const VisualStage: React.FC<VisualStageProps> = ({ children }) => {
  return (
    <VisualStageContext.Provider
      value={{
        width: 100,
        height: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </VisualStageContext.Provider>
  );
};

export const useVisualStage = (): VisualStageContextValue => {
  const context = useContext(VisualStageContext);

  if (!context) {
    throw new Error("useVisualStage must be used inside VisualStage");
  }

  return context;
};
