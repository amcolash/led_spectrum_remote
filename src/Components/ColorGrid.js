import React from 'react';
import { Component } from 'react';

export class ColorGrid extends Component {
  render() {
    const items = [];

    for (var i = 0; i < 64; i++) {
      items.push(<div>A</div>);
    }

    return (
      <div style={{ backgroundColor: 'white', display: 'flex' }}>{items}</div>
    );
  }
}
