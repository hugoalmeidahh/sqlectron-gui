import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Transition } from 'semantic-ui-react';

export default class Message extends Component {
  static propTypes = {
    closeable: PropTypes.bool,
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    preformatted: PropTypes.bool,
  };
  constructor() {
    super();
    this.state = { visible: true };
  }
  onClose() {
    //$(this.refs.message).transition('fade');
    this.setState({ visible: false });
  }

  render() {
    const { closeable, title, message, type, preformatted } = this.props;
    var classtype = `ui message ${type || ''}`;
    return (
      <Transition visible={this.state.visible} animation="fade" duration={500}>
        <div className={classtype}>
          {closeable && (
            <i className="close icon" onClick={this.onClose.bind(this)} />
          )}
          {title && <div className="header">{title}</div>}
          {message && preformatted ? <pre>{message}</pre> : <p>{message}</p>}
        </div>
      </Transition>
    );
  }
}
