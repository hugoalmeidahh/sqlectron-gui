import AppSql from './renderer/AppSql.jsx';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {  BrowserRouter as Router,Link,Route} from 'react-router-dom'
import $ from 'jquery';
class Items extends Component {
  render() {
    return (
      <div>items</div>);
    }
}
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div id="todoapp" className="table-responsive">
              <Link to="/">sqlui</Link>
              <Link style={{paddingLeft:"20px"}} to ="/items">备件</Link>
          </div>
          <Route exact path="/" component={AppSql}/>
          <Route path="/Items" component={Items}/>
        </div>
           
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
