/* eslint-disable react/sort-comp, no-underscore-dangle */

import React from 'react';
import Game from './Game';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game: {}, playerList: [], p1: null, p2: null, started: false };
    this.update = this.update.bind(this);
    this.setP1 = this.setP1.bind(this);
    this.setP2 = this.setP2.bind(this);
    this.updatePlayerList = this.updatePlayerList.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    this.updatePlayerList();
  }

  updatePlayerList() {
    fetch('//localhost:3333/players/')
      .then(r => r.json())
      .then(j => {
        const playerList = j.players;
        this.setState({ playerList });
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
      const pArr = this.state.playerList;
      pArr.push(j);
      this.setState({ playerList: pArr });
      this.refs.player.value = '';
    });
  }

  setP1() {
    console.log('clicked!', this.refs.player1.value);
    this.setState({ p1: this.refs.player1.value });
  }
  setP2() {
    this.setState({ p2: this.refs.player2.value });
  }
  // http://localhost:3333/players/

  startGame() {
    if (this.refs.player1.value !== this.refs.player2.value) {
      this.setP1();
      this.setP2();
      this.setState({ started: true });
    }
  }

  render() {
    const playerList = this.state.playerList;
    let button = (
      <button
        className="btn btn-primary"
        onClick={this.startGame}
      >
        Start Game!
      </button>);
    const game = this.state.started ?
                  (<Game
                    player1={this.state.p1}
                    player2={this.state.p2}
                    game={(this.state.game) ?
                          (this.state.game) : 'joe'}
                  />) : '';
    console.log('logloglog: ', playerList);
    if (this.refs.player1 && this.refs.player1.value === this.refs.player2.value) {
      button = '';
    }
    return (
      <div>
        <h1>Checkers - Play Game </h1>
        <div>
          <label>Player One</label>
          <select type="dropdown" ref="player1" onChange={this.setP1}>
            {playerList.map((t, i) => <option value={t._id} key={i}>{t.name}</option>)}
          </select>
          <label>Player Two</label>
          <select type="dropdown" ref="player2" onChange={this.setP2}>
            {playerList.map((t, i) => <option value={t._id} key={i}>{t.name}</option>)}
          </select>
          {button}
        </div>
        <div>
          {game}
        </div>
      </div>);
  }
}

export default Home;
