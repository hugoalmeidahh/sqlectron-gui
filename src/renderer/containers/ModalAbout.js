import * as React from 'react';
import {Button, Modal } from 'semantic-ui-react';
var {electron}=window.myremote;//
var config=window.myremote.config.get();
console.log(Modal);
export default class App extends React.Component{
  // constructor(props, context) {
  //   super(props, context);
  //   // console.log("constructor modal1");
  // }
  onClick=()=>{
    console.log(electron.shell);
    electron.shell.openExternal(config.website);
  }
  render=()=>{
    return <Modal show={this.props.showModal}  onHide={this.props.closeModal}>
        <Modal.Header content='About Sqlectron' />
        <Modal.Content>
          <table>
          <tbody>
          <tr><td>Version:</td><td>{config.version}</td></tr>
          <tr><td>Author:</td><td>{config.author.name}</td></tr>
          <tr><td>email:</td><td>{config.author.email}</td></tr>
          <tr><td>website:</td><td><a onClick={this.onClick}>{config.website}</a></td></tr>
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