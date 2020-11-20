import React, { Component } from 'react';
import PropTypes from 'proptypes';
import set from 'lodash.set';
import Select from 'react-select';
import ConfirmModal from './confim-modal.jsx';
import Message from './message.jsx';
import Checkbox from '@material-ui/core/Checkbox';
import { requireLogos } from './require-context';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
var { sqlectron } = window.myremote;
const styles={
 container:(provided,state)=>{
  return{
    ...provided,
    minWidth:"200px",
    maxWidth:"300px",
  }
 },
};
const components={
  Option: (props) => {
    // console.log(props);
    return (
      <div {...props.innerProps} style={{ backgroundColor:props.isFocused?"#ddd":"#fff"}}>
        <img src={props.data.logo} style={{height:"1em"}} />{props.children}
      </div>
    );
  },
  SingleValue:(props)=>{
    const { children, innerProps } = props;
    return (
      <div {...innerProps}>
        <img src={props.data.logo} style={{height:"1em"}} />{children}
      </div>
    );    
  }
};
const CLIENTS = sqlectron.db.CLIENTS.map(dbClient => ({
  value: dbClient.key,
  logo: requireLogos(dbClient.key),
  label: dbClient.name,
  defaultPort: dbClient.defaultPort,
  disabledFeatures: dbClient.disabledFeatures,
}));

const DEFAULT_SSH_PORT = 22;

export default class ServerModalForm extends Component {
  static propTypes = {
    onSaveClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onTestConnectionClick: PropTypes.func.isRequired,
    onDuplicateClick: PropTypes.func.isRequired,
    server: PropTypes.object,
    error: PropTypes.object,
    testConnection: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    let server = props.server || {};
    this.state = {
      ...server,
      isNew: !server.id,
      showPlainPassword: false,
      modalOpen: false,
    };
    // this.state.value = this.state.client;
    console.log(props);
    console.log(this.state);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  componentWillUnmount() {
  }

  onSaveClick() {
    var tmp = this.mapStateToServer(this.state);
    this.props.onSaveClick(tmp);
  }

  onRemoveCancelClick() {
    this.setState({ confirmingRemove: false });
  }

  onRemoveConfirmClick() {
    this.props.onRemoveClick();
  }

  onRemoveOpenClick() {
    this.setState({ confirmingRemove: true });
  }

  onTestConnectionClick() {
    this.props.onTestConnectionClick(this.mapStateToServer(this.state));
  }

  onDuplicateClick() {
    this.props.onDuplicateClick(this.mapStateToServer(this.state));
  }

  onToggleShowPlainPasswordClick() {
    this.setState({ showPlainPassword: !this.state.showPlainPassword });
  }

  isFeatureDisabled(feature) {
    if (!this.state.client) {
      return false;
    }

    const dbClient = CLIENTS.find(dbc => {
      return dbc.value === this.state.client;
    });
    if(dbClient.disabledFeatures && dbClient.disabledFeatures.indexOf(feature)>=0){
      return true;
    }
    else{
      return false;
    }
  }

  mapStateToServer(state) {
    // console.log("mapStateToServer");
    // console.log(state)
    const server = {
      name: state.name,
      client: state.client,
      ssl: !!state.ssl,
      host: state.host && state.host.length ? state.host : null,
      port: state.port || state.defaultPort,
      socketPath:
        state.socketPath && state.socketPath.length ? state.socketPath : null,
      user: state.user || null,
      password: state.password || null,
      database: state.database,
      domain: state.domain,
      schema: state.schema || null,
    };
    // console.log(server);
    const { ssh } = state;
    if (ssh) {
      server.ssh = {
        host: ssh.host,
        port: ssh.port || DEFAULT_SSH_PORT,
        user: ssh.user,
        password: ssh.password && ssh.password.length ? ssh.password : null,
        privateKey:
          ssh.privateKey && ssh.privateKey.length ? ssh.privateKey : null,
        privateKeyWithPassphrase: !!ssh.privateKeyWithPassphrase,
      };
    }

    const { filter } = state;
    if (filter) {
      server.filter = {};
      const addFilter = type => {
        if (!filter[type]) return;

        server.filter[type] = {
          only: (filter[type].only || []).filter(val => val),
          ignore: (filter[type].ignore || []).filter(val => val),
        };

        if (
          !server.filter[type].only.length &&
          !server.filter[type].ignore.length
        ) {
          delete server.filter[type];
        }
      };

      addFilter('database');
      addFilter('schema');

      if (!Object.keys(server.filter).length) {
        delete server.filter;
      }
    }
    // console.log("gen server");
    // console.log(server);
    return server;
  }

  highlightError(name) {
    const { error } = this.state;
    let hasError = !!(error && error[name]);
    if (error && error.ssh && /^ssh\./.test(name)) {
      const sshErrors = error.ssh[0].errors[0];
      const lastName = name.replace(/^ssh\./, '');
      hasError = !!~Object.keys(sshErrors).indexOf(lastName);
    }
    return hasError ? 'error' : '';
  }

  handleOnClientChange=(client)=>{
    this.setState({client:client.value}, () => {
      console.log("after handleOnClientChange==========");
      console.log(this.state);
      const clientConfig = CLIENTS.find(entry => entry.value === client.value);
      if (clientConfig && clientConfig.defaultPort) {
        this.setState({ defaultPort: clientConfig.defaultPort });
      }
    });
  }

  handleChange(event) {
    const newState = {};
    const { target } = event;
    let value = target.files ? target.files[0].path : target.value;
    const name = target.name.replace(/^file\./, '');
    const [name1, name2] = name.split('.');

    if (name1 && name2) {
      newState[name1] = { ...this.state[name1] };
    }

    if (name1 === 'filter') {
      value = value.split('\n');
    }

    set(newState, name, value);

    return this.setState(newState);
  }

  renderClientItem({ label, logo }) {
    return (
      <div>
        <img alt="logo" src={logo} style={{ width: '16px' }} /> {label}
      </div>
    );
  }

  renderMessage() {
    const { testConnection } = this.props;

    if (testConnection.error) {
      return (
        <Message
          closeable
          title="Connection Error"
          message={testConnection.error.message}
          type="error"
        />
      );
    }

    if (testConnection.connected) {
      return (
        <Message
          closeable
          title="Connection Test"
          message="Successfully connected"
          type="success"
        />
      );
    }

    return null;
  }

  renderBasicPanel() {
    var className_name = `nine wide field ${this.highlightError('name')}`;
    var className_client = `six wide field ${this.highlightError('client')}`;
    var className_host = `five wide field ${this.highlightError('host')}`;
    var className_port = `two wide field ${this.highlightError('port')}`;
    var className_domain = `four wide field ${this.highlightError('domain')}`;
    var className_socketPath = `five wide field ${this.highlightError('socketPath')}`;
    var className_user = `four wide field ${this.highlightError('user')}`;
    var className_passwd = `four wide field ${this.highlightError('password')}`;
    var className_database = `four wide field ${this.highlightError(
      'database'
    )}`;
    var className_schema = `four wide field ${this.highlightError('schema')}`;
    let className_sqlite1 = '';
    let input_sqlite;
    if (this.state.client && this.state.client === 'sqlite') {
      input_sqlite = (
        <label>
          <FolderOpenIcon />
          <input
            type="file"
            id="file.database"
            name="file.database"
            onChange={this.handleChange.bind(this)}
          ></input>
        </label>
      );
    }
    // console.log(className_client);
    // console.log("hiiiiiiiiiiiiiiiii");
    // console.log(this.state.value);
    return (
      <div >
        <FormGroup row>
            <label>Name</label>
            <FormControlLabel label="Name" control={
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={this.state.name || ''}
              onChange={this.handleChange.bind(this)}
            />} />
          <label>Database Type</label>
          <Select  name="client"
              components={components}
              styles={styles}
              placeholder="Select"
              options={CLIENTS}
              clearable={false}
              onChange={this.handleOnClientChange}
              value={CLIENTS.find(dbc => {
                return dbc.value === this.state.client;
              })}
            />
            <Checkbox
              name="ssl"
              label="SSL"
              style={{display:this.isFeatureDisabled('server:ssl')?"none":"inline"}}
              checked={this.state.ssl}
              onChange={()=>{
                 if(this.state.ssl){
                  this.setState({ssl:false})
                 }
                 else{
                  this.setState({ssl:true})
                 }
              }}
            />
        </FormGroup>
        <FormGroup row>
              <label style={{display:this.isFeatureDisabled('server:host')?"none":"inline"}}
              >Server Address</label>
              <input
                type="text"
                name="host"
                placeholder="Host"
                value={this.state.host || ''}
                onChange={this.handleChange.bind(this)}
                style={{display:this.isFeatureDisabled('server:host') || this.state.socketPath?"none":"inline"}}
              />
              <input
                type="number"
                name="port"
                maxLength="5"
                placeholder="Port"
                value={this.state.port || this.state.defaultPort || ''}
                onChange={this.handleChange.bind(this)}
                style={{display:this.isFeatureDisabled('server:host') || this.state.socketPath?"none":"inline"}}
              />
              <input
                type="text"
                name="domain"
                placeholder="Domain"
                value={this.state.domain || ''}
                style={{display:this.isFeatureDisabled('server:domain')?"none":"inline"}}
                onChange={this.handleChange.bind(this)}
              />
                <input
                  type="text"
                  name="socketPath"
                  placeholder="Unix socket path"
                  value={this.state.socketPath || ''}
                  onChange={this.handleChange.bind(this)}
                  style={{display:this.state.host ||
                    this.state.port ||
                    this.isFeatureDisabled('server:socketPath')?"none":"inline"}}
                />
                <label
                  htmlFor="file.socketPath"
                  className="ui icon button btn-file"
                >
                  <i className="file outline icon" />
                  <input
                    type="file"
                    id="file.socketPath"
                    name="file.socketPath"
                    onChange={this.handleChange.bind(this)}
                    style={{ display: 'none' }}
                    disabled={
                      this.state.host ||
                      this.state.port ||
                      this.isFeatureDisabled('server:socketPath')
                    }
                  />
                </label>
        </FormGroup>
        <FormGroup row>
            <label style={{display:this.isFeatureDisabled('server:user')?"none":"inline"}}>User</label>
            <input
              type="text"
              name="user"
              placeholder="User"
              value={this.state.user || ''}
              style={{display:this.isFeatureDisabled('server:user')?"none":"inline"}}
              onChange={this.handleChange.bind(this)}
            />
            <div style={{display:this.isFeatureDisabled('server:password')?"none":"inline"}}>
              <label>Password</label>
            </div>
            <div style={{display:this.isFeatureDisabled('server:password')?"none":"inline"}}>
              <input
                type={this.state.showPlainPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={this.state.password || ''}
                disabled={this.isFeatureDisabled('server:password')}
                onChange={this.handleChange.bind(this)}
              />
              <span
                className="ui icon button"
                onClick={this.onToggleShowPlainPasswordClick.bind(this)}
              >
                <i className="unhide icon" />
              </span>
            </div>
            <label>Initial Database/Keyspace</label>
            <div className={className_sqlite1}>
              <input
                type="text"
                name="database"
                placeholder="Database"
                value={this.state.database || ''}
                onChange={this.handleChange.bind(this)}
              />
              {input_sqlite}
            </div>
            <label style={{display:this.isFeatureDisabled('server:schema')?"none":"inline"}}>Initial Schema</label>
            <input
              type="text"
              name="schema"
              maxLength="100"
              placeholder="Schema"
              style={{display:this.isFeatureDisabled('server:schema')?"none":"inline"}}
              value={this.state.schema || ''}
              onChange={this.handleChange.bind(this)}
            />
        </FormGroup>
      </div>
    );
  }

  renderSSHPanel() {
    //console.log("renderSSHPanel");
    const isSSHChecked = !!this.state.ssh;
    const ssh = this.state.ssh || {};

    if (this.isFeatureDisabled('server:ssh')) {
      return null;
    }

    return (
      <div style={{display:"flex",flexWrap:"wrap"}}>
        <div className="one field">
          <Checkbox
            name="sshTunnel"
            label="SSH Tunnel"
             checked={isSSHChecked}
              onChange={()=>{
                 if(isSSHChecked){
                  this.setState({ssl:null})
                 }
                 else{
                  this.setState({ssl:{}})
                 }
              }}
          />
        </div>
        {isSSHChecked && (
          <div>
            <div className="field">
              <label>SSH Address</label>
              <div className="fields">
                <div
                  className={`seven wide field ${this.highlightError(
                    'ssh.host'
                  )}`}
                >
                  <input
                    type="text"
                    name="ssh.host"
                    placeholder="Host"
                    disabled={!isSSHChecked}
                    value={ssh.host || ''}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
                <div
                  className={`three wide field ${this.highlightError(
                    'ssh.port'
                  )}`}
                >
                  <input
                    type="number"
                    name="ssh.port"
                    maxLength="5"
                    placeholder="Port"
                    disabled={!isSSHChecked}
                    value={ssh.port || DEFAULT_SSH_PORT}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
              </div>
            </div>
            <div className="fields">
              <div
                className={`four wide field ${this.highlightError('ssh.user')}`}
              >
                <label>User</label>
                <input
                  type="text"
                  name="ssh.user"
                  placeholder="User"
                  disabled={!isSSHChecked}
                  value={ssh.user || ''}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div
                className={`four wide field ${this.highlightError(
                  'ssh.password'
                )}`}
              >
                <label>Password</label>
                <input
                  type="password"
                  name="ssh.password"
                  placeholder="Password"
                  disabled={!isSSHChecked || ssh.privateKey}
                  value={ssh.password || ''}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div
                className={`five wide field ${this.highlightError(
                  'ssh.privateKey'
                )}`}
              >
                <label>Private Key</label>
                <div className="ui action input">
                  <input
                    type="text"
                    name="ssh.privateKey"
                    placeholder="~/.ssh/id_rsa"
                    disabled={!isSSHChecked || ssh.password}
                    value={ssh.privateKey || ''}
                    onChange={this.handleChange.bind(this)}
                  />
                  <label
                    htmlFor="file.ssh.privateKey"
                    className="ui icon button btn-file"
                  >
                    <i className="file outline icon" />
                    <input
                      type="file"
                      id="file.ssh.privateKey"
                      name="file.ssh.privateKey"
                      onChange={this.handleChange.bind(this)}
                      disabled={!isSSHChecked || ssh.password}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              <div className="three wide field" style={{ paddingTop: '2em' }}>
                <Checkbox
                  name="ssh.privateKeyWithPassphrase"
                  label="Passphrase"
                  disabled={!!(!isSSHChecked || ssh.password)}
              checked={ssh && ssh.privateKeyWithPassphrase}
              onChange={()=>{
                 if(isSSHChecked){
                    const stateSSH = this.state.ssh
                      ? { ...this.state.ssh }
                      : {};
                    stateSSH.privateKeyWithPassphrase = true;
                    this.setState({ ssh: stateSSH });
                 }
                 else{
                    const stateSSH = this.state.ssh
                      ? { ...this.state.ssh }
                      : {};
                    stateSSH.privateKeyWithPassphrase = false;
                    this.setState({ ssh: stateSSH });
                 }
              }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderFilterPanelItem(isFilterChecked, filter, label, type) {
    const filterType = filter[type] || {};

    return (
      <div className="field">
        <label>{label}</label>
        <div className="fields">
          <div
            className={`eight wide field ${this.highlightError(
              `filter.${type}.only`
            )}`}
          >
            <label>Only</label>
            <textarea
              name={`filter.${type}.only`}
              placeholder="Only"
              rows="3"
              disabled={!isFilterChecked}
              value={filterType.only ? filterType.only.join('\n') : ''}
              onChange={this.handleChange.bind(this)}
            />
          </div>
          <div
            className={`eight wide field ${this.highlightError(
              `filter.${type}.ignore`
            )}`}
          >
            <label>Ignore</label>
            <textarea
              name={`filter.${type}.ignore`}
              placeholder="Ignore"
              rows="3"
              disabled={!isFilterChecked}
              value={filterType.ignore ? filterType.ignore.join('\n') : ''}
              onChange={this.handleChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

  renderFilterPanel() {
    /* eslint max-len:0 */
    //console.log("renderFilterPanel");
    const isFilterChecked = !!this.state.filter;
    const filter = this.state.filter || {};

    if (this.isFeatureDisabled('server:filter')) {
      return null;
    }
    let addDiv;
    if (isFilterChecked) {
      addDiv = (
        <div>
          <p>
            <em>
              Allow to pre filter the data available in the sidebar. It improves
              the rendering performance for large servers.
              <br />
              Separate values by break line
            </em>
          </p>
          {this.renderFilterPanelItem(
            isFilterChecked,
            filter,
            'Database',
            'database'
          )}
          {this.renderFilterPanelItem(
            isFilterChecked,
            filter,
            'Schema',
            'schema'
          )}
        </div>
      );
    } else {
      addDiv = null;
    }
    return (
      <div className="ui segment">
        <div className="one field">
          <FormControlLabel label="Filter" control={
          <Checkbox
            name="filter"
            
            checked={isFilterChecked}
              onChange={()=>{
                 if(isFilterChecked){
                  this.setState({filter:null})
                 }
                 else{
                  this.setState({filter:{}})
                 }
              }}
          />} />
        </div>
        {addDiv}
      </div>
    );
  }

  renderActionsPanel() {
    const { testConnection } = this.props;
    const { isNew, client } = this.state;

    const classStatusButtons = testConnection.connecting ? 'disabled' : '';
    const classStatusTestButton = [
      client ? '' : 'disabled',
      testConnection.connecting ? 'loading' : '',
    ].join(' ');
    //console.log("renderActionsPanel");
    //console.log(classStatusButtons);

    return (
      <React.Fragment>
        <Button variant="outlined"
          className={`small ui blue right labeled icon button ${classStatusTestButton}`}
          tabIndex="0"
          onClick={this.onTestConnectionClick.bind(this)}
        >
          Test
          <i className="plug icon" />
        </Button>
        {!isNew && (
          <Button variant="outlined"
            className={`small ui right labeled icon button ${classStatusButtons}`}
            tabIndex="0"
            onClick={this.onDuplicateClick.bind(this)}
          >
            Duplicate
            <i className="copy icon" />
          </Button>
        )}
        <Button variant="outlined"
          className={`small ui black deny right labeled icon button ${classStatusButtons}`}
          onClick={this.props.onCancelClick}
          tabIndex="0"
        >
          Cancel
          <i className="ban icon" />
        </Button>
        <Button variant="outlined"
          className={`small ui green right labeled icon button ${classStatusButtons}`}
          tabIndex="0"
          onClick={this.onSaveClick.bind(this)}
        >
          Save
          <i className="checkmark icon" />
        </Button>
        {!isNew && (
          <Button
            variant="outlined"
            className={`small ui red right labeled icon button ${classStatusButtons}`}
            tabIndex="0"
            onClick={this.onRemoveOpenClick.bind(this)}
          >
            Remove
            <i className="trash icon" />
          </Button>
        )}
     </React.Fragment>
    );
  }

  renderConfirmRemoveModal() {
    const { confirmingRemove } = this.state;

    if (!confirmingRemove) {
      return null;
    }

    return (
      <ConfirmModal
        modalOpen={confirmingRemove}
        context="#server-modal"
        title={`Delete ${this.state.name}`}
        message="Are you sure you want to remove this server connection?"
        onCancelClick={this.onRemoveCancelClick.bind(this)}
        onRemoveClick={this.onRemoveConfirmClick.bind(this)}
      />
    );
  }

  render() {
    // console.log("render== ServerModalForm")
    // console.log(this.state);
    return (
      <Dialog open={this.props.modalOpen} fullScreen>
        <DialogTitle>Edit Server</DialogTitle>
        <DialogContent>
          {this.renderMessage()}
          {this.renderBasicPanel()}
          {this.renderSSHPanel()}
          {this.renderFilterPanel()}
        </DialogContent>
        <DialogActions>
          {this.renderActionsPanel()}
          {this.renderConfirmRemoveModal()}
        </DialogActions>
      </Dialog>
    );
  }
}
