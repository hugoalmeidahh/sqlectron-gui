import * as React from 'react';
import {Button, Modal } from 'semantic-ui-react';
// var {electron}=window.myremote;//
export default class App extends React.Component{
  onClick=()=>{
  }
  render=()=>{
    console.log(this.props);
    return <Modal
        open={this.props.modalOpen}
        onClose={this.props.handleClose}
        dimmer={"inverted"}
      >
        <Modal.Header content='Edit Table' />
        <Modal.Content>
        <div>database name:{this.props.database.name},table:{this.props.item.name}</div>
          <table>
          <tbody>
          <tr><td></td><td></td></tr>
          <tr><td></td><td></td></tr>
          </tbody></table>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.handleClose}>
            ok
          </Button>
        </Modal.Actions>
      </Modal>;
    }
}