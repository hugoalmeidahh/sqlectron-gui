"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepare = prepare;
exports.prepareSync = prepareSync;
exports.path = path;
exports.get = get;
exports.getSync = getSync;
exports.save = save;
exports.saveSettings = saveSettings;

var _uuid = _interopRequireDefault(require("uuid"));

var utils = _interopRequireWildcard(require("./utils"));

var crypto = _interopRequireWildcard(require("./crypto"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EMPTY_CONFIG = {
  servers: []
};

function sanitizeServer(server, cryptoSecret) {
  const srv = { ...server
  }; // ensure has an unique id

  if (!srv.id) {
    srv.id = _uuid.default.v4();
  } // ensure has the new fileld SSL


  if (typeof srv.ssl === 'undefined') {
    srv.ssl = false;
  } // ensure all secret fields are encrypted


  if (typeof srv.encrypted === 'undefined') {
    srv.encrypted = true;

    if (srv.password) {
      srv.password = crypto.encrypt(srv.password, cryptoSecret);
    }

    if (srv.ssh && srv.ssh.password) {
      srv.ssh.password = crypto.encrypt(srv.ssh.password, cryptoSecret);
    }
  }

  return srv;
}

function sanitizeServers(data, cryptoSecret) {
  return data.servers.map(server => sanitizeServer(server, cryptoSecret));
}
/**
 * Prepare the configuration file sanitizing and validating all fields availbale
 */


async function prepare(cryptoSecret) {
  const filename = utils.getConfigPath();
  const fileExistsResult = await utils.fileExists(filename);

  if (!fileExistsResult) {
    await utils.createParentDirectory(filename);
    await utils.writeJSONFile(filename, EMPTY_CONFIG);
  }

  const result = await utils.readJSONFile(filename);
  result.servers = sanitizeServers(result, cryptoSecret);
  await utils.writeJSONFile(filename, result); // TODO: Validate whole configuration file
  // if (!configValidate(result)) {
  //   throw new Error('Invalid ~/.sqlectron.json file format');
  // }
}

function prepareSync(cryptoSecret) {
  const filename = utils.getConfigPath();
  const fileExistsResult = utils.fileExistsSync(filename);

  if (!fileExistsResult) {
    utils.createParentDirectorySync(filename);
    utils.writeJSONFileSync(filename, EMPTY_CONFIG);
  }

  const result = utils.readJSONFileSync(filename);
  result.servers = sanitizeServers(result, cryptoSecret);
  utils.writeJSONFileSync(filename, result); // TODO: Validate whole configuration file
  // if (!configValidate(result)) {
  //   throw new Error('Invalid ~/.sqlectron.json file format');
  // }
}

function path() {
  const filename = utils.getConfigPath();
  return utils.resolveHomePathToAbsolute(filename);
}

function get() {
  const filename = utils.getConfigPath();
  return utils.readJSONFile(filename);
}

function getSync() {
  const filename = utils.getConfigPath();
  return utils.readJSONFileSync(filename);
}

function save(data) {
  const filename = utils.getConfigPath();
  return utils.writeJSONFile(filename, data);
}

async function saveSettings(data) {
  const fullData = await get();
  const filename = utils.getConfigPath();
  const newData = { ...fullData,
    ...data
  };
  return utils.writeJSONFile(filename, newData);
}