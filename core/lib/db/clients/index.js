"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CLIENTS = void 0;

var _mysql = _interopRequireDefault(require("./mysql"));

var _postgresql = _interopRequireDefault(require("./postgresql"));

var _sqlserver = _interopRequireDefault(require("./sqlserver"));

var _sqlite = _interopRequireDefault(require("./sqlite"));

var _cassandra = _interopRequireDefault(require("./cassandra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * List of supported database clients
 */
const CLIENTS = [{
  key: 'mysql',
  name: 'MySQL',
  defaultPort: 3306,
  disabledFeatures: ['server:schema', 'server:domain']
}, {
  key: 'postgresql',
  name: 'PostgreSQL',
  defaultDatabase: 'postgres',
  defaultPort: 5432,
  disabledFeatures: ['server:domain']
}, {
  key: 'sqlserver',
  name: 'Microsoft SQL Server',
  defaultPort: 1433
}, {
  key: 'sqlite',
  name: 'SQLite',
  defaultDatabase: ':memory:',
  disabledFeatures: ['server:ssl', 'server:host', 'server:port', 'server:socketPath', 'server:user', 'server:password', 'server:schema', 'server:domain', 'server:ssh', 'scriptCreateTable', 'cancelQuery']
}, {
  key: 'cassandra',
  name: 'Cassandra',
  defaultPort: 9042,
  disabledFeatures: ['server:ssl', 'server:socketPath', 'server:user', 'server:password', 'server:schema', 'server:domain', 'scriptCreateTable', 'cancelQuery']
}];
exports.CLIENTS = CLIENTS;
var _default = {
  mysql: _mysql.default,
  postgresql: _postgresql.default,
  sqlserver: _sqlserver.default,
  sqlite: _sqlite.default,
  cassandra: _cassandra.default
};
exports.default = _default;