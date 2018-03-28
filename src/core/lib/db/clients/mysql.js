'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateAllTables = exports.getRoutineCreateScript = exports.getViewCreateScript = exports.getTableCreateScript = exports.listDatabases = exports.executeQuery = exports.getTableKeys = exports.getTableReferences = exports.listTableIndexes = exports.listTableTriggers = exports.listTableColumns = exports.listRoutines = exports.listViews = exports.listTables = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let listTables = exports.listTables = (() => {
  var _ref2 = _asyncToGenerator(function* (conn) {
    const sql = `
    SELECT table_name as name
    FROM information_schema.tables
    WHERE table_schema = database()
    AND table_type NOT LIKE '%VIEW%'
    ORDER BY table_name
  `;

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data;
  });

  return function listTables(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

let listViews = exports.listViews = (() => {
  var _ref3 = _asyncToGenerator(function* (conn) {
    const sql = `
    SELECT table_name as name
    FROM information_schema.views
    WHERE table_schema = database()
    ORDER BY table_name
  `;

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data;
  });

  return function listViews(_x4) {
    return _ref3.apply(this, arguments);
  };
})();

let listRoutines = exports.listRoutines = (() => {
  var _ref4 = _asyncToGenerator(function* (conn) {
    const sql = `
    SELECT routine_name, routine_type
    FROM information_schema.routines
    WHERE routine_schema = database()
    ORDER BY routine_name
  `;

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data.map(function (row) {
      return {
        routineName: row.routine_name,
        routineType: row.routine_type
      };
    });
  });

  return function listRoutines(_x5) {
    return _ref4.apply(this, arguments);
  };
})();

let listTableColumns = exports.listTableColumns = (() => {
  var _ref5 = _asyncToGenerator(function* (conn, database, table) {
    const sql = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = database()
    AND table_name = ?
  `;

    const params = [table];

    const { data } = yield driverExecuteQuery(conn, { query: sql, params });

    return data.map(function (row) {
      return {
        columnName: row.column_name,
        dataType: row.data_type
      };
    });
  });

  return function listTableColumns(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
})();

let listTableTriggers = exports.listTableTriggers = (() => {
  var _ref6 = _asyncToGenerator(function* (conn, table) {
    const sql = `
    SELECT trigger_name
    FROM information_schema.triggers
    WHERE event_object_schema = database()
    AND event_object_table = ?
  `;

    const params = [table];

    const { data } = yield driverExecuteQuery(conn, { query: sql, params });

    return data.map(function (row) {
      return row.trigger_name;
    });
  });

  return function listTableTriggers(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
})();

let listTableIndexes = exports.listTableIndexes = (() => {
  var _ref7 = _asyncToGenerator(function* (conn, database, table) {
    const sql = 'SHOW INDEX FROM ?? FROM ??';

    const params = [table, database];

    const { data } = yield driverExecuteQuery(conn, { query: sql, params });

    return data.map(function (row) {
      return row.Key_name;
    });
  });

  return function listTableIndexes(_x11, _x12, _x13) {
    return _ref7.apply(this, arguments);
  };
})();

let getTableReferences = exports.getTableReferences = (() => {
  var _ref8 = _asyncToGenerator(function* (conn, table) {
    const sql = `
    SELECT referenced_table_name
    FROM information_schema.key_column_usage
    WHERE referenced_table_name IS NOT NULL
    AND table_schema = database()
    AND table_name = ?
  `;

    const params = [table];

    const { data } = yield driverExecuteQuery(conn, { query: sql, params });

    return data.map(function (row) {
      return row.referenced_table_name;
    });
  });

  return function getTableReferences(_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
})();

let getTableKeys = exports.getTableKeys = (() => {
  var _ref9 = _asyncToGenerator(function* (conn, database, table) {
    const sql = `
    SELECT constraint_name, column_name, referenced_table_name,
      CASE WHEN (referenced_table_name IS NOT NULL) THEN 'FOREIGN'
      ELSE constraint_name
      END as key_type
    FROM information_schema.key_column_usage
    WHERE table_schema = database()
    AND table_name = ?
    AND ((referenced_table_name IS NOT NULL) OR constraint_name LIKE '%PRIMARY%')
  `;

    const params = [table];

    const { data } = yield driverExecuteQuery(conn, { query: sql, params });

    return data.map(function (row) {
      return {
        constraintName: `${row.constraint_name} KEY`,
        columnName: row.column_name,
        referencedTable: row.referenced_table_name,
        keyType: `${row.key_type} KEY`
      };
    });
  });

  return function getTableKeys(_x16, _x17, _x18) {
    return _ref9.apply(this, arguments);
  };
})();

let executeQuery = exports.executeQuery = (() => {
  var _ref11 = _asyncToGenerator(function* (conn, queryText) {
    const { fields, data } = yield driverExecuteQuery(conn, { query: queryText });
    if (!data) {
      return [];
    }

    const commands = identifyCommands(queryText).map(function (item) {
      return item.type;
    });

    if (!isMultipleQuery(fields)) {
      return [parseRowQueryResult(data, fields, commands[0])];
    }

    return data.map(function (_, idx) {
      return parseRowQueryResult(data[idx], fields[idx], commands[idx]);
    });
  });

  return function executeQuery(_x20, _x21) {
    return _ref11.apply(this, arguments);
  };
})();

let listDatabases = exports.listDatabases = (() => {
  var _ref12 = _asyncToGenerator(function* (conn, filter) {
    const sql = 'show databases';

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data.filter(function (item) {
      return filterDatabase(item, filter, 'Database');
    }).map(function (row) {
      return row.Database;
    });
  });

  return function listDatabases(_x22, _x23) {
    return _ref12.apply(this, arguments);
  };
})();

let getTableCreateScript = exports.getTableCreateScript = (() => {
  var _ref13 = _asyncToGenerator(function* (conn, table) {
    const sql = `SHOW CREATE TABLE ${table}`;

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data.map(function (row) {
      return row['Create Table'];
    });
  });

  return function getTableCreateScript(_x24, _x25) {
    return _ref13.apply(this, arguments);
  };
})();

let getViewCreateScript = exports.getViewCreateScript = (() => {
  var _ref14 = _asyncToGenerator(function* (conn, view) {
    const sql = `SHOW CREATE VIEW ${view}`;

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data.map(function (row) {
      return row['Create View'];
    });
  });

  return function getViewCreateScript(_x26, _x27) {
    return _ref14.apply(this, arguments);
  };
})();

let getRoutineCreateScript = exports.getRoutineCreateScript = (() => {
  var _ref15 = _asyncToGenerator(function* (conn, routine, type) {
    const sql = `SHOW CREATE ${type.toUpperCase()} ${routine}`;

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data.map(function (row) {
      return row[`Create ${type}`];
    });
  });

  return function getRoutineCreateScript(_x28, _x29, _x30) {
    return _ref15.apply(this, arguments);
  };
})();

let getSchema = (() => {
  var _ref16 = _asyncToGenerator(function* (conn) {
    const sql = 'SELECT database() AS \'schema\'';

    const { data } = yield driverExecuteQuery(conn, { query: sql });

    return data[0].schema;
  });

  return function getSchema(_x31) {
    return _ref16.apply(this, arguments);
  };
})();

let truncateAllTables = exports.truncateAllTables = (() => {
  var _ref17 = _asyncToGenerator(function* (conn) {
    yield runWithConnection(conn, (() => {
      var _ref18 = _asyncToGenerator(function* (connection) {
        const connClient = { connection };

        const schema = yield getSchema(connClient);

        const sql = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = '${schema}'
      AND table_type NOT LIKE '%VIEW%'
    `;

        const { data } = yield driverExecuteQuery(connClient, { query: sql });

        const truncateAll = data.map(function (row) {
          return `
      SET FOREIGN_KEY_CHECKS = 0;
      TRUNCATE TABLE ${wrapIdentifier(schema)}.${wrapIdentifier(row.table_name)};
      SET FOREIGN_KEY_CHECKS = 1;
    `;
        }).join('');

        yield driverExecuteQuery(connClient, { query: truncateAll });
      });

      return function (_x33) {
        return _ref18.apply(this, arguments);
      };
    })());
  });

  return function truncateAllTables(_x32) {
    return _ref17.apply(this, arguments);
  };
})();

let runWithConnection = (() => {
  var _ref19 = _asyncToGenerator(function* ({ pool }, run) {
    let rejected = false;
    return new Promise(function (resolve, reject) {
      const rejectErr = function (err) {
        if (!rejected) {
          rejected = true;
          reject(err);
        }
      };

      pool.getConnection((() => {
        var _ref20 = _asyncToGenerator(function* (errPool, connection) {
          if (errPool) {
            rejectErr(errPool);
            return;
          }

          connection.on('error', function (error) {
            // it will be handled later in the next query execution
            logger().error('Connection fatal error %j', error);
          });

          try {
            resolve((yield run(connection)));
          } catch (err) {
            rejectErr(err);
          } finally {
            connection.release();
          }
        });

        return function (_x36, _x37) {
          return _ref20.apply(this, arguments);
        };
      })());
    });
  });

  return function runWithConnection(_x34, _x35) {
    return _ref19.apply(this, arguments);
  };
})();

exports.disconnect = disconnect;
exports.listSchemas = listSchemas;
exports.query = query;
exports.getQuerySelectTop = getQuerySelectTop;
exports.wrapIdentifier = wrapIdentifier;
exports.filterDatabase = filterDatabase;

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _sqlQueryIdentifier = require('sql-query-identifier');

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utils = require('../../utils');

var _errors = require('../../errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logger2.default)('db:clients:mysql');

const mysqlErrors = {
  EMPTY_QUERY: 'ER_EMPTY_QUERY',
  CONNECTION_LOST: 'PROTOCOL_CONNECTION_LOST'
};

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (server, database) {
    const dbConfig = configDatabase(server, database);
    logger().debug('create driver client for mysql with config %j', dbConfig);

    const conn = {
      pool: _mysql2.default.createPool(dbConfig)
    };

    // light solution to test connection with with the server
    yield driverExecuteQuery(conn, { query: 'select version();' });

    return {
      wrapIdentifier,
      disconnect: function () {
        return disconnect(conn);
      },
      listTables: function () {
        return listTables(conn);
      },
      listViews: function () {
        return listViews(conn);
      },
      listRoutines: function () {
        return listRoutines(conn);
      },
      listTableColumns: function (db, table) {
        return listTableColumns(conn, db, table);
      },
      listTableTriggers: function (table) {
        return listTableTriggers(conn, table);
      },
      listTableIndexes: function (db, table) {
        return listTableIndexes(conn, db, table);
      },
      listSchemas: function () {
        return listSchemas(conn);
      },
      getTableReferences: function (table) {
        return getTableReferences(conn, table);
      },
      getTableKeys: function (db, table) {
        return getTableKeys(conn, db, table);
      },
      query: function (queryText) {
        return query(conn, queryText);
      },
      executeQuery: function (queryText) {
        return executeQuery(conn, queryText);
      },
      listDatabases: function (filter) {
        return listDatabases(conn, filter);
      },
      getQuerySelectTop: function (table, limit) {
        return getQuerySelectTop(conn, table, limit);
      },
      getTableCreateScript: function (table) {
        return getTableCreateScript(conn, table);
      },
      getViewCreateScript: function (view) {
        return getViewCreateScript(conn, view);
      },
      getRoutineCreateScript: function (routine, type) {
        return getRoutineCreateScript(conn, routine, type);
      },
      truncateAllTables: function () {
        return truncateAllTables(conn);
      }
    };
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function disconnect(conn) {
  conn.pool.end();
}

function listSchemas() {
  return Promise.resolve([]);
}

function query(conn, queryText) {
  let pid = null;
  let canceling = false;
  const cancelable = (0, _utils.createCancelablePromise)(_extends({}, _errors2.default.CANCELED_BY_USER, {
    sqlectronError: 'CANCELED_BY_USER'
  }));

  return {
    execute() {
      return runWithConnection(conn, (() => {
        var _ref10 = _asyncToGenerator(function* (connection) {
          const connClient = { connection };

          const { data: dataPid } = yield driverExecuteQuery(connClient, {
            query: 'SELECT connection_id() AS pid'
          });

          pid = dataPid[0].pid;

          try {
            const data = yield Promise.race([cancelable.wait(), executeQuery(connClient, queryText)]);

            pid = null;

            return data;
          } catch (err) {
            if (canceling && err.code === mysqlErrors.CONNECTION_LOST) {
              canceling = false;
              err.sqlectronError = 'CANCELED_BY_USER';
            }

            throw err;
          } finally {
            cancelable.discard();
          }
        });

        return function (_x19) {
          return _ref10.apply(this, arguments);
        };
      })());
    },

    cancel() {
      return _asyncToGenerator(function* () {
        if (!pid) {
          throw new Error('Query not ready to be canceled');
        }

        canceling = true;
        try {
          yield driverExecuteQuery(conn, {
            query: `kill ${pid};`
          });
          cancelable.cancel();
        } catch (err) {
          canceling = false;
          throw err;
        }
      })();
    }
  };
}

function getQuerySelectTop(conn, table, limit) {
  return `SELECT * FROM ${wrapIdentifier(table)} LIMIT ${limit}`;
}

function wrapIdentifier(value) {
  return value !== '*' ? `\`${value.replace(/`/g, '``')}\`` : '*';
}

function configDatabase(server, database) {
  const config = {
    host: server.config.host,
    port: server.config.port,
    user: server.config.user,
    password: server.config.password,
    database: database.database,
    multipleStatements: true,
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: true
  };

  if (server.sshTunnel) {
    config.host = server.config.localHost;
    config.port = server.config.localPort;
  }

  if (server.config.ssl) {
    config.ssl = {
      // It is not the best recommend way to use SSL with node-mysql
      // https://github.com/felixge/node-mysql#ssl-options
      // But this way we have compatibility with all clients.
      rejectUnauthorized: false
    };
  }

  return config;
}

function getRealError(conn, err) {
  /* eslint no-underscore-dangle:0 */
  if (conn && conn._protocol && conn._protocol._fatalError) {
    return conn._protocol._fatalError;
  }
  return err;
}

function parseRowQueryResult(data, fields, command) {
  // Fallback in case the identifier could not reconize the command
  const isSelect = Array.isArray(data);
  return {
    command: command || isSelect && 'SELECT',
    rows: isSelect ? data : [],
    fields: fields || [],
    rowCount: isSelect ? (data || []).length : undefined,
    affectedRows: !isSelect ? data.affectedRows : undefined
  };
}

function isMultipleQuery(fields) {
  if (!fields) {
    return false;
  }
  if (!fields.length) {
    return false;
  }
  return Array.isArray(fields[0]) || fields[0] === undefined;
}

function identifyCommands(queryText) {
  try {
    return (0, _sqlQueryIdentifier.identify)(queryText);
  } catch (err) {
    return [];
  }
}

function driverExecuteQuery(conn, queryArgs) {
  const runQuery = connection => new Promise((resolve, reject) => {
    connection.query(queryArgs.query, queryArgs.params, (err, data, fields) => {
      if (err && err.code === mysqlErrors.EMPTY_QUERY) return resolve({});
      if (err) return reject(getRealError(connection, err));

      resolve({ data, fields });
    });
  });

  return conn.connection ? runQuery(conn.connection) : runWithConnection(conn, runQuery);
}

function filterDatabase(item, { database } = {}, databaseField) {
  if (!database) {
    return true;
  }

  const value = item[databaseField];
  if (typeof database === 'string') {
    return database === value;
  }

  const { only, ignore } = database;

  if (only && only.length && !~only.indexOf(value)) {
    return false;
  }

  if (ignore && ignore.length && ~ignore.indexOf(value)) {
    return false;
  }

  return true;
}