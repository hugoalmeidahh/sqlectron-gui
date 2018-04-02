import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';
import { Button,Input, Grid, Header, List, Segment, Icon, Modal } from 'semantic-ui-react'
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
  state={value:true, modalOpen: false }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })
  buttonClick=()=>{
    console.log(this.props.history);
    this.props.history.push("/sql/manage");
  }
  onChange=()=>{
    console.log("onChange");
      var v=!this.state.value;
      this.setState({value:v});
  }
  clickno=()=>{
    console.log("clickno");
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
     <Modal
        trigger={<Button onClick={this.handleOpen}>Show Modal</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='browser' content='Cookies policy' />
        <Modal.Content>
          <h3>This website uses cookies to ensure the best user experience.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
      </div>
    );
  }
}
export default withRouter(App);