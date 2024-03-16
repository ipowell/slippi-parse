import { SlippiGame, ComboType, Character, Stage } from "@slippi/slippi-js";
import { GameParser } from "../highlights";
import { Highlight } from "../highlights";
import { getPlayerWithConnectCode } from "../utils";

const codeClon = "NEWB#788";

export const clonTopKillCombos: GameParser = (game: SlippiGame) => {
  const clon = getPlayerWithConnectCode(game, codeClon);
  if (clon === undefined) {
    return [];
  }
  if (game.getSettings().isTeams) {
    return [];
  }
  if (
    clon.characterId === Character.MARTH &&
    game.getSettings().stageId === Stage.FINAL_DESTINATION
  ) {
    return [];
  }
  const combos = game.getStats()!.combos;
  const kills = combos.filter((combo: ComboType) => {
    return combo.playerIndex !== clon.playerIndex && combo.didKill;
  });

  const frames = kills.map<Highlight>((combo: ComboType) => {
    return {
      startFrame: combo.startFrame,
      endFrame: combo.endFrame!,
      value: combo.moves.length,
    };
  });
  return frames;
};

export const clonTopDamageCombos: GameParser = (game: SlippiGame) => {
  const clon = getPlayerWithConnectCode(game, codeClon);
  if (clon === undefined) {
    return [];
  }
  if (game.getSettings().isTeams) {
    return [];
  }
  if (
    clon.characterId === Character.MARTH &&
    game.getSettings().stageId === Stage.FINAL_DESTINATION
  ) {
    return [];
  }
  const combos = game.getStats()!.combos;
  const kills = combos.filter((combo: ComboType) => {
    return combo.playerIndex !== clon.playerIndex && combo.didKill;
  });

  const frames = kills.map<Highlight>((combo: ComboType) => {
    return {
      startFrame: combo.startFrame,
      endFrame: combo.endFrame!,
      value: combo.endPercent - combo.startFrame,
    };
  });
  return frames;
};
