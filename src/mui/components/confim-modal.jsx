import React, { Component } from 'react';
import PropTypes from 'proptypes';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
export default class ServerModalForm extends Component {
  static propTypes = {
    onCancelClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
  };

  componentDidMount() {
    // $(this.refs.confirmModal).modal({
    //   closable: false,
    //   detachable: false,
    //   allowMultiple: true,
    //   context: this.props.context,
    //   onDeny: () => {
    //     this.props.onCancelClick();
    //     return true;
    //   },
    //   onApprove: () => {
    //     this.props.onRemoveClick();
    //     return false;
    //   },
    // }).modal('show');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  componentWillUnmount() {
    //$(this.refs.confirmModal).modal('hide');
    // this.props.onCancelClick();
  }
  // allowMultiple={true}
  // context={this.props.context}
  // onDeny={ () => {
  //   this.props.onCancelClick();
  //   return true;
  // }}
  // onApprove={() => {
  //   this.props.onRemoveClick();
  //   return false;
  // }}

  render() {
    const { title, message } = this.props;
    return (
      <Dialog
        ref="confirmModal"
        closable="false"
        detachable="false"
        open={this.props.modalOpen}
        dimmer={'inverted'}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <div
            className="small ui black deny right labeled icon button"
            onClick={this.props.onCancelClick}
            tabIndex="0"
          >
            No
            <i className="ban icon" />
          </div>
          <div
            className="small ui positive right labeled icon button"
            onClick={this.props.onRemoveClick}
            tabIndex="0"
          >
            Yes
            <i className="checkmark icon" />
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}
