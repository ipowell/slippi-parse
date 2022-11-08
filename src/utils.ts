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

function didHit(frame: FrameEntryType, attacker: PlayerType, attackee: PlayerType) {
    return frame.players[attackee.playerIndex].post.lastHitBy == attacker.playerIndex
}

function tookDamageThisFrame(frames: FramesType, frame: FrameEntryType, player: PlayerType) {
    const nextFrame = frames[frame.frame + 1]
    return frame.players[player.playerIndex].pre.percent < nextFrame.players[player.playerIndex].pre.percent
}

function wasLastHitBySomeoneElse(frame: FrameEntryType, attacker: PlayerType, attackee: PlayerType) {
    return frame.players[attackee.playerIndex].post.lastHitBy != attacker.playerIndex
}

export function isHitByRest(frames: FramesType, frame: FrameEntryType, puff: PlayerType, notPuff: PlayerType) {
    return (
        isResting(frame, puff) &&
        didHit(frame, puff, notPuff) &&
        tookDamageThisFrame(frames, frame, notPuff)
    )
}

export function isPassedIntoRest(frames: FramesType, frame: FrameEntryType, puff: PlayerType, notPuff: PlayerType) {
    const previousFrame = frames[frame.frame - 1]
    return (
        isResting(frame, puff) &&
        wasLastHitBySomeoneElse(previousFrame, puff, notPuff) &&
        didHit(frame, puff, notPuff) &&
        tookDamageThisFrame(frames, frame, notPuff)
    )
}