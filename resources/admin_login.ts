import { Buffer, crypto, Drash, jose } from "../deps.ts";
import { db, getKeys } from "../db.ts";

export default class Login extends Drash.Resource {
  public paths = ["/admin/login"];

  public async POST(request: Drash.Request, response: Drash.Response) {
    let username = request.bodyParam("username");
    let password = request.bodyParam("password");

    if (!username) {
      response.status = 400;
      return response.text("need auth");
    }
    username = username as string;

    if (!password) {
      response.status = 400;
      return response.text("need auth");
    }
    password = password as string;

    console.log({ username, password });

    const userCount = db.query("SELECT COUNT(*) FROM users")[0];

    const pwhash = Buffer.from(
      new Uint8Array(
        await crypto.subtle.digest(
          "BLAKE3",
          new TextEncoder().encode(password as string),
        ),
      ),
    ).toString("hex");

    if (userCount[0] === 0) {
      db.query(`INSERT INTO users(username, password) VALUES (?, ?)`, [
        username as string,
        pwhash,
      ]);
    }

    const [dbPwHash] =
      db.query(`SELECT password FROM users WHERE username = ?`, [
        username as string,
      ])[0];

    if (pwhash !== dbPwHash) {
      response.status = 400;
      return response.text("need auth");
    }

    const { privateKey } = await getKeys();

    console.log(privateKey);

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt()
      .setIssuer("xn--g28h.login")
      .setAudience("xn--g28h.blog")
      .setExpirationTime("2h")
      .sign(privateKey);

    console.log(jwt);

    response.setCookie({ name: "jwt", value: jwt });

    response.headers.set("Location", "/admin");

    response.text("auth worked!");
  }

  public GET(_request: Drash.Request, response: Drash.Response) {
    const html = response.render("admin_login.html", { title: "🔑❓" }) as string;
    return response.html(html);
  }
}