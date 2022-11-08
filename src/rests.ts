import { characters, FrameEntryType, FramesType, PlayerType, SlippiGame } from "@slippi/slippi-js";
import { evaluateCandidates, EventTest, isHitByRest, isResting, GameParser, playerIsJigglypuff, isPassedIntoRest } from "./utils";




export const findRests: GameParser = function (game: SlippiGame): number[] {
    const frames = game.getFrames();

    const settings = game.getSettings()!;
    const jigglypuffs: PlayerType[] = settings.players.filter(playerIsJigglypuff);

    if (jigglypuffs.length == 0) {
        return []
    }
    else if (jigglypuffs.length > 1) {
        const restableTargets = settings.players
    } else {
        const restableTargets = settings.players.filter((value: PlayerType) => value.playerIndex != jigglypuffs[0].playerIndex)
    }



    let restingFrames: number[] = []

    jigglypuffs.forEach((jigglypuff) => {
        const restableTargets = settings.players.filter((value: PlayerType) => value.playerIndex != jigglypuff.playerIndex)
        // find rest attempts
        const restTest: EventTest = function (frames: FramesType, currentFrameIndex: number) {
            let frame = frames[currentFrameIndex]
            if (isResting(frame, jigglypuff)) {
                if (restableTargets.some((target: PlayerType) => isPassedIntoRest(frames, frame, jigglypuff, target))) {
                    return true
                }
            }
            return false
        }

        restingFrames = evaluateCandidates(frames, Object.keys(frames) as unknown as number[], restTest)

        // const landedRestTest: EventTest = function (allFrames: FramesType, currentFrameIndex: number) {
        //     let frame = allFrames[currentFrameIndex]
        //     return isHitByRest(frame, opponent1) || isHitByRest(frame, opponent2)
        // }

        // const landedRests = evaluateCandidates(frames, restAttempts, landedRestTest)

        // return landedRests

        // const passedIntoRestTest: EventTest = function (allFrames: FramesType, currentFrameIndex: number) {
        //     let frame = allFrames[currentFrameIndex]
        //     return isResting(frame, jigglypuff)
        // }

        // restingFrames.forEach((value: number, index: number, array: number[]) => {

        // })

    })



    return restingFrames


}