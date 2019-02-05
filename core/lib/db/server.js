"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createServer = createServer;

var _client = require("./client");

var _clients = require("./clients");

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
    config: { ...serverConfig,
      host: serverConfig.host || serverConfig.socketPath
    }
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
      Object.keys(server.db).forEach(key => server.db[key].disconnect()); // close SSH tunnel

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