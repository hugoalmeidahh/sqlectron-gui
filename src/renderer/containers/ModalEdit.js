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
        <Modal.Header content='About Sqlectron' />
        <Modal.Content>
        <div>{this.props.database.name}:{this.props.item.name}</div>
          <table>
          <tbody>
          <tr><td>Version:</td><td></td></tr>
          <tr><td>Author:</td><td></td></tr>
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