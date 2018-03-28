'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateAllTables = undefined;

exports.default = function (server, database) {
  return new Promise((() => {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      const dbConfig = configDatabase(server, database);

      logger().debug('creating database client %j', dbConfig);
      const client = new _cassandraDriver.Client(dbConfig);

      logger().debug('connecting');
      client.connect(function (err) {
        if (err) {
          client.shutdown();
          return reject(err);
        }

        logger().debug('connected');
        resolve({
          wrapIdentifier,
          disconnect: function () {
            return disconnect(client);
          },
          listTables: function (db) {
            return listTables(client, db);
          },
          listViews: function () {
            return listViews(client);
          },
          listRoutines: function () {
            return listRoutines(client);
          },
          listTableColumns: function (db, table) {
            return listTableColumns(client, db, table);
          },
          listTableTriggers: function (table) {
            return listTableTriggers(client, table);
          },
          listTableIndexes: function (db, table) {
            return listTableIndexes(client, table);
          },
          listSchemas: function () {
            return listSchemas(client);
          },
          getTableReferences: function (table) {
            return getTableReferences(client, table);
          },
          getTableKeys: function (db, table) {
            return getTableKeys(client, db, table);
          },
          query: function (queryText) {
            return executeQuery(client, queryText);
          },
          executeQuery: function (queryText) {
            return executeQuery(client, queryText);
          },
          listDatabases: function () {
            return listDatabases(client);
          },
          getQuerySelectTop: function (table, limit) {
            return getQuerySelectTop(client, table, limit);
          },
          getTableCreateScript: function (table) {
            return getTableCreateScript(client, table);
          },
          getViewCreateScript: function (view) {
            return getViewCreateScript(client, view);
          },
          getRoutineCreateScript: function (routine) {
            return getRoutineCreateScript(client, routine);
          },
          truncateAllTables: function (db) {
            return truncateAllTables(client, db);
          }
        });
      });
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })());
};

exports.disconnect = disconnect;
exports.listTables = listTables;
exports.listViews = listViews;
exports.listRoutines = listRoutines;
exports.listTableColumns = listTableColumns;
exports.listTableTriggers = listTableTriggers;
exports.listTableIndexes = listTableIndexes;
exports.listSchemas = listSchemas;
exports.getTableReferences = getTableReferences;
exports.getTableKeys = getTableKeys;
exports.executeQuery = executeQuery;
exports.listDatabases = listDatabases;
exports.getQuerySelectTop = getQuerySelectTop;
exports.getTableCreateScript = getTableCreateScript;
exports.getViewCreateScript = getViewCreateScript;
exports.getRoutineCreateScript = getRoutineCreateScript;
exports.wrapIdentifier = wrapIdentifier;

var _cassandraDriver = require('cassandra-driver');

var _sqlQueryIdentifier = require('sql-query-identifier');

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logger2.default)('db:clients:cassandra');

/**
 * To keep compatibility with the other clients we treat keyspaces as database.
 */

function disconnect(client) {
  client.shutdown();
}

function listTables(client, database) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT table_name as name
      FROM system_schema.tables
      WHERE keyspace_name = ?
    `;
    const params = [database];
    client.execute(sql, params, (err, data) => {
      if (err) return reject(err);
      resolve(data.rows.map(row => ({ name: row.name })));
    });
  });
}

function listViews() {
  return Promise.resolve([]);
}

function listRoutines() {
  return Promise.resolve([]);
}

function listTableColumns(client, database, table) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT position, column_name, type
      FROM system_schema.columns
      WHERE keyspace_name = ?
        AND table_name = ?
    `;
    const params = [database, table];
    client.execute(sql, params, (err, data) => {
      if (err) return reject(err);
      resolve(data.rows
      // force pks be placed at the results beginning
      .sort((a, b) => b.position - a.position).map(row => ({
        columnName: row.column_name,
        dataType: row.type
      })));
    });
  });
}

function listTableTriggers() {
  return Promise.resolve([]);
}
function listTableIndexes() {
  return Promise.resolve([]);
}

function listSchemas() {
  return Promise.resolve([]);
}

function getTableReferences() {
  return Promise.resolve([]);
}

function getTableKeys(client, database, table) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT column_name
      FROM system_schema.columns
      WHERE keyspace_name = ?
        AND table_name = ?
        AND kind = 'partition_key'
      ALLOW FILTERING
    `;
    const params = [database, table];
    client.execute(sql, params, (err, data) => {
      if (err) return reject(err);
      resolve(data.rows.map(row => ({
        constraintName: null,
        columnName: row.column_name,
        referencedTable: null,
        keyType: 'PRIMARY KEY'
      })));
    });
  });
}

function query(conn, queryText) {
  // eslint-disable-line no-unused-vars
  throw new Error('"query" function is not implementd by cassandra client.');
}

function executeQuery(client, queryText) {
  const commands = identifyCommands(queryText).map(item => item.type);

  return new Promise((resolve, reject) => {
    client.execute(queryText, (err, data) => {
      if (err) return reject(err);

      resolve([parseRowQueryResult(data, commands[0])]);
    });
  });
}

function listDatabases(client) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT keyspace_name FROM system_schema.keyspaces';
    const params = [];
    client.execute(sql, params, (err, data) => {
      if (err) return reject(err);
      resolve(data.rows.map(row => row.keyspace_name));
    });
  });
}

function getQuerySelectTop(client, table, limit) {
  return `SELECT * FROM ${wrapIdentifier(table)} LIMIT ${limit}`;
}

function getTableCreateScript() {
  return Promise.resolve([]);
}

function getViewCreateScript() {
  return Promise.resolve([]);
}

function getRoutineCreateScript() {
  return Promise.resolve([]);
}

function wrapIdentifier(value) {
  if (value === '*') return value;
  const matched = value.match(/(.*?)(\[[0-9]\])/); // eslint-disable-line no-useless-escape
  if (matched) return wrapIdentifier(matched[1]) + matched[2];
  return `"${value.replace(/"/g, '""')}"`;
}

const truncateAllTables = exports.truncateAllTables = (() => {
  var _ref2 = _asyncToGenerator(function* (connection, database) {
    const sql = `
    SELECT table_name
    FROM system_schema.tables
    WHERE keyspace_name = '${database}'
  `;
    const [result] = yield executeQuery(connection, sql);
    const tables = result.rows.map(function (row) {
      return row.table_name;
    });
    const promises = tables.map(function (t) {
      const truncateSQL = `
      TRUNCATE TABLE ${wrapIdentifier(database)}.${wrapIdentifier(t)};
    `;
      return executeQuery(connection, truncateSQL);
    });

    yield Promise.all(promises);
  });

  return function truncateAllTables(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

function configDatabase(server, database) {
  const config = {
    contactPoints: [server.config.host],
    protocolOptions: {
      port: server.config.port
    },
    keyspace: database.database
  };

  if (server.sshTunnel) {
    config.contactPoints = [server.config.localHost];
    config.protocolOptions.port = server.config.localPort;
  }

  if (server.config.ssl) {
    // TODO: sslOptions
  }

  return config;
}

function parseRowQueryResult(data, command) {
  // Fallback in case the identifier could not reconize the command
  const isSelect = command ? command === 'SELECT' : Array.isArray(data.rows);
  return {
    command: command || isSelect && 'SELECT',
    rows: data.rows || [],
    fields: data.columns || [],
    rowCount: isSelect ? data.rowLength || 0 : undefined,
    affectedRows: !isSelect && !isNaN(data.rowLength) ? data.rowLength : undefined
  };
}

function identifyCommands(queryText) {
  try {
    return (0, _sqlQueryIdentifier.identify)(queryText);
  } catch (err) {
    return [];
  }
}