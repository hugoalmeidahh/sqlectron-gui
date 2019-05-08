import React from 'react';
import PropTypes from 'proptypes';
import { requireLogos } from './require-context';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormGroup from '@material-ui/core/FormGroup';
import EditIcon from '@material-ui/icons/Edit';
import PowerIcon from '@material-ui/icons/Power';
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
      <FormGroup row>
        <div className="header">{server.name}</div>
        <img
          alt="client"
          style={{height:"1em"}}
          src={ICONS[server.client]}
        />
      <Button variant="outlined" onClick={() => onEditClick(server)}>
        <EditIcon />edit
      </Button>
      <div  style={{ lineHeight: '1.5em', marginTop: '5px', marginLeft: '45px' }}>
        {server.host ? `${server.host}:${server.port}` : server.socketPath}
        {server.ssh && <div>via {server.ssh.host}</div>}
      </div>
      <Button
        variant="outlined"
        tabIndex="0"
        onClick={() => onConnectClick(server)}
      >
        <PowerIcon />
        Connect
      </Button>
    </FormGroup>
    </CardContent>
  </Card>
);

ServerListItem.propTypes = {
  server: PropTypes.object.isRequired,
  onConnectClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default ServerListItem;
