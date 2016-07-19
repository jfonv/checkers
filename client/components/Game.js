/* eslint-disable react/sort-comp, no-underscore-dangle, prefer-template */
/* eslint-disable react/prop-types, arrow-body-style */

import React from 'react';
import Tile from './Tile';
import BlankTile from './BlankTile';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: {}, positions: [[]], isMoving: false };
    this.fillPositions = this.fillPositions.bind(this);
    this.loadData = this.loadData.bind(this);
    this.moveFrom = this.moveFrom.bind(this);
    this.moveTo = this.moveTo.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  moveFrom(event) {
    const piece = event.currentTarget.getAttribute('data-name');
    this.setState({ isMoving: { piece } });
  }

  moveTo(event) {
    console.log('Going here!: ', event);
    if (this.state.isMoving) {
      const player = this.state.game.currPlayer1 ?
                     this.state.game.player1 :
                     this.state.game.player2;
      const piece = this.state.isMoving.piece;
      const newPos = event.currentTarget.getAttribute('data-pos');
      // console.log('pre-fetch', player, piece, newPos);
      console.log('pre-fetch', this.state.game);
      console.log('pre-fetch', player, piece, newPos);
      fetch(`//localhost:3333/games/${this.state.game._id}/move`,
      { method: 'put',
        body: JSON.stringify({ player, piece, newPos }),
        headers: { 'Content-Type': 'application/json' } })
      .then((r) => { return r.json(); })
      .then((data) => {
        if (data.game) {
          this.setState({ game: data.game, isMoving: false });
          this.fillPositions();
        } else {
          console.log('error happened!: ', data);
        }
      });
      this.setState({ isMoving: false });
    }
  }

  loadData() {
    const player1 = this.props.player1;
    const player2 = this.props.player2;
    fetch('//localhost:3333/games',
    { method: 'post',
      body: JSON.stringify({ player1, player2 }),
      headers: { 'Content-Type': 'application/json' } })
    .then((r) => { return r.json(); })
    .then((data) => {
      this.setState({ game: data.game });
      this.fillPositions();
    });
  }

  fillPositions() {
    const positions = new Array(8).fill(new Array(8).fill({}));
    const newPos = positions.map((v, i) => {
      let outerRetData = v.map((v2, j) => {
        const rowEven = (i % 2) === 0;
        const posEven = (j % 2) === 0;
        const position = (i * 4) + Math.floor(j / 2) + 1;

        if ((rowEven && posEven) || (!rowEven && !posEven)) {
          // blank space
          return <BlankTile className="blankSpace" />;
        }
        let piece = null;
        piece = this.state.game.pieces.find(p => p.position === position);
        return (
          <Tile
            className="position"
            piece={piece}
            move={piece ? this.moveFrom : this.moveTo}
            position={position}
          />);
      });
      return <tr>{outerRetData}</tr>;
    });

    this.setState({ positions: newPos });
  }

  findPiece() {

  }

  render() {
    // let closeDiv = '';
    return (
      <table>
        <tbody>
          {this.state.positions}
        </tbody>
      </table>);
  }
}

export default Game;
