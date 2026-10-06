export const SCENE_LAYOUT = {
  width: 1080,
  height: 1920,

  safe: {
    top: 120,
    right: 72,
    bottom: 150,
    left: 72,
  },

  title: {
    top: 140,
    height: 300,
    maxWidth: 900,
  },

  visual: {
    top: 500,
    bottom: 1550,
    maxWidth: 936,
  },

  footer: {
    bottom: 120,
  },

  sizes: {
    journeyIcon: 100,
    journeyItemWidth: 170,

    dashboardMaxWidth: 936,

    retentionCircle: 560,
    retentionNode: 112,
    retentionCenter: 230,

    competitionBarWidth: 150,
    competitionHeight: 560,

    transformationBox: 360,

    phoneWidth: 520,

    missedCardWidth: 800,
  },
} as const;

export const SCENE_CENTER = {
  left: "50%",
  transform: "translateX(-50%)",
} as const;
