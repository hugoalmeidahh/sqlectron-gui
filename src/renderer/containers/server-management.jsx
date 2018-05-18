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
//import {Modal } from 'semantic-ui-react';

const STYLES = {
  wrapper: { paddingTop: '50px' },
  container: { padding: '0px 10px 50px 10px' },
};


const BREADCRUMB = [{ icon: 'server', label: 'servers' }];


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
  onConnectClick=({ id }) =>{
    // console.log(this.props);
    // console.log(id);
    var path=`/sql/server/${id}`;
    // console.log(path);
    this.props.history.push(path);
  }

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

  onSaveClick=(server)=>{
    const { dispatch, servers } = this.props;
    const id = servers.editingServer && servers.editingServer.id;
    // console.log("onSaveClick======");
    // console.log(server);

    dispatch(ServersActions.saveServer({ id, server }));
  }

  onCancelClick=()=> {
    const { dispatch } = this.props;
    dispatch(ServersActions.finishEditing());
  }

  onRemoveClick() {
    const { dispatch, servers } = this.props;
    const id = servers.editingServer && servers.editingServer.id;
    dispatch(ServersActions.removeServer({ id }));
  }

  onSettingsSaveClick=(config)=> {
    const { dispatch } = this.props;
    // console.log("onSettingsSaveClick");
    var rt=ConfigActions.saveConfig(config);
    // console.log(dispatch);
    // console.log(rt);
    dispatch(rt);
  }

  onSettingsCancelClick=()=> {
    const { dispatch } = this.props;
    dispatch(ConfigActions.finishEditing());
  }

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

    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
          <Header items={BREADCRUMB} />
        </div>
        <div style={STYLES.container}>
          <ServerFilter
            onFilterChange={this.onFilterChange.bind(this)}
            onAddClick={this.onAddClick.bind(this)}
            onSettingsClick={this.onSettingsClick.bind(this)} />
         {
            connections.error &&
              <Message
                closeable
                title="Connection Error"
                message={connections.error.message}
                type="error" />
          }

          <ServerList servers={filteredServers}
            onEditClick={this.onEditClick.bind(this)}
            onConnectClick={this.onConnectClick.bind(this)} />

         {servers.isEditing && <ServerModalForm
            modalOpen={servers.isEditing}
            server={selected}
            error={servers.error}
            testConnection={testConnection}
            onTestConnectionClick={this.onTestConnectionClick.bind(this)}
            onDuplicateClick={this.onDuplicateClick.bind(this)}
            onSaveClick={this.onSaveClick}
            onCancelClick={this.onCancelClick}
            onRemoveClick={this.onRemoveClick.bind(this)} />}

          {config.isEditing && <SettingsModalForm 
            modalOpen={config.isEditing}
            config={config}
            error={config.error}
            onSaveClick={this.onSettingsSaveClick}
            onCancelClick={this.onSettingsCancelClick} />}
        </div>
        <div style={STYLES.footer}>
          <Footer status={status} />
        </div>
        <style jsx="true">{`
.Select-input input {
  padding: 0 !important;
  border: 0 !important;
}

.error .Select .Select-control {
    background: #fff6f6;
    border-color: #e0b4b4;
    color: #9f3a38;
    border-radius: '';
    box-shadow: none;
}
        `}</style>
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

export default connect(mapStateToProps)(withRouter(ServerManagerment));
