import { characters, FrameEntryType, FramesType, PlayerType, SlippiGame } from "@slippi/slippi-js";
import { evaluateCandidates, EventTest, GameParser, playerIsJigglypuff, isAlive, wasLastHitBySomeoneElse, didHit, tookDamageThisFrame } from "./utils";


function getJigglypuffs(game: SlippiGame): PlayerType[] {
    return game.getSettings().players.filter(playerIsJigglypuff);
}

const restStates = [
    369, // grounded facing left
    370, // airborne facing left
    371, // grounded facing right
    372, // airborne facing right
]

export function isResting(frame: FrameEntryType, puff: PlayerType) {
    if (!isAlive(frame, puff)) {
        return false
    }
    const actionStateId = frame.players[puff.playerIndex]!.post.actionStateId
    return restStates.includes(actionStateId)
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
        isAlive(frame, notPuff) &&
        wasLastHitBySomeoneElse(previousFrame, puff, notPuff) &&
        didHit(frame, puff, notPuff) &&
        tookDamageThisFrame(frames, frame, notPuff)
    )
}

export const allRestAttempts: GameParser = function (game: SlippiGame): number[] {
    const frames = game.getFrames();
    const jigglypuffs: PlayerType[] = getJigglypuffs(game);
    let restingFrames: number[] = []

    jigglypuffs.forEach((jigglypuff) => {
        const restTest: EventTest = function (frames: FramesType, currentFrameIndex: number) {
            let frame = frames[currentFrameIndex]
            let previousFrame = frames[currentFrameIndex - 1]
            return (isResting(frame, jigglypuff) && !isResting(previousFrame, jigglypuff))
        }
        restingFrames = evaluateCandidates(frames, Object.keys(frames) as unknown as number[], restTest)
    })
    return restingFrames
}

export const hitRests: GameParser = function (game: SlippiGame): number[] {
    const frames = game.getFrames();
    const settings = game.getSettings()!;
    const jigglypuffs: PlayerType[] = getJigglypuffs(game);
    let restingFrames: number[] = []

    jigglypuffs.forEach((jigglypuff) => {
        const otherPlayers = settings.players.filter((value: PlayerType) => value.playerIndex != jigglypuff.playerIndex)
        const restTest: EventTest = function (frames: FramesType, currentFrameIndex: number) {
            let frame = frames[currentFrameIndex]
            const restableTargets = otherPlayers.filter(player => isAlive(frame, player))
            if (isResting(frame, jigglypuff)) {
                if (restableTargets.some((target: PlayerType) => isHitByRest(frames, frame, jigglypuff, target))) {
                    return true
                }
            }
            return false
        }

        restingFrames = evaluateCandidates(frames, Object.keys(frames) as unknown as number[], restTest)
    })
    return restingFrames
}


export const passIntoRests: GameParser = function (game: SlippiGame): number[] {
    const frames = game.getFrames();
    const settings = game.getSettings()!;
    if (!settings.isTeams) {
        return []
    }
    const jigglypuffs: PlayerType[] = getJigglypuffs(game);
    let restingFrames: number[] = []

    jigglypuffs.forEach((jigglypuff) => {
        const otherPlayers = settings.players.filter((value: PlayerType) => value.playerIndex != jigglypuff.playerIndex)
        const restTest: EventTest = function (frames: FramesType, currentFrameIndex: number) {
            let frame = frames[currentFrameIndex]
            const restableTargets = otherPlayers.filter(player => isAlive(frame, player))
            if (isResting(frame, jigglypuff)) {
                if (restableTargets.some((target: PlayerType) => isAlive(frame, target) && isPassedIntoRest(frames, frame, jigglypuff, target))) {
                    return true
                }
            }
            return false
        }

        restingFrames = evaluateCandidates(frames, Object.keys(frames) as unknown as number[], restTest)
    })
    return restingFrames
}
