import { db, Drash, Marked } from "./deps.ts";

export class Delete extends Drash.Resource {
    public paths = ["/admin/blog/:slug/delete"];

    public GET(request: Drash.Request, response: Drash.Response) {
        let slug = request.pathParam("slug");
        if (!slug) {
            response.status = 400;
            return response.text("need slug");
        }
        slug = slug as string;

        db.query("UPDATE posts SET deleted_at=DATETIME('now') WHERE slug = ?", [slug]);

        response.status = 403;
        response.headers.set("Location", "/admin/blog");
        return response.html("<script>window.location.href='/admin/blog';</script>");
    }
}

export class Rescue extends Drash.Resource {
    public paths = ["/admin/blog/:slug/rescue"];

    public GET(request: Drash.Request, response: Drash.Response) {
        let slug = request.pathParam("slug");
        if (!slug) {
            response.status = 400;
            return response.text("need slug");
        }
        slug = slug as string;

        db.query("UPDATE posts SET deleted_at=NULL WHERE slug = ?", [slug]);

        response.status = 403;
        response.headers.set("Location", "/admin/blog");
        return response.html("<script>window.location.href='/admin/blog';</script>");
    }
}

export class AdminIndex extends Drash.Resource {
  public paths = ["/admin/blog"];

  public GET(_request: Drash.Request, response: Drash.Response) {
    const posts = [];

    for (
      const [title, slug, created_at, updated_at, deleted_at] of db.query(
        "SELECT title, slug, created_at, updated_at, deleted_at FROM posts ORDER BY created_at DESC",
      )
    ) {
      posts.push({
        title,
        slug,
        created_at,
        updated_at,
        deleted_at,
      });
    }

    const html = response.render("blog_index_admin.html", {
      title: "👷🏼‍♀️📄",
      posts: posts,
    }) as string;

    return response.html(html);
  }
}

export class Index extends Drash.Resource {
  public paths = ["/blog"];

  public GET(_request: Drash.Request, response: Drash.Response) {
    const posts = [];

    for (
      const [title, slug, created_at] of db.query(
        "SELECT title, slug, created_at FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC",
      )
    ) {
      posts.push({
        title,
        slug,
        created_at,
      });
    }

    const html = response.render("blog_index.html", {
      title: "Blog",
      posts: posts,
    }) as string;

    return response.html(html);
  }
}

export class Create extends Drash.Resource {
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

export class PageEditor extends Drash.Resource {
  public paths = ["/admin/blog/:slug/edit"];

  public POST(request: Drash.Request, response: Drash.Response) {
    const slug = request.pathParam("slug");
    const title = request.bodyParam<string>("title");
    let content = request.bodyParam<string>("text");

    if (!title) {
      response.status = 400;
      return response.json({ "error": "Missing title" });
    }
    if (!content) {
      response.status = 400;
      return response.json({ "error": "Missing content" });
    }
    content = content as string;

    const content_html = Marked.parse(content).content;

    db.query(
      "UPDATE posts SET title = ?, content = ?, content_html = ?, updated_at = DATETIME('now') WHERE slug = ?",
      [title as string, content as string, content_html, slug],
    );

    response.json({ "message": "Post updated." });
  }

  public GET(request: Drash.Request, response: Drash.Response) {
    const slug = request.pathParam("slug");

    let post = undefined;
    for (
      const [title, content, created_at, deleted_at] of db.query(
        "SELECT title, content, created_at, deleted_at FROM posts WHERE slug = ?",
        [slug],
      )
    ) {
      post = {
        title,
        slug,
        content,
        created_at,
        deleted_at,
      };
    }

    if (post === undefined) {
      throw new Drash.Errors.HttpError(404, "Post not found: " + slug);
    }

    const html = response.render("blog_edit.html", post) as string;
    return response.html(html);
  }
}

export class Page extends Drash.Resource {
  public paths = ["/blog/:slug"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const slug = request.pathParam("slug");

    let post = undefined;
    for (
      const [title, content_html, created_at, updated_at] of db.query(
        "SELECT title, content_html, created_at, updated_at FROM posts WHERE slug = ? AND deleted_at IS NULL",
        [slug],
      )
    ) {
      post = {
        title,
        content_html,
        created_at,
        updated_at,
      };
    }

    if (post === undefined) {
      throw new Drash.Errors.HttpError(404, "Post not found or was deleted: " + slug);
    }

    const html = response.render("blog_page.html", post) as string;
    return response.html(html);
  }
}
