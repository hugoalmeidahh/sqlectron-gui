const path=require("path");
console.log(path.resolve("."));
console.log(window);
require("babel-register");
//require(path.resolve(".")+"/db.js")
//require(path.resolve(".")+"/react_browser/index.js")
require("./index.js");