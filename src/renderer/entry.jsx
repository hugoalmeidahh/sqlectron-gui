import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom'
import App from './containers/app.jsx';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management.jsx';
import QueryBrowserContainer from './containers/query-browser.jsx';

const store = configureStore();
var Router=BrowserRouter;
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/" component={App} />
        <Route path="/" component={ServerManagementContainer} />
        <Route path="/server/:id" component={QueryBrowserContainer} />
       </div>
    </Router>
  </Provider>,
  document.getElementById('content')
);
