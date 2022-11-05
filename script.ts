import { writeFileSync } from 'fs';

import { SlippiGame, characters, stages, isTeching, FrameEntryType, FramesType, moves, State } from "@slippi/slippi-js";

require('dotenv').config();

const game = new SlippiGame("test.slp");

type Dolphin = {
    mode: string,
    replay: string,
    isRealTimeMode: boolean,
    outputOverlayFiles: boolean,
    queue: Clip[],
}

// Get game settings – stage, characters, etc
const settings = game.getSettings()!;
const p1 = characters.getCharacterShortName(settings.players[0].characterId!);
const p2 = characters.getCharacterShortName(settings.players[1].characterId!);

const player = settings.players[1]!
const opponent = settings.players[0]!

const stage = stages.getStageName(settings.stageId!);

console.log(`This game is ${p1} vs ${p2} on ${stage}.`);

const metadata = game.getMetadata()!;

const stats = game.getStats()!;

// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
const allFrames = game.getFrames()!;

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
    gameStation: string,
    // additional: any,
}

function createDolphinDataFromFrames(
    frames: number[], leadingFrames: number = 180, trailingFrames: number = 240,): Dolphin {
    return {
        mode: 'queue',
        replay: '',
        isRealTimeMode: false,
        outputOverlayFiles: false,
        queue: frames.map((frame: number): Clip => {
            return {
                // TODO: find a better way of inferring this path
                path: process.env.BASE_DIR + '/test.slp',
                startFrame: Math.max(frame - leadingFrames, -123),
                endFrame: Math.min(frame + trailingFrames, metadata.lastFrame!),
                gameStartAt: metadata.startAt, // _.get(metadata, "startAt", ""),
                gameStation: metadata.playedOn,
                // gameStation: "", // _.get(metadata, "consoleNick", ""),
                // additional: {
                //     characterId: player.characterId,
                //     opponentCharacterId: opponent.characterId,
                // }
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

type Occurrence = {
    predicate: EventPredicate
    description: string,
    filename: string,
}

function isKneeing(actionStateId: number): boolean {
    return actionStateId == State.AERIAL_FAIR
}

function isDamaged(actionStateId: number) {
    return actionStateId >= State.DAMAGE_START && actionStateId <= State.DAMAGE_END;
}

let knees: Occurrence = {
    predicate: function (allFrames: FramesType, currentFrameIndex: number) {



        let frame = allFrames[currentFrameIndex]
        let previousFrame = allFrames[currentFrameIndex - 1]
        return isKneeing(frame.players[1]!.post.actionStateId!)
            && isDamaged(frame.players[0]!.post.actionStateId!)
            && (!isKneeing(previousFrame.players[1]!.post.actionStateId!)
                || !isDamaged(previousFrame.players[0]!.post.actionStateId!)
            )
    },
    description: `Kneed`,
    filename: `knees`,
}


let occurrences: Occurrence[] = [
    knees,
]

occurrences.forEach((occurrence) => {
    let frames = findOccurrences(occurrence.predicate)
    console.log(`${occurrence.description} on frames ${frames}`)
    writeDolphinFile(createDolphinDataFromFrames(frames, 60, 30), occurrence.filename);
});


