import { Drash, Marked } from "../deps.ts";
import { db } from "../db.ts";
import ProtectedResource from "./protected_resource.ts";

export default class BlogEdit extends ProtectedResource {
    public paths = ["/admin/blog/:slug/edit"];
  
    public POST(request: Drash.Request, response: Drash.Response) {
      const slug = request.pathParam("slug");
      const title = request.bodyParam<string>("title");
      const content = request.bodyParam<string>("text");
      const is_draft = request.bodyParam<boolean>("draft");
  
      if (!title) {
        response.status = 400;
        return response.json({ "error": "Missing title" });
      }
      if (!content) {
        response.status = 400;
        return response.json({ "error": "Missing content" });
      }
  
      const content_html = Marked.parse(content).content;
  
      db.query(
        "UPDATE posts SET title = ?, content = ?, content_html = ?, updated_at = DATETIME('now'), draft = ? WHERE slug = ?",
        [title as string, content as string, content_html, is_draft || true, slug],
      );
  
      response.json({ "message": "Post updated." });
    }
  
    public GET(request: Drash.Request, response: Drash.Response) {
      const slug = request.pathParam("slug");
  
      let post = undefined;
      for (
        const [title, content, created_at, deleted_at, draft] of db.query(
          "SELECT title, content, created_at, deleted_at, draft FROM posts WHERE slug = ?",
          [slug],
        )
      ) {
        post = {
          title,
          slug,
          content,
          created_at,
          deleted_at,
          draft,
        };
      }
  
      if (post === undefined) {
        throw new Drash.Errors.HttpError(404, "Post not found: " + slug);
      }
  
      const html = response.render("blog_edit.html", post) as string;
      return response.html(html);
    }
  }