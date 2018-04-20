import React, { Component } from 'react';
import ServerManagement from './server-management.jsx';
import App from './app.jsx';
export default class AppContainer extends Component {
  render() {
    return (
      <App><ServerManagement />
      </App>
    );
  }
}

