"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
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
exports.truncateAllTables = void 0;

var _cassandraDriver = require("cassandra-driver");

var _sqlQueryIdentifier = require("sql-query-identifier");

var _logger = _interopRequireDefault(require("../../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _logger.default)('db:clients:cassandra');
/**
 * To keep compatibility with the other clients we treat keyspaces as database.
 */

function _default(server, database) {
  return new Promise(async (resolve, reject) => {
    const dbConfig = configDatabase(server, database);
    logger().debug('creating database client %j', dbConfig);
    const client = new _cassandraDriver.Client(dbConfig);
    logger().debug('connecting');
    client.connect(err => {
      if (err) {
        client.shutdown();
        return reject(err);
      }

      logger().debug('connected');
      resolve({
        wrapIdentifier,
        disconnect: () => disconnect(client),
        listTables: db => listTables(client, db),
        listViews: () => listViews(client),
        listRoutines: () => listRoutines(client),
        listTableColumns: (db, table) => listTableColumns(client, db, table),
        listTableTriggers: table => listTableTriggers(client, table),
        listTableIndexes: (db, table) => listTableIndexes(client, table),
        listSchemas: () => listSchemas(client),
        getTableReferences: table => getTableReferences(client, table),
        getTableKeys: (db, table) => getTableKeys(client, db, table),
        query: queryText => executeQuery(client, queryText),
        executeQuery: queryText => executeQuery(client, queryText),
        listDatabases: () => listDatabases(client),
        getQuerySelectTop: (table, limit) => getQuerySelectTop(client, table, limit),
        getTableCreateScript: table => getTableCreateScript(client, table),
        getViewCreateScript: view => getViewCreateScript(client, view),
        getRoutineCreateScript: routine => getRoutineCreateScript(client, routine),
        truncateAllTables: db => truncateAllTables(client, db)
      });
    });
  });
}

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
      resolve(data.rows.map(row => ({
        name: row.name
      })));
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
      resolve(data.rows // force pks be placed at the results beginning
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

const truncateAllTables = async (connection, database) => {
  const sql = `
    SELECT table_name
    FROM system_schema.tables
    WHERE keyspace_name = '${database}'
  `;
  const [result] = await executeQuery(connection, sql);
  const tables = result.rows.map(row => row.table_name);
  const promises = tables.map(t => {
    const truncateSQL = `
      TRUNCATE TABLE ${wrapIdentifier(database)}.${wrapIdentifier(t)};
    `;
    return executeQuery(connection, truncateSQL);
  });
  await Promise.all(promises);
};

exports.truncateAllTables = truncateAllTables;

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

  if (server.config.ssl) {// TODO: sslOptions
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