'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLogger;
exports.setLogger = setLogger;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const loggers = {};

function createLogger(namespace) {
  if (!namespace) {
    throw new Error('Missing log namespace');
  }
  if (loggers[namespace]) {
    throw new Error('This logger is already registered');
  }

  // default logger
  const debugLogger = (0, _debug2.default)(`sqlectron-core:${namespace}`);
  loggers[namespace] = {
    debug: debugLogger.bind(debugLogger),
    error: debugLogger.bind(debugLogger)
  };

  // The logger is load through a function
  // so is possible to access a new logger
  // defined with setLogger
  return () => loggers[namespace];
}

/**
 * Allow use a different logger
 */
function setLogger(customLogger) {
  Object.keys(loggers).forEach(logger => {
    loggers[logger] = customLogger(logger);
  });
}