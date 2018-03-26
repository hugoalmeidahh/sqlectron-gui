import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
type Props = {};

class Home extends Component {
  componentDidMount() {
    console.log(this.props);
    this.props.history.push("/manage");
  }
  componentWillReceiveProps (nextProps) {
    console.log(nextProps);
  }
  render() {
    console.log("render===========");
    return (
      <div>
        <div  data-tid="container">
          <h2>Home</h2>
          <div><Link to="/manage">to Counter</Link></div>
          <div><Link to="/server/:id">to Db</Link></div>
        </div>
      </div>
    );
  }
}
export default withRouter(Home);