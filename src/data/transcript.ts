export type CaptionData = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
};

export type TranscriptData = {
  engine: string;
  model: string;
  language: string;
  text: string;
  captions: CaptionData[];
};
