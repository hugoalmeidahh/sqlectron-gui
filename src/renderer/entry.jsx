import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import ServerManagementContainer from './containers/server-management2.jsx';
import QueryBrowserContainer from './containers/query-browser2.jsx';

// import App from './containers/app.jsx';
// import ServerManagementContainer from './containers/server-management.jsx';
// import QueryBrowserContainer from './containers/query-browser.jsx';

import { BrowserRouter,Link,Route,Switch} from 'react-router-dom'
import configureStore from './store/configure';
const store = configureStore();
class Root extends Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
            <App>
              <Switch>

                <Route path="/server/:id" component={QueryBrowserContainer} />
                <Route path="/" component={ServerManagementContainer} />
                
            </Switch>
            </App>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('content')
);
