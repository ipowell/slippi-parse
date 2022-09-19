"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var slippi_js_1 = require("@slippi/slippi-js");
var game = new slippi_js_1.SlippiGame("test.slp");
// const test = new Dolph
var dolphin = {
    mode: 'queue',
    replay: '',
    isRealTimeMode: false,
    outputOverlayFiles: false,
    queue: []
};
// const dolphin = new Dolphin(
//     mode: "queue",
//     replay, "",
//     isRealTimeMode, false,
//     outputOverlayFiles, true,
//     queue, [],
// );
// Get game settings – stage, characters, etc
var settings = game.getSettings();
var p1 = slippi_js_1.characters.getCharacterShortName(settings.players[0].characterId);
var p2 = slippi_js_1.characters.getCharacterShortName(settings.players[1].characterId);
var player = settings.players[1];
var opponent = settings.players[0];
var stage = slippi_js_1.stages.getStageName(settings.stageId);
console.log("This game is ".concat(p1, " vs ").concat(p2, " on ").concat(stage, "."));
// Get metadata - start time, platform played on, etc
var metadata = game.getMetadata();
// console.log(metadata);
// Get computed stats - openings / kill, conversions, etc
var stats = game.getStats();
// console.log(stats);
// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
var allFrames = game.getFrames();
var techFrames = [];
var currentFrame = allFrames[0];
var previousFrame = allFrames[-1];
while (currentFrame) {
    var didTech = (0, slippi_js_1.isTeching)(currentFrame.players[1].post.actionStateId)
        && !(0, slippi_js_1.isTeching)(previousFrame.players[1].post.actionStateId);
    if (didTech) {
        techFrames.push(currentFrame.frame);
    }
    previousFrame = currentFrame;
    currentFrame = allFrames[currentFrame.frame + 1];
}
techFrames.forEach(function (techFrame) {
    var x = {
        path: '/Users/ianpowell/Development/personal/slippi-parse/test.slp',
        startFrame: techFrame - 240 > -123 ? techFrame - 240 : -123,
        endFrame: techFrame + 180 < metadata.lastFrame ? techFrame + 180 : metadata.lastFrame,
        gameStartAt: "",
        gameStation: "",
        additional: {
            characterId: player.characterId,
            opponentCharacterId: opponent.characterId
        }
    };
    dolphin.queue.push(x);
});
console.log("Teched on frames ".concat(techFrames.join(', ')));
// fs.writeFileSync();
(0, fs_1.writeFileSync)("./combos.json", JSON.stringify(dolphin));
