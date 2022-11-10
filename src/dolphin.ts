import { SlippiGame } from "@slippi/slippi-js";
import { spawn } from "child_process";
import { writeFileSync } from "fs";
import path = require("path");
import { exit } from "process";

const fsPromises = require("fs").promises




export type Clip = {
    path: string,
    startFrame: number,
    endFrame: number,
    gameStartAt: string,
    // gameStation: string,
    // additional: any,
}

export type Dolphin = {
    mode: string,
    replay: string,
    isRealTimeMode: boolean,
    outputOverlayFiles: boolean,
    outputPath: string, // used for slp-to-video
    queue: Clip[],
}

export function getQueueData(file: string, game: SlippiGame, frames: number[], leadingFrames: number = 240, trailingFrames: number = 159,) {
    return frames.map((frame: number, index: number, array: number[]): Clip => {
        return {
            // TODO: find a better way of inferring this path
            path: file,
            // TODO: consider what to do if clips overlap
            startFrame: Math.max(frame - leadingFrames, -123),
            endFrame: Math.min((frame - 0) + trailingFrames, game.getMetadata().lastFrame!),
            // gameStartAt: "", // _.get(metadata, "startAt", ""),
            // gameStation: "", // _.get(metadata, "consoleNick", ""),
            // additional: {
            //     characterId: player.characterId,
            //     opponentCharacterId: opponent.characterId,
            // }
            gameStartAt: "09/04/22 7:56 am",
        }
    })
}

export function createDolphinDataFromFrames(outputPath: string, queue: Clip[], leadingFrames: number = 240, trailingFrames: number = 159,): Dolphin {
    return {
        mode: 'queue',
        replay: '',
        isRealTimeMode: false,
        outputOverlayFiles: false,
        outputPath: outputPath + ".mp4",
        queue: queue,
    };
}

export function writeDolphinFile(dolphin: Dolphin, filename: string) {
    let file = `output/${filename}.json`;
    writeFileSync(file, JSON.stringify(dolphin))
    console.log(`wrote file to ${file}`)
}
