//import { webFrame } from 'electron'; // eslint-disable-line import/no-unresolved
//import { webFrame } from '../../browser/remote';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/config.js';
import MenuHandler from '../menu-handler';
import ModalAbout from './ModalAbout';
var { webFrame }= window.myremote.electron;//
function hasClass( elements,cName ){ 
  return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); 
}; 
function addClass( elements,cName ){ 
  if( !hasClass( elements,cName ) ){ 
    elements.className += " " + cName; 
  }; 
}; 
function removeClass( elements,cName ){ 
  if( hasClass( elements,cName ) ){ 
    elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " );
  }; 
};
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
    let body=document.getElementsByTagName('body')[0];
    if (enabledDarkTheme === true) {
      addClass(body,'dark-theme');
    } else {
      removeClass(body,'dark-theme');
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
        <style jsx="true">{`
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  padding: 0;
  font-size: 14px;
  line-height: 30px;
  color: rgba(0,0,0,.87);
}

p.help {
  font-size: 0.8em;
}

/* Override semantic ui style */
.ui.secondary.menu {
  max-width: 100%;
}

.ui.message pre {
  margin-top: 1em;
  font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}

/* Custom css for tables, views and routines lists */
span.list-title {
  cursor: pointer;
  padding: 0.33em;
}

span.list-item {
  word-break: break-all;
}

span.clickable {
  cursor: pointer;
}

::-webkit-scrollbar { width:8px; height:8px }
::-webkit-scrollbar-track { background: #fff; }
::-webkit-scrollbar-thumb { background: #666; border-radius:5px }


/* Dark theme */
body.dark-theme {
  filter: invert(100%);
  background-color: #333;
}

body.dark-theme .Select-control,
body.dark-theme .ui.form input:not([type]),
body.dark-theme .ui.form input[type="date"],
body.dark-theme .ui.form input[type="datetime-local"],
body.dark-theme .ui.form input[type="email"],
body.dark-theme .ui.form input[type="number"],
body.dark-theme .ui.form input[type="password"],
body.dark-theme .ui.form input[type="search"],
body.dark-theme .ui.form input[type="tel"],
body.dark-theme .ui.form input[type="time"],
body.dark-theme .ui.form input[type="text"],
body.dark-theme .ui.form input[type="url"] {
  border-color: #000;
}
body.dark-theme .ui.toggle.checkbox .box:before,
body.dark-theme .ui.toggle.checkbox label:before {
  border: 1px solid #333;
  background: #ccc;
}
body.dark-theme .ui.toggle.checkbox .box:after,
body.dark-theme .ui.toggle.checkbox label:after {
  box-shadow: 0px 1px 2px 0 #333, 0px 0px 0px 1px #333 inset;
}

          `}</style>
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
