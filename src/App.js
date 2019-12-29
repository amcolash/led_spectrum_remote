import React from 'react';
import { Component } from 'react';
import { rgbFromHsv } from './Util/hsv';
import './App.css';
import { Bars } from './Components/Bars';
import { ColorGrid } from './Components/ColorGrid';
import { Text } from './Components/Text';

export class App extends Component {
  constructor(props) {
    super(props);

    const barColors = [];
    for (let i = 0; i < 16; i++) {
      const h = Math.floor((i / 16) * 255);
      barColors.push(rgbFromHsv(h, 255, 255));
    }
    const textColor = rgbFromHsv(82, 255, 255);

    this.state = { barColors, textColor, selected: -1 };
  }

  updateColor(h, s) {
    if (this.state.selected === -1) return;
    else if (this.state.selected === -2) this.updateTextColor(h);
    else this.updateBarColor(h, s);
  }

  updateTextColor(h) {
    this.setState({ textColor: rgbFromHsv(h, 255, 255) });
  }

  updateBarColor(h, s) {
    const updatedColors = [...this.state.barColors];
    updatedColors[this.state.selected] = rgbFromHsv(h, s, 255);
    this.setState({ barColors: updatedColors });
  }

  render() {
    const { barColors, selected, textColor } = this.state;

    let selectedText = 'Selected: ';
    if (selected === -1) selectedText += 'Nothing';
    else if (selected === -2) selectedText += 'Text';
    else selectedText += 'Bar ' + selected;

    return (
      <div
        className="app"
        style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', height: '100vh' }}
        onClick={e => {
          if (e.target.className === 'app') this.setState({ selected: -1 });
        }}
      >
        <div
          className="display"
          style={{
            width: '22em',
            height: '12.3em',
            border: '1px solid gray',
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 20,
            padding: 3,
            borderRadius: 3
          }}
        >
          <Text color={textColor} selected={this.state.selected === -2} onClick={() => this.setState({ selected: -2 })} />
          <Bars barColors={barColors} selected={selected} onClick={i => this.setState({ selected: i })} />
        </div>
        <div style={{ flexBasis: '100%', width: 0 }}></div>

        <div style={{ marginBottom: 30, color: 'white' }}>{selectedText}</div>
        <div style={{ flexBasis: '100%', width: 0 }}></div>

        <ColorGrid dimensions={7} size={30} margin={2} onClick={(h, s) => this.updateColor(h, s)} />
        <div style={{ flexBasis: '100%', width: 0 }}></div>

        <div>SAVE</div>
        <div>LIST</div>
        <div>RESET</div>
      </div>
    );
  }
}
