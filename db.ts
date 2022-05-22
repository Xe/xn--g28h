import {DB} from "./deps.ts";

const dbLoc = Deno.env.get("DATABASE_PATH");
const db = new DB(dbLoc !== undefined ? dbLoc : "./xn--g28h.db");

const migrations = [
    `
CREATE TABLE IF NOT EXISTS posts
  ( id INTEGER NOT NULL PRIMARY KEY
  , title TEXT NOT NULL
  , slug TEXT NOT NULL
  , content TEXT NOT NULL
  , content_html TEXT NOT NULL
  , created_at TEXT NOT NULL
  , updated_at TEXT
  , deleted_at TEXT
  , metadata TEXT
  );
`,
`
CREATE TABLE IF NOT EXISTS pages
  ( id INTEGER NOT NULL PRIMARY KEY
  , title TEXT NOT NULL
  , slug TEXT NOT NULL
  , content TEXT NOT NULL
  , content_html TEXT NOT NULL
  , created_at TEXT NOT NULL
  , updated_at TEXT
  , deleted_at TEXT
  );
`,
`
CREATE TABLE IF NOT EXISTS users
  ( id INTEGER NOT NULL PRIMARY KEY
  , username TEXT NOT NULL
  , password TEXT NOT NULL
  );
`,
`
CREATE UNIQUE INDEX IF NOT EXISTS posts_slugs
  ON posts(slug);
`,
`
ALTER TABLE posts ADD COLUMN public_at TEXT;
`
];

const [dbVersion] = db.query("PRAGMA user_version")[0];

if (dbVersion as number < migrations.length) {
    const toRun = migrations.slice(dbVersion as number);
    for (const step of toRun) {
        db.query(step);
    }

    db.query(`PRAGMA user_version=${migrations.length}`);
}

export {db};