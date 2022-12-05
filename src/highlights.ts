import { FramesType, SlippiGame } from "@slippi/slippi-js";
import { Clip } from "./dolphin";
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

// export function highlightToClip(highlight: Highlight): Clip {
//   return {
//     path: highlight.path,
//     startFrame: highlight.startFrame,
//     endFrame: highlight.endFrame,
//   }
// }

export type GameParser = (game: SlippiGame) => Highlight[];

export class HighlightFinder {
  parser: GameParser;
  filename: string;
  clips: Heap<Clip>;
  maxHighlights?: number;
  leadingFrames: number;
  trailingFrames: number;

  customPriorityComparator = (a: Clip, b: Clip) => {
    return b.value - a.value;
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
    if (this.maxHighlights !== undefined) {
      this.clips.limit = this.maxHighlights;
    }
    this.leadingFrames = leadingFrames;
    this.trailingFrames = trailingFrames;
  }

  parseGame(game: SlippiGame) {
    const highlightEndpoints: Highlight[] = this.parser(game);
    if (highlightEndpoints.length > 0) {
      console.log(
        "Found " +
          highlightEndpoints.length +
          " highlights for " +
          this.filename
      );
    }
    this.clips.addAll(
      highlightEndpoints.map<Clip>((highlight: Highlight) => {
        return {
          startFrame: highlight.startFrame - this.leadingFrames,
          endFrame: highlight.endFrame + this.trailingFrames,
          value: highlight.value ?? 0,
          path: game.getFilePath()!,
          gameStartAt: game.getMetadata()?.startAt!,
        };
      })
    );
  }

  getClips(): Clip[] {
    return this.clips.heapArray;
  }
}

export function evaluateCandidates(
  allFrames: FramesType,
  candidates: number[],
  test: EventTest
) {
  return candidates.filter((value) => test(allFrames, value));
}
