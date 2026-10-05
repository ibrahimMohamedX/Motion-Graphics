import fs from "node:fs";
import path from "node:path";

// Load the new ScenePlanner by compiling TypeScript on the fly
// We'll use the logic directly since we can't easily import TS

const ROOT = "/sessions/hopeful-amazing-goodall/mnt/AI-Motion-Graphics";

// Read the transcript
const transcriptPath = path.join(ROOT, "videos/agent-real-test/data/transcript.json");
const transcript = JSON.parse(fs.readFileSync(transcriptPath, "utf8"));

// Convert captions to TranscriptSegments
const segments = transcript.captions.map(c => ({
  start: c.startMs / 1000,
  end: c.endMs / 1000,
  text: c.text.trim()
}));

console.log("Loaded transcript segments:", segments.length);
segments.forEach((s, i) => {
  console.log(`  ${i+1}. [${s.start}s-${s.end}s] ${s.text.slice(0,60)}...`);
});

// Import the planner logic - we'll replicate the key functions here
// since we can't easily import TypeScript

const SCENE_ARCHETYPE_DEFINITIONS = [
  { type: "hero-question", bestFor: ["hook", "question", "attention", "problem framing"] },
  { type: "usage-counter", bestFor: ["statistics", "usage", "frequency", "behavior"] },
  { type: "appearance-to-utility", bestFor: ["value explanation", "utility", "business value", "not just looks"] },
  { type: "fragmented-customer-journey", bestFor: ["problem", "fragmentation", "complex journey", "customer friction"] },
  { type: "unified-customer-journey", bestFor: ["solution", "mobile app", "customer journey", "unified experience"] },
  { type: "business-insights-dashboard", bestFor: ["analytics", "metrics", "orders", "revenue", "customer insights"] },
  { type: "customer-retention-loop", bestFor: ["retention", "repeat customers", "loyalty", "engagement"] },
  { type: "competition-pressure", bestFor: ["competition", "market", "competitive advantage"] },
  { type: "missed-opportunities", bestFor: ["loss", "missed customers", "missed opportunities", "risk"] },
  { type: "digital-transformation", bestFor: ["transformation", "before after", "digitalization", "modernization"] },
  { type: "custom-app-solution", bestFor: ["solution", "custom app", "product presentation"] },
  { type: "brand-cta", bestFor: ["cta", "closing", "contact", "conversion"] },
];

const SCENE_ARCHETYPE_DEFINITION_MAP = Object.fromEntries(
  SCENE_ARCHETYPE_DEFINITIONS.map(d => [d.type, d])
);

const INTENT_TO_ARCHETYPE = {
  hook: ["hero-question", "usage-counter"],
  problem: ["fragmented-customer-journey", "appearance-to-utility", "missed-opportunities"],
  explanation: ["appearance-to-utility", "digital-transformation"],
  solution: ["unified-customer-journey", "custom-app-solution", "digital-transformation"],
  benefit: ["business-insights-dashboard", "customer-retention-loop", "appearance-to-utility"],
  comparison: ["competition-pressure", "digital-transformation"],
  cta: ["brand-cta", "custom-app-solution"],
};

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

function inferIntent(text) {
  const value = text.toLowerCase();
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(value)) return intent;
    }
  }
  return "explanation";
}

function selectArchetype(intent, narration) {
  const candidates = INTENT_TO_ARCHETYPE[intent] ?? [];
  if (candidates.length === 0) return null;
  const narrationLower = narration.toLowerCase();
  let bestArchetype = null;
  let bestScore = -1;
  for (const archetype of candidates) {
    const definition = SCENE_ARCHETYPE_DEFINITION_MAP[archetype];
    if (!definition) continue;
    let score = 0;
    for (const keyword of definition.bestFor) {
      if (narrationLower.includes(keyword.toLowerCase())) score += 2;
      if (keyword.toLowerCase() === intent) score += 3;
    }
    if (score > bestScore) {
      bestScore = score;
      bestArchetype = archetype;
    }
  }
  return bestArchetype ?? candidates[0];
}

function generateArchetypeProps(archetype, narration) {
  const text = narration.trim();
  const sentences = text.split(/[.!?।؟]+/).filter(s => s.trim().length > 0);
  const firstSentence = sentences[0]?.trim() ?? text;
  const words = text.split(/\s+/).filter(w => w.length > 2);
  const highlights = words.filter(w => /^[A-Zأ-ي]/.test(w) || /\d/.test(w) || w.length > 8);
  const highlight = highlights.slice(0, 3).join(" ") || firstSentence.slice(0, 40);
  const question = text.includes("?") ? text : `${firstSentence}?`;
  const subtitle = sentences.slice(1, 3).join(" ") || "";
  const stepCandidates = text.split(/[,،؛;]+/).map(s => s.trim()).filter(s => s.length > 3 && s.length < 50).slice(0, 5);
  const metrics = text.match(/\d+[.,]?\d*\s*[%٪xX×]?/g) ?? [];
  const metricLabels = ["customers","orders","revenue","growth","sales","performance","efficiency","retention","conversion","engagement","عملاء","مبيعات","نمو","أرباح","كفاءة"];
  const foundMetrics = metricLabels.filter(label => text.toLowerCase().includes(label.toLowerCase()));

  switch (archetype) {
    case "hero-question":
      return { question: firstSentence.slice(0,80), highlight: highlight.slice(0,40), subtitle: subtitle.slice(0,100), badge: foundMetrics[0]?.toUpperCase() || "ARCHAI" };
    case "usage-counter":
      return { question: firstSentence.slice(0,80), target: metrics[0] || "1000", label: foundMetrics[0] || "INTERACTIONS" };
    case "appearance-to-utility":
      return { title: firstSentence.slice(0,60), highlight: highlight.slice(0,40), subtitle: subtitle.slice(0,100) };
    case "fragmented-customer-journey":
      return { title: "رحلة العميل المجزأة", highlight: "نقاط احتكاك متعددة", steps: stepCandidates.length > 0 ? stepCandidates : ["اكتشاف","بحث","مقارنة","قرار","شراء"] };
    case "unified-customer-journey":
      return { title: "رحلة عميل موحدة", highlight: "في تطبيق واحد", steps: stepCandidates.length > 0 ? stepCandidates : ["منتج","طلب","دفع","متابعة","إشعار"] };
    case "business-insights-dashboard":
      return { title: firstSentence.slice(0,60), metrics: [
        { label: "CUSTOMERS", value: metrics[0] || "1,284", icon: "DataIcon" },
        { label: "ORDERS", value: metrics[1] || "348", icon: "SystemIcon" },
        { label: "REVENUE", value: metrics[2] || "8,750 EGP", icon: "CircuitIcon" }
      ]};
    case "customer-retention-loop":
      return { title: firstSentence.slice(0,60), highlight: "العميل يرجع تاني", steps: stepCandidates.length > 0 ? stepCandidates : ["عميل","شراء","تفاعل","ولاء"] };
    case "competition-pressure":
      return { title: firstSentence.slice(0,60), highlight: "المنافسة بتزيد", competitors: ["COMPETITOR 1","COMPETITOR 2","COMPETITOR 3","YOU"] };
    case "missed-opportunities":
      return { question: firstSentence.slice(0,80), target: metrics[0] || "12", label: "فرص ممكن تضيع كل يوم" };
    case "digital-transformation":
      return { title: firstSentence.slice(0,60), highlight: "تجربة رقمية", leftLabel: "تقليدية", rightLabel: "رقمية" };
    case "custom-app-solution":
      return { title: firstSentence.slice(0,60), highlight: "مصممة مخصوص لبزنسك", appName: "Your Business" };
    case "brand-cta":
      return { title: "Archai Solutions", cta: "خلي البزنس أقرب لعملائك", brand: "AS" };
    default:
      return {};
  }
}

function createPrimitiveVisualPlan(intent) {
  const layouts = {
    hook: { zone: "hero", scale: "hero", anchor: "center", alignment: "center", spacing: "normal" },
    problem: { zone: "focus", scale: "large", anchor: "center", alignment: "center", spacing: "wide" },
    solution: { zone: "focus", scale: "large", anchor: "center", alignment: "center", spacing: "normal" },
    benefit: { zone: "data", scale: "large", anchor: "center", alignment: "center", spacing: "normal" },
    comparison: { zone: "focus", scale: "large", anchor: "center", alignment: "center", spacing: "wide" },
    cta: { zone: "cta", scale: "large", anchor: "center", alignment: "center", spacing: "normal" },
    explanation: { zone: "focus", scale: "medium", anchor: "center", alignment: "center", spacing: "normal" },
  };
  const concepts = { hook: "problem", problem: "problem", solution: "solution", benefit: "growth", comparison: "comparison", cta: "outcome", explanation: "system" };
  const primitivesMap = { hook: ["node","path","data-packet"], problem: ["comparison","node","path"], solution: ["interface","node","data-packet"], benefit: ["dashboard","metric","data-packet"], comparison: ["comparison","path"], cta: ["interface","metric","node"], explanation: ["node","path","data-packet"] };
  const motionsMap = { hook: ["reveal","connect","flow"], problem: ["compare","emphasize","resolve"], solution: ["reveal","connect","flow"], benefit: ["build","emphasize","flow"], comparison: ["compare","resolve"], cta: ["reveal","emphasize","resolve"], explanation: ["build","connect","flow"] };
  return { concept: concepts[intent] ?? "system", primitives: primitivesMap[intent] ?? ["node","path","data-packet"], motion: motionsMap[intent] ?? ["build","connect","flow"], layout: layouts[intent] ?? { zone: "focus", scale: "medium", anchor: "center", alignment: "center", spacing: "normal" }, density: "balanced" };
}

function visualForSegment(segment) {
  const intent = inferIntent(segment.text);
  const archetype = selectArchetype(intent, segment.text);
  if (archetype) {
    const props = generateArchetypeProps(archetype, segment.text);
    return { archetype, props };
  }
  return createPrimitiveVisualPlan(intent);
}

// Generate scene plan
const fps = 30;
const audio = "voice-over.wav";
const scenes = segments.map((segment, index) => {
  const intent = inferIntent(segment.text);
  const visual = visualForSegment(segment);
  return {
    id: `scene-${String(index + 1).padStart(2, "0")}`,
    start: segment.start,
    end: segment.end,
    narration: segment.text,
    intent,
    visual,
  };
});

const durationInSeconds = Math.max(...scenes.map(s => s.end));
const scenePlan = { fps, durationInSeconds, audio, scenes };

// Write output
const outputPath = path.join(ROOT, "videos/agent-real-test/data/scene-plan.json");
fs.writeFileSync(outputPath, JSON.stringify(scenePlan, null, 2), "utf8");

console.log("\nGenerated scene plan:");
console.log(`  FPS: ${fps}`);
console.log(`  Duration: ${durationInSeconds}s`);
console.log(`  Scenes: ${scenes.length}`);
console.log(`  Audio: ${audio}`);
console.log(`\nScene details:`);
scenes.forEach(s => {
  const arch = s.visual.archetype ? s.visual.archetype : "primitive-fallback";
  console.log(`  ${s.id}: [${s.start}s-${s.end}s] intent="${s.intent}" archetype="${arch}"`);
  console.log(`    narration: "${s.narration.slice(0,80)}..."`);
});

console.log(`\nWritten to: ${outputPath}`);