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
  // 1. CTA
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
      "خلي البزنس أقرب",
      "خلي بزنسك أقرب",
      "نقدر نساعدك",
      "إحنا نقدر نساعدك",
    ])
  ) {
    return {
      intent: "cta",
      visualConcept: "outcome",
      preferredArchetypes: ["brand-cta"],
    };
  }

  // --------------------------------------------------
  // 2. HOOK / QUESTION
  // --------------------------------------------------

  if (
    text.includes("?") ||
    text.includes("؟") ||
    containsAny(text, [
      "تفتكر",
      "هل",
      "ليه",
      "السؤال",
      "واضحة بالنسبة",
      "واضحة بنفس الشكل",
      "واضح بالنسبة",
    ])
  ) {
    return {
      intent: "hook",
      visualConcept: "problem",
      preferredArchetypes: [
        "hero-question",
        "fragmented-customer-journey",
      ],
    };
  }

  // --------------------------------------------------
  // 3. RISK / COST / DELAY
  // --------------------------------------------------

  if (
    containsAny(text, [
      "خسارة",
      "اخسر",
      "تكلفة أعلى",
      "تكلفة",
      "وقت أكثر",
      "وقت أكتر",
      "تأخير",
      "تأخير في إطلاق",
      "فرص",
      "تضيع",
      "غلط",
      "مش هو اللي كنت متخيله",
      "مش اللي كنت متخيله",
    ])
  ) {
    return {
      intent: "risk",
      visualConcept: "outcome",
      preferredArchetypes: [
        "missed-opportunities",
        "business-insights-dashboard",
      ],
    };
  }

  // --------------------------------------------------
  // 4. PROBLEM / MISCOMMUNICATION / ITERATION
  // --------------------------------------------------

  if (
    containsAny(text, [
      "هنا تبدأ المشكلة",
      "تبدأ المشكلة",
      "المشكلة",
      "مش فاهم",
      "مش فاهم شغله",
      "مش واضح",
      "مش واضحة",
      "ما تنقلتش",
      "ما تنقلتش بشكل واضح",
      "مش هو اللي",
      "التعديلات",
      "تعديل وراء تعديل",
      "تعديل ورا تعديل",
      "كنت أقصد",
      "خلي دي تظهر",
      "نغير الجزء",
      "المطور يبدأ",
      "الفريق التقني",
      "الشخص اللي هيبرمجها",
    ])
  ) {
    return {
      intent: "problem",
      visualConcept: "problem",
      preferredArchetypes: [
        "fragmented-customer-journey",
        "competition-pressure",
        "missed-opportunities",
      ],
    };
  }

  // --------------------------------------------------
  // 5. TRANSFORMATION / IDEA -> REQUIREMENTS
  // --------------------------------------------------

  if (
    containsAny(text, [
      "تحويل",
      "نحول",
      "نحوّل",
      "تحويل الفكرة",
      "تحول",
      "من مجرد تصور",
      "لخطة واضحة",
      "خطة واضحة",
      "قابلة للتنفيذ",
      "متطلبات واضحة",
      "متطلبات",
      "تجربة مستخدم محددة",
      "فكرة حلوة",
    ])
  ) {
    return {
      intent: "transformation",
      visualConcept: "transformation",
      preferredArchetypes: [
        "digital-transformation",
        "custom-app-solution",
      ],
    };
  }

  // --------------------------------------------------
  // 6. SOLUTION / PLANNING BEFORE CODE
  // --------------------------------------------------

  if (
    containsAny(text, [
      "قبل ما نكتب سطر كود",
      "قبل البرمجة",
      "قبل ما تبدأ البرمجة",
      "هنبني إيه",
      "وليه",
      "وازاي",
      "وزاي",
      "فين بالضبط",
      "نحدد",
      "محتاج حد",
      "محتاج",
      "قابلة للتنفيذ",
      "حل",
      "خدمة",
    ])
  ) {
    return {
      intent: "solution",
      visualConcept: "system",
      preferredArchetypes: [
        "custom-app-solution",
        "unified-customer-journey",
        "digital-transformation",
      ],
    };
  }

  // --------------------------------------------------
  // 7. COMPETITION
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
  // 8. ANALYTICS / BUSINESS INSIGHTS
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
  // 9. CUSTOMER RETENTION
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
  // 10. BEHAVIOR / USAGE
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
  // 11. VALUE
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


