"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRests = void 0;
var findRests = function (game) { return [1]; };
exports.findRests = findRests;
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
//# sourceMappingURL=rests.js.map