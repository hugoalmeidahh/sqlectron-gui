import * as React from 'react';
import {Button,Icon, Modal } from 'semantic-ui-react';
export default class App extends React.Component{
  // constructor(props, context) {
  //   super(props, context);
  //   // console.log("constructor modal1");
  // }
  // componentDidMount() {
  //   console.log("modal1 mount");
  // }
  // componentWillUnmount() {
  //   console.log("modal1  un mount");
  // }
  render=()=>{
    return <Modal
        open={this.props.modalOpen}
        onClose={this.props.handleClose}
        basic
        size='small'
      >
        <Modal.Header icon='browser' content='Cookies policy' />
        <Modal.Content>
          <h3>This website uses coo
          kies to ensu=
          re the best user experience.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.props.handleClose} inverted>
            <Icon name='checkmark' /> =========Got it
          </Button>
        </Modal.Actions>
      </Modal>;
    }
}