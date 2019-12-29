import React from 'react';
import { Component } from 'react';
import './Bars.css';

export class Bars extends Component {
  constructor(props) {
    super(props);

    const heights = [];
    for (let i = 0; i < 16; i++) {
      heights.push(Math.random() * 60 + 20);
    }
    this.state = { heights };
  }

  render() {
    const bars = [];
    for (let i = 0; i < 16; i++) {
      bars.push(
        <div
          className="bar"
          style={{
            width: 18,
            height: this.state.heights[i],
            margin: 2,
            backgroundColor: this.props.barColors[i],
            outline: this.props.selected === i ? '1px solid white' : undefined
          }}
          key={i}
          onClick={() => this.props.onClick(i)}
        ></div>
      );
    }

    return <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>{bars}</div>;
  }
}
