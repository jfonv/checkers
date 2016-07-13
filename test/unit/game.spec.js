/* eslint-disable no-unused-expressions, no-underscore-dangle  */


const expect = require('chai').expect;
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
        game.fillPieces();
        expect(err).to.be.undefined;
        expect(game.completed).to.be.false;
        expect(game.player1).to.equal(player1._id);
        expect(game.pieces.length).to.equal(24);
        expect(game.pieces[0].name).to.equal('p1');
        done();
      });
    });
  });
});
