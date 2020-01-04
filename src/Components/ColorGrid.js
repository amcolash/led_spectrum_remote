import React from 'react';
import { Component } from 'react';
import { rgbFromHsv } from '../Util/hsv';
import './ColorGrid.css';

export class ColorGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { saturation: 255, syncSaturation: true };
  }

  componentDidUpdate(prevProps, prevState) {
    // A bit messy, but the saturation state should be updated when in the "synchronized mode" and when it gets turned on
    if (
      (this.props.saturation !== prevProps.saturation && this.state.syncSaturation) ||
      (!prevState.syncSaturation && this.state.syncSaturation)
    ) {
      this.setState({ saturation: this.props.saturation });
    }
  }

  render() {
    const { dimensions, size, margin, hue, disabled } = this.props;
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
            outline: hue === h ? '1px solid white' : '1px solid transparent',
            pointerEvents: disabled ? 'none' : undefined,
            filter: disabled ? 'grayscale(90%) blur(1px)' : undefined,
            cursor: disabled ? undefined : 'pointer'
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
            transition: 'all 0.2s',
            backgroundColor: disabled ? '#2a2a2a' : 'black',
            display: 'flex',
            flexWrap: 'wrap',
            width,
            padding: margin,
            textShadow: '1px 1px black'
          }}
        >
          {items}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ paddingRight: 4 }}>Saturation</label>
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
            <span style={{ paddingLeft: 8 }}>{this.state.saturation}</span>
          </div>

          <div style={{ display: 'flex' }}>
            <input
              id="saturationCheck"
              type="checkbox"
              checked={this.state.syncSaturation}
              onClick={e => {
                this.setState({ syncSaturation: !this.state.syncSaturation });
                e.stopPropagation();
              }}
              onChange={e => {
                this.setState({ syncSaturation: !this.state.syncSaturation });
                e.stopPropagation();
              }}
            />
            <label htmlFor="saturationCheck">Sync Saturation</label>
          </div>
        </div>
      </div>
    );
  }
}
