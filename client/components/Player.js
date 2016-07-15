/* eslint-disable react/prop-types, no-restricted-syntax, no-debugger
   no-unused-vars */

import React from 'react';
// import Nav from './Nav';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [] };
    this.update = this.update.bind(this);
    this.updatePlayerList = this.updatePlayerList.bind(this);
  }

  componentDidMount() {
    this.updatePlayerList();
  }

  updatePlayerList() {
    fetch('//localhost:3333/players/')
      .then(r => r.json())
      .then(j => {
        const players = j.players;
        this.setState({ players });
      });
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
      const pArr = this.state.players;
      pArr.push(j);
      this.setState({ players: pArr });
      this.refs.player.value = '';
    });
  }

  // http://localhost:3333/players/

  render() {
    const playerList = this.state.players;
    console.log('logloglog: ', playerList);

    return (
      <div>
        <h1>Checkers - Create Player </h1>
        <div className="form-group">
          <label>Player Name</label>
          <input className="form-control" ref="player" type="text" />
        </div>
        <button className="btn btn-primary" onClick={this.update}>Create</button>
        <div>
          <ul>
            {playerList.map((t, i) => <li key={i}>{t.name}</li>)}
          </ul>
        </div>
      </div>);
  }
}

export default Player;
