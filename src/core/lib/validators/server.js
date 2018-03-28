'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * validations applied on creating/updating a server
 */
let validate = exports.validate = (() => {
  var _ref = _asyncToGenerator(function* (server) {
    const serverSchema = _extends({}, SERVER_SCHEMA);

    const clientConfig = _db.CLIENTS.find(function (dbClient) {
      return dbClient.key === server.client;
    });
    if (clientConfig && clientConfig.disabledFeatures) {
      clientConfig.disabledFeatures.forEach(function (item) {
        const [region, field] = item.split(':');
        if (region === 'server') {
          delete serverSchema[field];
        }
      });
    }

    const validated = yield _valida2.default.process(server, serverSchema);
    if (!validated.isValid()) {
      throw validated.invalidError();
    }
  });

  return function validate(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.validateUniqueId = validateUniqueId;

var _valida = require('valida');

var _valida2 = _interopRequireDefault(_valida);

var _db = require('../db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function serverAddressValidator(ctx) {
  const { host, port, socketPath } = ctx.obj;
  if (!host && !port && !socketPath || (host || port) && socketPath) {
    return {
      validator: 'serverAddressValidator',
      msg: 'You must use host+port or socket path'
    };
  }

  if (socketPath) {
    return undefined;
  }

  if (host && !port || !host && port) {
    return {
      validator: 'serverAddressValidator',
      msg: 'Host and port are required fields.'
    };
  }
}

function clientValidator(ctx, options, value) {
  if (typeof value === 'undefined' || value === null) {
    return undefined;
  }
  if (!~_db.CLIENTS.some(dbClient => dbClient.key === ctx.obj.client)) {
    return {
      validator: 'clientValidator',
      msg: 'Invalid client type'
    };
  }
}

function boolValidator(ctx, options, value) {
  if (typeof value === 'undefined' || value === null) {
    return undefined;
  }
  if (value !== true && value !== false) {
    return {
      validator: 'boolValidator',
      msg: 'Invalid boolean type.'
    };
  }
}

const SSH_SCHEMA = {
  host: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }],
  port: [{ sanitizer: _valida2.default.Sanitizer.toInt }, { validator: _valida2.default.Validator.len, min: 1, max: 5 }],
  user: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.required }, { validator: _valida2.default.Validator.len, min: 1 }],
  password: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }],
  privateKey: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }],
  privateKeyWithPassphrase: [{ validator: boolValidator }]
};

const SERVER_SCHEMA = {
  name: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.required }, { validator: _valida2.default.Validator.len, min: 1 }],
  client: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.required }, { validator: clientValidator }],
  ssl: [{ validator: _valida2.default.Validator.required }],
  host: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }, { validator: serverAddressValidator }],
  port: [{ sanitizer: _valida2.default.Sanitizer.toInt }, { validator: _valida2.default.Validator.len, min: 1, max: 5 }, { validator: serverAddressValidator }],
  socketPath: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }, { validator: serverAddressValidator }],
  database: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }],
  user: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }],
  password: [{ sanitizer: _valida2.default.Sanitizer.trim }, { validator: _valida2.default.Validator.len, min: 1 }],
  ssh: [{ validator: _valida2.default.Validator.schema, schema: SSH_SCHEMA }]
};function validateUniqueId(servers, serverId) {
  if (!serverId) {
    return;
  }

  const server = servers.find(srv => srv.id === serverId);
  if (!server) {
    return;
  }
  if (serverId && server.id === serverId) {
    return;
  }

  throw new Error('Already exist another server with same id');
}