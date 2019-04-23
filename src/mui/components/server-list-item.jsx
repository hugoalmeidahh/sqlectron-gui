import React from 'react';
import PropTypes from 'proptypes';
import { requireLogos } from './require-context';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

var { sqlectron } = window.myremote;
//var e=require('electron');
// console.log(sqlectron);

//var { sqlectron }= require('electron').remote;
/**
 * Load icons for supported database clients
 */
const ICONS = sqlectron.db.CLIENTS.reduce((clients, dbClient) => {
  /* eslint no-param-reassign:0 */
  clients[dbClient.key] = requireLogos(dbClient.key);
  // console.log(clients[dbClient.key]);
  return clients;
}, {});

const ServerListItem = ({ server, onConnectClick, onEditClick }) => (
  <Card>
    <CardContent>
      <div
        className="left floated"
        style={{ height: '35px', width: '35px', margin: '5px 10px 0 0' }}
      >
        <img
          alt="client"
          className="ui image"
          style={{ width: '100%' }}
          src={ICONS[server.client]}
        />
      </div>
      <Button
        variant="outlined"
        onClick={() => onEditClick(server)}
      >
        edit<i className="icon pencil" />
      </Button>
      <div className="header">{server.name}</div>
      <div
        className="meta"
        style={{ lineHeight: '1.5em', marginTop: '5px', marginLeft: '45px' }}
      >
        {server.host ? `${server.host}:${server.port}` : server.socketPath}
        {server.ssh && <div>via {server.ssh.host}</div>}
      </div>
    </CardContent>
    <CardActions>
    <Button variant="outlined"
      tabIndex="0"
      onClick={() => onConnectClick(server)}
    >
      <i className="plug icon" />
      Connect
    </Button>
    </CardActions>
  </Card>
);

ServerListItem.propTypes = {
  server: PropTypes.object.isRequired,
  onConnectClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default ServerListItem;
