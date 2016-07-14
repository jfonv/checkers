/* eslint-disable no-unused-expressions, no-underscore-dangle  */

const expect = require('chai').expect;
// const Game = require('../../dst/controllers/game');
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('Games', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/pop_players.sh`,
       { cwd: `${__dirname}/../scripts` }, () => {
         cp.execFile(`${__dirname}/../scripts/pop_games.sh`,
            { cwd: `${__dirname}/../scripts` }, () => {
              done();
            });
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
    it('should move a player 1 piece on the game board', (done) => {
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
        expect(rsp.body.game.currPlayer1).to.equal(false);
        expect(rsp.body.game.pieces[10].position).to.equal(15);
        done();
      });
    });
    it('should move a player 2 piece on the game board', (done) => {
      request(app)
      .put('/games/5786b12f8a1461dcd58dac22/move')
      .send({ player: '608699f277640568c18b2b36',
              piece: 'p11',
              newPos: 15,
            })
      .end(() => {
        request(app)
        .put('/games/5786b12f8a1461dcd58dac22/move')
        .send({ player: '608699f277640568c18b2b37',
                piece: 'p13',
                newPos: 17,
              })
        .end((err2, rsp2) => {
          expect(err2).to.be.null;
          expect(rsp2.status).to.equal(200);
          expect(rsp2.body.game._id).to.be.ok;
          expect(rsp2.body.game.currPlayer1).to.equal(true);
          expect(rsp2.body.game.pieces[12].position).to.equal(17);
          done();
        });
      });
    });
    it('should not move a player 1 piece on the game board', (done) => {
      request(app)
      .put('/games/5786b12f8a1461dcd58dac22/move')
      .send({ player: '608699f277640568c18b2b36',
              piece: 'p10',
              newPos: 6,
            })
      .end((err, rsp) => {
        expect(rsp.text).to.equal('Error: Invalid Move');
        expect(rsp.status).to.equal(400);
        done();
      });
    });
    it('should not move a player 2 piece on the game board', (done) => {
      request(app)
      .put('/games/5786b12f8a1461dcd58dac22/move')
      .send({ player: '608699f277640568c18b2b36',
              piece: 'p11',
              newPos: 15,
            })
      .end(() => {
        request(app)
        .put('/games/5786b12f8a1461dcd58dac22/move')
        .send({ player: '608699f277640568c18b2b37',
                piece: 'p13',
                newPos: 25,
              })
        .end((err2, rsp2) => {
          expect(rsp2.text).to.equal('Error: Invalid Move');
          expect(rsp2.status).to.equal(400);
          done();
        });
      });
    });
    it('should not move player piece outside of board', (done) => {
      request(app)
      .put('/games/5786b12f8a1461dcd58dac22/move')
      .send({ player: '608699f277640568c18b2b36',
              piece: 'p10',
              newPos: 0,
            })
      .end((err, rsp) => {
        // expect(err).to.be.ok;
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('Error: Invalid Move');
        done();
      });
    });
    it('should not move the player to new position if that position is occupied', (done) => {
      request(app)
      .put('/games/5786b12f8a1461dcd58dac22/move')
      .send({ player: '608699f277640568c18b2b36',
              piece: 'p9',
              newPos: 14,
            })
      .end(() => {
        request(app)
        .put('/games/5786b12f8a1461dcd58dac22/move')
        .send({ player: '608699f277640568c18b2b37',
                piece: 'p13',
                newPos: 17,
              })
        .end((err1, rsp1) => {
          request(app)
          .put('/games/5786b12f8a1461dcd58dac22/move')
          .send({ player: '608699f277640568c18b2b36',
                  piece: 'p9',
                  newPos: 17,
                })
          .end((err, rsp) => {
            expect(rsp.text).to.equal('Error: Invalid Move');
            expect(rsp.status).to.equal(400);
            expect(rsp.body.game).to.be.undefined;
            expect(rsp1.body.game.pieces[8].position).to.equal(14);
            done();
          });
        });
      });
    });
  });
});
