import React, { Component} from 'react';
import PropTypes from 'proptypes';
import {Divider, Transition,Button,Input, Grid, Header, List, Segment, Icon, Modal } from 'semantic-ui-react';

export default class Message extends Component {
  static propTypes = {
    closeable: PropTypes.bool,
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    preformatted: PropTypes.bool,
  }
  constructor(){
    super();
    this.state={visible:true};
  }
  onClose() {
    //$(this.refs.message).transition('fade');
    this.setState({visible:false});
  }

  render() {
    const { closeable, title, message, type, preformatted } = this.props;
    var classtype=`ui message ${type || ''}`;
    return (
      <Transition visible={this.state.visible} animation='scale' duration={5000}>
        <div ref="message" className={classtype}>
        {
          closeable && <i className="close icon" onClick={this.onClose.bind(this)}></i>
        }
        {
          title && <div className="header">{title}</div>
        }
        {
          message && preformatted ? <pre>{message}</pre> : <p>{message}</p>
        }
      </div>
     </Transition>
      
    );
  }
}
