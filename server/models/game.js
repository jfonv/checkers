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
    console.log('got here yo40');
    cb(invalidMoveError, null);
  } else if (this.isCollision(newPos)) {
    console.log('got here yo43');
    cb(invalidMoveError, null);
  } else {
    const oldRow = Math.floor((currPiece.position - 1) / 4);
    const newRow = Math.floor((newPos - 1) / 4);
    // Basic move!
    if (currPiece &&
        (this.currPlayer1 ? this.player1 : this.player2).toString() === currPlayer &&
        this.currPlayer1 === (currPiece.player === 1) &&
        Math.abs(oldRow - newRow) === 1 &&
        !currPiece.king) {
      moveSucceed = this.moveOne(currPiece, newPos);
    // King basic move!
    } else if (currPiece &&
        (this.currPlayer1 ? this.player1 : this.player2).toString() === currPlayer &&
        this.currPlayer1 === (currPiece.player === 1) &&
        Math.abs(oldRow - newRow) === 1 &&
        currPiece.king) {
      moveSucceed = this.kingMoveOne(currPiece, newPos);
      console.log('got here 57, ', moveSucceed, piece);
    // Jump move!
    } else if (currPiece &&
        (this.currPlayer1 ? this.player1 : this.player2).toString() === currPlayer &&
        this.currPlayer1 === (currPiece.player === 1) &&
        Math.abs(oldRow - newRow) === 2 &&
        !currPiece.king) {
      const jumpMoveSucceed = this.moveJump(currPiece, newPos);
      if (jumpMoveSucceed) {
        moveSucceed = true;
        pieceRemoveIdx = jumpMoveSucceed.removeIdx;
      }
    // King jump move!
    } else if (currPiece &&
        (this.currPlayer1 ? this.player1 : this.player2).toString() === currPlayer &&
        this.currPlayer1 === (currPiece.player === 1) &&
        Math.abs(oldRow - newRow) === 2 &&
        currPiece.king) {
      const jumpMoveSucceed = this.kingMoveJump(currPiece, newPos);
      if (jumpMoveSucceed) {
        moveSucceed = true;
        pieceRemoveIdx = jumpMoveSucceed.removeIdx;
      }
    } else {
      // cb(invalidMoveError, null);
    }

    if (moveSucceed) {
      currPiece.position = newPos;
      if (pieceRemoveIdx > -1) {
        this.pieces.splice(pieceRemoveIdx, 1);
      }
      const isWinOrDraw = this.checkBoardForWin();
      const isDraw = (isWinOrDraw.draw);
      if (isWinOrDraw) {
        this.completed = true;
      } else {
        this.currPlayer1 = !this.currPlayer1;
      }
      if (this.isKinged(currPiece, newPos)) {
        currPiece.king = true;
      }
      this.save(() => {
        this.updatePlayers(isDraw, () => {
          cb(null, this);
        });
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
  const moves = [(currPiece.player % 2 === 1 ? 1 : -1) * (4 - (even ? 1 : 0)),
                 (currPiece.player % 2 === 1 ? 1 : -1) * (5 - (even ? 1 : 0))];
  console.log('vars: ');
  console.log('diff: ', diff);
  console.log('row: ', row);
  console.log('even: ', even);
  console.log('moves: ', moves);

  if (moves.find((v) => v === diff)) {
    return true;
  }

  return false;
};
schema.methods.kingMoveOne = function (currPiece, newPos) {
  const diff = newPos - currPiece.position;
  const row = Math.floor((currPiece.position - 1) / 4);
  const even = row % 2;
  const moves = [(4 - even),
                 (5 - even),
                   -1 * (3 + even),
                 -1 * (4 + even)];
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
schema.methods.isKinged = function (currPiece, newPos) {
  if ((newPos > 28 && currPiece.player === 1) ||
     (newPos < 5 && currPiece.player === 2)) {
    return true;
  }

  return false;
};

schema.methods.moveJump = function (currPiece, newPos) {
  const currPosition = currPiece.position;
  const diff = newPos - currPosition;
  const mathStuff = ((currPiece.position - 1) % 4);
  const rowEven = !(mathStuff % 2);
  let jumpedPos = 0;
  if (this.currPlayer1 && diff > 0) {
    jumpedPos =
      currPosition + (rowEven ? Math.ceil(diff / 2) : Math.floor(diff / 2));
  } else if (!this.currPlayer1 && diff < 0) {
    jumpedPos =
      currPosition + (rowEven ? Math.floor(diff / 2) : Math.ceil(diff / 2));
  } else {
    return false;
  }
  //
  // console.log('line 99: ', currPosition);
  // console.log('line 99: ', diff);
  // console.log('line 99: ', mathStuff);
  // console.log('line 99: ', rowEven);
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
schema.methods.kingMoveJump = function (currPiece, newPos) {
  const currPosition = currPiece.position;
  const diff = newPos - currPosition;
  const mathStuff = ((currPiece.position - 1) % 4);
  const rowEven = !(mathStuff % 2);
  let jumpedPos = 0;
  if (diff > 0) {
    jumpedPos =
      currPosition + (rowEven ? Math.ceil(diff / 2) : Math.floor(diff / 2));
  } else {
    jumpedPos =
      currPosition + (rowEven ? Math.floor(diff / 2) : Math.ceil(diff / 2));
  }

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
  console.log('diff: ', diff);
  console.log('even: ', rowEven);
  console.log('moves: ', moves);

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

schema.methods.checkBoardForWin = function () {
  const player1Left = this.pieces.filter(v => v.player === 1);
  const player2Left = this.pieces.filter(v => v.player === 2);

  if (player1Left && player2Left) {
    if (player1Left.length === 1 && player2Left.length === 1) {
      if ((player1Left[0].king && player2Left[0].king) ||
          (!player1Left[0].king && !player2Left[0].king)) {
        // DRAW
        return { draw: true };
      }
      if (player1Left[0].king) {
        this.currPlayer1 = true;
        return true;
      }
      this.currPlayer1 = false;
      return true;
    }
  }
  return false;
};

schema.methods.updatePlayers = function (isDraw, cb) {
  const winner = (this.currPlayer1 ? this.player1 : this.player2);
  const p1Win = (winner === this.player1);
  const p2Win = (winner === this.player2);
  if (isDraw) {
    this.model('Player').findById(this.player1, (err, player1) => {
      player1.draws += 1;
      this.model('Player').findById(this.player2, (err2, player2) => {
        player2.draws += 1;
        player1.save(() => {
          player2.save(() => {
            cb(null, this);
          });
        });
      });
    });
  } else {
    this.model('Player').findById(this.player1, (err, player1) => {
      console.log('line 304 - ', player1);
      if (p1Win) {
        player1.wins += 1;
      } else {
        player1.losses += 1;
      }
      this.model('Player').findById(this.player2, (err2, player2) => {
        if (p2Win) {
          player2.wins += 1;
        } else {
          player2.losses += 1;
        }
        player1.save(() => {
          player2.save(() => {
            cb(null, this);
          });
        });
      });
    });
  }
};

module.exports = mongoose.model('Game', schema);
