import React, { Component } from 'react';
import {withRouter, Link} from 'react-router-dom';
import AppQuery from './AppQuery';

class App extends React.Component{
  buttonClick=()=>{
    console.log(this.props.history);
    this.props.history.push("/sql/manage");
  }
  render() {
    return (
      <div>
      <button onClick={this.buttonClick}>sqlui</button>
      <AppQuery />
      </div>
    );
  }
}
export default withRouter(App);