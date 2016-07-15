/* eslint-disable react/sort-comp, no-underscore-dangle */

import React from 'react';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: {} };
    this.update = this.update.bind(this);
  }

  update() {
    const name = this.refs.player.value;
    const url = '//localhost:3333/players/';
    // call database
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    }).then(r => r.json())
    .then(j => {
      const pArr = this.state.playerList;
      pArr.push(j);
      this.setState({ playerList: pArr });
      this.refs.player.value = '';
    });
  }

  render() {
    return (
      <div>
        Game!!!!
      </div>);
  }
}

export default Game;
