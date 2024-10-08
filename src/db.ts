import sqlite3 from "sqlite3";

const db = new sqlite3.Database("db/db.sqlite3");

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT NOT NULL UNIQUE,
        lastfm_username TEXT NOT NULL
        )
    `);
});

export default db;
