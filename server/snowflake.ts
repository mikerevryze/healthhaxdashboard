import snowflake from "snowflake-sdk";
import { log } from "./logger";

snowflake.configure({ logLevel: "ERROR" });

let connection: snowflake.Connection | null = null;

function createNewConnection(): Promise<snowflake.Connection> {
  return new Promise((resolve, reject) => {
    const conn = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT!,
      username: process.env.SNOWFLAKE_USER!,
      password: process.env.SNOWFLAKE_PASSWORD!,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
      database: process.env.SNOWFLAKE_DATABASE!,
      schema: process.env.SNOWFLAKE_SCHEMA!,
    });

    conn.connect((err, conn) => {
      if (err) {
        log(`Snowflake connection error: ${err.message}`, "snowflake");
        return reject(err);
      }
      log("Connected to Snowflake", "snowflake");
      connection = conn;
      resolve(conn);
    });
  });
}

function getConnection(): Promise<snowflake.Connection> {
  if (connection && connection.isUp()) {
    return Promise.resolve(connection);
  }
  connection = null;
  return createNewConnection();
}

function isSessionExpiredError(err: Error): boolean {
  const msg = err.message || "";
  // Snowflake session token errors: expired token, gone session, auth failures on existing conn
  return /session|token|expire|auth|390104|390111|390114/i.test(msg);
}

function runQuery<T>(conn: snowflake.Connection, sql: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText: sql,
      complete: (err, _stmt, rows) => {
        if (err) return reject(err);
        resolve((rows || []) as T[]);
      },
    });
  });
}

export async function executeQuery<T = Record<string, unknown>>(
  sql: string
): Promise<T[]> {
  let conn = await getConnection();
  try {
    return await runQuery<T>(conn, sql);
  } catch (err: any) {
    if (isSessionExpiredError(err)) {
      log(`Session expired, reconnecting: ${err.message}`, "snowflake");
      connection = null;
      conn = await createNewConnection();
      return await runQuery<T>(conn, sql);
    }
    log(`Snowflake query error: ${err.message}`, "snowflake");
    throw err;
  }
}
