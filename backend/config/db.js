require("dotenv").config();

const rawDbServer = process.env.DB_SERVER || "localhost";
const DB_NAME = process.env.DB_NAME || process.env.DB_DATABASE || "ReliefLinkDB";
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const useSqlLogin = Boolean(DB_USER && DB_PASSWORD);
const useTrustedConnection = process.env.DB_TRUSTED_CONNECTION
  ? /^true$/i.test(process.env.DB_TRUSTED_CONNECTION)
  : true;

const sanitizedDbServer = rawDbServer.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
const [DB_SERVER, DB_INSTANCE] = sanitizedDbServer.split("\\");
const trustedConnectionServer = DB_INSTANCE ? `${DB_SERVER}\\${DB_INSTANCE}` : DB_SERVER;

let sql;
let config;

if (useSqlLogin) {
  sql = require("mssql");
  config = {
    server: DB_SERVER,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      enableArithAbort: true,
      ...(DB_INSTANCE ? { instanceName: DB_INSTANCE } : {})
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };
} else if (useTrustedConnection) {
  // Windows Authentication for local SQL Server Express.
  // Requires: npm install, which installs msnodesqlv8 from package.json.
  sql = require("mssql/msnodesqlv8");
  config = {
    connectionString:
      `Driver={ODBC Driver 17 for SQL Server};` +
      `Server=${trustedConnectionServer};` +
      `Database=${DB_NAME};` +
      `Trusted_Connection=Yes;` +
      `TrustServerCertificate=Yes;`,
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
  };
} else {
  throw new Error(
    "SQL Server authentication is disabled. Set DB_USER and DB_PASSWORD in backend/.env or enable DB_TRUSTED_CONNECTION."
  );
}

let poolPromise;

async function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .catch((err) => {
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

async function testConnection() {
  const pool = await getPool();
  const result = await pool.request().query("SELECT DB_NAME() AS databaseName, GETDATE() AS serverTime");
  return result.recordset[0];
}

module.exports = { sql, getPool, testConnection };
