"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;
exports.validateUniqueId = validateUniqueId;

var _valida = _interopRequireDefault(require("valida"));

var _db = require("../db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serverAddressValidator(ctx) {
  const {
    host,
    port,
    socketPath
  } = ctx.obj;

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
  host: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  port: [{
    sanitizer: _valida.default.Sanitizer.toInt
  }, {
    validator: _valida.default.Validator.len,
    min: 1,
    max: 5
  }],
  user: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.required
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  password: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  privateKey: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  privateKeyWithPassphrase: [{
    validator: boolValidator
  }]
};
const SERVER_SCHEMA = {
  name: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.required
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  client: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.required
  }, {
    validator: clientValidator
  }],
  ssl: [{
    validator: _valida.default.Validator.required
  }],
  host: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }, {
    validator: serverAddressValidator
  }],
  port: [{
    sanitizer: _valida.default.Sanitizer.toInt
  }, {
    validator: _valida.default.Validator.len,
    min: 1,
    max: 5
  }, {
    validator: serverAddressValidator
  }],
  socketPath: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }, {
    validator: serverAddressValidator
  }],
  database: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  user: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  password: [{
    sanitizer: _valida.default.Sanitizer.trim
  }, {
    validator: _valida.default.Validator.len,
    min: 1
  }],
  ssh: [{
    validator: _valida.default.Validator.schema,
    schema: SSH_SCHEMA
  }]
};
/**
 * validations applied on creating/updating a server
 */

async function validate(server) {
  const serverSchema = { ...SERVER_SCHEMA
  };

  const clientConfig = _db.CLIENTS.find(dbClient => dbClient.key === server.client);

  if (clientConfig && clientConfig.disabledFeatures) {
    clientConfig.disabledFeatures.forEach(item => {
      const [region, field] = item.split(':');

      if (region === 'server') {
        delete serverSchema[field];
      }
    });
  }

  const validated = await _valida.default.process(server, serverSchema);

  if (!validated.isValid()) {
    throw validated.invalidError();
  }
}

function validateUniqueId(servers, serverId) {
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