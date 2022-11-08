import { characters, FrameEntryType, FramesType, PlayerType, SlippiGame } from "@slippi/slippi-js";
import { evaluateCandidates, EventTest, isHitByRest, isResting, GameParser, playerIsJigglypuff } from "./utils";




export const findRests: GameParser = function (game: SlippiGame): number[] {
    const frames = game.getFrames();

    const settings = game.getSettings()!;
    const jigglypuffs: PlayerType[] = settings.players.filter(playerIsJigglypuff);

    let results = []

    jigglypuffs.forEach((jigglypuff) => {
        // find rest attempts
        const restTest: EventTest = function (allFrames: FramesType, currentFrameIndex: number) {
            let frame = allFrames[currentFrameIndex]
            let previousFrame = allFrames[currentFrameIndex - 1]
            return isResting(frame, jigglypuff) && !isResting(previousFrame, jigglypuff)
        }

        const restAttempts = evaluateCandidates(frames, Object.keys(frames) as unknown as number[], restTest)

        // const landedRestTest: EventTest = function (allFrames: FramesType, currentFrameIndex: number) {
        //     let frame = allFrames[currentFrameIndex]
        //     return isHitByRest(frame, opponent1) || isHitByRest(frame, opponent2)
        // }

        // const landedRests = evaluateCandidates(frames, restAttempts, landedRestTest)

        // return landedRests
        results.push(...restAttempts)
    })

    return results


}