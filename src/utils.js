"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHitByRest = exports.isResting = exports.evaluateCandidates = void 0;
function evaluateCandidates(allFrames, candidates, test) {
    return candidates.filter(function (value) { return test(allFrames, value); });
}
exports.evaluateCandidates = evaluateCandidates;
function isResting(frame, puff) {
    var _a;
    return ((_a = frame.players[puff.playerIndex]) === null || _a === void 0 ? void 0 : _a.post.actionStateId) == 21; // from moves.esm.js, probably wrong
}
exports.isResting = isResting;
function isHitByRest(frame, notPuff) {
    return true;
}
exports.isHitByRest = isHitByRest;
//# sourceMappingURL=utils.js.map