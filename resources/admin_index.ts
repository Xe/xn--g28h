import { Drash } from "../deps.ts";
import { db } from "../db.ts";
import ProtectedResource from "./protected_resource.ts";

export default class AdminIndex extends ProtectedResource {
  public paths = ["/admin"];

  public GET(_request: Drash.Request, response: Drash.Response) {
    const posts = db.query("SELECT COUNT(*) FROM posts")[0];
    const pages = db.query("SELECT COUNT(*) FROM pages")[0];
    const dbVersion = db.query("PRAGMA user_version")[0];

    const html = response.render("admin_index.html", {
      posts,
      pages,
      dbVersion,
      title: "👷🏼‍♀️",
    }) as string;
    return response.html(html);
  }
}