import {
  SlippiGame,
  ComboType,
  Character,
  characters,
  StockType,
} from "@slippi/slippi-js";
import { CharacterInfo } from "@slippi/slippi-js/dist/melee/characterUtils";
import { fstat } from "fs";
import { getSlippiFilesFromDirectory } from "../utils";

var fs = require("fs");

const decemberGames = "/home/ian/hdd/games/recordings/Slippi/2022-12";
const slippiFiles = getSlippiFilesFromDirectory(decemberGames);

const winners = {};
const allChars = characters.getAllCharacters();
allChars.forEach((winningCharacter: CharacterInfo) => {
  let losers = {};
  allChars.forEach((losingCharacter: CharacterInfo) => {
    losers[losingCharacter.name] = createEmptyResults();
  });
  winners[winningCharacter.name] = losers;
});

function stockLoss(game: SlippiGame) {
  const settings = game.getSettings()!;
  if (settings.isTeams) {
    return;
  }

  const matchWinners = game.getWinners();
  if (matchWinners.length == 0) {
    // presumably an incomplete game
    return;
  }

  const winningPlayerIndex = matchWinners[0].playerIndex;
  const losingPlayerIndex = 1 - winningPlayerIndex;

  const winningCharacterId = settings.players[winningPlayerIndex].characterId;
  const losingCharacterId = settings.players[losingPlayerIndex].characterId;

  const winningCharacterName = characters.getCharacterName(winningCharacterId);
  const losingCharacterName = characters.getCharacterName(losingCharacterId);

  const stocks = game.getStats().stocks;
  if (stocks.length == 0) {
    console.log("what's going on here");
  } else {
    let winnerStocks = 4;
    let loserStocks = 4;

    // remove the 0th element, is effectively a duplicate of the 1st for this purpose
    stocks.slice(1).forEach((stock: StockType) => {
      if (stock.count > 4) {
        // I have some 99 stock practice games that I didn't finish but show up here anyway
        return;
      }
      if (stock.playerIndex == winningPlayerIndex) {
        winnerStocks = stock.count;
      } else {
        loserStocks = stock.count;
      }

      // increment # of games won when stock count was X to Y
      winners[winningCharacterName][losingCharacterName][winnerStocks][
        loserStocks
      ] += 1;
    });
  }
}

function createEmptyResults(): number[][] {
  return [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
}

let currentFileIndex = 1;
const totalFiles = slippiFiles.length;
slippiFiles.forEach((filename: string) => {
  console.log("(" + currentFileIndex++ + "/" + totalFiles + "): " + filename);
  const game = new SlippiGame(filename);
  stockLoss(game);
});

console.log(winners);

fs.writeFile("stockData.json", JSON.stringify(winners), (err) => {
  if (err) {
    throw err;
  }
  console.log("JSON data is saved.");
});
