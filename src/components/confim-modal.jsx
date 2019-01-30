import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Modal } from 'semantic-ui-react';
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
    this.props.onCancelClick();
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
      <Modal
        ref="confirmModal"
        closable="false"
        detachable="false"
        open={this.props.modalOpen}
        dimmer={'inverted'}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>{message}</Modal.Content>
        <Modal.Actions>
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
        </Modal.Actions>
      </Modal>
    );
  }
}
