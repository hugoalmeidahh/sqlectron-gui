'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createServer = createServer;

var _client = require('./client');

var _clients = require('./clients');

function createServer(serverConfig) {
  if (!serverConfig) {
    throw new Error('Missing server configuration');
  }

  if (!_clients.CLIENTS.some(cli => cli.key === serverConfig.client)) {
    throw new Error('Invalid SQL client');
  }

  const server = {
    /**
     * All connected dbs
     */
    db: {},

    config: _extends({}, serverConfig, {
      host: serverConfig.host || serverConfig.socketPath
    })
  };

  /**
  * Server public API
  */
  return {
    db(dbName) {
      return server.db[dbName];
    },

    end() {
      // disconnect from all DBs
      Object.keys(server.db).forEach(key => server.db[key].disconnect());

      // close SSH tunnel
      if (server.sshTunnel) {
        server.sshTunnel.close();
        server.sshTunnel = null;
      }
    },

    createConnection(dbName, cryptoSecret) {
      if (server.db[dbName]) {
        return server.db[dbName];
      }

      const database = {
        database: dbName,
        connection: null,
        connecting: false
      };

      server.db[dbName] = (0, _client.createConnection)(server, database, cryptoSecret);

      return server.db[dbName];
    }
  };
}