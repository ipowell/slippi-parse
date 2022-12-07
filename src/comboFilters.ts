import { ComboType } from "@slippi/slippi-js";

export abstract class ComboFilter {
  abstract apply(combo: ComboType): boolean;

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

  apply(combo: ComboType): boolean {
    return this.filters.every((filter) => filter.apply(combo));
  }
}

export class OrFilter extends ComboFilter {
  filters: ComboFilter[];

  constructor(...filters: ComboFilter[]) {
    super();
    this.filters = filters;
  }

  apply(combo: ComboType): boolean {
    return this.filters.some((filter) => filter.apply(combo));
  }
}

export class DamageFilter extends ComboFilter {
  threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  apply(combo: ComboType): boolean {
    return combo.endPercent - combo.startPercent >= this.threshold;
  }
}

export class NumberOfHitsFilter extends ComboFilter {
  threshold: number;

  constructor(threshold: number) {
    super();
    this.threshold = threshold;
  }

  apply(combo: ComboType): boolean {
    return combo.moves.length >= this.threshold;
  }
}

export class KilledFilter extends ComboFilter {
  didKill: boolean;

  constructor(didKill?: boolean) {
    super();
    this.didKill = didKill ?? true;
  }

  apply(combo: ComboType): boolean {
    return combo.didKill === this.didKill;
  }
}
