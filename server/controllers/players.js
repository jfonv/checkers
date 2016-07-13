/* eslint-disable new-cap */

import express from 'express';
import Player from '../models/player';
const router = module.exports = express.Router();

// index
router.post('/', (req, res) => {
  const player = new Player(req.body);
  player.save({ new: true }, () => {
    res.send({ player });
  });
});
