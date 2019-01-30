import React from 'react';
import ReactDOM from 'react-dom';
const fs= require('fs');
const path=require('path');
window.myremote={
    fs:require('fs'),
    path:require("path"),
    electron:require('electron'),
    csvStringify:require('csv-stringify')
    // remote:electron.remote,
    // ipcRenderer:electron.ipcRenderer,
    // shell:electron.shell,
    // webFrame:electron.webFrame,
};
let where= window.require('electron').ipcRenderer.sendSync('getpath');
window.myremote.sqlectron=require(__dirname+"/../core/lib");
window.myremote.createLogger=require(__dirname+"/../logger.js");
window.myremote.config=require(__dirname+"/../config.js");

function fileExist(p){
    if(fs.existsSync(p)){
      return true;
    }
    return false;
}
function link(where,module_name) {
  // body...
  var thelink=document.createElement('link');
  thelink.setAttribute("rel","stylesheet");
  var file1=path.join(where,module_name)
  thelink.setAttribute("href",file1);
  document.head.appendChild(thelink);
}
let module_name;
let App;
module_name="./AppSql";
if (module_name==="./AppSql"){
	link(where,"node_modules/react-tabs/style/react-tabs.css");
	link(where,"node_modules/storm-react-diagrams/dist/style.min.css");
	link(where,"node_modules/react-virtualized/styles.css");
  link(where,"node_modules/react-select/dist/react-select.css")
  link(where,"node_modules/semantic-ui-css/semantic.css")
  // link(where, 'node_modules/bootstrap/dist/css/bootstrap.min.css');
  // link(where, 'node_modules/bootstrap/dist/css/bootstrap-theme.min.css');
  
	link("./","components/react-resizable.css")
  link('./', 'react-contextmenu.css');
}


App=require(module_name).default;
ReactDOM.render(<App />, document.getElementById('root'));

