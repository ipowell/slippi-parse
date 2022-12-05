import { SlippiGame } from "@slippi/slippi-js";
import { GameParser, HighlightFinder } from "../src/highlights";
import {
  game,
  withGameFilepath,
  withGameMetadata,
  withGameSettings,
} from "./testUtils";

beforeEach(() => {
  jest.resetModules();
});

const testGameParser: GameParser = (game: SlippiGame) => {
  return [
    { startFrame: 1000, endFrame: 2000, value: 0 },
    // { startFrame: 3, endFrame: 4 },
  ];
};

describe("HighlightFinder", function () {
  const testHighlightFinder = new HighlightFinder(
    testGameParser,
    "testFilename",
    0,
    0
  );

  it("parses a game file", function () {
    withGameFilepath("path/file1.slp");
    withGameMetadata({ startAt: "startAt" });
    testHighlightFinder.parseGame(game);
    expect(testHighlightFinder.getClips()).toStrictEqual([
      {
        path: "path/file1.slp",
        startFrame: 1000,
        endFrame: 2000,
        gameStartAt: "startAt",
        value: 0,
      },
    ]);
  });

  it("parses two game files", function () {
    withGameFilepath("path/file1.slp");
    withGameMetadata({ startAt: "startAt1" });
    testHighlightFinder.parseGame(game);

    withGameFilepath("path/file2.slp");
    withGameMetadata({ startAt: "startAt2" });
    testHighlightFinder.parseGame(game);
    expect(testHighlightFinder.getClips()).toStrictEqual([
      {
        path: "path/file1.slp",
        startFrame: 1000,
        endFrame: 2000,
        gameStartAt: "startAt1",
        value: 0,
      },
      {
        path: "path/file2.slp",
        startFrame: 1000,
        endFrame: 2000,
        gameStartAt: "startAt2",
        value: 0,
      },
    ]);
  });
});
