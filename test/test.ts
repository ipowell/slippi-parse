import { SlippiGame } from "@slippi/slippi-js";
import { AndFilter, GameFilter, OrFilter } from "../src/game_filters";
var assert = require("assert");

const game = new SlippiGame("");

class TrueFilter extends GameFilter {
  apply(game: SlippiGame): boolean {
    return true;
  }
}

class FalseFilter extends GameFilter {
  apply(game: SlippiGame): boolean {
    return false;
  }
}

const trueFilter = new TrueFilter();
const falseFilter = new FalseFilter();

describe("TrueFilter", function () {
  it("should return true with apply", function () {
    assert.equal(trueFilter.apply(game), true);
  });
});

describe("FalseFilter", function () {
  it("should return true with apply", function () {
    assert.equal(falseFilter.apply(game), false);
  });
});

describe("AndFilter", function () {
  it("should return true when all are true", function () {
    assert.equal(new AndFilter(trueFilter, trueFilter).apply(game), true);
  });

  it("should return false when some are false", function () {
    assert.equal(new AndFilter(trueFilter, falseFilter).apply(game), false);
  });

  it("should return false when all are false", function () {
    assert.equal(new AndFilter(falseFilter, falseFilter).apply(game), false);
  });
});

describe("OrFilter", function () {
  it("should return true when all are true", function () {
    assert.equal(new OrFilter(trueFilter, trueFilter).apply(game), true);
  });

  it("should return false when some are true", function () {
    assert.equal(new OrFilter(trueFilter, falseFilter).apply(game), true);
  });

  it("should return false when all are false", function () {
    assert.equal(new OrFilter(falseFilter, falseFilter).apply(game), false);
  });
});
