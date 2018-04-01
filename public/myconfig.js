var path=window.myremote.path;
console.log(path);
console.log(__dirname);
console.log(__filename);

window.myremote.createLogger =require('../logger').default;
window.myremote.config = require('../config');
console.log(window.myremote);