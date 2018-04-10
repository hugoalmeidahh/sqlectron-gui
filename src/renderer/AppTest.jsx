import React, { Component } from 'react';
import {withRouter, Link} from 'react-router-dom';
import AppV from './AppV';

class App extends React.Component{
  buttonClick=()=>{
    console.log(this.props.history);
    this.props.history.push("/sql/manage");
  }
  render() {
    return (
      <div>
      <button onClick={this.buttonClick}>sqlui</button>
      <AppV />
      </div>
    );
  }
}
export default withRouter(App);