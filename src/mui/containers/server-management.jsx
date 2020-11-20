import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as ServersActions from '../actions/servers.js';
import * as ConnActions from '../actions/connections.js';
import * as ConfigActions from '../actions/config.js';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import ServerList from '../components/server-list.jsx';
import ServerModalForm from '../components/server-modal-form.jsx';
import SettingsModalForm from '../components/settings-modal-form.jsx';
import ServerFilter from '../components/server-filter.jsx';
import Message from '../components/message.jsx';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import StorageIcon from '@material-ui/icons/Storage';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
});
class ServerManagerment extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    connections: PropTypes.object.isRequired,
    servers: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    //router: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    // console.log("ServerManagerment componentWillReceiveProps");
    // console.log(nextProps);
  }
  onConnectClick = ({ id }) => {
    // console.log(this.props);
    // console.log(id);
    var path = `/server/${id}`;
    console.log(path);
    this.props.history.push(path);
  };

  onTestConnectionClick(server) {
    const { dispatch } = this.props;
    //server.client=server.client.value;
    dispatch(ConnActions.test(server));
  }

  onAddClick() {
    const { dispatch } = this.props;
    dispatch(ServersActions.startEditing());
  }

  onSettingsClick() {
    const { dispatch } = this.props;
    dispatch(ConfigActions.startEditing());
  }

  onEditClick(server) {
    const { dispatch } = this.props;
    dispatch(ServersActions.startEditing(server.id));
  }

  onDuplicateClick(server) {
    const { dispatch } = this.props;
    dispatch(ServersActions.duplicateServer({ server }));
  }

  onSaveClick = server => {
    const { dispatch, servers } = this.props;
    const id = servers.editingServer && servers.editingServer.id;
    // console.log("onSaveClick======");
    // console.log(server);

    dispatch(ServersActions.saveServer({ id, server }));
  };

  onCancelClick = () => {
    const { dispatch } = this.props;
    dispatch(ServersActions.finishEditing());
  };

  onRemoveClick() {
    const { dispatch, servers } = this.props;
    const id = servers.editingServer && servers.editingServer.id;
    dispatch(ServersActions.removeServer({ id }));
  }

  onSettingsSaveClick = config => {
    const { dispatch } = this.props;
    // console.log("onSettingsSaveClick");
    var rt = ConfigActions.saveConfig(config);
    // console.log(dispatch);
    // console.log(rt);
    dispatch(rt);
  };

  onSettingsCancelClick = () => {
    const { dispatch } = this.props;
    dispatch(ConfigActions.finishEditing());
  };

  onFilterChange(event) {
    this.setState({ filter: event.target.value });
  }

  filterServers(name, servers) {
    const regex = RegExp(name, 'i');
    return servers.filter(srv => regex.test(srv.name));
  }

  render() {
    const { filter } = this.state;
    const { connections, servers, config, status } = this.props;
    const selected = servers.editingServer || {};
    const filteredServers = this.filterServers(filter, servers.items);

    const testConnection = {
      connected: connections.testConnected,
      connecting: connections.testConnecting,
      error: connections.testError,
    };
    // console.log(this.props);
    // const BREADCRUMB = [{ icon: 'server', label: 'servers' }];
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              className={this.props.classes.grow}
            >
              sqlectron
            </Typography>
            <StorageIcon />
            <Typography
              variant="h6"
              color="inherit"
              className={this.props.classes.grow}
            >
              servers
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <ServerFilter
            onFilterChange={this.onFilterChange.bind(this)}
            onAddClick={this.onAddClick.bind(this)}
            onSettingsClick={this.onSettingsClick.bind(this)}
          />
          {connections.error && (
            <Message
              closeable
              title="Connection Error"
              message={connections.error.message}
              type="error"
            />
          )}

          <ServerList
            servers={filteredServers}
            onEditClick={this.onEditClick.bind(this)}
            onConnectClick={this.onConnectClick.bind(this)}
          />

          {servers.isEditing && (
            <ServerModalForm
              modalOpen={servers.isEditing}
              server={selected}
              error={servers.error}
              testConnection={testConnection}
              onTestConnectionClick={this.onTestConnectionClick.bind(this)}
              onDuplicateClick={this.onDuplicateClick.bind(this)}
              onSaveClick={this.onSaveClick}
              onCancelClick={this.onCancelClick}
              onRemoveClick={this.onRemoveClick.bind(this)}
            />
          )}

          {config.isEditing && (
            <SettingsModalForm
              modalOpen={config.isEditing}
              config={config}
              error={config.error}
              onSaveClick={this.onSettingsSaveClick}
              onCancelClick={this.onSettingsCancelClick}
            />
          )}
        </div>
        <Footer status={status} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    connections: state.connections,
    servers: state.servers,
    config: state.config,
    status: state.status,
  };
}
ServerManagerment.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps)(withRouter(withStyles(styles)(ServerManagerment)));
