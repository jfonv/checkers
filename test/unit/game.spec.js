/* eslint-disable no-unused-expressions, no-underscore-dangle,
  prefer-arrow-callback, no-param-reassign */


const expect = require('chai').expect;
const sinon = require('sinon');
const Game = require('../../dst/models/game');
const Player = require('../../dst/models/player');
// const cp = require('child_process');

describe('Game', () => {
  // beforeEach((done) => {
  //   cp.execFile(`${__dirname}/../scripts/pop_players.sh`,
  //      { cwd: `${__dirname}/../scripts` }, () => {
  //        done();
  //      });
  // });
  describe('constructor', () => {
    it('should create a game with two players', (done) => {
      const player1 = new Player({ name: 'Jayam' });
      const player2 = new Player({ name: 'Joe' });
      const game = new Game({ player1: player1._id,
                              player2: player2._id });
      game.validate(err => {
        game.setupBoard();
        expect(err).to.be.undefined;
        expect(game.completed).to.be.false;
        expect(game.player1).to.equal(player1._id);
        expect(game.pieces.length).to.equal(24);
        expect(game.pieces[0].name).to.equal('p1');
        done();
      });
    });
  });
  describe('move', () => {
    it('should move player 1 in the right direction for said player', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.move('608699f277640568c18b2b36', 'p11', 15, err2 => {
          expect(err2).to.be.null;
          expect(game.pieces[10].position).to.equal(15);
          done();
        });
      });
    }));
    it('should not move player1 in the wrong direction', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.move('608699f277640568c18b2b36', 'p11', 8, err2 => {
          expect(err2).to.be.ok;
          expect(err2.message).to.equal('Error: Invalid Move');
          expect(game.pieces[10].position).to.equal(11);
          done();
        });
      });
    }));
    it('should move player 2 in the right direction for said player', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.currPlayer1 = false;
        game.move('608699f277640568c18b2b37', 'p13', 17, err2 => {
          expect(err2).to.be.null;
          expect(game.pieces[12].position).to.equal(17);
          done();
        });
      });
    }));
    it('should not move player2 in the wrong direction', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.currPlayer1 = false;
        game.move('608699f277640568c18b2b37', 'p13', 25, err2 => {
          expect(err2).to.be.ok;
          expect(err2.message).to.equal('Error: Invalid Move');
          expect(game.pieces[12].position).to.equal(21);
          done();
        });
      });
    }));
    it('should not move player 1 onto another piece', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.move('608699f277640568c18b2b36', 'p9', 14, (err1, updateGame1) => {
          updateGame1.move('608699f277640568c18b2b37', 'p13', 17, (err2, updateGame2) => {
            updateGame2.move('608699f277640568c18b2b36', 'p9', 17, (err3) => {
              expect(err3).to.be.ok;
              expect(err3.message).to.equal('Error: Invalid Move');
              expect(updateGame2.pieces[8].position).to.equal(14);
              expect(updateGame2.pieces[12].position).to.equal(17);
              done();
            });
          });
        });
      });
    }));
    it('should allow player 1 to jump player 2', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.move('608699f277640568c18b2b36', 'p9', 14, (err1, updateGame1) => {
          updateGame1.move('608699f277640568c18b2b37', 'p13', 17, (err2, updateGame2) => {
            updateGame2.move('608699f277640568c18b2b36', 'p9', 21, (err3, gameNew) => {
              expect(err3).to.be.null;
              expect(gameNew.pieces[8].position).to.equal(21);
              expect(gameNew.pieces[12].position).to.equal(22);
              done();
            });
          });
        });
      });
    }));
    it('should now allow player 1 to jump player 1', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.move('608699f277640568c18b2b36', 'p11', 15, (err1, updateGame1) => {
          updateGame1.move('608699f277640568c18b2b37', 'p13', 17, (err2, updateGame2) => {
            updateGame2.move('608699f277640568c18b2b36', 'p4', 11, (err3) => {
              expect(err3).to.be.ok;
              expect(err3.message).to.equal('Error: Invalid Move');
              expect(updateGame2.pieces[3].position).to.equal(4);
              done();
            });
          });
        });
      });
    }));
    it('should not allow player 2 to jump backwards over player 1', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.move('608699f277640568c18b2b36', 'p11', 15, (err1, updateGame1) => {
          updateGame1.pieces[13].position = 11;
          updateGame1.move('608699f277640568c18b2b37', 'p14', 18, (err2, newGame) => {
            expect(err2).to.be.ok;
            expect(err2.message).to.equal('Error: Invalid Move');
            expect(newGame).to.be.null;
            done();
          });
        });
      });
    }));
    it('should allow a kinged player 2 to jump backwards over player 1',
            sinon.test(function (done) {
              const game = new Game({ player1: '608699f277640568c18b2b36',
                                      player2: '608699f277640568c18b2b37' });
              this.stub(game, 'save').yields(null, this);
              game.validate(() => {
                game.setupBoard();
                game.move('608699f277640568c18b2b36', 'p11', 15, (err1, updateGame1) => {
                  updateGame1.pieces[13].position = 11;
                  updateGame1.pieces[13].king = true;
                  updateGame1.move('608699f277640568c18b2b37', 'p14', 18, (err2, newGame) => {
                    expect(err2).to.be.null;
                    expect(newGame.pieces[12].position).to.equal(18);
                    expect(newGame.pieces[10].position).to.equal(12);
                    done();
                  });
                });
              });
            }));
    it('should allow player 1 win', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.pieces.splice(0, 5);
        game.pieces.splice(1, 17);
        game.pieces[0].king = true;
        game.move('608699f277640568c18b2b36', 'p6', 9, (err3, gameNew) => {
          expect(err3).to.be.null;
          // expect(err3.message).to.equal('Error: Invalid Move');
          expect(gameNew.completed).to.equal(true);
          expect(gameNew.currPlayer1).to.equal(true);
          done();
        });
      });
    }));
    it('should allow player 1 to king p1', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.pieces.splice(2, 10);
        game.pieces.splice(4, 10);
        game.pieces[0].position = 27;
        game.move('608699f277640568c18b2b36', 'p1', 31, (err3, gameNew) => {
          expect(err3).to.be.null;
          expect(gameNew.pieces[0].king).to.equal(true);
          done();
        });
      });
    }));
  });
});
