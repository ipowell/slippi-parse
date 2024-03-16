import { Character, MoveLandedType, SlippiGame } from "@slippi/slippi-js";
import { getSlippiFilesFromDirectory, printGame } from "./utils";
import { createDolphinDataFromFrames, writeDolphinFile } from "./dolphin";
import { twigTeamKills } from "./clipFinders/twigTeamKills";
import { HighlightFinder } from "./highlights";

require("dotenv").config();

const slippiFolder = "/home/ian/hdd/games/recordings/Slippi";
const novemberGames = "/home/ian/hdd/games/recordings/Slippi/2022-10";

const slippiFiles = getSlippiFilesFromDirectory(slippiFolder);
// const slippiFiles = ["/home/ian/hdd/games/recordings/Slippi/2022-10/Game_20221001T155512.slp"]

const highlightFinders: HighlightFinder[] = [
  new HighlightFinder(twigTeamKills, "twigTeamKills"),
];

let currentFileIndex = 1;
const totalFiles = slippiFiles.length;

slippiFiles.forEach((filename: string) => {
  console.log("(" + currentFileIndex++ + "/" + totalFiles + "): " + filename);
  const game = new SlippiGame(filename);

  // printGame(game)
  highlightFinders.forEach((highlightFinder) => {
    highlightFinder.parseGame(game);
  });
});

highlightFinders.forEach((highlightFinder) => {
  writeDolphinFile(
    createDolphinDataFromFrames(
      highlightFinder.filename,
      highlightFinder.getClips()
    ),
    highlightFinder.filename
  );
});
