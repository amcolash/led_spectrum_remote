import React from 'react';
import { Component } from 'react';
import { rgbFromHsv } from '../Util/hsv';
import './ColorGrid.css';

export class ColorGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { saturation: 255 };
  }

  componentDidUpdate(prevProps) {
    if (this.props.saturation !== prevProps.saturation) {
      this.setState({ saturation: this.props.saturation });
    }
  }

  render() {
    const { dimensions, size, margin, hue } = this.props;
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
            borderRadius: size / 12,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.2s',
            outline: hue === h ? '1px solid white' : '1px solid transparent'
          }}
          key={i}
          onClick={e => {
            this.props.onClick(h, Number(this.state.saturation));
            e.stopPropagation();
          }}
        >
          <div style={{ opacity: 0, transition: 'all 0.2s' }}>{h}</div>
        </div>
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
            padding: margin,
            textShadow: '1px 1px black'
          }}
        >
          {items}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', paddingTop: margin * 2 }}>
          <label style={{ paddingRight: 5 }}>Saturation</label>
          <input
            type="range"
            min="0"
            max="255"
            value={this.state.saturation}
            onClick={e => {
              this.setState({ saturation: e.target.value });
              e.stopPropagation();
            }}
            onChange={e => {
              this.setState({ saturation: e.target.value });
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    );
  }
}
