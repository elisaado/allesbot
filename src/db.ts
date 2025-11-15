import { Database } from "@db/sqlite";
import { addSigListener } from "./sigHandler.ts";

const basePath: URL = new URL("../", import.meta.url);
const db: Database = new Database(
  new URL("./daataabaasaa.db", basePath),
);

const closeListener = (): void => {
  console.log("Closing DB");
  db.close();
};

addSigListener(closeListener);

db.sql`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT NOT NULL UNIQUE,
        lastfm_username TEXT NOT NULL
        )
    `;

db.sql`
        CREATE TABLE IF NOT EXISTS karma (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL UNIQUE,
        karma INTEGER NOT NULL
  )`;

// delete old fipo table
db.sql`
        DROP TABLE IF EXISTS fipo
    `;

db.sql`
        CREATE TABLE IF NOT EXISTS fipos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT NOT NULL,
        date TEXT NOT NULL
  )`;

export { db };
