var { Menu } =require('electron'); // eslint-disable-line import/no-unresolved
var darwin =require('./darwin');
var linux =require('./linux');
var win32 =require('./win32');


const menus = {
  darwin,
  linux,
  win32,
};


function attachMenuToWindow(app, buildNewWindow, appConfig) {
  const template = menus[process.platform].buildTemplate(app, buildNewWindow, appConfig);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (process.platform === 'darwin') {
    const dockTemplate = menus.darwin.buildTemplateDockMenu(app, buildNewWindow);
    const dockMenu = Menu.buildFromTemplate(dockTemplate);
    app.dock.setMenu(dockMenu);
  }
}
exports.attachMenuToWindow=attachMenuToWindow
