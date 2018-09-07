var {resolve } =require('path');
var { BrowserWindow } =require('electron'); // eslint-disable-line import/no-unresolved
var { attachMenuToWindow } =require('./menu');
var {  checkUpdate } =require('./update-checker');
var config =require('./config');
var createLogger =require('./logger');
const path=require("path");
// console.log("=============");
// console.log(createLogger);
const logger = createLogger('window');
// console.log(logger);
console.log(process.argv);
const devMode = (process.argv || []).indexOf('--dev') !== -1;
const localMode = (process.argv || []).indexOf('--local') !== -1;
const localBuildMode = (process.argv || []).indexOf('--build') !== -1;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
const WINDOWS = {};


// Indicate the number of windows has already been opened.
// Also used as identifier to for each window.
let windowsNumber = 0;


function buildNewWindow(app) {
  const appConfig = config.get();//getConfig();

  windowsNumber += 1;
  const mainWindow = new BrowserWindow({
    title: appConfig.name,
    //icon: resolve(__dirname, '..', '..', 'build', 'app.png'),
    width: 1024,
    height: 700,
    minWidth: 512,
    minHeight: 350,
    webPreferences: {
      preload: resolve(__dirname, 'preload.js'),
    },
  });

  attachMenuToWindow(app, buildNewWindow, appConfig);

  // and load the index.html of the app.

  // const entryBasePath = devMode ? 'http://localhost:8080' : ('file://' + resolve(__dirname, '..'));

  // mainWindow.loadURL(entryBasePath + '/static/index.html');
  //console.log(__dirname);

  var cp=__dirname;
  //console.log(cp);
  let entryBasePath;
  if(localMode){//local mode
    if(localBuildMode){
        entryBasePath =  'file://' + cp+ '/build/index.html';  
    }
    else{
        entryBasePath =  'file://' + cp+ `/src/index.html`;  
    }
  }
  else{         //devMode  productionMode
    entryBasePath = devMode ? 'http://localhost:3000' : 'file://' + cp+ '/resources/app/build/index.html';
  }
  mainWindow.loadURL(entryBasePath);// + '/static/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => delete WINDOWS[windowsNumber]);

  if (devMode) {
    mainWindow.openDevTools();
  }

  // checkUpdate(mainWindow, appConfig)
  //   .catch(err => logger.error('Unable to check for updates', err));
}
exports.buildNewWindow=buildNewWindow;
