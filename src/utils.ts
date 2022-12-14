import {
  FrameEntryType,
  FramesType,
  PlayerType,
  SlippiGame,
  characters,
} from "@slippi/slippi-js";
import { readdirSync, Dirent } from "fs";

export function getSlippiFilesFromDirectory(directory: string): string[] {
  const contents = readdirSync(directory, { withFileTypes: true });
  let slippiFiles = contents
    .filter((ent: Dirent) => ent.isFile() && ent.name.endsWith(".slp"))
    .map((ent) => directory + "/" + ent.name);
  contents
    .filter((ent: Dirent) => ent.isDirectory())
    .forEach((dir: Dirent) => {
      slippiFiles = slippiFiles.concat(
        getSlippiFilesFromDirectory(directory + "/" + dir.name)
      );
    });
  return slippiFiles;
}

export function didHit(
  frame: FrameEntryType,
  attacker: PlayerType,
  attackee: PlayerType
) {
  return (
    isAlive(frame, attacker) &&
    isAlive(frame, attackee) &&
    frame.players[attackee.playerIndex]!.post.lastHitBy === attacker.playerIndex
  );
}

export function tookDamageThisFrame(
  frames: FramesType,
  frame: FrameEntryType,
  player: PlayerType
) {
  return tookXDamageThisFrame(frames, frame, player, 1);
}

export function tookXDamageThisFrame(
  frames: FramesType,
  frame: FrameEntryType,
  player: PlayerType,
  damage: number
) {
  const nextFrame = frames[frame.frame + 1];
  if (
    frame === null ||
    frame.players[player.playerIndex] === null ||
    nextFrame === null ||
    nextFrame.players[player.playerIndex] === null
  ) {
    return false;
  }

  const currentFramePercent = frame.players[player.playerIndex]!.pre.percent!;
  const nextFramePercent = nextFrame.players[player.playerIndex]!.pre.percent!;
  return nextFramePercent >= currentFramePercent + damage;
}

export function wasLastHitBy(
  frame: FrameEntryType,
  attacker: PlayerType,
  attackee: PlayerType
) {
  const playerOnFrame = frame.players[attackee.playerIndex];
  if (playerOnFrame === null) {
    return false;
  }
  return playerOnFrame.post.lastHitBy === attacker.playerIndex;
}

export function wasLastHitBySomeoneElse(
  frame: FrameEntryType,
  attacker: PlayerType,
  attackee: PlayerType
) {
  const playerOnFrame = frame.players[attackee.playerIndex];
  if (playerOnFrame === null) {
    return false;
  }
  return playerOnFrame.post.lastHitBy != attacker.playerIndex;
}

export function isAlive(frame: FrameEntryType, player: PlayerType) {
  return (
    frame.players[player.playerIndex] != null &&
    frame.players[player.playerIndex]!.post != null
  );
}

export function printGame(game: SlippiGame) {
  for (let i = 0; i < game.getMetadata()!.lastFrame!; i++) {
    let frame = game.getFrames()[i];
    let secondsElapsed = i / 60;
    let minutesElapsed = Math.ceil(secondsElapsed / 60);
    let timeRemaining =
      8 -
      minutesElapsed +
      ":" +
      ((60 - (secondsElapsed % 60)) % 60).toPrecision(4);
    let info = "Frame " + i + " @ " + timeRemaining;

    game
      .getSettings()!
      .players.forEach(
        (player: PlayerType, index: number, array: PlayerType[]) => {
          let name = characters.getCharacterShortName(player.characterId!);
          if (isAlive(frame, player)) {
            let state = frame.players[index]!.post.actionStateId;
            let percent = frame.players[index]!.pre.percent;
            let lastHitBy = frame.players[index]!.post.lastHitBy;
            info =
              info +
              ", " +
              name +
              " state " +
              state +
              " " +
              percent!.toPrecision(3) +
              "% by " +
              lastHitBy;
          } else {
            info = info + ", " + name + " is dead";
          }
        }
      );
    console.log(info);
  }
}

export function onTeams(player1: PlayerType, player2: PlayerType) {
  return player1.teamId === player2.teamId;
}

export function getPlayerWithConnectCode(
  game: SlippiGame,
  code: string
): PlayerType | undefined {
  return game
    .getSettings()!
    .players.find((player: PlayerType) => player.connectCode === code);
}
