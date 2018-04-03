class Logger{
  constructor(namespace){
        this.namespace=namespace;
  }
  error(p){
    console.log(p);
  }
  info(p){
    console.log(p);
  }
}
//var l=new Logger();

var createLogger=function(namespace){
    return new Logger(namespace);

};
window.myremote.createLogger =createLogger;
const logger = createLogger('window');
logger.error("hi");

const ipcRenderer = window.myremote.ipcRenderer;
var Config={
  get:function(arg){
    return ipcRenderer.sendSync('getconfig', arg);
  },
}
window.myremote.config = Config;
console.log(window.myremote);