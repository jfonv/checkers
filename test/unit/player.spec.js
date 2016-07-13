/* eslint-disable no-unused-expressions  */

const expect = require('chai').expect;
const Player = require('../../dst/models/player');
// const player = require('../../dst/models/player');

describe('Player', () => {
  describe('constructor', () => {
    it('should create player', (done) => {
      const player = new Player({ name: 'Bob' });
      player.validate(err => {
        expect(err).to.be.undefined;
        expect(player.name).to.equal('Bob');
        expect(player.wins).to.equal(0);
        done();
      });
    });
  });
});
