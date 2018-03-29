import AppSql from './renderer/AppSql.jsx';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {  BrowserRouter as Router,Link,Route} from 'react-router-dom'
import Checkbox from './renderer/components/checkbox.jsx';

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
          <Route path="/" component={AppSql}/>
        </div>
           
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
