const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const pool = new sql.ConnectionPool({
  user: process.env.USER_SQL_SERVER,
  password: process.env.PASSWORD_SQL_SERVER,
  server: process.env.SERVIDOR_SQL_SERVER,
  database: process.env.DATABASE_SQL_SERVER,
  options: {
    encrypt: false,
    
  },
});


async function conectarBaseDeDatos() {
  try {
    console.log(process.env.USER_SQL_SERVER,process.env.SERVIDOR_SQL_SERVER,process.env.PASSWORD_SQL_SERVER,process.env.DATABASE_SQL_SERVER);
    await pool.connect();
    console.log('Conectado a SQL');
    return pool;
  } catch (error) {
    console.error('Error de conexión:', error);
    throw error;
  }
}

module.exports = {
  conectarBaseDeDatos,
};

