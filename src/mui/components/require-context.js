// export const requireLogos = require('./server-db-client-.*\.png$/);
const cassandraPNG = './server-db-client-cassandra.png';
const mysqlPNG = './server-db-client-mysql.png';
const pgPNG = './server-db-client-postgresql.png';
const sqlitePNG = './server-db-client-sqlite.png';
const sqlserverPNG = './server-db-client-sqlserver.png';

var dic1 = {
  cassandra: cassandraPNG,
  postgresql: pgPNG,
  mysql: mysqlPNG,
  sqlite: sqlitePNG,
  sqlserver: sqlserverPNG,
};
export const requireLogos = name => {
  return dic1[name];
}; // require.context('./', false, /server-db-client-.*\.png$/);
