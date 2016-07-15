/* eslint-disable new-cap */
/* eslint-disable array-callback-return */

import express from 'express';
import Player from '../models/player';
const router = module.exports = express.Router();

// index
router.post('/', (req, res) => {
  console.log('got here! ', req.body);
  const player = new Player(req.body);
  player.save({ new: true }, () => {
    console.log('and here!');
    res.send({ player });
  });
});

router.get('/', (req, res) => {
  Player.find((err, players) => {
    res.send({ players });
  });
});
