export const ARCHAI = {
  colors: {
    bg: "#0B1015",
    surface: "#10171E",
    card: "#17212A",
    elevated: "#202C35",

    cyan: "#19D3F3",
    cyanDark: "#0B9FC0",

    white: "#F5F8FA",
    text: "#DCE5EA",
    silver: "#8C9AA5",
    muted: "#56636D",

    copper: "#B88752",

    border: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.14)",
    cyanBorder: "rgba(25,211,243,0.35)",
  },

  fonts: {
    latin: "Manrope",
    arabic: "IBM Plex Sans Arabic",
  },

  typography: {
    display: {
      fontSize: 86,
      lineHeight: 1.04,
      fontWeight: 800,
    },

    h1: {
      fontSize: 68,
      lineHeight: 1.08,
      fontWeight: 800,
    },

    h2: {
      fontSize: 52,
      lineHeight: 1.12,
      fontWeight: 700,
    },

    h3: {
      fontSize: 38,
      lineHeight: 1.18,
      fontWeight: 700,
    },

    bodyLarge: {
      fontSize: 30,
      lineHeight: 1.45,
      fontWeight: 500,
    },

    body: {
      fontSize: 24,
      lineHeight: 1.5,
      fontWeight: 400,
    },

    bodySmall: {
      fontSize: 19,
      lineHeight: 1.45,
      fontWeight: 500,
    },

    caption: {
      fontSize: 17,
      lineHeight: 1.35,
      fontWeight: 600,
    },

    number: {
      fontSize: 96,
      lineHeight: 0.95,
      fontWeight: 800,
    },
  },

  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
    section: 96,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },

  motion: {
    fast: 6,
    normal: 10,
    medium: 15,
    slow: 21,

    spring: {
      gentle: {
        damping: 22,
        stiffness: 120,
        mass: 0.8,
      },

      standard: {
        damping: 20,
        stiffness: 150,
        mass: 0.7,
      },

      emphasis: {
        damping: 18,
        stiffness: 180,
        mass: 0.65,
      },
    },
  },
} as const;
