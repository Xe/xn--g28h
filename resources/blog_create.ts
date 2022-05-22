import { Drash, Marked } from "../deps.ts";
import { db } from "../db.ts";
import ProtectedResource from "./protected_resource.ts";

export default class Create extends ProtectedResource {    
  public paths = ["/admin/blog/create"];

  public POST(request: Drash.Request, response: Drash.Response) {
    let slug = request.bodyParam<string>("slug");
    let title = request.bodyParam<string>("title");
    let content = request.bodyParam<string>("text");

    if (!slug) {
      response.status = 400;
      return response.json({ "error": "missing slug" });
    }
    slug = slug as string;

    if (!title) {
      response.status = 400;
      return response.json({ "error": "Missing title" });
    }
    title = title as string;

    if (!content) {
      response.status = 400;
      return response.json({ "error": "Missing content" });
    }
    content = content as string;

    const content_html = Marked.parse(content).content;

    db.query(
      "INSERT INTO posts(title, content, content_html, slug, created_at) VALUES(?, ?, ?, ?, DATETIME('now'))",
      [title as string, content as string, content_html, slug],
    );

    response.json({ "message": "Post updated." });
  }

  public GET(_request: Drash.Request, response: Drash.Response) {
    const html = response.render("blog_create.html", { title: "📄🆕" }) as string;
    return response.html(html);
  }
}