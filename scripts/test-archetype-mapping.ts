import { createScenePlan, type TranscriptSegment } from "../src/engine/planning/ScenePlanner.js";

// Test cases: narration text -> expected archetype
const testCases: Array<{
  narration: string;
  expectedArchetype: string | string[];
  intent: string;
}> = [
  // hook → hero-question
  {
    narration: "لماذا تخسر عملاءك كل يوم؟",
    expectedArchetype: "hero-question",
    intent: "hook",
  },
  {
    narration: "Why are you losing customers every day?",
    expectedArchetype: "hero-question",
    intent: "hook",
  },
  {
    narration: "تخيل لو كان لديك نظام واحد يجمع كل شيء",
    expectedArchetype: "hero-question",
    intent: "hook",
  },

  // problem → fragmented-customer-journey
  {
    narration: "العميل يمر برحلة مجزأة عبر نقاط تواصل متعددة",
    expectedArchetype: "fragmented-customer-journey",
    intent: "problem",
  },
  {
    narration: "مشكلة كبيرة: البيانات مبعثرة في كل مكان",
    expectedArchetype: "fragmented-customer-journey",
    intent: "problem",
  },
  {
    narration: "صعوبة في تتبع رحلة العميل بسبب التشتت",
    expectedArchetype: "fragmented-customer-journey",
    intent: "problem",
  },

  // solution → unified-customer-journey
  {
    narration: "الحل هو تطبيق موحد يجمع كل رحلة العميل",
    expectedArchetype: "unified-customer-journey",
    intent: "solution",
  },
  {
    narration: "نظام واحد يحل مشكلة التشتت ويوحد التجربة",
    expectedArchetype: "unified-customer-journey",
    intent: "solution",
  },
  {
    narration: "منصة متكاملة تجمع المنتج والطلب والدفع والمتابعة",
    expectedArchetype: "unified-customer-journey",
    intent: "solution",
  },

  // benefit → business-insights-dashboard or customer-retention-loop
  {
    narration: "تزيد مبيعاتك وتنمو أرباحك مع تحليلات ذكية",
    expectedArchetype: ["business-insights-dashboard", "customer-retention-loop"],
    intent: "benefit",
  },
  {
    narration: "العملاء يرجعوا تاني وتتحسن معدلات الاحتفاظ",
    expectedArchetype: ["customer-retention-loop", "business-insights-dashboard"],
    intent: "benefit",
  },
  {
    narration: "لوحة معلومات تظهر لك كل أرقام البيزنس في لحظة",
    expectedArchetype: ["business-insights-dashboard", "customer-retention-loop"],
    intent: "benefit",
  },

  // competition → competition-pressure
  {
    narration: "المنافسة بتزيد كل يوم والمنافسين بياخدوا عملائك",
    expectedArchetype: "competition-pressure",
    intent: "comparison",
  },
  {
    narration: "ضغط تنافسي قوي في السوق يهدد حصتك",
    expectedArchetype: "competition-pressure",
    intent: "comparison",
  },

  // risk/loss → missed-opportunities
  {
    narration: "بتخسر 12 فرصة كل يوم بسبب عدم وجود نظام",
    expectedArchetype: "missed-opportunities",
    intent: "problem",
  },
  {
    narration: "كم فرصة ضائعة تخسرها شركتك سنوياً؟",
    expectedArchetype: "missed-opportunities",
    intent: "problem",
  },

  // transformation → digital-transformation
  {
    narration: "تحويل تجربتك من تقليدية إلى رقمية بالكامل",
    expectedArchetype: "digital-transformation",
    intent: "explanation",
  },
  {
    narration: "التحول الرقمي يغير طريقة عملك تماماً",
    expectedArchetype: "digital-transformation",
    intent: "explanation",
  },
  {
    narration: "قبل وبعد: من ورق وأقلام إلى نظام ذكي متكامل",
    expectedArchetype: "digital-transformation",
    intent: "comparison",
  },

  // CTA → brand-cta
  {
    narration: "تواصل معانا وابدأ رحلتك الرقمية اليوم",
    expectedArchetype: "brand-cta",
    intent: "cta",
  },
  {
    narration: "احجز استشارة مجانية وخلي البزنس أقرب لعملائك",
    expectedArchetype: "brand-cta",
    intent: "cta",
  },
];

function runTests() {
  console.log("========================================");
  console.log("  Archetype Mapping Test Suite");
  console.log("========================================");
  console.log("");

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];

    const segments: TranscriptSegment[] = [{
      start: i * 5,
      end: (i + 1) * 5,
      text: tc.narration,
    }];

    const plan = createScenePlan(segments, 30, null);
    const scene = plan.scenes[0];

    const actualArchetype = scene.visual.archetype ?? "";
    const actualIntent = scene.intent;

    const expectedArchetypes = Array.isArray(tc.expectedArchetype)
      ? tc.expectedArchetype
      : [tc.expectedArchetype];

    const archetypeMatch = expectedArchetypes.includes(actualArchetype);
    const intentMatch = actualIntent === tc.intent;

    const narrationPreview = tc.narration?.slice(0, 50) ?? "";

    if (archetypeMatch && intentMatch) {
      console.log(`✅ PASS: "${narrationPreview}..."`);
      console.log(`   Intent: ${actualIntent} | Archetype: ${actualArchetype}`);
      passed++;
    } else {
      console.log(`❌ FAIL: "${narrationPreview}..."`);
      console.log(`   Expected intent: ${tc.intent} | Got: ${actualIntent}`);
      console.log(`   Expected archetype: ${expectedArchetypes.join(" or ")} | Got: ${actualArchetype}`);
      failed++;
    }
    console.log("");
  }

  console.log("========================================");
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();