/* eslint-disable new-cap */

import express from 'express';
import Game from '../models/game';
const router = module.exports = express.Router();

// index
router.post('/', (req, res) => {
  const game = new Game(req.body);
  game.setupBoard();
  game.save({ new: true }, () => {
    res.send({ game });
  });
});

router.put('/:id/move', (req, res) => {
  const gameId = req.params.id;
  const playerId = req.body.player;
  const piece = req.body.piece;
  const newPos = req.body.newPos;
  // console.log('got here mom! line 20: ', gameId);
  Game.findById(gameId, (err, game) => {
    game.move(playerId,
              piece,
              newPos,
              (err2, updatedGame) => {
                res.send({ game: updatedGame });
              });
  });
});
