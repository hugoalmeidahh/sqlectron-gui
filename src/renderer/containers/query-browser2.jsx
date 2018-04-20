import React, { Component } from 'react';
import QueryBrowserContainer from './query-browser.jsx';
import App from './app.jsx';
export default class AppContainer extends Component {
  render() {
    return (
      <App><QueryBrowserContainer/>
      </App>
    );
  }
}

