import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/css';
import 'brace/theme/github';
export default class Root extends Component<Props> {
  constructor() {
    super();
    this.state = {
      mode: 'css',
      displayAce: 'none',
    };
  }

  render = () => {
    var d = new Date();
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <button
          onClick={() => {
            if (this.state.displayAce == 'none') {
              this.setState({ displayAce: 'block' });
            } else {
              this.setState({ displayAce: 'none' });
            }
          }}
        >
          edit style
        </button>
        <AceEditor
          style={{
            display: this.state.displayAce,
            width: '300px',
            height: '300px',
            border: 'solid gray 5px',
          }}
          mode={this.state.mode}
          theme="github"
          value={this.props.css}
          onChange={this.props.cssChange}
          name={'' + d}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    );
  };
}
