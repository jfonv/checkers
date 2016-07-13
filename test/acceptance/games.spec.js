/* eslint-disable no-unused-expressions, no-underscore-dangle  */

const expect = require('chai').expect;
// const Game = require('../../dst/controllers/game');
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('Game', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/pop_players.sh`,
       { cwd: `${__dirname}/../scripts` }, () => {
         done();
       });
  });

  describe('post /games', () => {
    it('should create a model for game with players', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '608699f277640568c18b2b36',
              player2: '608699f277640568c18b2b37' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.be.ok;
        expect(rsp.body.game.player1).to.equal('608699f277640568c18b2b36');
        expect(rsp.body.game.pieces[0].name).to.equal('p1');
        done();
      });
    });
  });
  describe('put /games', () => {
    it('should move a player piece on the game board', (done) => {
      request(app)
      .put('/games/5786b12f8a1461dcd58dac22/move')
      .send({ player: '608699f277640568c18b2b36',
              piece: 'p11',
              newPos: 15,
            })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.be.ok;
        expect(rsp.body.game.player1).to.equal('608699f277640568c18b2b36');
        expect(rsp.body.game.pieces[10].position).to.equal(15);
        done();
      });
    });
  });
});
