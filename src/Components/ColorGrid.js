import React from "react";
import { Component } from "react";

export class ColorGrid extends Component {
  render() {
    const container = <div style={{ backgroundColor: "white" }}></div>;

    container.push(<div>A</div>);
    container.push(<div>B</div>);
    container.push(<div>C</div>);

    return container;
  }
}
