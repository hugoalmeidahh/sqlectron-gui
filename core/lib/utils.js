"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfigPath = getConfigPath;
exports.homedir = homedir;
exports.fileExists = fileExists;
exports.fileExistsSync = fileExistsSync;
exports.writeFile = writeFile;
exports.writeJSONFile = writeJSONFile;
exports.writeJSONFileSync = writeJSONFileSync;
exports.readFile = readFile;
exports.readJSONFile = readJSONFile;
exports.readJSONFileSync = readJSONFileSync;
exports.createParentDirectory = createParentDirectory;
exports.createParentDirectorySync = createParentDirectorySync;
exports.resolveHomePathToAbsolute = resolveHomePathToAbsolute;
exports.getPort = getPort;
exports.createCancelablePromise = createCancelablePromise;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _portfinder = _interopRequireDefault(require("portfinder"));

var _envPaths = _interopRequireDefault(require("env-paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let configPath = '';

function getConfigPath() {
  if (configPath) {
    return configPath;
  }

  const configName = 'sqlectron.json';

  const oldConfigPath = _path.default.join(homedir(), `.${configName}`);

  if (fileExistsSync(oldConfigPath)) {
    configPath = oldConfigPath;
  } else {
    const newConfigDir = (0, _envPaths.default)('Sqlectron', {
      suffix: ''
    }).config;
    configPath = _path.default.join(newConfigDir, configName);
  }

  return configPath;
}

function homedir() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}

function fileExists(filename) {
  return new Promise(resolve => {
    _fs.default.stat(filename, (err, stats) => {
      if (err) return resolve(false);
      resolve(stats.isFile());
    });
  });
}

function fileExistsSync(filename) {
  try {
    return _fs.default.statSync(filename).isFile();
  } catch (e) {
    return false;
  }
}

function writeFile(filename, data) {
  return new Promise((resolve, reject) => {
    _fs.default.writeFile(filename, data, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function writeJSONFile(filename, data) {
  return writeFile(filename, JSON.stringify(data, null, 2));
}

function writeJSONFileSync(filename, data) {
  return _fs.default.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function readFile(filename) {
  const filePath = resolveHomePathToAbsolute(filename);
  return new Promise((resolve, reject) => {
    _fs.default.readFile(_path.default.resolve(filePath), (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function readJSONFile(filename) {
  return readFile(filename).then(data => JSON.parse(data));
}

function readJSONFileSync(filename) {
  const filePath = resolveHomePathToAbsolute(filename);

  const data = _fs.default.readFileSync(_path.default.resolve(filePath), {
    enconding: 'utf-8'
  });

  return JSON.parse(data);
}

function createParentDirectory(filename) {
  return new Promise((resolve, reject) => (0, _mkdirp.default)(_path.default.dirname(filename), err => err ? reject(err) : resolve()));
}

function createParentDirectorySync(filename) {
  _mkdirp.default.sync(_path.default.dirname(filename));
}

function resolveHomePathToAbsolute(filename) {
  if (!/^~\//.test(filename)) {
    return filename;
  }

  return _path.default.join(homedir(), filename.substring(2));
}

function getPort() {
  return new Promise((resolve, reject) => {
    _portfinder.default.getPort({
      host: 'localhost'
    }, (err, port) => {
      if (err) return reject(err);
      resolve(port);
    });
  });
}

function createCancelablePromise(error, timeIdle = 100) {
  let canceled = false;
  let discarded = false;

  const wait = time => new Promise(resolve => setTimeout(resolve, time));

  return {
    async wait() {
      while (!canceled && !discarded) {
        await wait(timeIdle);
      }

      if (canceled) {
        const err = new Error(error.message || 'Promise canceled.');
        Object.getOwnPropertyNames(error).forEach(key => err[key] = error[key]); // eslint-disable-line no-return-assign

        throw err;
      }
    },

    cancel() {
      canceled = true;
    },

    discard() {
      discarded = true;
    }

  };
}