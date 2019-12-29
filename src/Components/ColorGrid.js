import React from 'react';
import { Component } from 'react';
import { rgbFromHsv } from '../Util/hsv';
import './ColorGrid.css';

export class ColorGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { saturation: 255 };
  }

  render() {
    const { dimensions, size, margin } = this.props;
    const sizeSquared = dimensions * dimensions;
    const width = (size + margin * 2) * dimensions;

    const items = [];

    for (let i = 0; i < sizeSquared; i++) {
      const h = Math.floor((i / sizeSquared) * 255);
      const color = rgbFromHsv(h, this.state.saturation, 255);

      items.push(
        <div
          className="gridItem"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            margin,
            borderRadius: size / 12
          }}
          key={i}
          onClick={() => this.props.onClick(h, Number(this.state.saturation))}
        ></div>
      );
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: width + margin * 2 }}>
        <div
          style={{
            backgroundColor: 'black',
            display: 'flex',
            flexWrap: 'wrap',
            width,
            padding: margin
          }}
        >
          {items}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingTop: margin * 2 }}>
          <label style={{ color: 'white', paddingRight: 5 }}>Saturation</label>
          <input
            type="range"
            min="0"
            max="255"
            value={this.state.saturation}
            onChange={e => this.setState({ saturation: e.target.value })}
          />
        </div>
      </div>
    );
  }
}
