import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
// var {electron}=window.myremote;//
export default class App extends React.Component{
  onClick=()=>{
  }
  render=()=>{
    console.log(this.props);
    return <Dialog
        open={this.props.modalOpen}
        onClose={this.props.handleClose}
        dimmer={"inverted"}
      >
        <DialogTitle>Edit Table</DialogTitle>
        <DialogContent>
        <div>database name:{this.props.database.name},table:{this.props.item.name}</div>
          <table>
          <tbody>
          <tr><td></td><td></td></tr>
          <tr><td></td><td></td></tr>
          </tbody></table>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose}>
            ok
          </Button>
        </DialogActions>
      </Dialog>;
    }
}