import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
var {electron}=window.myremote;//
var config=window.myremote.config.get();
// console.log(Modal);
export default class App extends React.Component{
  // constructor(props, context) {
  //   super(props, context);
  //   // console.log("constructor modal1");
  // }
  onClick=()=>{
    // console.log(electron.shell);
    electron.shell.openExternal(config.website);
  }
  render=()=>{
    return <Dialog open={this.props.open}  onClose={this.props.onClose}>
        <DialogTitle>About Sqlectron</DialogTitle>
        <DialogContent>
          <table>
          <tbody>
          <tr><td>Version:</td><td>{config.version}</td></tr>
          <tr><td>Author:</td><td>{config.author.name}</td></tr>
          <tr><td>email:</td><td>{config.author.email}</td></tr>
          <tr><td>website:</td><td><a onClick={this.onClick}>{config.website}</a></td></tr>
          </tbody></table>
        </DialogContent>
        <DialogActions>
          <button onClick={this.props.handleClose}>
            ok
          </button>
        </DialogActions>
      </Dialog>;
    }
}