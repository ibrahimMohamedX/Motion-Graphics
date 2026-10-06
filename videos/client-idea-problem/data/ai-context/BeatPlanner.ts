export type BeatType =
  | "intro"
  | "statement"
  | "emphasis"
  | "transition"
  | "resolution";

export type SceneBeat = {
  id: string;
  start: number;
  end: number;
  type: BeatType;
  text?: string;
  motion:
    | "reveal"
    | "emphasize"
    | "connect"
    | "flow"
    | "transform"
    | "resolve";
};

type BeatInput = {
  start: number;
  end: number;
  text?: string;
};

export function planSceneBeats(input: BeatInput): SceneBeat[] {
  const duration = Math.max(0.1, input.end - input.start);

  const first = Math.min(1.2, duration * 0.22);
  const second = Math.min(1.8, duration * 0.30);

  const beats: SceneBeat[] = [];

  beats.push({
    id: "intro",
    start: input.start,
    end: Math.min(input.end, input.start + first),
    type: "intro",
    text: input.text,
    motion: "reveal",
  });

  if (duration > 2.5) {
    const emphasisStart = input.start + first;
    const emphasisEnd = Math.min(
      input.end,
      emphasisStart + second,
    );

    beats.push({
      id: "emphasis",
      start: emphasisStart,
      end: emphasisEnd,
      type: "emphasis",
      text: input.text,
      motion: "emphasize",
    });
  }

  if (duration > 4) {
    const resolutionStart =
      Math.max(input.start + first + second, input.end - 1.5);

    beats.push({
      id: "resolution",
      start: resolutionStart,
      end: input.end,
      type: "resolution",
      text: input.text,
      motion: "resolve",
    });
  }

  return beats;
}
