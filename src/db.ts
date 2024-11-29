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

  db.run(`
        CREATE TABLE IF NOT EXISTS karma (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL UNIQUE,
        karma INTEGER NOT NULL
  )`);

  db.run(`
        CREATE TABLE IF NOT EXISTS fipo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT NOT NULL UNIQUE,
        fipos INTEGER NOT NULL
  )`);
});

export default db;
