import React from 'react';
import { Component, Fragment } from 'react';
import axios from 'axios';
import './App.css';
import { Bars } from './Components/Bars';
import { ColorGrid } from './Components/ColorGrid';
import { Spinner } from './Components/Spinner';
import { Text } from './Components/Text';

const serverUrl = 'https://home.amcolash.com:9000/spectrum/color';

export class App extends Component {
  constructor(props) {
    super(props);

    let presets = localStorage.getItem('presets');
    if (presets) presets = JSON.parse(presets);
    else presets = {};

    this.state = {
      loading: true,
      setting: false,
      error: null,
      barHues: [],
      barSaturation: [],
      textHue: 0,
      textSaturation: 0,
      selected: -1,
      presets,
      preset: '',
      tmpHue: null
    };
  }

  componentDidMount() {
    this.getServerColors();
  }

  getServerColors(preset) {
    axios
      .get(serverUrl)
      .then(response => this.setState({ loading: false, setting: false, tmpHue: null, preset: preset || '', ...response.data }))
      .catch(err => {
        console.error(err);
        this.setState({ error: err });
      });
  }

  setServerColors(data, preset) {
    this.setState({ setting: true, preset: preset || '' }, () => {
      axios
        .post(serverUrl + '?data=' + JSON.stringify(data))
        .then(response => this.setState({ loading: false, setting: false, tmpHue: null, preset: preset || '', ...response.data }))
        .catch(err => {
          console.error(err);
        });
    });
  }

  saveColorPreset() {
    let presets = localStorage.getItem('presets');
    if (presets) presets = JSON.parse(presets);
    else presets = {};

    const name = prompt('Preset Name?', 'default');
    if (name) {
      const { barHues, barSaturation, textHue, textSaturation } = this.state;
      presets[name] = { barHues, barSaturation, textHue, textSaturation };
      localStorage.setItem('presets', JSON.stringify(presets));

      this.setState({ presets, preset: name });
    }
  }

  loadColorPreset(name) {
    let presets = localStorage.getItem('presets');
    if (presets) {
      presets = JSON.parse(presets);
      if (presets[name]) {
        const { barHues, barSaturation, textHue, textSaturation } = presets[name];

        this.setServerColors({ barHues, barSaturation, textHue, textSaturation }, name);
      }
    }
  }

  updateColor(h, s) {
    this.setState({ tmpHue: h }, () => {
      let { barHues, barSaturation, textHue, textSaturation, selected } = this.state;

      if (this.state.selected === -1) return;
      else if (this.state.selected === -2) {
        textHue = h;
        textSaturation = s;
      } else {
        barHues = [...this.state.barHues];
        barSaturation = [...this.state.barSaturation];
        barHues[selected] = h;
        barSaturation[selected] = s;
      }

      this.setServerColors({ barHues, barSaturation, textHue, textSaturation });
    });
  }

  render() {
    const { barHues, barSaturation, error, loading, selected, setting, tmpHue, textHue, textSaturation } = this.state;

    let selectedText = 'Selected: ';
    let hue = -1;
    let saturation = 255;
    if (selected === -1) selectedText += 'Nothing';
    else if (selected === -2) {
      selectedText += 'Text';
      hue = textHue;
      saturation = textSaturation;
    } else {
      selectedText += 'Bar ' + selected;
      hue = barHues[selected];
      saturation = barSaturation[selected];
    }
    hue = tmpHue !== null && selected !== -1 ? tmpHue : hue;

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
        onClick={() => this.setState({ selected: -1, tmpHue: null })}
      >
        {error ? (
          <h1>{error.message}</h1>
        ) : loading ? (
          <h1>Loading...</h1>
        ) : (
          <Fragment>
            <div
              className="display"
              style={{
                width: '22em',
                height: '12.3em',
                border: '1px solid gray',
                display: 'flex',
                flexDirection: 'column',
                padding: 3,
                borderRadius: 3,
                marginBottom: 20
              }}
            >
              <Text
                textHue={textHue}
                textSaturation={textSaturation}
                selected={this.state.selected === -2}
                onClick={() => this.setState({ selected: -2, tmpHue: null })}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  position: 'relative',
                  paddingBottom: 10
                }}
              >
                <Spinner visible={setting} />
                <div style={{ opacity: !setting && selected !== -1 ? 1 : 0, transition: 'all 0.35s', position: 'absolute' }}>
                  {selectedText}
                </div>
              </div>
              <Bars
                barHues={barHues}
                barSaturation={barSaturation}
                selected={selected}
                onClick={i => this.setState({ selected: i, tmpHue: null })}
              />
            </div>

            <ColorGrid dimensions={7} size={32} margin={2} hue={hue} saturation={saturation} onClick={(h, s) => this.updateColor(h, s)} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
              <div>
                <label>Presets</label>
                <select onChange={e => this.loadColorPreset(e.target.value)} value={this.state.preset}>
                  {['', ...Object.keys(this.state.presets)]
                    .sort((a, b) => a.localeCompare(b))
                    .map(p => (
                      <option value={p} key={p}>
                        {p}
                      </option>
                    ))}
                </select>
                <button onClick={() => this.saveColorPreset(true)}>Save</button>
                <button
                  onClick={() => {
                    this.setState({ setting: true }, () =>
                      axios
                        .post(serverUrl + '?reset')
                        .then(response => this.setState({ loading: false, setting: false, tmpHue: null, preset: '', ...response.data }))
                    );
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
