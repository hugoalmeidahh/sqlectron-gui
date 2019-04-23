import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
const styles = theme => ({
  close: {
    padding: theme.spacing(2),
  },
});
class Loading extends Component {
  state = { active: false };
  static propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
    inverted: PropTypes.bool,
  };

  componentDidMount() {
    //$(this.refs.loader).dimmer('show');
    this.setState({ active: true });
  }

  componentWillUnmount() {
    //$(this.refs.loader).dimmer('hide');
    this.setState({ active: false });
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ active: false });
  };
  render() {
    const { message } = this.props;
    const { classes } = this.props;
    //const inverted = this.props.inverted ? 'inverted' : '';
    return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.active}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
    );
  }
}
Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loading);