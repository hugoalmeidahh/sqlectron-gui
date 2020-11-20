// import isPlainObject from 'lodash.isplainobject';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
// import classNames from 'classnames';
 import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

export default class PreviewModal extends Component {
  static propTypes = {
    onCloseClick: PropTypes.func.isRequired,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    // const selected = this.state.selected || 'plain';
    // const previewValue = this.getPreviewValue(selected);
    return (
      <Dialog
        closable="false"
        detachable="false"
        open={this.props.modalOpen}
        dimmer={'inverted'}
      >
        <DialogTitle>Content Preview</DialogTitle>
        <DialogContent>
          <p>{this.props.pos.row}</p>
          <p>{this.props.pos.col}</p>
        </DialogContent>
        <DialogActions>
          <div
            className="small ui black deny right button"
            onClick={this.props.onCloseClick}
            tabIndex="0"
          >
            Close
          </div>
        </DialogActions>
      </Dialog>
    );
  }
}
