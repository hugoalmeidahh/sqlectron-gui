'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveSettings = exports.prepare = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Prepare the configuration file sanitizing and validating all fields availbale
 */
let prepare = exports.prepare = (() => {
  var _ref = _asyncToGenerator(function* (cryptoSecret) {
    const filename = utils.getConfigPath();
    const fileExistsResult = yield utils.fileExists(filename);
    if (!fileExistsResult) {
      yield utils.createParentDirectory(filename);
      yield utils.writeJSONFile(filename, EMPTY_CONFIG);
    }

    const result = yield utils.readJSONFile(filename);

    result.servers = sanitizeServers(result, cryptoSecret);

    yield utils.writeJSONFile(filename, result);

    // TODO: Validate whole configuration file
    // if (!configValidate(result)) {
    //   throw new Error('Invalid ~/.sqlectron.json file format');
    // }
  });

  return function prepare(_x) {
    return _ref.apply(this, arguments);
  };
})();

let saveSettings = exports.saveSettings = (() => {
  var _ref2 = _asyncToGenerator(function* (data) {
    const fullData = yield get();
    const filename = utils.getConfigPath();
    const newData = _extends({}, fullData, data);
    return utils.writeJSONFile(filename, newData);
  });

  return function saveSettings(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

exports.prepareSync = prepareSync;
exports.path = path;
exports.get = get;
exports.getSync = getSync;
exports.save = save;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _crypto = require('./crypto');

var crypto = _interopRequireWildcard(_crypto);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const EMPTY_CONFIG = { servers: [] };

function sanitizeServer(server, cryptoSecret) {
  const srv = _extends({}, server);

  // ensure has an unique id
  if (!srv.id) {
    srv.id = _uuid2.default.v4();
  }

  // ensure has the new fileld SSL
  if (typeof srv.ssl === 'undefined') {
    srv.ssl = false;
  }

  // ensure all secret fields are encrypted
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
}function prepareSync(cryptoSecret) {
  const filename = utils.getConfigPath();
  const fileExistsResult = utils.fileExistsSync(filename);
  if (!fileExistsResult) {
    utils.createParentDirectorySync(filename);
    utils.writeJSONFileSync(filename, EMPTY_CONFIG);
  }

  const result = utils.readJSONFileSync(filename);

  result.servers = sanitizeServers(result, cryptoSecret);

  utils.writeJSONFileSync(filename, result);

  // TODO: Validate whole configuration file
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