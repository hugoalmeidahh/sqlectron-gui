"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _net = _interopRequireDefault(require("net"));

var _ssh = require("ssh2");

var _utils = require("../utils");

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _logger.default)('db:tunnel');

function _default(serverInfo) {
  return new Promise(async (resolve, reject) => {
    logger().debug('configuring tunnel');
    const config = await configTunnel(serverInfo);
    const connections = [];
    logger().debug('creating ssh tunnel server');

    const server = _net.default.createServer(async conn => {
      conn.on('error', err => server.emit('error', err));
      logger().debug('creating ssh tunnel client');
      const client = new _ssh.Client();
      connections.push(conn);
      client.on('error', err => server.emit('error', err));
      client.on('ready', () => {
        logger().debug('connected ssh tunnel client');
        connections.push(client);
        logger().debug('forwarding ssh tunnel client output');
        client.forwardOut(config.srcHost, config.srcPort, config.dstHost, config.dstPort, (err, sshStream) => {
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
        const localPort = await (0, _utils.getPort)();
        logger().debug('connecting ssh tunnel client');
        client.connect({ ...config,
          localPort
        });
      } catch (err) {
        server.emit('error', err);
      }
    });

    server.once('close', () => {
      logger().debug('close ssh tunnel server');
      connections.forEach(conn => conn.end());
    });
    logger().debug('connecting ssh tunnel server');
    server.listen(config.localPort, config.localHost, err => {
      if (err) return reject(err);
      logger().debug('connected ssh tunnel server');
      resolve(server);
    });
  });
}

async function configTunnel(serverInfo) {
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
    localPort: await (0, _utils.getPort)()
  };
  if (serverInfo.ssh.password) config.password = serverInfo.ssh.password;
  if (serverInfo.ssh.passphrase) config.passphrase = serverInfo.ssh.passphrase;

  if (serverInfo.ssh.privateKey) {
    config.privateKey = await (0, _utils.readFile)(serverInfo.ssh.privateKey);
  }

  return config;
}