// import isPlainObject from 'lodash.isplainobject';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
// import classNames from 'classnames';
import { Modal } from 'semantic-ui-react';

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
      <Modal
        closable="false"
        detachable="false"
        open={this.props.modalOpen}
        dimmer={'inverted'}
      >
        <Modal.Header>Content Preview</Modal.Header>
        <Modal.Content>
          <p>{this.props.pos.row}</p>
          <p>{this.props.pos.col}</p>
        </Modal.Content>
        <Modal.Actions>
          <div
            className="small ui black deny right button"
            onClick={this.props.onCloseClick}
            tabIndex="0"
          >
            Close
          </div>
        </Modal.Actions>
      </Modal>
    );
  }
}
