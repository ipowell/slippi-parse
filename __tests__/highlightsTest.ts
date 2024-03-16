import { SlippiGame } from "@slippi/slippi-js";
import { GameParser, HighlightFinder } from "../src/highlights";
import { game, withGameFilepath, withGameMetadata } from "./testUtils";

beforeEach(() => {
  jest.resetModules();
});

const testGameParser: GameParser = (_game: SlippiGame) => {
  return [
    { startFrame: 1000, endFrame: 2000, value: 0 },
    // { startFrame: 3, endFrame: 4 },
  ];
};

function createTestFinder() {
  return new HighlightFinder(testGameParser, "testFilename", 0, 0);
}

describe("HighlightFinder", function () {
  it("parses a game file", function () {
    const testHighlightFinder = createTestFinder();
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
    const testHighlightFinder = createTestFinder();
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

  it("can limit the number of highlights", function () {
    const limit = 2;
    const testGameParser: GameParser = (_game: SlippiGame) => {
      return [
        { startFrame: 1, endFrame: 2 },
        { startFrame: 3, endFrame: 4 },
        { startFrame: 5, endFrame: 6 },
      ];
    };
    const testHighlightFinder = new HighlightFinder(
      testGameParser,
      "testFilename",
      0,
      0,
      limit
    );
    testHighlightFinder.parseGame(game);
    expect(testHighlightFinder.getClips().length).toBe(2);
  });

  it("will sort highlights by value", function () {
    const limit = 2;
    const testGameParser: GameParser = (_game: SlippiGame) => {
      return [
        { startFrame: 1, endFrame: 2, value: 1 },
        { startFrame: 3, endFrame: 4, value: 3 },
        { startFrame: 5, endFrame: 6, value: 2 },

        { startFrame: 6, endFrame: 7, value: 4 },
      ];
    };
    const testHighlightFinder = new HighlightFinder(
      testGameParser,
      "testFilename",
      0,
      0,
      limit
    );
    withGameFilepath("path/file1.slp");
    withGameMetadata({ startAt: "startAt" });
    testHighlightFinder.parseGame(game);
    expect(testHighlightFinder.getClips()).toStrictEqual([
      {
        path: "path/file1.slp",
        startFrame: 6,
        endFrame: 7,
        gameStartAt: "startAt",
        value: 4,
      },
      {
        path: "path/file1.slp",
        startFrame: 3,
        endFrame: 4,
        gameStartAt: "startAt",
        value: 3,
      },
    ]);
  });

  it("will pad frames by leadingFrames and trailingFrames", function () {
    withGameFilepath("path/file1.slp");
    withGameMetadata({ startAt: "startAt" });
    const testGameParser: GameParser = (_game: SlippiGame) => {
      return [{ startFrame: 10, endFrame: 20 }];
    };

    const highlightFinder = new HighlightFinder(
      testGameParser,
      "testFilename",
      5,
      5
    );

    highlightFinder.parseGame(game);

    expect(highlightFinder.getClips()).toStrictEqual([
      {
        path: "path/file1.slp",
        startFrame: 5,
        endFrame: 25,
        gameStartAt: "startAt",
        value: 0,
      },
    ]);
  });

  it("will pad frames by default if no value is provided", function () {
    withGameFilepath("path/file1.slp");
    withGameMetadata({ startAt: "startAt" });
    const testGameParser: GameParser = (_game: SlippiGame) => {
      return [{ startFrame: 480, endFrame: 540 }];
    };

    const highlightFinder = new HighlightFinder(testGameParser, "testFilename");

    highlightFinder.parseGame(game);

    expect(highlightFinder.getClips()).toStrictEqual([
      {
        path: "path/file1.slp",
        startFrame: 240,
        endFrame: 660,
        gameStartAt: "startAt",
        value: 0,
      },
    ]);
  });
});
