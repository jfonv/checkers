/* eslint-disable react/sort-comp, react/prop-types, no-underscore-dangle */

import React from 'react';

class BlankTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { piece: this.props.piece };
  }

  render() {
    return (
      <td className={this.props.className} />);
  }
}

export default BlankTile;
