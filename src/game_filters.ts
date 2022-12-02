import { Character, PlayerType, SlippiGame } from "@slippi/slippi-js";
// This file contains filters that are meant to filter at the game level.
// This should be limited to game settings or metadata. The goal is to
// prevent unnessecary parsing the file for combos.

// TODO: support ORs somehow

export abstract class GameFilter {
  abstract apply(game: SlippiGame): boolean;

  and(...filters: GameFilter[]): AndFilter {
    return new AndFilter(this, ...filters);
  }

  or(...filters: GameFilter[]): OrFilter {
    return new OrFilter(this, ...filters);
  }

  negate() {
    // can/should we do this?
  }
}

class AndFilter extends GameFilter {
  filters: GameFilter[];

  constructor(...filters: GameFilter[]) {
    super();
    this.filters = filters;
  }

  apply(game: SlippiGame): boolean {
    return this.filters.every((filter) => filter.apply(game));
  }
}

class OrFilter extends GameFilter {
  filters: GameFilter[];

  constructor(...filters: GameFilter[]) {
    super();
    this.filters = filters;
  }

  apply(game: SlippiGame): boolean {
    return this.filters.some((filter) => filter.apply(game));
  }
}

class GameConfig extends GameFilter {
  filters: GameFilter[];

  constructor() {
    super();
    this.filters = [];
  }

  add(...filters: GameFilter[]) {
    filters.push(...filters);
  }

  apply(game: SlippiGame): boolean {
    return this.filters.every((filter) => filter.apply(game));
  }
}

enum GameMode {
  Any,
  Singles,
  Teams,
}

class GameModeFilter extends GameFilter {
  mode: GameMode;
  constructor(mode: GameMode) {
    super();
    this.mode = mode;
  }

  apply(game: SlippiGame): boolean {
    return (
      this.mode == GameMode.Any ||
      (this.mode == GameMode.Singles && !game.getSettings().isTeams) ||
      (this.mode == GameMode.Teams && game.getSettings().isTeams)
    );
  }
}

class ConnectCodeFilter extends GameFilter {
  connectCode: string;

  constructor(connectCode: string) {
    super();
    this.connectCode = connectCode;
  }

  apply(game: SlippiGame): boolean {
    return game
      .getSettings()
      .players.some(
        (player: PlayerType) => player.connectCode == this.connectCode
      );
  }
}

class PlayerFilter extends GameFilter {
  character: number;
  tag: string;

  constructor(character: number, tag: string) {
    super();
    this.character = character;
    this.tag = tag;
  }

  apply(game: SlippiGame): boolean {
    throw new Error("Method not implemented.");
  }
}

class ConnectCodesOnTeamFilter extends GameFilter {
  code1: string;
  code2: string;

  constructor(code1: string, code2: string) {
    super();
  }

  apply(game: SlippiGame): boolean {
    if (!game.getSettings().isTeams) {
      return false;
    }
    const players = game.getSettings().players;
    const player1 = players.find((player) => player.connectCode == this.code1);
    const player2 = players.find((player) => player.connectCode == this.code2);
    return (
      player1 != undefined &&
      player2 != undefined &&
      player1.teamId == player2.teamId
    );
  }
}

class CharactersOnTeamFilter extends GameFilter {
  char1: Character;
  char2: Character;

  constructor(char1: Character, char2: Character) {
    super();
    this.char1 = char1;
    this.char2 = char2;
  }

  apply(game: SlippiGame): boolean {
    if (!game.getSettings().isTeams) {
      return false;
    }

    const char1Teams: number[] = [];
    const char2Teams: number[] = [];

    game.getSettings().players.forEach((player) => {
      if (player.characterId == this.char1.valueOf()) {
        char1Teams.push(player.teamId);
        if (char2Teams.includes(player.teamId)) {
          return true;
        }
      } else if (player.characterId == this.char2.valueOf()) {
        char2Teams.push(player.teamId);
        if (char1Teams.includes(player.teamId)) {
          return true;
        }
      }
    });
    return false;
  }
}

class StageFilter extends GameFilter {
  stages: number[];

  constructor(...stages: number[]) {
    super();
    this.stages = stages;
  }

  apply(game: SlippiGame): boolean {
    return this.stages.includes(game.getSettings().stageId);
  }
}
