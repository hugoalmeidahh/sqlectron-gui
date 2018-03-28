'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let configTunnel = (() => {
  var _ref3 = _asyncToGenerator(function* (serverInfo) {
    const config = {
      username: serverInfo.ssh.user,
      port: serverInfo.ssh.port,
      host: serverInfo.ssh.host,
      dstPort: serverInfo.port,
      dstHost: serverInfo.host,
      sshPort: 22,
      srcPort: 0,
      srcHost: 'localhost',
      localHost: 'localhost',
      localPort: yield (0, _utils.getPort)()
    };
    if (serverInfo.ssh.password) config.password = serverInfo.ssh.password;
    if (serverInfo.ssh.passphrase) config.passphrase = serverInfo.ssh.passphrase;
    if (serverInfo.ssh.privateKey) {
      config.privateKey = yield (0, _utils.readFile)(serverInfo.ssh.privateKey);
    }
    return config;
  });

  return function configTunnel(_x4) {
    return _ref3.apply(this, arguments);
  };
})();

exports.default = function (serverInfo) {
  return new Promise((() => {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      logger().debug('configuring tunnel');
      const config = yield configTunnel(serverInfo);

      const connections = [];

      logger().debug('creating ssh tunnel server');
      const server = _net2.default.createServer((() => {
        var _ref2 = _asyncToGenerator(function* (conn) {
          conn.on('error', function (err) {
            return server.emit('error', err);
          });

          logger().debug('creating ssh tunnel client');
          const client = new _ssh.Client();
          connections.push(conn);

          client.on('error', function (err) {
            return server.emit('error', err);
          });

          client.on('ready', function () {
            logger().debug('connected ssh tunnel client');
            connections.push(client);

            logger().debug('forwarding ssh tunnel client output');
            client.forwardOut(config.srcHost, config.srcPort, config.dstHost, config.dstPort, function (err, sshStream) {
              if (err) {
                logger().error('error ssh connection %j', err);
                server.close();
                server.emit('error', err);
                return;
              }
              server.emit('success');
              conn.pipe(sshStream).pipe(conn);
            });
          });

          try {
            const localPort = yield (0, _utils.getPort)();

            logger().debug('connecting ssh tunnel client');
            client.connect(_extends({}, config, { localPort }));
          } catch (err) {
            server.emit('error', err);
          }
        });

        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      })());

      server.once('close', function () {
        logger().debug('close ssh tunnel server');
        connections.forEach(function (conn) {
          return conn.end();
        });
      });

      logger().debug('connecting ssh tunnel server');
      server.listen(config.localPort, config.localHost, function (err) {
        if (err) return reject(err);

        logger().debug('connected ssh tunnel server');
        resolve(server);
      });
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })());
};

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _ssh = require('ssh2');

var _utils = require('../utils');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logger2.default)('db:tunnel');