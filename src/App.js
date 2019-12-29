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

    const defaultColors = this.getDefaultColors();

    this.state = { barColors: defaultColors.barColors, textColor: defaultColors.textColor, selected: -1, presets: [] };
  }

  componentDidMount() {
    this.saveColors(false);
  }

  getDefaultColors() {
    const barColors = [];
    for (let i = 0; i < 16; i++) {
      const h = Math.floor((i / 16) * 255);
      barColors.push(rgbFromHsv(h, 255, 255));
    }
    const textColor = rgbFromHsv(82, 255, 255);

    return { barColors, textColor };
  }

  randomColors() {
    const barColors = [];
    for (let i = 0; i < 16; i++) {
      const h = Math.floor(Math.random() * 255);
      barColors.push(rgbFromHsv(h, 255, 255));
    }
    const textColor = rgbFromHsv(Math.floor(Math.random() * 255), 255, 255);

    return { barColors, textColor };
  }

  saveColors(promptName) {
    let presets = localStorage.getItem('presets');
    if (presets) presets = JSON.parse(presets);
    else presets = {};

    const name = promptName ? prompt('Preset Name?', 'default') : 'default';
    if (name) presets[name] = { barColors: this.state.barColors, textColor: this.state.textColor };
    localStorage.setItem('presets', JSON.stringify(presets));

    this.setState({ presets: Object.keys(presets) });
  }

  loadColors(name) {
    let presets = localStorage.getItem('presets');
    if (presets) {
      presets = JSON.parse(presets);
      if (presets[name]) {
        const preset = presets[name];
        this.setState({ textColor: preset.textColor, barColors: preset.barColors });
      }
    }
  }

  // This will forecefully apply all colors at once, instead of a per-item change (useful for presets)
  applyColors() {
    // Do the magic here
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
        onClick={() => this.setState({ selected: -1 })}
      >
        <div
          className="display"
          style={{
            width: '22em',
            height: '12.3em',
            border: '1px solid gray',
            display: 'flex',
            flexWrap: 'wrap',
            padding: 3,
            borderRadius: 3,
            marginBottom: 20
          }}
        >
          <Text color={textColor} selected={this.state.selected === -2} onClick={() => this.setState({ selected: -2 })} />
          <div style={{ width: '100%', textAlign: 'center', visibility: selectedText === 'Selected: Nothing' ? 'hidden' : undefined }}>
            {selectedText}
          </div>
          <Bars barColors={barColors} selected={selected} onClick={i => this.setState({ selected: i })} />
        </div>

        <ColorGrid dimensions={7} size={30} margin={2} onClick={(h, s) => this.updateColor(h, s)} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
          <div>
            <label>Presets</label>
            <select onChange={e => this.loadColors(e.target.value)}>
              {this.state.presets.map(p => (
                <option value={p} key={p}>
                  {p}
                </option>
              ))}
            </select>
            <button onClick={() => this.saveColors(true)}>Save</button>
            <button onClick={() => this.setState({ ...this.applyColors() })}>Apply</button>
          </div>
          <div>
            <button onClick={() => this.setState({ ...this.randomColors() })}>Random</button>
            <button onClick={() => this.setState({ ...this.getDefaultColors() })}>Reset</button>
          </div>
        </div>
      </div>
    );
  }
}
