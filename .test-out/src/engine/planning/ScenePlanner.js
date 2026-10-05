"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScenePlan = exports.visualForSegment = void 0;
const SceneArchetype_1 = require("../scenes/SceneArchetype");
// Intent to archetype mapping using bestFor metadata from registry
const INTENT_TO_ARCHETYPE = {
    hook: ["hero-question", "usage-counter"],
    problem: [
        "fragmented-customer-journey",
        "appearance-to-utility",
        "missed-opportunities",
    ],
    explanation: ["appearance-to-utility", "digital-transformation"],
    solution: [
        "unified-customer-journey",
        "custom-app-solution",
        "digital-transformation",
    ],
    benefit: [
        "business-insights-dashboard",
        "customer-retention-loop",
        "appearance-to-utility",
    ],
    comparison: ["competition-pressure", "digital-transformation"],
    cta: ["brand-cta", "custom-app-solution"],
};
// Arabic/English keyword patterns for intent inference
const INTENT_PATTERNS = {
    hook: [
        /ليه|لماذا|ازاي|إزاي|هل|تخيل|عمرك|why|how|imagine|سؤال|question/i,
        /مشكلة|مشكله|تبدأ|start|beginning|افتتاحية|opening/i,
    ],
    problem: [
        /مشكلة|مشاكل|مشكله|صعوبة|صعب|خسارة|بتخسر|يضيع|ضياع|problem|loss|difficult|pain|issue|issues|error|errors|فشل|failing|فشل|عطل|broken|مكسور/i,
        /منافسة|منافس|competition|competitor|pressure|ضغط|تهديد|threat/i,
        /مفقود|مضيع|missed|مفقودة|lost|فرصة|opportunity|تخسر|lose/i,
    ],
    solution: [
        /حل|حلول|نظام|أنظمة|تطبيق|تطبيقات|منصة|منصه|تقنية|ذكاء|system|solution|platform|technology|app|application|software|منتج|product|أداة|tool|service|خدمة/i,
        /بناء|بنيت|build|بنية|architecture|معمارية|تصميم|design|تطوير|develop/i,
    ],
    benefit: [
        /ميزة|فوائد|زيادة|نمو|مبيعات|عملاء|ربح|efficiency|growth|sales|customers|revenue|profit|تحسين|improvement|أداء|performance|كفاءة|efficiency|نتيجة|result|نتائج|results|عائد|return|ROI|توفير|saving|توفير|save/i,
        /ولاء|loyalty|احتفاظ|retention|تكرار|repeat|عودة|return|engagement|تفاعل/i,
        /بيانات|تحليل|analytics|insight|insights|intelligence|metric|metrics|dashboard|ذكاء|بيزنس|business|أرقام|numbers|إحصائيات|statistics/i,
    ],
    comparison: [
        /قبل|بعد|بدل|مقابل|before|after|versus|vs|مقارنة|compare|comparison|فرق|difference|أفضل|better|احسن|احسن|تحسين/i,
    ],
    cta: [
        /تواصل|كلمني|ابدأ|اطلب|راسل|احجز|contact|start|message|begin|get|started|الان|now|اليوم|today|اتصل|call|موقع|website|رابط|link/i,
    ],
    explanation: [
        /كيف|how|يعمل|works|آلية|mechanism|عملية|process|خطوات|steps|مراحل|stages|شرح|explain|تفصيل|detail|طريقة|method|طريقة|approach/i,
    ],
};
// Fallback: explanation patterns (broad)
const EXPLANATION_PATTERNS = [
    /كيف|how|يعمل|works|آلية|mechanism|عملية|process|خطوات|steps|مراحل|stages|شرح|explain|تفصيل|detail|طريقة|method|طريقة|approach/i,
];
/**
 * Infer intent from narration text using keyword patterns
 */
const inferIntent = (text) => {
    const value = text.toLowerCase();
    // Check each intent's patterns in priority order
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
        for (const pattern of patterns) {
            if (pattern.test(value)) {
                return intent;
            }
        }
    }
    // Check explanation patterns
    for (const pattern of EXPLANATION_PATTERNS) {
        if (pattern.test(value)) {
            return "explanation";
        }
    }
    return "explanation";
};
/**
 * Select the best archetype for a given intent and narration.
 * Uses the bestFor metadata from SceneArchetypeRegistry.
 */
const selectArchetype = (intent, narration) => {
    const candidates = INTENT_TO_ARCHETYPE[intent] ?? [];
    if (candidates.length === 0)
        return null;
    const narrationLower = narration.toLowerCase();
    // Score each candidate based on bestFor keyword matches
    let bestArchetype = null;
    let bestScore = -1;
    for (const archetype of candidates) {
        const definition = SceneArchetype_1.SCENE_ARCHETYPE_DEFINITION_MAP[archetype];
        if (!definition)
            continue;
        let score = 0;
        for (const keyword of definition.bestFor) {
            if (narrationLower.includes(keyword.toLowerCase())) {
                score += 2;
            }
            // Also check intent name matches bestFor
            if (keyword.toLowerCase() === intent) {
                score += 3;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestArchetype = archetype;
        }
    }
    // Default to first candidate if no keyword matches
    return bestArchetype ?? candidates[0];
};
/**
 * Generate archetype-specific props from narration text.
 * Extracts relevant content dynamically rather than hardcoding.
 */
const generateArchetypeProps = (archetype, narration) => {
    const text = narration.trim();
    const sentences = text.split(/[.!?।؟]+/).filter((s) => s.trim().length > 0);
    const firstSentence = sentences[0]?.trim() ?? text;
    const words = text.split(/\s+/).filter((w) => w.length > 2);
    // Extract potential highlight words (capitalized, longer words, numbers)
    const highlights = words.filter((w) => /^[A-Zأ-ي]/.test(w) ||
        /\d/.test(w) ||
        w.length > 8);
    const highlight = highlights.slice(0, 3).join(" ") || firstSentence.slice(0, 40);
    const question = text.includes("?") ? text : `${firstSentence}?`;
    const subtitle = sentences.slice(1, 3).join(" ") || "";
    // Extract steps from narration (look for enumerated items or comma-separated)
    const stepCandidates = text
        .split(/[,،؛;]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 3 && s.length < 50)
        .slice(0, 5);
    // Extract metrics/numbers
    const metrics = text.match(/\d+[.,]?\d*\s*[%٪xX×]?/g) ?? [];
    const metricLabels = [
        "customers",
        "orders",
        "revenue",
        "growth",
        "sales",
        "performance",
        "efficiency",
        "retention",
        "conversion",
        "engagement",
        "عملاء",
        "مبيعات",
        "نمو",
        "أرباح",
        "كفاءة",
    ];
    const foundMetrics = metricLabels.filter((label) => text.toLowerCase().includes(label.toLowerCase()));
    switch (archetype) {
        case "hero-question":
            return {
                question,
                highlight: highlight.slice(0, 40),
                subtitle: subtitle.slice(0, 100),
                badge: foundMetrics[0]?.toUpperCase() || "ARCHAI",
            };
        case "usage-counter":
            return {
                question: firstSentence.slice(0, 80),
                target: metrics[0] || "1000",
                label: foundMetrics[0] || "INTERACTIONS",
            };
        case "appearance-to-utility":
            return {
                title: firstSentence.slice(0, 60),
                highlight: highlight.slice(0, 40),
                subtitle: subtitle.slice(0, 100),
            };
        case "fragmented-customer-journey":
            return {
                title: "رحلة العميل المجزأة",
                highlight: "نقاط احتكاك متعددة",
                steps: stepCandidates.length > 0
                    ? stepCandidates
                    : ["اكتشاف", "بحث", "مقارنة", "قرار", "شراء"],
            };
        case "unified-customer-journey":
            return {
                title: "رحلة عميل موحدة",
                highlight: "في تطبيق واحد",
                steps: stepCandidates.length > 0
                    ? stepCandidates
                    : ["منتج", "طلب", "دفع", "متابعة", "إشعار"],
            };
        case "business-insights-dashboard":
            return {
                title: firstSentence.slice(0, 60),
                metrics: [
                    { label: "CUSTOMERS", value: metrics[0] || "1,284", icon: "DataIcon" },
                    { label: "ORDERS", value: metrics[1] || "348", icon: "SystemIcon" },
                    {
                        label: "REVENUE",
                        value: metrics[2] || "8,750 EGP",
                        icon: "CircuitIcon",
                    },
                ],
            };
        case "customer-retention-loop":
            return {
                title: firstSentence.slice(0, 60),
                highlight: "العميل يرجع تاني",
                steps: stepCandidates.length > 0
                    ? stepCandidates
                    : ["عميل", "شراء", "تفاعل", "ولاء"],
            };
        case "competition-pressure":
            return {
                title: firstSentence.slice(0, 60),
                highlight: "المنافسة بتزيد",
                competitors: [
                    "COMPETITOR 1",
                    "COMPETITOR 2",
                    "COMPETITOR 3",
                    "YOU",
                ],
            };
        case "missed-opportunities":
            return {
                question: firstSentence.slice(0, 80),
                target: metrics[0] || "12",
                label: "فرص ممكن تضيع كل يوم",
            };
        case "digital-transformation":
            return {
                title: firstSentence.slice(0, 60),
                highlight: "تجربة رقمية",
                leftLabel: "تقليدية",
                rightLabel: "رقمية",
            };
        case "custom-app-solution":
            return {
                title: firstSentence.slice(0, 60),
                highlight: "مصممة مخصوص لبزنسك",
                appName: "Your Business",
            };
        case "brand-cta":
            return {
                title: "Archai Solutions",
                cta: "خلي البزنس أقرب لعملائك",
                brand: "AS",
            };
        default:
            return {};
    }
};
/**
 * Create a primitive visual plan as fallback when no archetype matches.
 */
const createPrimitiveVisualPlan = (intent) => {
    const layouts = {
        hook: { zone: "hero", scale: "hero", anchor: "center", alignment: "center", spacing: "normal" },
        problem: { zone: "focus", scale: "large", anchor: "center", alignment: "center", spacing: "wide" },
        solution: { zone: "focus", scale: "large", anchor: "center", alignment: "center", spacing: "normal" },
        benefit: { zone: "data", scale: "large", anchor: "center", alignment: "center", spacing: "normal" },
        comparison: { zone: "focus", scale: "large", anchor: "center", alignment: "center", spacing: "wide" },
        cta: { zone: "cta", scale: "large", anchor: "center", alignment: "center", spacing: "normal" },
        explanation: { zone: "focus", scale: "medium", anchor: "center", alignment: "center", spacing: "normal" },
    };
    const concepts = {
        hook: "problem",
        problem: "problem",
        solution: "solution",
        benefit: "growth",
        comparison: "comparison",
        cta: "outcome",
        explanation: "system",
    };
    const primitivesMap = {
        hook: ["node", "path", "data-packet"],
        problem: ["comparison", "node", "path"],
        solution: ["interface", "node", "data-packet"],
        benefit: ["dashboard", "metric", "data-packet"],
        comparison: ["comparison", "path"],
        cta: ["interface", "metric", "node"],
        explanation: ["node", "path", "data-packet"],
    };
    const motionsMap = {
        hook: ["reveal", "connect", "flow"],
        problem: ["compare", "emphasize", "resolve"],
        solution: ["reveal", "connect", "flow"],
        benefit: ["build", "emphasize", "flow"],
        comparison: ["compare", "resolve"],
        cta: ["reveal", "emphasize", "resolve"],
        explanation: ["build", "connect", "flow"],
    };
    return {
        concept: concepts[intent] ?? "system",
        primitives: primitivesMap[intent] ?? ["node", "path", "data-packet"],
        motion: motionsMap[intent] ?? ["build", "connect", "flow"],
        layout: layouts[intent] ?? { zone: "focus", scale: "medium", anchor: "center", alignment: "center", spacing: "normal" },
        density: "balanced",
    };
};
/**
 * Create the visual plan for a scene - tries archetype first, falls back to primitives.
 */
const visualForSegment = (segment) => {
    const intent = inferIntent(segment.text);
    const archetype = selectArchetype(intent, segment.text);
    if (archetype) {
        const props = generateArchetypeProps(archetype, segment.text);
        return {
            archetype,
            props,
            concept: "system",
            primitives: [],
            motion: [],
            layout: { zone: "hero", scale: "hero", anchor: "center", alignment: "center", spacing: "normal" },
            density: "minimal",
        };
    }
    return createPrimitiveVisualPlan(intent);
};
exports.visualForSegment = visualForSegment;
const createScenePlan = (segments, fps = 30, audio = null) => {
    const scenes = segments.map((segment, index) => {
        const intent = inferIntent(segment.text);
        const visual = (0, exports.visualForSegment)(segment);
        return {
            id: `scene-${String(index + 1).padStart(2, "0")}`,
            start: segment.start,
            end: segment.end,
            narration: segment.text,
            intent,
            visual,
        };
    });
    const durationInSeconds = scenes.length > 0 ? Math.max(...scenes.map((scene) => scene.end)) : 0;
    return {
        fps,
        durationInSeconds,
        audio,
        scenes,
    };
};
exports.createScenePlan = createScenePlan;
