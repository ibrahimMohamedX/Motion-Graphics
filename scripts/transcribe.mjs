import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const audioPath = process.argv[2];
const outputPath = process.argv[3];

if (!audioPath || !outputPath) {
  console.error(
    "Usage: node scripts/transcribe.mjs <audio-file> <output-json>"
  );
  process.exit(1);
}

if (!fs.existsSync(audioPath)) {
  console.error(`Audio file not found: ${audioPath}`);
  process.exit(1);
}

const root = process.cwd();

const whisperExe = path.join(
  root,
  "whisper.cpp",
  "main.exe"
);

const modelPath = path.join(
  root,
  "whisper.cpp",
  "models",
  "ggml-medium.bin"
);

const tempDir = path.join(root, ".tmp-whisper");
const tempWav = path.join(tempDir, "audio-16khz.wav");
const whisperJson = path.join(tempDir, "whisper-output.json");

fs.mkdirSync(tempDir, { recursive: true });

if (!fs.existsSync(whisperExe)) {
  console.error(`Whisper executable not found:\n${whisperExe}`);
  process.exit(1);
}

if (!fs.existsSync(modelPath)) {
  console.error(`Whisper model not found:\n${modelPath}`);
  console.error("");
  console.error("Download the model first.");
  process.exit(1);
}

console.log("");
console.log("======================================");
console.log(" Local Whisper Transcription");
console.log("======================================");
console.log("");

console.log("Whisper:");
console.log(whisperExe);

console.log("");
console.log("Model:");
console.log(modelPath);

console.log("");
console.log("Converting audio to 16kHz mono WAV...");

execFileSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    audioPath,
    "-ar",
    "16000",
    "-ac",
    "1",
    "-c:a",
    "pcm_s16le",
    tempWav,
  ],
  {
    stdio: "inherit",
  }
);

console.log("");
console.log("Running Whisper locally...");
console.log("");

execFileSync(
  whisperExe,
  [
    "-m",
    modelPath,
    "-f",
    tempWav,

    "-l",
    "ar",

    "-oj",
    "-of",
    path.join(tempDir, "whisper-output"),

    "-pp",
    "-np",

    "-t",
    "6",

    "-bs",
    "5",

    "-et",
       "2.4",
  ],
  {
    stdio: "inherit",
    windowsHide: false,
  }
);

if (!fs.existsSync(whisperJson)) {
  console.error("");
  console.error("Whisper finished but JSON output was not found:");
  console.error(whisperJson);
  process.exit(1);
}

const whisperResult = JSON.parse(
  fs.readFileSync(whisperJson, "utf8")
);

const transcription = whisperResult.transcription ?? [];

const text = transcription
  .map((segment) => segment.text ?? "")
  .join(" ")
  .replace(/\s+/g, " ")
  .trim();

const captions = transcription.flatMap((segment) => {
  const startMs = Math.round(
    Number(segment.offsets?.from ?? 0)
  );

  const endMs = Math.round(
    Number(segment.offsets?.to ?? startMs)
  );

  const segmentText = (segment.text ?? "").trim();

  if (!segmentText) {
    return [];
  }

  return [
    {
      text: segmentText,
      startMs,
      endMs,
      timestampMs: startMs,
    },
  ];
});

const result = {
  engine: "whisper.cpp",
  model: "medium",
  language: "ar",
  text,
  captions,
  transcription,
};

const outputDir = path.dirname(outputPath);

fs.mkdirSync(outputDir, {
  recursive: true,
});

fs.writeFileSync(
  outputPath,
  JSON.stringify(result, null, 2),
  "utf8"
);

console.log("");
console.log("======================================");
console.log(" Transcription completed");
console.log("======================================");
console.log("");
console.log(`Text length: ${text.length}`);
console.log(`Segments: ${transcription.length}`);
console.log(`Captions: ${captions.length}`);
console.log("");
console.log("Output:");
console.log(outputPath);
console.log("");

try {
  fs.rmSync(tempDir, {
    recursive: true,
    force: true,
  });
} catch {}