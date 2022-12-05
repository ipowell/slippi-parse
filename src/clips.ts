import { FramesType, SlippiGame } from "@slippi/slippi-js";
import { Clip, getQueueData } from "./dolphin";
import { Heap } from "heap-js";

export type EventTest = (
  allFrames: FramesType,
  currentFrameIndex: number
) => boolean;

export type Highlight = {
  startFrame: number;
  endFrame: number;
  value?: number;
};

export type GameParser = (game: SlippiGame) => Highlight[];

export class ClipFinder {
  parser: GameParser;
  filename: string;
  clips: Heap<Clip>;
  maxClips?: number;
  leadingFrames: number;
  trailingFrames: number;

  customPriorityComparator = (a: Clip, b: Clip) => {
    const first = a.value ?? 0;
    const second = b.value ?? 0;
    return second - first;
  };

  constructor(
    parser: GameParser,
    filename: string,
    leadingFrames: number = 240,
    trailingFrames: number = 159
  ) {
    this.parser = parser;
    this.filename = filename;
    this.clips = new Heap(this.customPriorityComparator);
    if (this.maxClips !== undefined) {
      this.clips.limit = this.maxClips;
    }
    this.leadingFrames = leadingFrames;
    this.trailingFrames = trailingFrames;
  }

  parseGame(game: SlippiGame) {
    const frames = this.parser(game);
    if (frames.length > 0) {
      console.log("Found " + frames.length + " clips for " + this.filename);
    }
    this.clips.push(
      ...getQueueData(
        game.getFilePath()!,
        game,
        frames,
        this.leadingFrames,
        this.trailingFrames
      )
    );
  }

  getClips() {
    return this.clips;
  }
}

export function evaluateCandidates(
  allFrames: FramesType,
  candidates: number[],
  test: EventTest
) {
  return candidates.filter((value) => test(allFrames, value));
}
