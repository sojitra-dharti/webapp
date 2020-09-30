var assert = require('assert');
var expect = require('chai').expect;
const getUser = require('../api/controllers/user-controller').getUser;
const { timeStamp } = require('console');

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

describe('Get User tests', () => {
  it('Get a user by username', () => {
    return getUser('octocat')
      .then(response => {
        //expect an object back
        expect(typeof response).to.equal('object');

        //Test result of name, company and location for the response
        expect(response.name).to.equal('The Octocat')
        expect(response.company).to.equal('@github')
        expect(response.location).to.equal('San Francisco')
      });
  });
});

