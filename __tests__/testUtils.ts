import {
  Language,
  SlippiGame,
  GameMode,
  GameStartType,
  PlayerType,
} from "@slippi/slippi-js";
import { GameFilter } from "../src/gameFilters";

jest.mock("@slippi/slippi-js");

export const game = new SlippiGame("");
export const mockGame = jest.mocked(game);

export function withGameSettings(settings: SlippiSettings) {
  mockGame.getSettings.mockReturnValue(createFakeSettings(settings));
}

export function withGameFilepath(filepath: string) {
  mockGame.getFilePath.mockReturnValue(filepath);
}

export function withGameMetadata(params: {
  startAt?: string;
  playedOn?: string;
  lastFrame?: number;
  players?: any[];
  consoleNick?: string;
}) {
  mockGame.getMetadata.mockReturnValue({
    startAt: params.startAt ?? "",
    playedOn: params.playedOn ?? "",
    lastFrame: params.lastFrame ?? 48000,
    players: params.players ?? null,
    consoleNick: params.consoleNick ?? "",
  });
}

export type SlippiSettings = {
  isTeams?: any;
  players?: any;
  slpVersion?: any;
  isPAL?: any;
  stageId?: any;
  scene?: any;
  gameMode?: any;
  language?: any;
};

export function createFakeSettings(params: SlippiSettings) {
  return {
    slpVersion: params.slpVersion ?? "",
    isTeams: params.isTeams ?? false,
    isPAL: params.isPAL ?? false,
    stageId: params.stageId ?? 1,
    players: params.players ?? [],
    scene: params.scene ?? 1,
    gameMode: params.gameMode ?? GameMode.VS,
    language: params.language ?? Language.ENGLISH,
  };
}

// export function createMockGetSettings(params: SlippiSettings) {
// const returnValue = ;
// if (mode === MockMode.Once) {
// mockGame.getSettings.mockReturnValueOnce(returnValue);
// } else {
// mockGame.getSettings.mockReturnValue(returnValue);
// }
// }

export type FakePlayerParams = {
  connectCode?: any;
  playerIndex?: any;
  port?: any;
  characterId?: any;
  characterColor?: any;
  startStocks?: any;
  type?: any;
  teamId?: any;
  controllerFix?: any;
  nametag?: any;
  displayName?: any;
  userId?: any;
};

export function createFakePlayer(params: FakePlayerParams): PlayerType {
  return {
    playerIndex: params.playerIndex ?? 0,
    port: params.port ?? 1,
    characterId: params.characterId ?? 1,
    characterColor: params.characterColor ?? 1,
    startStocks: params.startStocks ?? 4,
    type: params.type ?? null,
    teamId: params.teamId ?? 0,
    controllerFix: params.controllerFix ?? "UCF",
    nametag: params.nametag ?? null,
    displayName: params.displayName ?? "displayName",
    connectCode: params.connectCode ?? "connectCode",
    userId: params.userId ?? "userId",
  };
}
