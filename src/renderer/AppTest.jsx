import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';
import { Button,Input, Grid, Header, List, Segment } from 'semantic-ui-react'
import Checkbox from './components/checkbox.jsx' 
// import styled from "styled-components";
// //import Application from './demo/index.js';
// const StyledView = styled.h1`
//   background-color: papayawhip;
// `;

// const StyledText = styled.section`
//   color: palevioletred;
// `;

class App extends React.Component{
  state={value:true}
  buttonClick=()=>{
    console.log(this.props.history);
    this.props.history.push("/sql/manage");
  }
  onChange=()=>{
    console.log("onChange");
      var v=!this.state.value;
      this.setState({value:v});
  }
  render() {
    console.log(this.state);
    return (
      <div>
       <Button onClick={this.buttonClick}>sqlui</Button>
       <Input type="checkbox" checked={this.state.value}  
                    onChange={this.onChange} >
       </Input>


       <Checkbox name="Checkbox" label="Checkbox"
            defaultChecked={this.state.value} 
            onChecked={() => {
                  console.log("onChecked");
                  this.setState({ value: true })
                }
            }
            onUnchecked={
              () =>{
                this.setState({ value:false});
              }
            } 
       ></Checkbox>
       {
       // <StyledView>
       //  <StyledText>Hello World!</StyledText>
       // </StyledView>
     }
      </div>
    );
  }
}
export default withRouter(App);