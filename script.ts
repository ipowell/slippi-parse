import { writeFileSync } from 'fs';

import { SlippiGame, characters, stages, isTeching, FrameEntryType, FramesType } from "@slippi/slippi-js";

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

type EventTest = (allFrames: FramesType, currentFrameIndex: number) => boolean;

function findOccurrences(test: EventTest): number[] {
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
    additional: any,
}

function createDolphinDataFromFrames(frames: number[]): Dolphin {
    return {
        mode: 'queue',
        replay: '',
        isRealTimeMode: false,
        outputOverlayFiles: false,
        queue: frames.map((frame: number): Clip => {
            return {
                path: '/Users/ianpowell/Development/personal/slippi-parse/test.slp',
                startFrame: frame - 240 > -123 ? frame - 240 : -123,
                endFrame: frame + 180 < metadata.lastFrame! ? frame + 180 : metadata.lastFrame!,
                gameStartAt: "", // _.get(metadata, "startAt", ""),
                gameStation: "", // _.get(metadata, "consoleNick", ""),
                additional: {
                    characterId: player.characterId,
                    opponentCharacterId: opponent.characterId,
                }
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

let teched: Occurrence = {
    test: function (allFrames: FramesType, currentFrameIndex: number) {
        let frame = allFrames[currentFrameIndex]
        let previousFrame = allFrames[currentFrameIndex - 1]
        return isTeching(frame.players[1]!.post.actionStateId!)
            && !isTeching(previousFrame.players[1]!.post.actionStateId!)
    },
    description: `Teched`,
    filename: `techs`,
}

type Occurrence = {
    test: EventTest
    description: string,
    filename: string,
}

let occurrences: Occurrence[] = [
    teched,
]

occurrences.forEach((occurrence) => {
    let frames = findOccurrences(occurrence.test)
    console.log(`${occurrence.description} on frames ${frames}`)
    writeDolphinFile(createDolphinDataFromFrames(frames), occurrence.filename);
});


