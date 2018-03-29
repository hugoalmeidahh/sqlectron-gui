'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let connect = (() => {
  var _ref = _asyncToGenerator(function* (server, database) {
    /* eslint no-param-reassign: 0 */
    if (database.connecting) {
      throw new Error('There is already a connection in progress for this server. Aborting this new request.');
    }

    if (database.connecting) {
      throw new Error('There is already a connection in progress for this database. Aborting this new request.');
    }

    try {
      database.connecting = true;

      // terminate any previous lost connection for this DB
      if (database.connection) {
        database.connection.disconnect();
      }

      // reuse existing tunnel
      if (server.config.ssh && !server.sshTunnel) {
        logger().debug('creating ssh tunnel');
        server.sshTunnel = yield (0, _tunnel2.default)(server.config);

        const { address, port } = server.sshTunnel.address();
        logger().debug('ssh forwarding through local connection %s:%d', address, port);

        server.config.localHost = address;
        server.config.localPort = port;
      }

      const driver = _clients2.default[server.config.client];

      const [connection] = yield Promise.all([driver(server, database), handleSSHError(server.sshTunnel)]);

      database.connection = connection;
    } catch (err) {
      logger().error('Connection error %j', err);
      disconnect(server, database);
      throw err;
    } finally {
      database.connecting = false;
    }
  });

  return function connect(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getQuerySelectTop = (() => {
  var _ref2 = _asyncToGenerator(function* (server, database, table, schema, limit) {
    checkIsConnected(server, database);
    let limitValue = limit;
    if (typeof _limit === 'undefined') {
      yield loadConfigLimit();
      limitValue = typeof limitSelect !== 'undefined' ? limitSelect : DEFAULT_LIMIT;
    }
    return database.connection.getQuerySelectTop(table, limitValue, schema);
  });

  return function getQuerySelectTop(_x3, _x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
})();

let getTableSelectScript = (() => {
  var _ref3 = _asyncToGenerator(function* (server, database, table, schema) {
    const columnNames = yield getTableColumnNames(server, database, table, schema);
    const schemaSelection = resolveSchema(database, schema);
    return [`SELECT ${wrap(database, columnNames).join(', ')}`, `FROM ${schemaSelection}${wrap(database, table)};`].join(' ');
  });

  return function getTableSelectScript(_x8, _x9, _x10, _x11) {
    return _ref3.apply(this, arguments);
  };
})();

let getTableInsertScript = (() => {
  var _ref4 = _asyncToGenerator(function* (server, database, table, schema) {
    const columnNames = yield getTableColumnNames(server, database, table, schema);
    const schemaSelection = resolveSchema(database, schema);
    return [`INSERT INTO ${schemaSelection}${wrap(database, table)}`, `(${wrap(database, columnNames).join(', ')})\n`, `VALUES (${columnNames.fill('?').join(', ')});`].join(' ');
  });

  return function getTableInsertScript(_x12, _x13, _x14, _x15) {
    return _ref4.apply(this, arguments);
  };
})();

let getTableUpdateScript = (() => {
  var _ref5 = _asyncToGenerator(function* (server, database, table, schema) {
    const columnNames = yield getTableColumnNames(server, database, table, schema);
    const setColumnForm = wrap(database, columnNames).map(function (col) {
      return `${col}=?`;
    }).join(', ');
    const schemaSelection = resolveSchema(database, schema);
    return [`UPDATE ${schemaSelection}${wrap(database, table)}\n`, `SET ${setColumnForm}\n`, 'WHERE <condition>;'].join(' ');
  });

  return function getTableUpdateScript(_x16, _x17, _x18, _x19) {
    return _ref5.apply(this, arguments);
  };
})();

let getTableColumnNames = (() => {
  var _ref6 = _asyncToGenerator(function* (server, database, table, schema) {
    checkIsConnected(server, database);
    const columns = yield database.connection.listTableColumns(database.database, table, schema);
    return columns.map(function (column) {
      return column.columnName;
    });
  });

  return function getTableColumnNames(_x20, _x21, _x22, _x23) {
    return _ref6.apply(this, arguments);
  };
})();

let loadConfigLimit = (() => {
  var _ref7 = _asyncToGenerator(function* () {
    if (limitSelect === null) {
      const { limitQueryDefaultSelectTop } = yield config.get();
      limitSelect = limitQueryDefaultSelectTop;
    }
    return limitSelect;
  });

  return function loadConfigLimit() {
    return _ref7.apply(this, arguments);
  };
})();

exports.createConnection = createConnection;

var _tunnel = require('./tunnel');

var _tunnel2 = _interopRequireDefault(_tunnel);

var _clients = require('./clients');

var _clients2 = _interopRequireDefault(_clients);

var _config = require('../config');

var config = _interopRequireWildcard(_config);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logger2.default)('db');

const DEFAULT_LIMIT = 1000;
let limitSelect = null;

function createConnection(server, database) {
  /**
   * Database public API
   */
  return {
    connect: connect.bind(null, server, database),
    disconnect: disconnect.bind(null, server, database),
    listTables: listTables.bind(null, server, database),
    listViews: listViews.bind(null, server, database),
    listRoutines: listRoutines.bind(null, server, database),
    listTableColumns: listTableColumns.bind(null, server, database),
    listTableTriggers: listTableTriggers.bind(null, server, database),
    listTableIndexes: listTableIndexes.bind(null, server, database),
    listSchemas: listSchemas.bind(null, server, database),
    getTableReferences: getTableReferences.bind(null, server, database),
    getTableKeys: getTableKeys.bind(null, server, database),
    query: query.bind(null, server, database),
    executeQuery: executeQuery.bind(null, server, database),
    listDatabases: listDatabases.bind(null, server, database),
    getQuerySelectTop: getQuerySelectTop.bind(null, server, database),
    getTableCreateScript: getTableCreateScript.bind(null, server, database),
    getTableSelectScript: getTableSelectScript.bind(null, server, database),
    getTableInsertScript: getTableInsertScript.bind(null, server, database),
    getTableUpdateScript: getTableUpdateScript.bind(null, server, database),
    getTableDeleteScript: getTableDeleteScript.bind(null, server, database),
    getViewCreateScript: getViewCreateScript.bind(null, server, database),
    getRoutineCreateScript: getRoutineCreateScript.bind(null, server, database),
    truncateAllTables: truncateAllTables.bind(null, server, database)
  };
}

function handleSSHError(sshTunnel) {
  return new Promise((resolve, reject) => {
    if (!sshTunnel) {
      return resolve();
    }

    sshTunnel.on('success', resolve);
    sshTunnel.on('error', error => {
      logger().error('ssh error %j', error);
      reject(error);
    });
  });
}

function disconnect(server, database) {
  database.connecting = false;

  if (database.connection) {
    database.connection.disconnect();
    database.connection = null;
  }

  if (server.db[database.database]) {
    delete server.db[database.database];
  }
}

function listSchemas(server, database, filter) {
  checkIsConnected(server, database);
  return database.connection.listSchemas(database.database, filter);
}

function listTables(server, database, filter) {
  checkIsConnected(server, database);
  return database.connection.listTables(database.database, filter);
}

function listViews(server, database, filter) {
  checkIsConnected(server, database);
  return database.connection.listViews(filter);
}

function listRoutines(server, database, filter) {
  checkIsConnected(server, database);
  return database.connection.listRoutines(filter);
}

function listTableColumns(server, database, table, schema) {
  checkIsConnected(server, database);
  return database.connection.listTableColumns(database.database, table, schema);
}

function listTableTriggers(server, database, table, schema) {
  checkIsConnected(server, database);
  return database.connection.listTableTriggers(table, schema);
}

function listTableIndexes(server, database, table, schema) {
  checkIsConnected(server, database);
  return database.connection.listTableIndexes(database.database, table, schema);
}

function getTableReferences(server, database, table, schema) {
  checkIsConnected(server, database);
  return database.connection.getTableReferences(table, schema);
}

function getTableKeys(server, database, table, schema) {
  checkIsConnected(server, database);
  return database.connection.getTableKeys(database.database, table, schema);
}

function query(server, database, queryText) {
  checkIsConnected(server, database);
  return database.connection.query(queryText);
}

function executeQuery(server, database, queryText) {
  checkIsConnected(server, database);
  return database.connection.executeQuery(queryText);
}

function listDatabases(server, database, filter) {
  checkIsConnected(server, database);
  return database.connection.listDatabases(filter);
}

function getTableCreateScript(server, database, table, schema) {
  checkIsConnected(server, database);
  return database.connection.getTableCreateScript(table, schema);
}

function getTableDeleteScript(server, database, table, schema) {
  const schemaSelection = resolveSchema(database, schema);
  return [`DELETE FROM ${schemaSelection}${wrap(database, table)}`, 'WHERE <condition>;'].join(' ');
}

function getViewCreateScript(server, database, view /* , schema */) {
  checkIsConnected(server, database);
  return database.connection.getViewCreateScript(view);
}

function getRoutineCreateScript(server, database, routine, type, schema) {
  checkIsConnected(server, database);
  return database.connection.getRoutineCreateScript(routine, type, schema);
}

function truncateAllTables(server, database, schema) {
  return database.connection.truncateAllTables(database.database, schema);
}

function resolveSchema(database, schema) {
  return schema ? `${wrap(database, schema)}.` : '';
}

function wrap(database, identifier) {
  if (!Array.isArray(identifier)) {
    return database.connection.wrapIdentifier(identifier);
  }

  return identifier.map(item => database.connection.wrapIdentifier(item));
}

function checkIsConnected(server, database) {
  if (database.connecting || !database.connection) {
    throw new Error('There is no connection available.');
  }
}