import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';
import styled from "styled-components";
//import Application from './demo/index.js';
const StyledView = styled.h1`
  background-color: papayawhip;
`;

const StyledText = styled.section`
  color: palevioletred;
`;

class App extends React.Component{
  buttonClick=()=>{
    console.log(this.props.history);
    this.props.history.push("/sql/manage");
  }
  render() {
    console.log(this.props.history.location);
    return (
      <div>
       <button onClick={this.buttonClick}>sqlui</button>
       <StyledView>
        <StyledText>Hello World!</StyledText>
       </StyledView>
      </div>
    );
  }
}
export default withRouter(App);