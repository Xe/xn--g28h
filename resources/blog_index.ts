import { Drash } from "../deps.ts";
import { db } from "../db.ts";

export default class Index extends Drash.Resource {
  public paths = ["/blog"];

  public GET(_request: Drash.Request, response: Drash.Response) {
    const posts = [];

    for (
      const [title, slug, created_at ] of db.query(
        "SELECT title, slug, created_at FROM posts WHERE draft = FALSE AND deleted_at IS NULL OR public_at < DATETIME('now') ORDER BY created_at DESC",
      )
    ) {
      posts.push({
        title,
        slug,
        created_at,
      });
    }

    const html = response.render("blog_index.html", {
      title: "📝",
      posts: posts,
    }) as string;

    return response.html(html);
  }
}