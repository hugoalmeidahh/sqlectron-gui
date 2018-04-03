import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Button,Input, Grid, Header, List, Segment, Icon, Modal } from 'semantic-ui-react';
export default class ServerModalForm extends Component {
  static propTypes = {
    onCancelClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
  }

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
  }

  render() {
    const { title, message } = this.props;
    return (
      <Modal ref="confirmModal"
      closable={false}
      detachable={false}
      allowMultiple={true}
      context={this.props.context}
      onDeny={ () => {
        this.props.onCancelClick();
        return true;
      }}
      onApprove={() => {
        this.props.onRemoveClick();
        return false;
      }}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='browser' content='Cookies policy'>
          {title}
        </Header>
        <Modal.Content>
           {message}
        </Modal.Content>
        <Modal.Actions>
          <div className="small ui black deny right labeled icon button" tabIndex="0">
            No
            <i className="ban icon"></i>
          </div>
          <div className="small ui positive right labeled icon button" tabIndex="0">
            Yes
            <i className="checkmark icon"></i>
          </div>
        </Modal.Actions>
      </Modal>
    );
  }
}
