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
    it('should move a player in the right direction for said player', sinon.test(function (done) {
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
    it('should not move a player in the wrong direction', sinon.test(function (done) {
      const game = new Game({ player1: '608699f277640568c18b2b36',
                              player2: '608699f277640568c18b2b37' });
      this.stub(game, 'save').yields(null, this);
      game.validate(() => {
        game.setupBoard();
        game.move('608699f277640568c18b2b36', 'p11', 228, err2 => {
          expect(err2).to.be.ok;
          expect(err2.message).to.equal('Error: Invalid Move');
          expect(game.pieces[10].position).to.equal(11);
          done();
        });
      });
    }));
  });
});
