import { writeFileSync } from 'fs';

import { SlippiGame, characters, stages, isTeching, FrameEntryType, FramesType, PlayerType } from "@slippi/slippi-js";
import { OccurrenceFinder } from './utils';
import { findRests } from './rests';
import console = require('console');



require('dotenv').config();

const filename = "resources/doubles_puff.slp"

const game = new SlippiGame(filename);

type Dolphin = {
    mode: string,
    replay: string,
    isRealTimeMode: boolean,
    outputOverlayFiles: boolean,
    queue: Clip[],
}

const settings = game.getSettings()!;


const player = settings.players[1]!
const opponent = settings.players[0]!

const p1 = characters.getCharacterShortName(settings.players[0].characterId!);
const p2 = characters.getCharacterShortName(settings.players[1].characterId!);
const p3 = characters.getCharacterShortName(settings.players[2].characterId!);
const p4 = characters.getCharacterShortName(settings.players[3].characterId!);




const stage = stages.getStageName(settings.stageId!);

console.log(`This game is ${p1} vs ${p2} on ${stage}.`);

const metadata = game.getMetadata()!;

const stats = game.getStats()!;

// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
const allFrames = game.getFrames()!;



// for (let i = 0; i < metadata.lastFrame!; i++) {
//     let frame = allFrames[i]
//     let info = "Frame " + i + ": "

//     settings.players.forEach((player: PlayerType, index: number, array: PlayerType[]) => {
//         let name = characters.getCharacterShortName(player.characterId!);
//         let state = frame.players[index].post.actionStateId
//         let percent = frame.players[index].pre.percent
//         info = info + name + " state " + state + " " + percent + "%, "
//     })
//     console.log(info)
// }


type EventPredicate = (allFrames: FramesType, currentFrameIndex: number) => boolean;

function findOccurrences(test: EventPredicate): number[] {
    let occurrenceFrames: number[] = []
    for (let i = 0; i < metadata.lastFrame!; i++) {
        if (test(allFrames, i)) {
            occurrenceFrames.push(i);
        }
    }
    return occurrenceFrames
}

type Clip = {
    path: string,
    startFrame: number,
    endFrame: number,
    gameStartAt: string,
    // gameStation: string,
    // additional: any,
}

function createDolphinDataFromFrames(frames: number[], leadingFrames: number = 180, trailingFrames: number = 240,): Dolphin {
    return {
        mode: 'queue',
        replay: '',
        isRealTimeMode: false,
        outputOverlayFiles: false,
        queue: frames.map((frame: number, index: number, array: number[]): Clip => {
            return {
                // TODO: find a better way of inferring this path
                path: process.env.BASE_DIR + "/" + filename,
                startFrame: Math.max(frame - leadingFrames, -123),
                endFrame: Math.min((frame - 0) + trailingFrames, metadata.lastFrame!),
                // gameStartAt: "", // _.get(metadata, "startAt", ""),
                // gameStation: "", // _.get(metadata, "consoleNick", ""),
                // additional: {
                //     characterId: player.characterId,
                //     opponentCharacterId: opponent.characterId,
                // }
                gameStartAt: "09/04/22 7:56 am",
            }

        }
        )
    };


}

function writeDolphinFile(dolphin: Dolphin, filename: string) {
    let file = `output/${filename}.json`;
    writeFileSync(file, JSON.stringify(dolphin))
    console.log(`wrote file to ${file}`)
}

let restFinder: OccurrenceFinder = {
    parser: findRests,
    description: "landed rests",
    filename: "landed_rests"
}

let occurrentFinders: OccurrenceFinder[] = [
    restFinder
]



occurrentFinders.forEach((occurrence) => {
    let frames = occurrence.parser(game)
    console.log(`${occurrence.description} on frames ${frames}`)
    writeDolphinFile(createDolphinDataFromFrames(frames), occurrence.filename);
});



