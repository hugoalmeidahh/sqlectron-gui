//import { webFrame } from 'electron'; // eslint-disable-line import/no-unresolved
//import { webFrame } from '../../browser/remote';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/config.js';
import MenuHandler from '../../menu-handler';
import ModalAbout from './ModalAbout';
var { webFrame } = window.myremote.electron; //
function hasClass(elements, cName) {
  return !!elements.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
}
function addClass(elements, cName) {
  if (!hasClass(elements, cName)) {
    elements.className += ' ' + cName;
  }
}
function removeClass(elements, cName) {
  if (hasClass(elements, cName)) {
    elements.className = elements.className.replace(
      new RegExp('(\\s|^)' + cName + '(\\s|$)'),
      ' '
    );
  }
}
const preventDefault = e => e.preventDefault();

class AppContainer extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    //router: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { modalOpen: false };
    this.menuHandler = new MenuHandler();
  }
  componentWillMount() {
    this.props.dispatch(ConfigActions.loadConfig());
  }
  setMenus = () => {
    this.menuHandler.setMenus({
      'sqlectron:about': () => {
        this.setState({ modalOpen: true });
        //console.log("about");
      },
    });
  };
  componentDidMount() {
    // Prevent drag and drop causing redirect
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('drop', preventDefault, false);
    this.setMenus();
  }

  componentWillReceiveProps(newProps) {
    const { config } = newProps;
    if (!config.data) {
      return;
    }
    const { zoomFactor, enabledDarkTheme } = config.data;
    if (typeof zoomFactor !== 'undefined' && zoomFactor > 0) {
      // Apply the zoom factor
      // Required for HiDPI support
      webFrame.setZoomFactor(zoomFactor);
    }
    let body = document.getElementsByTagName('body')[0];
    if (enabledDarkTheme === true) {
      addClass(body, 'dark-theme');
    } else {
      removeClass(body, 'dark-theme');
    }
  }
  handleClose = () => {
    this.setState({ modalOpen: false });
  };
  componentWillUnmount() {
    document.removeEventListener('dragover', preventDefault, false);
    document.removeEventListener('drop', preventDefault, false);
    this.menuHandler.removeAllMenus();
  }

  render() {
    //console.log("App render=======");
    const { children, config } = this.props;
    // console.log("render========");
    // console.log(this.props);
    return (
      <div className="ui">
        <ModalAbout onClose={this.handleClose} open={this.state.modalOpen} />
        {config.isLoaded ? children : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
  };
}

export default connect(mapStateToProps)(withRouter(AppContainer));
