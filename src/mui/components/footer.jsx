import React from 'react';
import PropTypes from 'proptypes';
import UpdateChecker from './update-checker.jsx';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
// import LogStatus from './log-status.jsx';
var { shell } = window.myremote.electron;

const STYLE = {
  footer: { minHeight: 'auto' },
  status: { paddingLeft: '0.5em' },
};

function onGithubClick(event) {
  event.preventDefault();
  shell.openExternal('https://github.com/sqlectron/sqlectron-gui');
}

function onShortcutsClick(event) {
  event.preventDefault();
  shell.openExternal(
    'https://github.com/sqlectron/sqlectron-gui/wiki/Keyboard-Shortcuts'
  );
}

const Footer = ({ status }) => (
  <Snackbar>
    <SnackbarContent>
      <div style={STYLE.status}>{status}</div>
      <div className="right menu">
        <div className="item">
          {
            //<LogStatus />
          }
          <UpdateChecker />
        </div>
        <a className="item" onClick={onGithubClick}>
          Github
        </a>
        <a
          className="item"
          title="Keyboard Shortcuts"
          onClick={onShortcutsClick}
        >
          <i className="keyboard icon" />
        </a>
      </div>
    </SnackbarContent>
  </Snackbar>
);

Footer.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Footer;
