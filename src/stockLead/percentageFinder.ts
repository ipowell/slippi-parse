import stockData from "./stockData.json";

function createEmptyPercentageResults(): String[][] {
  return [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
}

function findPercentages(
  winnerData: number[][],
  loserData: number[][]
): String[][] {
  const results: String[][] = createEmptyPercentageResults();
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let wins = winnerData[i][j];
      let losses = loserData[i][j];
      results[i][j] = (wins / (wins + losses)).toPrecision(3);
    }
  }
  return results;
}

const falcoWins = stockData.Falco.Peach;
const peachWins = stockData.Peach.Falco;

const percents = findPercentages(falcoWins, peachWins);

console.log(percents);
