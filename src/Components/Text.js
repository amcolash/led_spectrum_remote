import React from 'react';
import { Component } from 'react';
import './Text.css';

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
        style={{ color: this.props.color, fontSize: 32, outline: this.props.selected ? '1px solid white' : undefined }}
        onClick={() => this.props.onClick()}
      >
        <div>{this.state.time}</div>
        <div style={{ fontSize: 16 }}>{this.state.date}</div>
      </div>
    );
  }
}
