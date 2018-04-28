import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppTest from './AppTest';
import ServerManagementContainer from './containers/server-management2.jsx';
import QueryBrowserContainer from './containers/query-browser2.jsx';
import {Router,Redirect, Route,Switch} from 'react-router-dom'
import configureStore from './store/configure';
import createHashHistory from "history/createHashHistory";
const history = createHashHistory({
  hashType: "slash" // the default
})
const store = configureStore();
class Routers extends Component{
  render=()=>{
    // console.log(this.props);
    return(<Switch>
                <Route path="/test" component={AppTest} />
                <Route path="/sql/manage" component={ServerManagementContainer} />
                <Route path="/sql/server/:id" component={QueryBrowserContainer} />
                <Redirect exact path="/"  to="/test" />
              </Switch>);
  }
}
export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <Router  history={history}>
            <Routers />
        </Router>
      </Provider>
    );
  }
}

