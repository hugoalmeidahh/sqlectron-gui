//import { webFrame } from 'electron'; // eslint-disable-line import/no-unresolved
//import { webFrame } from '../../browser/remote';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/config.js';
import { Responsive } from 'semantic-ui-react';
import MenuHandler from '../menu-handler';
import ModalAbout from './ModalAbout';
var { webFrame }= window.myremote.electron;//
// require('../semantic-ui/semantic.css');
// require('./app.css');

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
    this.state = {modalOpen:false};
    this.menuHandler = new MenuHandler();
  }
  componentWillReceiveProps (nextProps) {
     this.setMenus();


  }
  componentWillMount() {
    this.props.dispatch(ConfigActions.loadConfig());
  }
  setMenus=()=>{
    this.menuHandler.setMenus({
      'sqlectron:about': () => {
        this.setState({modalOpen:true});
        //console.log("about");
      },
    });
  }
  componentDidMount() {
    // Prevent drag and drop causing redirect
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('drop', preventDefault, false);
    this.setMenus();
  }

  componentWillReceiveProps(newProps) {
    const { config } = newProps;
    if (!config.data) { return; }
    const { zoomFactor, enabledDarkTheme } = config.data;
    if (typeof zoomFactor !== 'undefined' && zoomFactor > 0) {
      // Apply the zoom factor
      // Required for HiDPI support
      webFrame.setZoomFactor(zoomFactor);
    }
    if (enabledDarkTheme === true) {
    //   $('body').addClass('dark-theme');
    // } else {
    //   $('body').removeClass('dark-theme');
    }
  }
  handleClose=()=>{
    this.setState({modalOpen:false});
  }
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
      <ModalAbout handleClose={this.handleClose} modalOpen={this.state.modalOpen}/>
        {
          config.isLoaded ? children : null
        }
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
