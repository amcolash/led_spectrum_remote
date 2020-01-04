import React from 'react';
import { Component } from 'react';
import './Text.css';
import { rgbFromHsv } from '../Util/hsv';

export class Text extends Component {
  constructor(props) {
    super(props);

    const d = new Date();
    this.state = { time: d.toLocaleTimeString(), date: d.toLocaleDateString() };
  }

  componentDidMount() {
    this.intervalID = setInterval(() => {
      const d = new Date();
      this.setState({ time: d.toLocaleTimeString(), date: d.toLocaleDateString() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    return (
      <div
        className="text"
        style={{
          color: rgbFromHsv(this.props.textHue, this.props.textSaturation, 255),
          fontSize: 16,
          width: '100%',
          outline: this.props.selected ? '1px solid white' : undefined,
          cursor: 'pointer'
        }}
        onClick={e => {
          this.props.onClick(e);
          e.stopPropagation();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-begin', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: 32 }}>{this.state.time}</div>
          <div style={{ paddingTop: 4 }}>Weather</div>
        </div>
        <div>{this.state.date}</div>
      </div>
    );
  }
}
