/* eslint-disable react/prop-types */

import React from 'react';
// import Nav from './Nav';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.update = this.update.bind(this);
  }

  update() {
    const name = this.refs.player.value;
    console.log('Name???', name);
    const url = '//localhost:3333/players/';
    // call database
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    }).then((response) => {
      response.text().then((responseText) => {
        if (JSON.parse(responseText).player.name) {
          this.updatePlayerList();
          this.refs.player.value = '';
        } else {
          console.log('ASDJL:KJASLKDJA:SLDKJ');
        }
      });
    });
  }
  updatePlayerList() {
    const name = this.refs.player.value;
    console.log('Name???', name);
    const url = '//localhost:3333/players/';
    // call database
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    }).then((response) => {
      response.text().then((responseText) => {
        const responseBack = JSON.parse(responseText).players;
        if (responseBack) {
          console.log(responseBack);
        } else {
          //
        }
      });
    });
  }

  // http://localhost:3333/players/

  render() {
    return (
      <div>
        <h1>Checkers - Create Player </h1>
        <div className="form-group">
          <label>Player Name</label>
          <input className="form-control" ref="player" type="text" />
        </div>
        <button className="btn btn-primary" onClick={this.update}>Create</button>
      </div>);
  }
}

export default Player;
