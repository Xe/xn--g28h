import { Drash } from "../deps.ts";
import { db } from "../db.ts";

export default class Page extends Drash.Resource {
  public paths = ["/blog/:slug"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const slug = request.pathParam("slug");

    let post = undefined;
    for (
      const [title, content_html, created_at, updated_at, public_at, draft] of db.query(
        "SELECT title, content_html, created_at, updated_at, public_at, draft FROM posts WHERE slug = ? AND deleted_at IS NULL",
        [slug],
      )
    ) {
      post = {
        title,
        content_html,
        created_at,
        updated_at,
        public_at,
        draft,
      };
    }

    if (post === undefined) {
      throw new Drash.Errors.HttpError(404, "Post not found or was deleted: " + slug);
    }

    const html = response.render("blog_page.html", post) as string;
    return response.html(html);
  }
}