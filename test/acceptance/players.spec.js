/* eslint-disable no-unused-expressions, no-underscore-dangle  */

const expect = require('chai').expect;
// const Game = require('../../dst/controllers/game');
const request = require('supertest');
const app = require('../../dst/server');
// const player = require('../../dst/models/player');

describe('Players', () => {
  describe('post /players', () => {
    it('should create a player', (done) => {
      const newPlayer = { name: 'joe' };
      request(app)
      .post('/players')
      .send(newPlayer)
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.player._id).to.be.ok;
        expect(rsp.body.player.name).to.equal('joe');
        done();
      });
    });
  });
});
