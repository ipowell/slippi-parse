import { SlippiGame, ComboType, Character } from "@slippi/slippi-js";
import { GameParser, HighlightFinder } from "../highlights";
import { Highlight } from "../highlights";
import {
  getPlayerWithConnectCode,
  getSlippiFilesFromDirectory,
} from "../utils";
import { writeDolphinFile, createDolphinDataFromFrames } from "../dolphin";
import { connectCodeHotsauce } from "./connectCodes";

const peachCombosParser: GameParser = (game: SlippiGame) => {
  const hotsauce = getPlayerWithConnectCode(game, connectCodeHotsauce);
  if (hotsauce === undefined || hotsauce.characterId !== Character.PEACH) {
    return [];
  }
  const settings = game.getSettings()!;
  if (!settings.isTeams) {
    return [];
  }
  const combos = game.getStats()!.combos;
  const filteredCombos = combos.filter((combo: ComboType) => {
    if (settings.players[combo.playerIndex].teamId === hotsauce.teamId) {
      return false;
    }
    const killCombo = combo.didKill && combo.moves.length >= 4;
    const damageCombo = combo.moves.length > 6;
    // if (
    //   !combo.moves.some(
    //     (move) => settings.players[move.playerIndex].teamId === hotsauce.teamId
    //   )
    // ) {
    //   return false;
    // }
    return killCombo || damageCombo;
  });

  const frames = filteredCombos.map<Highlight>((combo: ComboType) => {
    return {
      startFrame: combo.startFrame,
      endFrame: combo.endFrame!,
      value: combo.moves
        .filter(
          (move) =>
            move.playerIndex !== 6 &&
            settings.players[move.playerIndex].teamId === hotsauce.teamId
        )
        .map((move) => move.damage)
        .reduce((move1, move2) => move1 + move2, 0),
    };
  });
  //   if (frames.length > 0) {
  //     console.log("Found " + frames.length + " clips.");
  //   }
  return frames;
};

export const peachCombos = new HighlightFinder(
  peachCombosParser,
  "peachCombos",
  240,
  120,
  25
);

const gameDir = "/home/ian/hdd/games/recordings/Slippi/2023-02";
const slippiFiles = getSlippiFilesFromDirectory(gameDir);

let currentFileIndex = 1;
const totalFiles = slippiFiles.length;
slippiFiles.forEach((filename: string) => {
  console.log("(" + currentFileIndex++ + "/" + totalFiles + "): " + filename);
  const game = new SlippiGame(filename);
  peachCombos.parseGame(game);
});

writeDolphinFile(
  createDolphinDataFromFrames(peachCombos.filename, peachCombos.getClips()),
  peachCombos.filename
);
