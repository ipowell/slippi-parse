import { Character, ComboType, SlippiGame } from "@slippi/slippi-js";

export abstract class ComboFilter {
  abstract apply(combo: ComboType, game: SlippiGame): boolean;

  and(...filters: ComboFilter[]): AndFilter {
    return new AndFilter(this, ...filters);
  }

  or(...filters: ComboFilter[]): OrFilter {
    return new OrFilter(this, ...filters);
  }
}

export class AndFilter extends ComboFilter {
  filters: ComboFilter[];

  constructor(...filters: ComboFilter[]) {
    super();
    this.filters = filters;
  }

  apply(combo: ComboType, game: SlippiGame): boolean {
    return this.filters.every((filter) => filter.apply(combo, game));
  }
}

export class OrFilter extends ComboFilter {
  filters: ComboFilter[];

  constructor(...filters: ComboFilter[]) {
    super();
    this.filters = filters;
  }

  apply(combo: ComboType, game: SlippiGame): boolean {
    return this.filters.some((filter) => filter.apply(combo, game));
  }
}

export class DamageFilter extends ComboFilter {
  threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  apply(combo: ComboType, _game: SlippiGame): boolean {
    return combo.endPercent - combo.startPercent >= this.threshold;
  }
}

export class NumberOfHitsFilter extends ComboFilter {
  threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  apply(combo: ComboType, _game: SlippiGame): boolean {
    return combo.moves.length >= this.threshold;
  }
}

export class KilledFilter extends ComboFilter {
  didKill: boolean;

  constructor(didKill?: boolean) {
    super();
    this.didKill = didKill ?? true;
  }

  apply(combo: ComboType, _game: SlippiGame): boolean {
    return combo.didKill === this.didKill;
  }
}

export class ComboPerformerCharacterFilter extends ComboFilter {
  character: Character;

  constructor(character: Character) {
    super();
    this.character = character;
  }

  apply(combo: ComboType, game: SlippiGame): boolean {
    return (
      game.getSettings().players[combo.playerIndex].characterId ===
      this.character
    );
  }
}

export class ComboPerformerConnectCodeFilter extends ComboFilter {
  connectCode: string;

  constructor(connectCode: string) {
    super();
    this.connectCode = connectCode;
  }

  apply(combo: ComboType, game: SlippiGame): boolean {
    return (
      game.getSettings().players[combo.playerIndex].connectCode ===
      this.connectCode
    );
  }
}
