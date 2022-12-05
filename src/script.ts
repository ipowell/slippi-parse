import { Character, MoveLandedType, SlippiGame } from "@slippi/slippi-js";
import {
  ClipFinder,
  GameParser,
  getPlayerWithConnectCode,
  getSlippiFilesFromDirectory,
  Highlight,
  playerIsCaptainFalcon,
  playerIsJigglypuff,
  printGame,
} from "./utils";
import console = require("console");
import { createDolphinDataFromFrames, writeDolphinFile } from "./dolphin";
import { twigTeamKills } from "./clipFinders/twigTeamKills";

require("dotenv").config();

const slippiFolder = "/home/ian/hdd/games/recordings/Slippi";
const novemberGames = "/home/ian/hdd/games/recordings/Slippi/2022-10";

const slippiFiles = getSlippiFilesFromDirectory(slippiFolder);
// const slippiFiles = ["/home/ian/hdd/games/recordings/Slippi/2022-10/Game_20221001T155512.slp"]

const clipFinders: ClipFinder[] = [
  new ClipFinder(twigTeamKills, "twigTeamKills"),
];

let currentFileIndex = 1;
const totalFiles = slippiFiles.length;

slippiFiles.forEach((filename: string) => {
  console.log("(" + currentFileIndex++ + "/" + totalFiles + "): " + filename);
  const game = new SlippiGame(filename);

  // printGame(game)
  clipFinders.forEach((clipFinder) => {
    clipFinder.parseGame(game);
  });
});

clipFinders.forEach((clipFinder) => {
  writeDolphinFile(
    createDolphinDataFromFrames(clipFinder.filename, clipFinder.clips),
    clipFinder.filename
  );
});
