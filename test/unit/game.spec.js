/* eslint-disable no-unused-expressions, no-underscore-dangle,
  prefer-arrow-callback */


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
      let game = new Game({ player1: '608699f277640568c18b2b36',
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
  });
});
