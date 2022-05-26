import { Drash } from "../deps.ts";
import { db } from "../db.ts";
import ProtectedResource from "./protected_resource.ts";

export default class AdminIndex extends ProtectedResource {
  public paths = ["/admin/blog"];

  public GET(_request: Drash.Request, response: Drash.Response) {
    const posts = [];

    for (
      const [title, slug, created_at, updated_at, deleted_at, public_at, draft] of db.query(
        "SELECT title, slug, created_at, updated_at, deleted_at, public_at, draft FROM posts ORDER BY created_at DESC",
      )
    ) {
      posts.push({
        title,
        slug,
        created_at,
        updated_at,
        deleted_at,
        public_at,
        draft,
      });
    }

    const html = response.render("blog_index_admin.html", {
      title: "👷🏼‍♀️📝",
      posts: posts,
    }) as string;

    return response.html(html);
  }
}