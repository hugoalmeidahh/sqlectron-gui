import React  from 'react';
import {withRouter, Link} from 'react-router-dom';
import AppTabs from './AppTabs';
// import AppTabs from './containers/query-browser-l'
class App extends React.Component{
  render() {
    return (
     <div>
      <Link to="/sql/manage">sqlui</Link>
      <AppTabs />
      </div>
    );
  }
}
export default withRouter(App);