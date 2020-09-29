var assert = require('assert');
var expect = require('chai').expect;

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('length of array', function () {
  describe('#length()', function () {
    it('should return length of array', function () {
     expect([1, 2, 3]).to.have.length.of.at.least(3);
    });
  });
});