/* eslint-disable no-unused-expressions, no-underscore-dangle,
   no-param-reassign, prefer-template, no-undef, no-unused-vars */


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
  currPlayer1: { type: Boolean, default: true },
});

schema.methods.setupBoard = function () {
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
  const invalidMoveError = new Error('Error: Invalid Move');
  const currPiece = this.pieces.find(n => n.name === piece);
  let moveSucceed = false;
  let pieceRemoveIdx = -1;
  if (this.isOutOfBounds(currPiece, newPos)) {
    cb(invalidMoveError, null);
  } else if (this.isCollision(newPos)) {
    cb(invalidMoveError, null);
  } else {
    const oldRow = Math.floor((currPiece.position - 1) / 4);
    const newRow = Math.floor((newPos - 1) / 4);
    if (currPiece &&
        (this.currPlayer1 ? this.player1 : this.player2).toString() === currPlayer &&
        this.currPlayer1 === (currPiece.player === 1) &&
        Math.abs(oldRow - newRow) === 1 &&
        !currPiece.king) {
      moveSucceed = this.moveOne(currPiece, newPos);
    } else if (currPiece &&
        (this.currPlayer1 ? this.player1 : this.player2).toString() === currPlayer &&
        this.currPlayer1 === (currPiece.player === 1) &&
        Math.abs(oldRow - newRow) === 2 &&
        !currPiece.king) {
      const jumpMoveSucceed = this.moveJump(currPiece, newPos);
      if (jumpMoveSucceed) {
        moveSucceed = true;
        console.log('in array: ', jumpMoveSucceed.removeIdx);
        pieceRemoveIdx = jumpMoveSucceed.removeIdx;
      }
    } else {
      // console.log('line 49: ', this.currPlayer1);
      // console.log('line 49: ', currPlayer);
      // console.log('line 49: ', (this.currPlayer1 ? this.player1 : this.player2).toString());
      // console.log('line 49: ', currPlayer);
      // console.log('line 49: ', newPos);
    }

    if (moveSucceed) {
      this.currPlayer1 = !this.currPlayer1;
      currPiece.position = newPos;
      if (pieceRemoveIdx > -1) {
        // console.log('in array: ', this.pieces);
        this.pieces.splice(pieceRemoveIdx, 1);
        // console.log('out array: ', this.pieces);
      }
      this.save(() => {
        cb(null, this);
      });
    } else {
      cb(invalidMoveError, null);
    }
  }
};

schema.methods.moveOne = function (currPiece, newPos) {
  const diff = newPos - currPiece.position;
  const row = Math.floor((currPiece.position - 1) / 4);
  const even = row % 2;
  const moves = [(currPiece.player % 2 === 1 ? 1 : -1) * (4 - even),
                 (currPiece.player % 2 === 1 ? 1 : -1) * (5 - even)];
  // console.log('vars: ');
  // console.log('diff: ', diff);
  // console.log('row: ', row);
  // console.log('even: ', even);
  // console.log('moves: ', moves);

  if (moves.find((v) => v === diff)) {
    return true;
  }

  return false;
};

schema.methods.moveJump = function (currPiece, newPos) {
  const currPosition = currPiece.position;
  const diff = newPos - currPosition;
  const rowEven = !(((currPiece.position - 1) / 4) % 2);
  const jumpedPos = currPosition + (rowEven ? Math.ceil(diff / 2) : Math.floor(diff / 2));
  // console.log('line 99: ', currPosition);
  // console.log('line 99: ', diff);
  // console.log('line 99: ', jumpedPos);
  // console.log('line 99: ', this.isCollision(jumpedPos));

  if (!this.isCollision(jumpedPos)) {
    return false;
  }
  const playerAtJump = this.pieces.find((v, i) => {
    if (v.position === jumpedPos) {
      v.index = i;
      return true;
    }
    return false;
  });

  if (playerAtJump.player === currPiece.player) {
    return false;
  }

  return { success: true, removeIdx: playerAtJump.index };
};

schema.methods.isOutOfBounds = function (currPiece, newPos) {
  if (newPos > 32 || newPos < 1) {
    return true;
  }

  const currPosMod = currPiece.position % 4;
  const diff = newPos - currPiece.position;
  const rowEven = !(((currPiece.position - 1) / 4) % 2);
  const moves = [];
  // console.log('diff: ', diff);
  // console.log('even: ', rowEven);
  // console.log('moves: ', moves);

  if ((currPosMod === 0 && rowEven) ||
      (currPosMod === 1 && !rowEven)) {
    if (diff !== -4 && diff !== 4) {
      if ((currPosMod === 0 && ((diff === -9) || (diff === 7))) ||
          (currPosMod === 1 && ((diff === 9) || (diff === -7)))) {
        return false;
      }
      return true;
    }
  }

  return false;
};

schema.methods.isCollision = function (newPos) {
  if (this.pieces.find(v => v.position === newPos)) {
    return true;
  }
  return false;
};

module.exports = mongoose.model('Game', schema);
