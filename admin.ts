import { Cookie } from "https://deno.land/x/drash@v2.5.4/deps.ts";
import { Buffer, crypto, db, Drash } from "./deps.ts";

export function authed(request: Drash.Request): boolean {
  return true;
}

function setAuth(response: Drash.Response) {
    //response.setCookie(new Cookie())
}

export class Login extends Drash.Resource {
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

    let pwhash = Buffer.from(
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

    const [dbPwHash] = db.query(`SELECT password FROM users WHERE username = ?`, [username as string])[0];

    if (pwhash !== dbPwHash) {
        response.status = 400;
        return response.text("need auth");
    }

    setAuth(response);
    response.text("auth worked!");
  }

  public GET(_request: Drash.Request, response: Drash.Response) {
    const html = response.render("admin_login.html", { title: "🔑❓" }) as string;
    return response.html(html);
  }
}

export class Index extends Drash.Resource {
  public paths = ["/admin"];

  public GET(request: Drash.Request, response: Drash.Response) {
    if (!authed(request)) {
      response.status = 403;
      response.headers.set("Location", "/admin/login");
      return response.html(
        "<script>window.location.href='/admin/login';</script>",
      );
    }

    const posts = db.query("SELECT COUNT(*) FROM posts")[0];
    const pages = db.query("SELECT COUNT(*) FROM pages")[0];

    const html = response.render("admin_index.html", {
      posts,
      pages,
      title: "👷🏼‍♀️",
    }) as string;
    return response.html(html);
  }
}
