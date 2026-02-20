import snowflake from "snowflake-sdk";

// Disable OCSP check to avoid issues in Replit environment
snowflake.configure({ ocspFailOpen: true });

let connection: snowflake.Connection | null = null;

function createConnection(): snowflake.Connection {
  return snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USER!,
    password: process.env.SNOWFLAKE_PASSWORD!,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE || "COMPUTE_WH",
    database: process.env.SNOWFLAKE_DATABASE || "REVRYZE",
    schema: process.env.SNOWFLAKE_SCHEMA || "RAW",
  });
}

export function getConnection(): Promise<snowflake.Connection> {
  return new Promise((resolve, reject) => {
    if (connection && connection.isUp()) {
      return resolve(connection);
    }
    connection = createConnection();
    connection.connect((err, conn) => {
      if (err) {
        console.error("Snowflake connection failed:", err.message);
        connection = null;
        return reject(err);
      }
      console.log("Connected to Snowflake");
      resolve(conn);
    });
  });
}

export function query<T = Record<string, unknown>>(sql: string): Promise<T[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = await getConnection();
      conn.execute({
        sqlText: sql,
        complete: (err, _stmt, rows) => {
          if (err) {
            console.error("Snowflake query error:", err.message);
            return reject(err);
          }
          resolve((rows || []) as T[]);
        },
      });
    } catch (err) {
      reject(err);
    }
  });
}
