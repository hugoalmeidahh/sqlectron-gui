import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';
//import Application from './demo/index.js';
type Props = {
  children: React.Node
};

class App extends React.Component<Props> {
  props: Props;
  buttonClick=()=>{
    console.log(this.props.history);
    this.props.history.push("/");
  }
  render() {
    console.log(this.props.history.location);
    return (
      <div>
       <button onClick={this.buttonClick}>home</button>
      </div>
    );
  }
}
export default withRouter(App);