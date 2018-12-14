/* eslint global-require:0, no-var: 0, no-extend-native: 0, vars-on-top: 0 */
// var config = require('./config');

// var configData = config.get();

// if (configData.printVersion) {
//   //console.log(configData.name, configData.version); // eslint-disable-line no-console
//   process.exit(0);
// }
const {ipcMain} = require('electron')
  // ipcMain.on('asynchronous-message', (event, arg) => {
  //   console.log(arg)  // prints "ping"
  //   event.sender.send('asynchronous-reply', 'pong')
  // })
  
// ipcMain.on('getconfig', (event, arg) => {
//     //console.log(arg)  // prints "ping"
//     var configData = config.get(arg);
//     event.returnValue = configData;
// })
ipcMain.on('getpath', (event, arg) => {
    event.returnValue = __dirname;
})
// enables ES6+ support
//if (configData.devMode) {
//  require('babel-register');
//}

//require('babel-polyfill');

// starts the electron app
require('./app_main');
