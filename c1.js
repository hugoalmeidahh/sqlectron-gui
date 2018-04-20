const sqlectron = require('./core/lib/index.js');
console.log(sqlectron);
// //sqlectron.servers.getAll();
// console.log(sqlectron.db.CLIENTS.length);
// console.log(sqlectron.db.CLIENTS[3]);
var serverConfig={client:sqlectron.db.CLIENTS[3].key}
var db=sqlectron.db.createServer(serverConfig);
//console.log(db);
var con=db.createConnection("D:/nodejs/apps/electron1/data.sqlite")
console.log(con);
con.connect().then(()=>{
	console.log("connected");
	var q=con.executeQuery("select * from parts_contact;").then((data)=>{
		for(var i in data){
			console.log(i);
		}
		// con.executeQuery("insert into ma(id) values(1);");
		// var ts=con.listTables().then((data)=>{
		// 	console.log(data);
		// });
	});
	console.log("q="+q);
});
//con.executeQuery("create table ma(id int)");