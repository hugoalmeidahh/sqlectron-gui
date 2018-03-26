import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route,Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom'
import App from './containers/app.jsx';
import configureStore from './store/configure';
import ServerManagementContainer from './containers/server-management.jsx';
import Home from './containers/Home.jsx';
import QueryBrowserContainer from './containers/query-browser.jsx';
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
       <div>
            <Route path="/" component={Home} />
            <Route path="/manage" component={ServerManagementContainer} />
            <Route path="/server/:id" component={QueryBrowserContainer} />
        </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('content')
);
