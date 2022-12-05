jest.mock("@slippi/slippi-js");
import { Character, Stage } from "@slippi/slippi-js";
import {
  AndFilter,
  CharactersOnTeamFilter,
  ConnectCodeFilter,
  ConnectCodesOnTeamFilter,
  GameFilter,
  GameMode,
  GameModeFilter,
  OrFilter,
  StageFilter,
} from "../src/gameFilters";
import {
  createFakePlayer,
  createMockGetSettings,
  FalseFilter,
  game,
  mockGame,
  TrueFilter,
  withGameSettings,
} from "./testUtils";

function assertShouldMatch(filter: GameFilter) {
  expect(filter.apply(game)).toBe(true);
}

function assertShouldFilter(filter: GameFilter) {
  expect(filter.apply(game)).toBe(false);
}

beforeEach(() => {
  jest.resetModules();
});

const trueFilter = new TrueFilter();
const falseFilter = new FalseFilter();

describe("GameFilter", function () {
  describe("and", function () {
    assertShouldMatch(trueFilter.and(trueFilter));
    assertShouldFilter(trueFilter.and(falseFilter));
    assertShouldFilter(falseFilter.and(falseFilter));
  });

  describe("or", function () {
    assertShouldMatch(trueFilter.or(trueFilter));
    assertShouldMatch(trueFilter.or(falseFilter));
    assertShouldFilter(falseFilter.or(falseFilter));
  });
});

describe("AndFilter", function () {
  it("should return true when all are true", function () {
    assertShouldMatch(new AndFilter(trueFilter, trueFilter));
  });

  it("should return false when some are false", function () {
    assertShouldFilter(new AndFilter(trueFilter, falseFilter));
  });

  it("should return false when all are false", function () {
    assertShouldFilter(new AndFilter(falseFilter, falseFilter));
  });
});

describe("OrFilter", function () {
  it("should return true when all are true", function () {
    assertShouldMatch(new OrFilter(trueFilter, trueFilter));
  });

  it("should return false when some are true", function () {
    assertShouldMatch(new OrFilter(trueFilter, falseFilter));
  });

  it("should return false when all are false", function () {
    assertShouldFilter(new OrFilter(falseFilter, falseFilter));
  });
});

describe("GameModeFilter", function () {
  describe("Singles", function () {
    const singlesFilter = new GameModeFilter(GameMode.Singles);
    it("should pass for singles", function () {
      createMockGetSettings(mockGame, { isTeams: false });
      assertShouldMatch(singlesFilter);
    });

    it("should fail for teams", function () {
      createMockGetSettings(mockGame, { isTeams: true });
      assertShouldFilter(singlesFilter);
    });
  });

  describe("Teams", function () {
    const teamsFilter = new GameModeFilter(GameMode.Teams);
    it("should pass for teams", function () {
      createMockGetSettings(mockGame, { isTeams: true });
      assertShouldMatch(teamsFilter);
    });

    it("should fail for singles", function () {
      createMockGetSettings(mockGame, { isTeams: false });
      assertShouldFilter(teamsFilter);
    });
  });

  describe("Any", function () {
    const anyModeFilter = new GameModeFilter(GameMode.Any);
    it("should pass for singles", function () {
      createMockGetSettings(mockGame, { isTeams: false });
      assertShouldMatch(anyModeFilter);
    });

    it("should pass for teams", function () {
      createMockGetSettings(mockGame, { isTeams: true });
      assertShouldMatch(anyModeFilter);
    });
  });
});

describe("ConnectCodeFilter", function () {
  const testCode = "IM#1";
  const connectCodeFilter = new ConnectCodeFilter(testCode);

  it("should pass when a player with the connect code exists", function () {
    createMockGetSettings(mockGame, {
      players: [createFakePlayer({ connectCode: testCode })],
    });
    assertShouldMatch(connectCodeFilter);
  });

  it("should fail when a player with the connect code does not exist", function () {
    createMockGetSettings(mockGame, {
      players: [createFakePlayer({ connectCode: "NOTME#0" })],
    });
    assertShouldFilter(connectCodeFilter);
  });
});

describe("ConnectCodesOnTeamFilter", function () {
  const teammate1Code = "IM#1";
  const teammate2Code = "IM#2";
  const connectCodesOnTeamFilter = new ConnectCodesOnTeamFilter(
    teammate1Code,
    teammate2Code
  );

  it("should fail if it is not a teams game", function () {
    createMockGetSettings(mockGame, {
      isTeams: false,
      players: [
        createFakePlayer({ connectCode: teammate1Code, teamId: 1 }),
        createFakePlayer({ connectCode: teammate2Code, teamId: 1 }),
      ],
    });
    assertShouldFilter(connectCodesOnTeamFilter);
  });

  it("should pass when the players are on the same team", function () {
    createMockGetSettings(mockGame, {
      isTeams: true,
      players: [
        createFakePlayer({ connectCode: teammate1Code, teamId: 0 }),
        createFakePlayer({ connectCode: teammate2Code, teamId: 0 }),
        createFakePlayer({ connectCode: "ELSE#1", teamId: 1 }),
        createFakePlayer({ connectCode: "ELSE#2", teamId: 1 }),
      ],
    });
    assertShouldMatch(connectCodesOnTeamFilter);
  });

  it("should fail when a players are on different teams", function () {
    createMockGetSettings(mockGame, {
      isTeams: true,
      players: [
        createFakePlayer({ connectCode: teammate1Code, teamId: 0 }),
        createFakePlayer({ connectCode: "ELSE#1", teamId: 0 }),
        createFakePlayer({ connectCode: teammate2Code, teamId: 1 }),
        createFakePlayer({ connectCode: "ELSE#2", teamId: 1 }),
      ],
    });
    assertShouldFilter(connectCodesOnTeamFilter);
  });

  it("should fail when not both players are playing", function () {
    createMockGetSettings(mockGame, {
      isTeams: true,
      players: [
        createFakePlayer({ connectCode: teammate1Code, teamId: 0 }),
        createFakePlayer({ connectCode: "ELSE#1", teamId: 0 }),
        createFakePlayer({ connectCode: "ELSE#2", teamId: 1 }),
        createFakePlayer({ connectCode: "ELSE#3", teamId: 1 }),
      ],
    });
    assertShouldFilter(connectCodesOnTeamFilter);
  });
});

describe("CharactersOnTeamFilter", function () {
  it("should fail if it is not a teams game", function () {
    const charactersOnTeamFilter = new CharactersOnTeamFilter(
      Character.BOWSER,
      Character.DONKEY_KONG
    );
    createMockGetSettings(mockGame, {
      isTeams: false,
      players: [
        createFakePlayer({
          characterId: Character.BOWSER,
          teamId: 0,
        }),
        createFakePlayer({
          characterId: Character.DONKEY_KONG,
          teamId: 0,
        }),
      ],
    });
    assertShouldFilter(charactersOnTeamFilter);
  });

  describe("when players are on the same team", function () {
    it("should pass when the characters are different", function () {
      const differentCharactersOnTeamFilter = new CharactersOnTeamFilter(
        Character.BOWSER,
        Character.DONKEY_KONG
      );
      createMockGetSettings(mockGame, {
        isTeams: true,
        players: [
          createFakePlayer({
            characterId: Character.BOWSER,
            teamId: 0,
          }),
          createFakePlayer({
            characterId: Character.DONKEY_KONG,
            teamId: 0,
          }),
          createFakePlayer({
            characterId: Character.CRAZY_HAND,
            teamId: 1,
          }),
          createFakePlayer({
            characterId: Character.WIREFRAME_FEMALE,
            teamId: 1,
          }),
        ],
      });
      assertShouldMatch(differentCharactersOnTeamFilter);
    });

    it("even if both characters are the same", function () {
      const sameCharactersOnTeamFilter = new CharactersOnTeamFilter(
        Character.BOWSER,
        Character.BOWSER
      );
      createMockGetSettings(mockGame, {
        isTeams: true,
        players: [
          createFakePlayer({
            characterId: Character.BOWSER,
            teamId: 0,
          }),
          createFakePlayer({ characterId: Character.BOWSER, teamId: 0 }),
          createFakePlayer({
            characterId: Character.WIREFRAME_MALE,
            teamId: 1,
          }),
          createFakePlayer({
            characterId: Character.WIREFRAME_FEMALE,
            teamId: 1,
          }),
        ],
      });
      assertShouldMatch(sameCharactersOnTeamFilter);
    });
  });

  it("should fail when the characters are on different teams", function () {
    const charactersOnTeamFilter = new CharactersOnTeamFilter(
      Character.BOWSER,
      Character.DONKEY_KONG
    );
    createMockGetSettings(mockGame, {
      isTeams: true,
      players: [
        createFakePlayer({
          characterId: Character.BOWSER,
          teamId: 0,
        }),
        createFakePlayer({ characterId: Character.CRAZY_HAND, teamId: 0 }),
        createFakePlayer({
          characterId: Character.DONKEY_KONG,
          teamId: 1,
        }),
        createFakePlayer({
          characterId: Character.WIREFRAME_FEMALE,
          teamId: 1,
        }),
      ],
    });
    assertShouldFilter(charactersOnTeamFilter);
  });

  it("should fail when not both players are playing", function () {
    const charactersOnTeamFilter = new CharactersOnTeamFilter(
      Character.BOWSER,
      Character.DONKEY_KONG
    );
    createMockGetSettings(mockGame, {
      isTeams: true,
      players: [
        createFakePlayer({
          characterId: Character.MASTER_HAND,
          teamId: 0,
        }),
        createFakePlayer({ characterId: Character.CRAZY_HAND, teamId: 0 }),
        createFakePlayer({
          characterId: Character.WIREFRAME_MALE,
          teamId: 1,
        }),
        createFakePlayer({
          characterId: Character.WIREFRAME_FEMALE,
          teamId: 1,
        }),
      ],
    });
    assertShouldFilter(charactersOnTeamFilter);
  });
});

describe("StageFilter", function () {
  const stageFilter = new StageFilter(Stage.CORNERIA, Stage.HOME_RUN_CONTEST);
  it("should pass if the stage is provided", function () {
    withGameSettings({ stageId: Stage.CORNERIA });
    assertShouldMatch(stageFilter);
  });

  it("should fail if the stage is not provided", function () {
    withGameSettings({ stageId: Stage.FOURSIDE });
    assertShouldFilter(stageFilter);
  });
});
