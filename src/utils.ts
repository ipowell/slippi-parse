import { FrameEntryType, FramesType, PlayerType, SlippiGame, moves } from "@slippi/slippi-js";

export type EventTest = (allFrames: FramesType, currentFrameIndex: number) => boolean;

export type GameParser = (game: SlippiGame) => number[];

export type OccurrenceFinder = {
    parser: GameParser,
    description: string,
    filename: string
}

export function evaluateCandidates(allFrames: FramesType, candidates: number[], test: EventTest) {
    return candidates.filter(value => test(allFrames, value))
}

export function playerIsJigglypuff(player: PlayerType) {
    return player.characterId == 15
}

const restStates = [
    369, // grounded facing left
    370, // airborne facing left
    371, // grounded facing right
    372, // airborne facing right
]
export function isResting(frame: FrameEntryType, puff: PlayerType) {
    const actionStateId = frame.players[puff.playerIndex]!.post.actionStateId
    return restStates.includes(actionStateId)
}

export function isHitByRest(frame: FrameEntryType, notPuff: PlayerType) {
    return true
}