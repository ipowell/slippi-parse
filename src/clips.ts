import { FramesType, SlippiGame } from "@slippi/slippi-js";
import { readdirSync, Dirent } from "fs";
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

// Function that will accept a `SlippiGame` as input and return a list of frames
// from which to generate clips around.
// TODO: return start/end frame tuples rather than just individual frames to pad on either side
export type GameParser = (game: SlippiGame) => Highlight[];

export function getSlippiFilesFromDirectory(directory: string): string[] {
  const contents = readdirSync(directory, { withFileTypes: true });
  let slippiFiles = contents
    .filter((ent: Dirent) => ent.isFile() && ent.name.endsWith(".slp"))
    .map((ent) => directory + "/" + ent.name);
  contents
    .filter((ent: Dirent) => ent.isDirectory())
    .forEach((dir: Dirent) => {
      slippiFiles = slippiFiles.concat(
        getSlippiFilesFromDirectory(directory + "/" + dir.name)
      );
    });
  return slippiFiles;
}

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
