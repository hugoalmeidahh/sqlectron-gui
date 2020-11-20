import React, { Component } from 'react';
import PropTypes from 'proptypes';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
var { sqlectron } = window.myremote;
const CLIENTS = sqlectron.db.CLIENTS.map(dbClient => ({
  key: dbClient.key,
  name: dbClient.name,
}));

//var { sqlectron }= require('electron').remote;
export default class ServerDBClientInfoModal extends Component {
  static propTypes = {
    client: PropTypes.string.isRequired,
    infos: PropTypes.array.isRequired,
    onCloseClick: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // $(this.refs.infoModal).modal({
    //   closable: true,
    //   detachable: false,
    //   allowMultiple: true,
    //   observeChanges: true,
    //   onHidden: () => this.props.onCloseClick(),
    // }).modal('show');
  }

  componentWillUnmount() {
    //$(this.refs.infoModal).modal('hide');
  }

  render() {
    const { client, infos } = this.props;
    const dbClient = CLIENTS.find(item => item.key === client);
    return (
      <Dialog
        id="settings-modal"
        open={this.props.modalOpen}
        closable="true"
        detachable="false"
        dimmer={'inverted'}
      >
        <DialogTitle>{dbClient.name} Query Information</DialogTitle>
        <DialogContent>
          <p>
            Some particularities about queries on {dbClient.name} you should
            know:
          </p>
          <div className="ui bulleted list">
            {infos.map((info, idx) => (
              <div key={idx} className="item">
                {info}
              </div>
            ))}
          </div>
          <ul />
        </DialogContent>
      </Dialog>
    );
  }
}
