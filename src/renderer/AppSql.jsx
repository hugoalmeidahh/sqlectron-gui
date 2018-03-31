import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App.jsx';
import AppTest from './AppTest.jsx';
import ServerManagementContainer from './containers/server-management2.jsx';
import QueryBrowserContainer from './containers/query-browser2.jsx';
import {Link, BrowserRouter,Route,Switch} from 'react-router-dom'
import configureStore from './store/configure';
const store = configureStore();
export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
            <App>
            <Link to="/test">test</Link><Link style={{paddingLeft:"20px"}}to="/sql/manage">manage</Link>
              <Switch>
                <Route path="/test" component={AppTest} />
                <Route path="/sql/manage" component={ServerManagementContainer} />
                <Route path="/sql/server/:id" component={QueryBrowserContainer} />
              </Switch>
            </App>
        </BrowserRouter>
      </Provider>
    );
  }
}

