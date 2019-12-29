import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import { rgbFromHsv } from './Util/hsv';
import './App.css';
import { Bars } from './Components/Bars';
import { ColorGrid } from './Components/ColorGrid';
import { Text } from './Components/Text';

const serverUrl = 'home.amcolash.com/spectrum';

export class App extends Component {
  constructor(props) {
    super(props);

    const defaultColors = this.getDefaultColors();

    this.state = {
      barColors: defaultColors.barColors,
      barHues: defaultColors.barHues,
      barSaturation: defaultColors.barSaturation,
      textColor: defaultColors.textColor,
      textHue: defaultColors.textHue,
      selected: -1,
      presets: []
    };
  }

  componentDidMount() {
    this.saveColors(false);
  }

  getDefaultColors() {
    const barColors = [];
    const barHues = [];
    const barSaturation = [];
    for (let i = 0; i < 16; i++) {
      const h = Math.floor((i / 16) * 255);
      barColors.push(rgbFromHsv(h, 255, 255));
      barHues.push(h);
      barSaturation.push(255);
    }
    const textHue = 82;
    const textColor = rgbFromHsv(textHue, 255, 255);

    return { barColors, barHues, barSaturation, textColor, textHue, preset: 'default' };
  }

  // not the most efficient (17 state updates, but that isn't a big deal for this application)
  async randomColors() {
    for (let i = 0; i < 16; i++) {
      const h = Math.floor(Math.random() * 255);
      await this.updateBarColor(h, 255, i);
    }
    await this.updateTextColor(Math.floor(Math.random() * 255));
  }

  saveColors(promptName) {
    let presets = localStorage.getItem('presets');
    if (presets) presets = JSON.parse(presets);
    else presets = {};

    const name = promptName ? prompt('Preset Name?', 'default') : 'default';
    if (name) {
      presets[name] = { barHues: this.state.barHues, barSaturation: this.state.barSaturation, textHue: this.state.textHue };
      localStorage.setItem('presets', JSON.stringify(presets));

      this.setState({ presets: Object.keys(presets), preset: name });
    }
  }

  async loadColors(name) {
    let presets = localStorage.getItem('presets');
    if (presets) {
      presets = JSON.parse(presets);
      if (presets[name]) {
        const preset = presets[name];

        for (let i = 0; i < 16; i++) {
          await this.updateBarColor(preset.barHues[i], preset.barSaturation[i], i);
        }

        await this.updateTextColor(preset.textHue);

        this.setState({ preset: name });
      }
    }
  }

  updateColor(h, s) {
    if (this.state.selected === -1) return;
    else if (this.state.selected === -2) this.updateTextColor(h);
    else this.updateBarColor(h, s);
  }

  async updateTextColor(h) {
    return new Promise((resolve, reject) => {
      this.setState({ textColor: rgbFromHsv(h, 255, 255), textHue: h }, () => resolve());
    });
  }

  async updateBarColor(h, s, i) {
    return new Promise((resolve, reject) => {
      let index = i;
      if (index === undefined) index = this.state.selected;

      const updatedColors = [...this.state.barColors];
      const updatedHues = [...this.state.barHues];
      const updatedSaturation = [...this.state.barSaturation];
      updatedColors[index] = rgbFromHsv(h, s, 255);
      updatedHues[index] = h;
      updatedSaturation[index] = s;

      this.setState({ barColors: updatedColors, barHues: updatedHues, barSaturation: updatedSaturation }, () => resolve());
    });
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
            <select onChange={e => this.loadColors(e.target.value)} value={this.state.preset}>
              {this.state.presets.map(p => (
                <option value={p} key={p}>
                  {p}
                </option>
              ))}
            </select>
            <button onClick={() => this.saveColors(true)}>Save</button>
          </div>
          <div>
            <button onClick={() => this.randomColors()}>Random</button>
            <button onClick={() => this.setState({ ...this.getDefaultColors() })}>Reset</button>
          </div>
        </div>
      </div>
    );
  }
}
