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
// class Logger{
//   constructor(namespace){
//         this.namespace=namespace;
//   }
//   error(p){
//     console.log(p);
//   }
//   info(p){
//     console.log(p);
//   }
// }
//var l=new Logger();
var cp=window.myremote.path.resolve(".")
//let corepath;
if (process.argv[0].indexOf("Sqlectron.exe")>0)
{
  cp=cp+"/resources/app";
}
console.log(cp);

window.myremote.sqlectron=require(cp+"/core/lib");
window.myremote.createLogger=require(cp+"/logger.js");
window.myremote.config =require(cp+"/config.js");
window.myremote.csvStringify=require('csv-stringify');
//console.log(window.myremote);
  //todo remove config,logger user ipc
