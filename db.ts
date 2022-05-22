import { DB, jose } from "./deps.ts";

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
`,
  `
CREATE TABLE IF NOT EXISTS jwt_secrets
  ( id INTEGER NOT NULL PRIMARY KEY
  , private TEXT NOT NULL
  , public TEXT NOT NULL
  )
`,
];

const [dbVersion] = db.query("PRAGMA user_version")[0];

if (dbVersion as number < migrations.length) {
  const toRun = migrations.slice(dbVersion as number);
  for (const step of toRun) {
    db.query(step);
  }

  db.query(`PRAGMA user_version=${migrations.length}`);
}

// generate JWT keypair to save users a step.
{
  const [len] = db.query("SELECT COUNT(*) FROM jwt_secrets")[0];

  if (len === 0) {
    (async () => {
      const { publicKey, privateKey } = await jose.generateKeyPair("ES256", {
        extractable: true,
      });

      const privateKeyPEM = await jose.exportJWK(privateKey);
      const publicKeyPEM = await jose.exportJWK(publicKey);

      console.log("🔒 generated new JWT keys");
      db.query(`INSERT INTO jwt_secrets(private, public) VALUES (?, ?)`, [
        JSON.stringify(privateKeyPEM),
        JSON.stringify(publicKeyPEM),
      ]);
    })();
  }
}

async function getKeys(): Promise<{
    publicKey: Uint8Array | jose.KeyLike;
    privateKey: Uint8Array | jose.KeyLike;
  }> {
    const [publicKey, privateKey] =
      db.query("SELECT public, private FROM jwt_secrets LIMIT 1")[0];
    const [pubObj, privObj] = [ JSON.parse(publicKey as string), JSON.parse(privateKey as string) ];
    privObj.alg = "ES256";
    pubObj.alg = "ES256";
    return {
      publicKey: await jose.importJWK(pubObj),
      privateKey: await jose.importJWK(privObj),
    };
  }

export { db, getKeys };