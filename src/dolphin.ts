import { SlippiGame } from "@slippi/slippi-js";
import { writeFileSync } from "fs";


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

export function getQueueData(file: string, game: SlippiGame, frames: [number, number][], leadingFrames: number = 60, trailingFrames: number = 60,) {
    return frames.map((startAndEndFrames: [number, number]): Clip => {
        const start = startAndEndFrames[0]
        const end = startAndEndFrames[1]
        const metadata = game.getMetadata()
        return {
            // TODO: find a better way of inferring this path
            path: file,
            // TODO: consider what to do if clips overlap
            startFrame: Math.max(start - leadingFrames, -123),
            endFrame: Math.min((end - 0) + trailingFrames, metadata.lastFrame!),
            // gameStartAt: "", // _.get(metadata, "startAt", ""),
            // gameStation: "", // _.get(metadata, "consoleNick", ""),
            // additional: {
            //     characterId: player.characterId,
            //     opponentCharacterId: opponent.characterId,
            // }
            gameStartAt: metadata.startAt,
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
    console.log(`Wrote ${dolphin.queue.length} clips to ${file}.`)
}
