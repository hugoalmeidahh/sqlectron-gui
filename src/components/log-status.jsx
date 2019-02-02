import React, { Component } from 'react';
var config=window.myremote.config.get();
const log = config.log;

export default class LogStatus extends Component {
  render() {
    if (!log.console && !log.file) {
      return null;
    }
    //console.log(log.level);
    return (
      <a className="ui red label">
        <i className="terminal icon" />
      </a>
    );
  }
}
