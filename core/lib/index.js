"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "setLogger", {
  enumerable: true,
  get: function () {
    return _logger.setLogger;
  }
});
exports.db = exports.servers = exports.config = void 0;

var config = _interopRequireWildcard(require("./config"));

exports.config = config;

var servers = _interopRequireWildcard(require("./servers"));

exports.servers = servers;

var db = _interopRequireWildcard(require("./db"));

exports.db = db;

var _logger = require("./logger");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }