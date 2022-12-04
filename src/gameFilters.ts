import { Character, PlayerType, SlippiGame, Stage } from "@slippi/slippi-js";
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

export class AndFilter extends GameFilter {
  filters: GameFilter[];

  constructor(...filters: GameFilter[]) {
    super();
    this.filters = filters;
  }

  apply(game: SlippiGame): boolean {
    return this.filters.every((filter) => filter.apply(game));
  }
}

export class OrFilter extends GameFilter {
  filters: GameFilter[];

  constructor(...filters: GameFilter[]) {
    super();
    this.filters = filters;
  }

  apply(game: SlippiGame): boolean {
    return this.filters.some((filter) => filter.apply(game));
  }
}

export enum GameMode {
  Any,
  Singles,
  Teams,
}

export class GameModeFilter extends GameFilter {
  mode: GameMode;
  constructor(mode: GameMode) {
    super();
    this.mode = mode;
  }

  apply(game: SlippiGame): boolean {
    return (
      this.mode === GameMode.Any ||
      (this.mode === GameMode.Singles && !game.getSettings().isTeams) ||
      (this.mode === GameMode.Teams && game.getSettings().isTeams)
    );
  }
}

export class ConnectCodeFilter extends GameFilter {
  connectCode: string;

  constructor(connectCode: string) {
    super();
    this.connectCode = connectCode;
  }

  apply(game: SlippiGame): boolean {
    return game
      .getSettings()
      .players.some(
        (player: PlayerType) => player.connectCode === this.connectCode
      );
  }
}

export class ConnectCodesOnTeamFilter extends GameFilter {
  code1: string;
  code2: string;

  constructor(code1: string, code2: string) {
    super();
    this.code1 = code1;
    this.code2 = code2;
  }

  apply(game: SlippiGame): boolean {
    if (!game.getSettings().isTeams) {
      return false;
    }
    const players = game.getSettings().players;
    const player1 = players.find((player) => player.connectCode === this.code1);
    const player2 = players.find((player) => player.connectCode === this.code2);

    return (
      player1 !== undefined &&
      player2 !== undefined &&
      player1.teamId === player2.teamId
    );
  }
}

export class CharactersOnTeamFilter extends GameFilter {
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
      if (player.characterId === this.char1) {
        char1Teams.push(player.teamId);
      }
      if (player.characterId === this.char2) {
        char2Teams.push(player.teamId);
      }
    });
    return char1Teams.some((teamId) => char2Teams.includes(teamId));
  }
}

export class StageFilter extends GameFilter {
  stages: Stage[];

  constructor(...stages: Stage[]) {
    super();
    this.stages = stages;
  }

  apply(game: SlippiGame): boolean {
    return this.stages.includes(game.getSettings().stageId);
  }
}

// export class GameConfig extends GameFilter {
//   filters: GameFilter[];

//   constructor() {
//     super();
//     this.filters = [];
//   }

//   add(...filters: GameFilter[]) {
//     filters.push(...filters);
//   }

//   apply(game: SlippiGame): boolean {
//     return this.filters.every((filter) => filter.apply(game));
//   }
// }
