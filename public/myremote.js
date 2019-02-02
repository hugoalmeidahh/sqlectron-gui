  // console.log(__dirname);
  // console.log(__filename);
  // console.log(process);

  var electron=require('electron');
  // console.log(electron);
  window.myremote={
    fs:require('fs'),
    path:require("path"),
    //sqlectron:require("sqlectron-core"),
    electron:electron,
    remote:electron.remote,
    ipcRenderer:electron.ipcRenderer,
    shell:electron.shell,
    webFrame:electron.webFrame,
    clipboard:electron.clipboard
  };
var cp=window.myremote.path.resolve(".")
if (process.argv[0].indexOf("Sqlectron.exe")>0)
{
  cp=cp+"/resources/app";
}
console.log(cp);

window.myremote.sqlectron=require(cp+"/core/lib");
window.myremote.createLogger=require(cp+"/logger.js");
window.myremote.config=require(__dirname+"/../config.js");
// let configv=null;
// let rconfig=require(cp+"/config.js");
// window.myremote.config ={
//   get:function(){
//     if (configv===null){
//       configv=rconfig.get();
//     }
//     else{
//       return configv;
//     }
//   }
// }//require(cp+"/config.js");
window.myremote.csvStringify=require('csv-stringify');
//console.log(window.myremote);
  //todo remove config,logger user ipc
