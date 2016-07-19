/* eslint-disable react/sort-comp, react/prop-types, no-underscore-dangle */
/* eslint-disable prefer-template */

import React from 'react';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { piece: this.props.piece };
  }

  render() {
    let player = '';
    let name = '';
    let pieceClass = this.props.className;
    let piece = '';
    if (this.props.piece) {
      piece = (this.props.piece.king ? 'K' : 'O');
      player = this.props.piece.player;
      name = this.props.piece.name;
      pieceClass = pieceClass + ' ' + (player === 1 ? 'redPiece' : 'whitePiece');
    }

    return (
      <td
        className={pieceClass}
        data-name={`${name}`}
        data-pos={this.props.position}
        onClick={this.props.move}
      >
        {piece}
      </td>);
  }
}

export default Tile;
