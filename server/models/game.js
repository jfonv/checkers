/* eslint-disable no-unused-expressions, no-underscore-dangle,
   no-param-reassign, prefer-template */


import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  pieces: [{
    king: { type: Boolean, default: false },
    player: { type: Number, min: 1, max: 2 },
    position: { type: Number, min: 1, max: 32 },
    name: String,
  }],
  completed: { type: Boolean, default: false },
  player1: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  player2: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.fillPieces = function () {
  this.pieces = new Array(24).fill({});
  this.pieces = this.pieces.map((v, i) => {
    const newV = v;
    newV.name = 'p' + (i + 1);
    newV.player = (i < 12) ? 1 : 2;
    newV.position = (i < 12) ? (i + 1) : (i + 9);
    return newV;
  });
};

schema.methods.move = function (currPlayer, piece, newPos, cb) {
  console.log('got here mom! line 33', this);
  this.pieces.find(n => n.name === piece).position = newPos;
  return cb(null, this);
};

module.exports = mongoose.model('Game', schema);
