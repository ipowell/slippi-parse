import { SlippiGame } from "@slippi/slippi-js";
import { writeFileSync } from "fs";
import { Highlight } from "./highlights";

export type Clip = {
  path: string;
  startFrame: number;
  endFrame: number;
  value: number;
  gameStartAt: string;
  // gameStation: string,
  // additional: any,
};

export type Dolphin = {
  mode: string;
  replay: string;
  isRealTimeMode: boolean;
  outputOverlayFiles: boolean;
  outputPath: string; // used for slp-to-video
  queue: Clip[];
};

export function createDolphinDataFromFrames(
  outputPath: string,
  queue: Clip[],
  leadingFrames: number = 240,
  trailingFrames: number = 159
): Dolphin {
  return {
    mode: "queue",
    replay: "",
    isRealTimeMode: false,
    outputOverlayFiles: false,
    outputPath: outputPath + ".mp4",
    queue: queue,
  };
}

export function writeDolphinFile(dolphin: Dolphin, filename: string) {
  let file = `output/${filename}.json`;
  writeFileSync(file, JSON.stringify(dolphin));
  console.log(`Wrote ${dolphin.queue.length} clips to ${file}.`);
}
