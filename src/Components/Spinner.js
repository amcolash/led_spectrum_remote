import React from 'react';
import { Component } from 'react';
import './Spinner.css';

// Spinner from https://tobiasahlin.com/spinkit/

export class Spinner extends Component {
  render() {
    let className = 'sk-cube-grid';
    if (!this.props.visible) className += ' hidden';

    return (
      <div className={className} style={{ width: this.props.width || 32, height: this.props.height || 32 }}>
        <div className="sk-cube sk-cube1"></div>
        <div className="sk-cube sk-cube2"></div>
        <div className="sk-cube sk-cube3"></div>
        <div className="sk-cube sk-cube4"></div>
        <div className="sk-cube sk-cube5"></div>
        <div className="sk-cube sk-cube6"></div>
        <div className="sk-cube sk-cube7"></div>
        <div className="sk-cube sk-cube8"></div>
        <div className="sk-cube sk-cube9"></div>
      </div>
    );
  }
}
