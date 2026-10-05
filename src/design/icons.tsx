import React from "react";

import { ARCHAI } from "./tokens";

type IconProps = {
  size?: number;
  active?: boolean;
  color?: string;
  strokeWidth?: number;
};

const base = (size: number, color: string, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const SystemIcon: React.FC<IconProps> = ({
  size = 48,
  active = false,
  color,
  strokeWidth = 1.6,
}) => {
  const stroke = color ?? (active ? ARCHAI.colors.cyan : ARCHAI.colors.silver);

  return (
    <svg {...base(size, stroke, strokeWidth)}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="9" y="14" width="6" height="6" rx="1" />

      <path d="M10 7h4" />
      <path d="M17 10v2" />
      <path d="M12 14v-4" />
    </svg>
  );
};

export const DataIcon: React.FC<IconProps> = ({
  size = 48,
  active = false,
  color,
  strokeWidth = 1.6,
}) => {
  const stroke = color ?? (active ? ARCHAI.colors.cyan : ARCHAI.colors.silver);

  return (
    <svg {...base(size, stroke, strokeWidth)}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
    </svg>
  );
};

export const ConnectionIcon: React.FC<IconProps> = ({
  size = 48,
  active = false,
  color,
  strokeWidth = 1.6,
}) => {
  const stroke = color ?? (active ? ARCHAI.colors.cyan : ARCHAI.colors.silver);

  return (
    <svg {...base(size, stroke, strokeWidth)}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />

      <path d="M8.2 11l7.4-4" />
      <path d="M8.2 13l7.4 4" />
    </svg>
  );
};

export const CircuitIcon: React.FC<IconProps> = ({
  size = 48,
  active = false,
  color,
  strokeWidth = 1.6,
}) => {
  const stroke = color ?? (active ? ARCHAI.colors.cyan : ARCHAI.colors.silver);

  return (
    <svg {...base(size, stroke, strokeWidth)}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />

      <path d="M9 3v4" />
      <path d="M12 3v4" />
      <path d="M15 3v4" />

      <path d="M9 17v4" />
      <path d="M12 17v4" />
      <path d="M15 17v4" />

      <path d="M3 9h4" />
      <path d="M3 12h4" />
      <path d="M3 15h4" />

      <path d="M17 9h4" />
      <path d="M17 12h4" />
      <path d="M17 15h4" />
    </svg>
  );
};
