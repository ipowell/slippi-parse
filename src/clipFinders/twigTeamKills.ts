import { SlippiGame, ComboType } from "@slippi/slippi-js";
import { GameParser, getPlayerWithConnectCode, Highlight } from "../utils";

export const twigTeamKills: GameParser = (game: SlippiGame) => {
  const codeTwig = "TWIG#619";
  const codeHotsauce = "HOTS#532";
  const twig = getPlayerWithConnectCode(game, codeTwig);
  const hotsauce = getPlayerWithConnectCode(game, codeHotsauce);
  if (twig === undefined || hotsauce === undefined) {
    return [];
  }
  if (!game.getSettings()!.isTeams || twig.teamId != hotsauce.teamId) {
    return [];
  }
  const combos = game.getStats()!.combos;
  const kills = combos.filter((combo: ComboType) => {
    if (
      combo.playerIndex === hotsauce.playerIndex ||
      combo.playerIndex === twig.playerIndex ||
      !combo.didKill
    ) {
      return false;
    }
    if (combo.moves.length < 4) {
      return false;
    }
    const attackers = combo.moves.map((move) => move.playerIndex);
    const attackersInvolved = new Set(attackers);
    return (
      attackersInvolved.has(twig.playerIndex) &&
      attackersInvolved.has(hotsauce.playerIndex)
    );
  });

  const frames = kills.map<Highlight>((combo: ComboType) => {
    return {
      startFrame: combo.startFrame,
      endFrame: combo.endFrame!,
    };
  });
  if (frames.length > 0) {
    console.log("Found " + frames.length + " clips.");
  }
  return frames;
};
