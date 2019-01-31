import React, { Component } from 'react';
import { Provider } from 'react-redux';
// import AppTest from './AppTest';
import ServerManagementContainer from './containers/server-management2.jsx';
import QueryBrowserContainer from './containers/query-browser2.jsx';
import {Router,Redirect, Route,Switch,Link} from 'react-router-dom'
import configureStore from './store/configure';
import createHashHistory from "history/createHashHistory";
// import createBrowserHistory from "history"
const history = createHashHistory({
  hashType: "slash" // the default
})
const store = configureStore();
class NoMatch extends Component{
  render=()=>{
    console.log(this.props.history.location.pathname);
    return(<div>
                <Link to="/manage" >manage</Link>
              </div>);
  }
}

class Routers extends Component{
  render=()=>{
    return(<Switch>
                <Route path="/manage" component={ServerManagementContainer} />
                <Route path="/server/:id" component={QueryBrowserContainer} />
                <Route component={NoMatch}/>
              </Switch>);
  }
}
export default class Root extends Component {
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

