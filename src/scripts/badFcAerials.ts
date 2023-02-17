// shield               3   GUARD       _
// blocked attacks      3   GUARDSETOFF GUARDDAMAGE
// float                0   341         295
// float nair           0   344         ATTACKAIRN
// float fair           0   345         ATTACKAIRF
// float bair           0   346         ATTACKAIRB
// float dair           0   348         ATTACKAIRLW

import {
  Character,
  FramesType,
  PlayerType,
  SlippiGame,
} from "@slippi/slippi-js";
import { EventTest, GameParser, Highlight } from "../highlights";
import { connectCodeHotsauce } from "./connectCodes";
import { getPlayerWithConnectCode, playerIsCharacter } from "../utils";

// autocancel/land      0   LANDING     LANDING
// aerial nair lag      0   LANDINGAIRN LANDINGAIRN
// aerial fair lag      0   LANDINGAIRF LANDINGAIRF
// aerial bair lag      0   LANDINGAIRB LANDINGAIRB
// aerial dair lag      0   LANDINGAIRLW    LANDINGAIRLW

const badAerials: GameParser = function (game: SlippiGame): Highlight[] {
  const hotsauce: PlayerType = getPlayerWithConnectCode(
    game,
    connectCodeHotsauce
  );

  if (
    hotsauce === undefined ||
    !playerIsCharacter(game, hotsauce, Character.PEACH)
  ) {
    return [];
  }

  const frames = game.getFrames();
  const settings = game.getSettings();

  //   let restingFrames: number[] = [];

  //   const otherPlayers = settings.players.filter(
  //     (value: PlayerType) => value.playerIndex != hotsauce.playerIndex
  //   );
  //   const restTest: EventTest = function (
  //     frames: FramesType,
  //     currentFrameIndex: number
  //   ) {
  //     let frame = frames[currentFrameIndex];
  //     const restableTargets = otherPlayers.filter((player) =>
  //       isAlive(frame, player)
  //     );
  //     if (isResting(frame, jigglypuff)) {
  //       if (
  //         restableTargets.some(
  //           (target: PlayerType) =>
  //             isAlive(frame, target) &&
  //             isPassedIntoRest(frames, frame, jigglypuff, target)
  //         )
  //       ) {
  //         return true;
  //       }
  //     }
  //     return false;
  //   };

  //   restingFrames = evaluateCandidates(
  //     frames,
  //     Object.keys(frames) as unknown as number[],
  //     restTest
  //   );
  //   return restingFrames;
};
