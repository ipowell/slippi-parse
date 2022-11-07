"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var slippi_js_1 = require("@slippi/slippi-js");
var rests_1 = require("./rests");
require('dotenv').config();
var game = new slippi_js_1.SlippiGame("resources/singles_puff.slp");
function playerIsJigglypuff(player) {
    return player.characterId == 15;
}
// Get game settings – stage, characters, etc
var settings = game.getSettings();
var p1 = slippi_js_1.characters.getCharacterShortName(settings.players[0].characterId);
var p2 = slippi_js_1.characters.getCharacterShortName(settings.players[1].characterId);
var jigglypuffs = settings.players.filter(playerIsJigglypuff);
var player = settings.players[1];
var opponent = settings.players[0];
var stage = slippi_js_1.stages.getStageName(settings.stageId);
console.log("This game is ".concat(p1, " vs ").concat(p2, " on ").concat(stage, "."));
var metadata = game.getMetadata();
var stats = game.getStats();
// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
var allFrames = game.getFrames();
function findOccurrences(test) {
    var occurrenceFrames = [];
    for (var i = 0; i < metadata.lastFrame; i++) {
        if (test(allFrames, i)) {
            occurrenceFrames.push(i);
        }
    }
    return occurrenceFrames;
}
function createDolphinDataFromFrames(frames, leadingFrames, trailingFrames) {
    if (leadingFrames === void 0) { leadingFrames = 180; }
    if (trailingFrames === void 0) { trailingFrames = 240; }
    return {
        mode: 'queue',
        replay: '',
        isRealTimeMode: false,
        outputOverlayFiles: false,
        queue: frames.map(function (frame) {
            return {
                // TODO: find a better way of inferring this path
                path: process.env.BASE_DIR + '/test.slp',
                startFrame: Math.max(frame - leadingFrames, -123),
                endFrame: Math.min(frame + trailingFrames, metadata.lastFrame),
                // gameStartAt: "", // _.get(metadata, "startAt", ""),
                // gameStation: "", // _.get(metadata, "consoleNick", ""),
                // additional: {
                //     characterId: player.characterId,
                //     opponentCharacterId: opponent.characterId,
                // }
                gameStartAt: "09/04/22 7:56 am",
            };
        })
    };
}
function writeDolphinFile(dolphin, filename) {
    var file = "output/".concat(filename, ".json");
    (0, fs_1.writeFileSync)(file, JSON.stringify(dolphin));
    console.log("wrote file to ".concat(file));
}
var restFinder = {
    parser: rests_1.findRests,
    description: "landed rests",
    filename: "landed_rests"
};
var occurrentFinders = [
    restFinder
];
occurrentFinders.forEach(function (occurrence) {
    var frames = occurrence.parser(game);
    console.log("".concat(occurrence.description, " on frames ").concat(frames));
    writeDolphinFile(createDolphinDataFromFrames(frames), occurrence.filename);
});
//# sourceMappingURL=script.js.map