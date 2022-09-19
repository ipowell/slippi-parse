import { writeFileSync } from 'fs';

import { SlippiGame, characters, stages, isTeching } from "@slippi/slippi-js";

const game = new SlippiGame("test.slp");

type Dolphin = {
    mode: string,
    replay: string,
    isRealTimeMode: boolean,
    outputOverlayFiles: boolean,
    queue: Clip[],
}

let dolphin: Dolphin = {
    mode: 'queue',
    replay: '',
    isRealTimeMode: false,
    outputOverlayFiles: false,
    queue: []
};

// Get game settings – stage, characters, etc
const settings = game.getSettings()!;
const p1 = characters.getCharacterShortName(settings.players[0].characterId!);
const p2 = characters.getCharacterShortName(settings.players[1].characterId!);

const player = settings.players[1]!
const opponent = settings.players[0]!

const stage = stages.getStageName(settings.stageId!);

console.log(`This game is ${p1} vs ${p2} on ${stage}.`);

// Get metadata - start time, platform played on, etc
const metadata = game.getMetadata()!;
// console.log(metadata);

// Get computed stats - openings / kill, conversions, etc
const stats = game.getStats()!;
// console.log(stats);

// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
const allFrames = game.getFrames()!;

let techFrames: number[] = []

let currentFrame = allFrames[0];
let previousFrame = allFrames[-1];
while (currentFrame) {
    const didTech = isTeching(currentFrame.players[1]!.post.actionStateId!)
        && !isTeching(previousFrame.players[1]!.post.actionStateId!);
    if (didTech) {
        techFrames.push(currentFrame.frame);
    }
    previousFrame = currentFrame;
    currentFrame = allFrames[currentFrame.frame + 1];
}

type Clip = {
    path: string,
    startFrame: number,
    endFrame: number,
    gameStartAt: string,
    gameStation: string,
    additional: any,
}

techFrames.forEach((techFrame) => {
    let x: Clip = {
        path: '/Users/ianpowell/Development/personal/slippi-parse/test.slp',
        startFrame: techFrame - 240 > -123 ? techFrame - 240 : -123,
        endFrame: techFrame + 180 < metadata.lastFrame! ? techFrame + 180 : metadata.lastFrame!,
        gameStartAt: "", // _.get(metadata, "startAt", ""),
        gameStation: "", // _.get(metadata, "consoleNick", ""),
        additional: {
            characterId: player.characterId,
            opponentCharacterId: opponent.characterId,
        }
    };

    dolphin.queue.push(x);
});



console.log(`Teched on frames ${techFrames.join(', ')}`);

writeFileSync("output/clips.json", JSON.stringify(dolphin))
