//import { webFrame } from 'electron'; // eslint-disable-line import/no-unresolved
import { webFrame } from '../../browser/remote';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/config.js';
import ServerManagement from './server-management.jsx';
if(!$){ var $=window.$};
// import '../../../vendor/renderer/semantic-ui/semantic.js';
// require('../../../vendor/renderer/lato/latofonts.css');
// require('../../../vendor/renderer/semantic-ui/semantic.css');
require('./app.css');

const preventDefault = e => e.preventDefault();

class AppContainer extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    //router: PropTypes.object.isRequired,
    //children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(ConfigActions.loadConfig());
  }

  componentDidMount() {
    // Prevent drag and drop causing redirect
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('drop', preventDefault, false);
  }

  componentWillReceiveProps(newProps) {
    console.log("server-management2 componentWillReceiveProps=========");
    console.log(newProps);
    
    const { config } = newProps;
    if (!config.data) { return; }
    const { zoomFactor, enabledDarkTheme } = config.data;
    if (typeof zoomFactor !== 'undefined' && zoomFactor > 0) {
      // Apply the zoom factor
      // Required for HiDPI support
      webFrame.setZoomFactor(zoomFactor);
    }
    if (enabledDarkTheme === true) {
      $('body').addClass('dark-theme');
    } else {
      $('body').removeClass('dark-theme');
    }
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', preventDefault, false);
    document.removeEventListener('drop', preventDefault, false);
  }

  render() {
    //console.log("App render=======");
    const { config } = this.props;
    console.log("render========");
    console.log(this.props);
    console.log(this.props.history.location);
    let cs;
    if(config.isLoaded)
    {cs=<ServerManagement />}

    return (
      <div className="ui">
        {
          cs
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  console.log("mapStateToProps");
  console.log(state);
  return {
    config: state.config,
  };
}

export default connect(mapStateToProps)(withRouter(AppContainer));
