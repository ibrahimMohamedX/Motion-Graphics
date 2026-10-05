import type { SceneArchetype } from "../scenes/SceneArchetype";

export type SemanticSceneIntent =
  | "hook"
  | "behavior-statistic"
  | "value"
  | "problem"
  | "solution"
  | "analytics"
  | "retention"
  | "competition"
  | "risk"
  | "transformation"
  | "cta";

export type VisualConcept =
  | "problem"
  | "data"
  | "system"
  | "connection"
  | "interface"
  | "growth"
  | "comparison"
  | "transformation"
  | "outcome";

export type SemanticAnalysis = {
  intent: SemanticSceneIntent;
  visualConcept: VisualConcept;
  preferredArchetypes: SceneArchetype[];
};

function containsAny(
  text: string,
  words: string[],
): boolean {
  return words.some((word) => {
    const normalizedWord = word
      .toLowerCase()
      .trim();

    if (!normalizedWord) {
      return false;
    }

    if (normalizedWord.includes(" ")) {
      return text.includes(normalizedWord);
    }

    const escaped = normalizedWord.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    return new RegExp(
      `(^|\\s|[،؟!.,:؛])${escaped}(?=$|\\s|[،؟!.,:؛])`,
      "u",
    ).test(text);
  });
}

export function analyzeNarration(
  narration: string,
): SemanticAnalysis {
  const text = narration
    .toLowerCase()
    .trim();

  // --------------------------------------------------
  // 1. COMPETITION
  // --------------------------------------------------

  if (
    containsAny(text, [
      "منافسة",
      "المنافسة",
      "منافسين",
      "السوق",
    ])
  ) {
    return {
      intent: "competition",
      visualConcept: "comparison",
      preferredArchetypes: [
        "competition-pressure",
      ],
    };
  }

  // --------------------------------------------------
  // 2. RISK / MISSED OPPORTUNITIES
  // --------------------------------------------------

  if (
    containsAny(text, [
      "اخسر",
      "خسارة",
      "ممكن اخسر",
      "فرص",
      "العملاء ممكن",
      "عملاء ممكن",
      "العملاء اللي",
      "العملاء",
    ]) &&
    containsAny(text, [
      "اخسر",
      "خسارة",
      "ممكن",
      "فرص",
    ])
  ) {
    return {
      intent: "risk",
      visualConcept: "outcome",
      preferredArchetypes: [
        "missed-opportunities",
      ],
    };
  }

  // --------------------------------------------------
  // 3. TRANSFORMATION
  // --------------------------------------------------

  if (
    containsAny(text, [
      "تحويل",
      "تحويله",
      "تحويل البزنس",
      "تجربة رقمية",
      "رقمية",
      "التحول الرقمي",
    ])
  ) {
    return {
      intent: "transformation",
      visualConcept: "transformation",
      preferredArchetypes: [
        "digital-transformation",
      ],
    };
  }

  // --------------------------------------------------
  // 4. CUSTOM APP SOLUTION
  // --------------------------------------------------

  if (
    containsAny(text, [
      "نبني",
      "معمولة مخصوص",
      "معمول مخصوص",
      "مصممة مخصوص",
      "خدمة",
      "حل",
      "مخصوص",
    ])
  ) {
    return {
      intent: "solution",
      visualConcept: "interface",
      preferredArchetypes: [
        "custom-app-solution",
      ],
    };
  }

  // --------------------------------------------------
  // 5. UNIFIED CUSTOMER JOURNEY
  // --------------------------------------------------

  if (
    containsAny(text, [
      "تطبيق واحد",
      "يشوف منتجات",
      "يطلب",
      "يدفع",
      "يتابع",
      "إشعارات",
    ])
  ) {
    return {
      intent: "solution",
      visualConcept: "system",
      preferredArchetypes: [
        "unified-customer-journey",
      ],
    };
  }

  // --------------------------------------------------
  // 6. ANALYTICS / BUSINESS INSIGHTS
  // --------------------------------------------------

  if (
    containsAny(text, [
      "تفهم عملائك",
      "تفهم عملائك أكثر",
      "طلبات",
      "بيانات",
      "تتابع",
      "تحليل",
      "عملائك أكثر",
    ])
  ) {
    return {
      intent: "analytics",
      visualConcept: "data",
      preferredArchetypes: [
        "business-insights-dashboard",
      ],
    };
  }

  // --------------------------------------------------
  // 7. CUSTOMER RETENTION
  // --------------------------------------------------

  if (
    containsAny(text, [
      "يرجع",
      "يرجعلك",
      "يرجع لك",
      "مرة تانية",
      "علاقة مستمرة",
      "ولاء",
      "العميل يرجع",
      "يرجع العميل",
    ])
  ) {
    return {
      intent: "retention",
      visualConcept: "growth",
      preferredArchetypes: [
        "customer-retention-loop",
      ],
    };
  }

  // --------------------------------------------------
  // 8. VALUE / APPEARANCE -> UTILITY
  // --------------------------------------------------

  if (
    containsAny(text, [
      "مش مجرد شكل",
      "مش مجرد",
      "مش شكل",
      "فائدة",
      "قيمة",
      "مش بس",
    ])
  ) {
    return {
      intent: "value",
      visualConcept: "transformation",
      preferredArchetypes: [
        "appearance-to-utility",
      ],
    };
  }

  // --------------------------------------------------
  // 9. FRAGMENTED CUSTOMER JOURNEY
  // --------------------------------------------------

  if (
    containsAny(text, [
      "يدور",
      "جوجل",
      "موقع",
      "رسالة",
      "بدل ما",
      "يدور عليك",
      "يبعتلك رسالة",
    ])
  ) {
    return {
      intent: "problem",
      visualConcept: "problem",
      preferredArchetypes: [
        "fragmented-customer-journey",
      ],
    };
  }

  // --------------------------------------------------
  // 10. BEHAVIOR / USAGE STATISTIC
  // --------------------------------------------------

  if (
    containsAny(text, [
      "كم مرة",
      "كتير جداً",
      "كتير",
      "كل يوم",
      "مرات",
      "يفتح موبايله",
    ])
  ) {
    return {
      intent: "behavior-statistic",
      visualConcept: "data",
      preferredArchetypes: [
        "usage-counter",
      ],
    };
  }

  // --------------------------------------------------
  // 11. GENERIC HOOK
  // --------------------------------------------------

  if (
    containsAny(text, [
      "تفتكر",
      "هل",
      "ليه",
      "السؤال",
    ])
  ) {
    return {
      intent: "hook",
      visualConcept: "problem",
      preferredArchetypes: [
        "hero-question",
      ],
    };
  }

  // --------------------------------------------------
  // 12. CTA
  //
  // CTA must be explicit.
  // Do NOT classify generic words such as:
  // "إحنا", "عايز", "خلي", "خلينا"
  // as CTA triggers.
  // --------------------------------------------------

  if (
    containsAny(text, [
      "تواصل معانا",
      "تواصل معنا",
      "كلمنا",
      "كلمينا",
      "ابدأ معانا",
      "ابدأ معنا",
      "احجز",
      "اطلب الآن",
      "ابدأ دلوقتي",
      "ابدأ دلوقتي",
      "خلي البزنس أقرب",
      "خلي بزنسك أقرب",
      "بدغطة واحدة",
    ])
  ) {
    return {
      intent: "cta",
      visualConcept: "outcome",
      preferredArchetypes: [
        "brand-cta",
      ],
    };
  }

  // --------------------------------------------------
  // FALLBACK
  // --------------------------------------------------

  return {
    intent: "value",
    visualConcept: "system",
    preferredArchetypes: [
      "appearance-to-utility",
    ],
  };
}

