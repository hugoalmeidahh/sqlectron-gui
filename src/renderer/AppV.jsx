import React, { Component } from 'react';
import AppVirtual from './AppVirtual';
import PropTypes from 'proptypes';
import styles from './demo/Application.css';
import './GridExample.css';
class App extends React.Component{
  getChildContext() {
    return {list: [{name:"a"},{name:"b"},{name:"c"}]};
  }
  render() {
    return (
      <div className={styles.demo}>
      <AppVirtual />
      </div>
    );
  }
}
App.childContextTypes = {
  list: PropTypes.instanceOf(Object)
};
export default App;