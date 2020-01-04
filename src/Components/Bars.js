import React from 'react';
import { Component } from 'react';
import './Bars.css';
import { rgbFromHsv } from '../Util/hsv';

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
            backgroundColor: rgbFromHsv(this.props.barHues[i], this.props.barSaturation[i], 255),
            outline: this.props.selected === i ? '1px solid white' : undefined,
            cursor: 'pointer'
          }}
          key={i}
          onClick={e => {
            this.props.onClick(i);
            e.stopPropagation();
          }}
        ></div>
      );
    }

    return <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>{bars}</div>;
  }
}
