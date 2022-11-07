import { FrameEntryType, FramesType, SlippiGame } from "@slippi/slippi-js";
import { evaluateCandidates, EventTest, isHitByRest, isResting, GameParser } from "./utils";


export const findRests: GameParser = function (game: SlippiGame) { return [1] }
//     const frames = game.getFrames();
//     const metadata = game.getMetadata()!;
//     // find rest attempts
//     const restTest: EventTest = function (allFrames: FramesType, currentFrameIndex: number) {
//         let frame = allFrames[currentFrameIndex]
//         let previousFrame = allFrames[currentFrameIndex - 1]
//         return isResting(frame, puff) && !isResting(previousFrame, puff)
//     }

//     const restAttempts = evaluateCandidates(frames, frames.keys(), restTest)

//     const landedRestTest: EventTest = function (allFrames: FramesType, currentFrameIndex: number) {
//         let frame = allFrames[currentFrameIndex]
//         return isHitByRest(frame, opponent1) || isHitByRest(frame, opponent2)
//     }

//     const landedRests = evaluateCandidates(frames, restAttempts, landedRestTest)

//     return landedRests
// }