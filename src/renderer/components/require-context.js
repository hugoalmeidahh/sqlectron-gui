import cassandraPNG from './server-db-client-cassandra.png';
import mysqlPNG from './server-db-client-mysql.png';
import pgPNG from './server-db-client-postgresql.png';
import sqlitePNG from './server-db-client-sqlite.png';
import sqlserverPNG from './server-db-client-sqlserver.png';

var dic1={cassandra:cassandraPNG
    ,postgresql:pgPNG
    ,mysql:mysqlPNG
    ,sqlite:sqlitePNG
    ,sqlserver:sqlserverPNG};
export const requireLogos =(name)=>{
    return dic1[name];
};// require.context('./', false, /server-db-client-.*\.png$/);
