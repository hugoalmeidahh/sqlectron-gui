import React  from 'react';
import {withRouter, Link} from 'react-router-dom';
import AppTabs from './AppTabs';
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