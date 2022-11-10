import { FrameEntryType, FramesType, PlayerType, SlippiGame, moves, characters } from "@slippi/slippi-js";
import { Clip, getQueueData } from "./dolphin";

export type EventTest = (allFrames: FramesType, currentFrameIndex: number) => boolean;

export type GameParser = (game: SlippiGame) => number[];

export class ClipFinder {
    parser: GameParser
    description: string
    filename: string
    clips: Clip[] // file -> [frames]

    constructor(parser: GameParser,
        description: string,
        filename: string) {
        this.parser = parser
        this.description = description
        this.filename = filename
        this.clips = []
    }

    parseGame(game: SlippiGame) { // TODO: maybe get filename here
        const frames = this.parser(game)
        this.clips.push(...getQueueData(game.getFilePath(), game, frames))
    }

    getClips() {
        return this.clips
    }
}

// export type OccurrenceFinder = {

//     occurrences: Clip[],
// }


export function evaluateCandidates(allFrames: FramesType, candidates: number[], test: EventTest) {
    return candidates.filter(value => test(allFrames, value))
}

export function playerIsJigglypuff(player: PlayerType) {
    return player.characterId == 15
}


export function didHit(frame: FrameEntryType, attacker: PlayerType, attackee: PlayerType) {
    return frame.players[attackee.playerIndex].post.lastHitBy == attacker.playerIndex
}

export function tookDamageThisFrame(frames: FramesType, frame: FrameEntryType, player: PlayerType) {
    const nextFrame = frames[frame.frame + 1]
    if (nextFrame == null || nextFrame.players[player.playerIndex] == null) {
        return false
    }

    const currentFramePercent = frame.players[player.playerIndex].pre.percent
    const nextFramePercent = nextFrame.players[player.playerIndex].pre.percent
    return currentFramePercent < nextFramePercent
}

export function wasLastHitBySomeoneElse(frame: FrameEntryType, attacker: PlayerType, attackee: PlayerType) {
    const playerOnFrame = frame.players[attackee.playerIndex];
    if (playerOnFrame == null) {
        return false
    }
    return playerOnFrame.post.lastHitBy != attacker.playerIndex
}

export function isAlive(frame: FrameEntryType, player: PlayerType) {
    return frame.players[player.playerIndex] != null &&
        frame.players[player.playerIndex].post != null
}

export function printGame(game: SlippiGame) {
    for (let i = 0; i < game.getMetadata().lastFrame!; i++) {
        let frame = game.getFrames()[i]
        let secondsElapsed = i / 60
        let minutesElapsed = Math.ceil(secondsElapsed / 60)
        let timeRemaining = (8 - minutesElapsed) + ":" + ((60 - secondsElapsed % 60) % 60).toPrecision(4)
        let info = "Frame " + i + " @ " + timeRemaining

        game.getSettings().players.forEach((player: PlayerType, index: number, array: PlayerType[]) => {
            let name = characters.getCharacterShortName(player.characterId!);
            if (isAlive(frame, player)) {
                let state = frame.players[index].post.actionStateId
                let percent = frame.players[index].pre.percent
                let lastHitBy = frame.players[index].post.lastHitBy
                info = info + ", " + name + " state " + state + " " + percent.toPrecision(3) + "% by " + lastHitBy
            } else {
                info = info + ", " + name + " is dead"
            }



        })
        console.log(info)
    }
}

