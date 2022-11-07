import { FrameEntryType, FramesType, SlippiGame } from "@slippi/slippi-js";

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

export function isResting(frame: FrameEntryType, puff) {
    return frame.players[puff.playerIndex]?.post.actionStateId == 21 // from moves.esm.js, probably wrong
}

export function isHitByRest(frame: FrameEntryType, notPuff) {
    return true
}