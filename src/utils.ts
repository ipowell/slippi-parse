import {
  FrameEntryType,
  FramesType,
  PlayerType,
  SlippiGame,
  moves,
  characters,
} from "@slippi/slippi-js";
import { Dirent, readdirSync } from "fs";

import { Clip, getQueueData } from "./dolphin";

export type EventTest = (
  allFrames: FramesType,
  currentFrameIndex: number
) => boolean;

export type Highlight = {
  startFrame: number;
  endFrame: number;
  value?: number;
};

// Function that will accept a `SlippiGame` as input and return a list of frames
// from which to generate clips around.
// TODO: return start/end frame tuples rather than just individual frames to pad on either side
export type GameParser = (game: SlippiGame) => Highlight[];

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

export class ClipFinder {
  parser: GameParser;
  filename: string;
  clips: Clip[];
  maxClips?: number;
  leadingFrames: number;
  trailingFrames: number;

  constructor(
    parser: GameParser,
    filename: string,
    leadingFrames: number = 240,
    trailingFrames: number = 159
  ) {
    this.parser = parser;
    this.filename = filename;
    this.clips = [];
    this.leadingFrames = leadingFrames;
    this.trailingFrames = trailingFrames;
  }

  parseGame(game: SlippiGame) {
    const frames = this.parser(game);
    if (frames.length > 0) {
      console.log("Found " + frames.length + " clips for " + this.filename);
    }
    this.clips.push(
      ...getQueueData(
        game.getFilePath(),
        game,
        frames,
        this.leadingFrames,
        this.trailingFrames
      )
    );
  }

  getClips() {
    return this.clips;
  }
}

export function evaluateCandidates(
  allFrames: FramesType,
  candidates: number[],
  test: EventTest
) {
  return candidates.filter((value) => test(allFrames, value));
}

export function playerIsJigglypuff(player: PlayerType) {
  return player.characterId == 15;
}

export function playerIsCaptainFalcon(player: PlayerType) {
  return player.characterId == 0;
}

export function playerIsGanondorf(player: PlayerType) {
  return player.characterId == 25;
}

export function didHit(
  frame: FrameEntryType,
  attacker: PlayerType,
  attackee: PlayerType
) {
  return (
    isAlive(frame, attacker) &&
    isAlive(frame, attackee) &&
    frame.players[attackee.playerIndex].post.lastHitBy == attacker.playerIndex
  );
}

export function tookDamageThisFrame(
  frames: FramesType,
  frame: FrameEntryType,
  player: PlayerType
) {
  const nextFrame = frames[frame.frame + 1];
  if (nextFrame == null || nextFrame.players[player.playerIndex] == null) {
    return false;
  }

  const currentFramePercent = frame.players[player.playerIndex].pre.percent;
  const nextFramePercent = nextFrame.players[player.playerIndex].pre.percent;
  return currentFramePercent < nextFramePercent;
}

export function tookXDamageThisFrame(
  frames: FramesType,
  frame: FrameEntryType,
  player: PlayerType,
  damage: number
) {
  const nextFrame = frames[frame.frame + 1];
  if (nextFrame == null || nextFrame.players[player.playerIndex] == null) {
    return false;
  }

  const currentFramePercent = frame.players[player.playerIndex].pre.percent;
  const nextFramePercent = nextFrame.players[player.playerIndex].pre.percent;
  return nextFramePercent >= currentFramePercent + damage;
}

export function wasLastHitBy(
  frame: FrameEntryType,
  attacker: PlayerType,
  attackee: PlayerType
) {
  const playerOnFrame = frame.players[attackee.playerIndex];
  if (playerOnFrame == null) {
    return false;
  }
  return playerOnFrame.post.lastHitBy == attacker.playerIndex;
}

export function wasLastHitBySomeoneElse(
  frame: FrameEntryType,
  attacker: PlayerType,
  attackee: PlayerType
) {
  const playerOnFrame = frame.players[attackee.playerIndex];
  if (playerOnFrame == null) {
    return false;
  }
  return playerOnFrame.post.lastHitBy != attacker.playerIndex;
}

export function isAlive(frame: FrameEntryType, player: PlayerType) {
  return (
    frame.players[player.playerIndex] != null &&
    frame.players[player.playerIndex].post != null
  );
}

export function printGame(game: SlippiGame) {
  for (let i = 0; i < game.getMetadata().lastFrame!; i++) {
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
      .getSettings()
      .players.forEach(
        (player: PlayerType, index: number, array: PlayerType[]) => {
          let name = characters.getCharacterShortName(player.characterId!);
          if (isAlive(frame, player)) {
            let state = frame.players[index].post.actionStateId;
            let percent = frame.players[index].pre.percent;
            let lastHitBy = frame.players[index].post.lastHitBy;
            info =
              info +
              ", " +
              name +
              " state " +
              state +
              " " +
              percent.toPrecision(3) +
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
  return player1.teamId == player2.teamId;
}

export function getPlayerWithConnectCode(
  game: SlippiGame,
  code: string
): PlayerType | null {
  return game
    .getSettings()
    .players.find((player: PlayerType) => player.connectCode == code);
}
