"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAll = getAll;
exports.add = add;
exports.update = update;
exports.addOrUpdate = addOrUpdate;
exports.removeById = removeById;
exports.decryptSecrects = decryptSecrects;

var _uuid = _interopRequireDefault(require("uuid"));

var _server = require("./validators/server");

var config = _interopRequireWildcard(require("./config"));

var crypto = _interopRequireWildcard(require("./crypto"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getAll() {
  const {
    servers
  } = await config.get();
  return servers;
}

async function add(server, cryptoSecret) {
  let srv = { ...server
  };
  await (0, _server.validate)(srv);
  const data = await config.get();

  const newId = _uuid.default.v4();

  (0, _server.validateUniqueId)(data.servers, newId);
  srv = encryptSecrects(srv, cryptoSecret);
  srv.id = newId;
  data.servers.push(srv);
  await config.save(data);
  return srv;
}

async function update(server, cryptoSecret) {
  let srv = { ...server
  };
  await (0, _server.validate)(srv);
  const data = await config.get();
  (0, _server.validateUniqueId)(data.servers, srv.id);
  const index = data.servers.findIndex(item => item.id === srv.id);
  srv = encryptSecrects(srv, cryptoSecret, data.servers[index]);
  data.servers = [...data.servers.slice(0, index), srv, ...data.servers.slice(index + 1)];
  await config.save(data);
  return server;
}

function addOrUpdate(server, cryptoSecret) {
  const hasId = !!(server.id && String(server.id).length); // TODO: Add validation to check if the current id is a valid uuid

  return hasId ? update(server, cryptoSecret) : add(server, cryptoSecret);
}

async function removeById(id) {
  const data = await config.get();
  const index = data.servers.findIndex(srv => srv.id === id);
  data.servers = [...data.servers.slice(0, index), ...data.servers.slice(index + 1)];
  await config.save(data);
} // ensure all secret fields are encrypted


function encryptSecrects(server, cryptoSecret, oldSever) {
  const updatedServer = { ...server
  };
  /* eslint no-param-reassign:0 */

  if (server.password) {
    const isPassDiff = oldSever && server.password !== oldSever.password;

    if (!oldSever || isPassDiff) {
      updatedServer.password = crypto.encrypt(server.password, cryptoSecret);
    }
  }

  if (server.ssh && server.ssh.password) {
    const isPassDiff = oldSever && server.ssh.password !== oldSever.ssh.password;

    if (!oldSever || isPassDiff) {
      updatedServer.ssh.password = crypto.encrypt(server.ssh.password, cryptoSecret);
    }
  }

  updatedServer.encrypted = true;
  return updatedServer;
} // decrypt secret fields


function decryptSecrects(server, cryptoSecret) {
  const updatedServer = { ...server
  };
  /* eslint no-param-reassign:0 */

  if (!server.encrypted) {
    return;
  }

  if (server.password) {
    updatedServer.password = crypto.decrypt(server.password, cryptoSecret);
  }

  if (server.ssh && server.ssh.password) {
    updatedServer.ssh.password = crypto.decrypt(server.ssh.password, cryptoSecret);
  }

  updatedServer.encrypted = false;
  return updatedServer;
}