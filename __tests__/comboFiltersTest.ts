jest.mock("@slippi/slippi-js");
import { Character, ComboType, MoveLandedType, Stage } from "@slippi/slippi-js";
import {
  AndFilter,
  ComboFilter,
  DamageFilter,
  KilledFilter,
  NumberOfHitsFilter,
  OrFilter,
} from "../src/comboFilters";
import { mockGame } from "./testUtils";

type ComboParams = {
  playerIndex?: number;
  moves?: MoveLandedType[];
  didKill?: boolean;
  lastHitBy?: number;
  startFrame?: number;
  startPercent?: number;
  currentPercent?: number;
  endPercent?: number;
};

function comboWithParams(params: ComboParams) {
  return {
    playerIndex: params.playerIndex ?? 0,
    moves: params.moves ?? [],
    didKill: params.didKill ?? false,
    lastHitBy: params.lastHitBy ?? 0,
    startFrame: params.startFrame ?? 0,
    startPercent: params.startPercent ?? 0,
    currentPercent: params.currentPercent ?? 60,
    endPercent: params.endPercent ?? 60,
  };
}

function assertShouldMatch(filter: ComboFilter, combo: ComboType) {
  expect(filter.apply(combo, mockGame)).toBe(true);
}

function assertShouldFilter(filter: ComboFilter, combo: ComboType) {
  expect(filter.apply(combo, mockGame)).toBe(false);
}

beforeEach(() => {
  jest.resetModules();
});

class TrueFilter extends ComboFilter {
  apply(_combo: ComboType): boolean {
    return true;
  }
}

class FalseFilter extends ComboFilter {
  apply(_combo: ComboType): boolean {
    return false;
  }
}

const trueFilter = new TrueFilter();
const falseFilter = new FalseFilter();

describe("ComboFilter", function () {
  const emptyCombo = comboWithParams({});
  describe("and", function () {
    assertShouldMatch(trueFilter.and(trueFilter), emptyCombo);
    assertShouldFilter(trueFilter.and(falseFilter), emptyCombo);
    assertShouldFilter(falseFilter.and(falseFilter), emptyCombo);
  });

  describe("or", function () {
    assertShouldMatch(trueFilter.or(trueFilter), emptyCombo);
    assertShouldMatch(trueFilter.or(falseFilter), emptyCombo);
    assertShouldFilter(falseFilter.or(falseFilter), emptyCombo);
  });
});

describe("AndFilter", function () {
  const emptyCombo = comboWithParams({});
  it("should return true when all are true", function () {
    assertShouldMatch(new AndFilter(trueFilter, trueFilter), emptyCombo);
  });

  it("should return false when some are false", function () {
    assertShouldFilter(new AndFilter(trueFilter, falseFilter), emptyCombo);
  });

  it("should return false when all are false", function () {
    assertShouldFilter(new AndFilter(falseFilter, falseFilter), emptyCombo);
  });
});

describe("OrFilter", function () {
  const emptyCombo = comboWithParams({});
  it("should return true when all are true", function () {
    assertShouldMatch(new OrFilter(trueFilter, trueFilter), emptyCombo);
  });

  it("should return false when some are true", function () {
    assertShouldMatch(new OrFilter(trueFilter, falseFilter), emptyCombo);
  });

  it("should return false when all are false", function () {
    assertShouldFilter(new OrFilter(falseFilter, falseFilter), emptyCombo);
  });
});

describe("DamageFilter", function () {
  const damageCombo = comboWithParams({ startPercent: 0, endPercent: 60 });

  it("should return true if the damage is exceeded", function () {
    assertShouldMatch(new DamageFilter(59), damageCombo);
  });

  it("should return true if the damage is the same", function () {
    assertShouldMatch(new DamageFilter(60), damageCombo);
  });

  it("should return true if the damage is not met", function () {
    assertShouldFilter(new DamageFilter(61), damageCombo);
  });
});

describe("NumberOfHitsFilter", function () {
  const moveLanded: MoveLandedType = {
    playerIndex: 0,
    frame: 0,
    moveId: 0,
    hitCount: 0,
    damage: 0,
  };
  const threeHitCombo = comboWithParams({
    moves: [moveLanded, moveLanded, moveLanded],
  });

  it("should return true if the number of hits is exceeded", function () {
    assertShouldMatch(new NumberOfHitsFilter(2), threeHitCombo);
  });

  it("should return true if the number of hits is the same", function () {
    assertShouldMatch(new NumberOfHitsFilter(3), threeHitCombo);
  });

  it("should return true if the number of hits is not met", function () {
    assertShouldFilter(new NumberOfHitsFilter(4), threeHitCombo);
  });
});

describe("KilledFilter", function () {
  const killingCombo = comboWithParams({ didKill: true });
  const fleshWoundingCombo = comboWithParams({ didKill: false });

  it("should return true if didKilled matches the input", function () {
    assertShouldMatch(new KilledFilter(true), killingCombo);
    assertShouldMatch(new KilledFilter(false), fleshWoundingCombo);
  });

  it("should return false if didKilled does not match the input", function () {
    assertShouldFilter(new KilledFilter(true), fleshWoundingCombo);
    assertShouldFilter(new KilledFilter(false), killingCombo);
  });

  it("should default to true", function () {
    assertShouldMatch(new KilledFilter(), killingCombo);
    assertShouldFilter(new KilledFilter(), fleshWoundingCombo);
  });
});

describe("ComboPerformerCharacterFilter", function () {
  // TODO: implement this
});

describe("ComboPerformerConnectCodeFilter", function () {
  // TODO: implement this
});
