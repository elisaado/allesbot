import { Database } from "@db/sqlite";
import { addSigListener } from "./sigHandler.ts";

const basePath = new URL("../", import.meta.url);
const db = new Database(new URL("./db.db", basePath));

addSigListener(() => {
  console.log("Closing DB");
  db.close();
});

db.sql`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT NOT NULL UNIQUE,
    lastfm_username TEXT NOT NULL
  );
`;

db.sql`
  CREATE TABLE IF NOT EXISTS karma (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL UNIQUE,
    karma INTEGER NOT NULL
  );
`;

db.sql`DROP TABLE IF EXISTS fipo;`;

db.sql`
  CREATE TABLE IF NOT EXISTS fipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT NOT NULL,
    date TEXT NOT NULL
  );
`;

export { db };
