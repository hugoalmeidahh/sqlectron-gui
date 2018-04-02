var createLogger={

};
window.myremote.createLogger =createLogger;
const ipcRenderer = window.myremote.ipcRenderer;
var Config={
  get:function(){
    return ipcRenderer.sendSync('getconfig', 'ping');
  },
}
window.myremote.config = Config;
console.log(window.myremote);