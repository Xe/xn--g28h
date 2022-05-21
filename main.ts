import { Marked, dexter, db, Drash, tengine } from "./deps.ts";

class Files extends Drash.Resource {
  paths = ["/static/.*"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const path = new URL(request.url).pathname;
    return response.file(`.${path}`); // response.file("./favicon.ico")
  }
}

class BlogIndex extends Drash.Resource {
  public paths = ["/blog"];

  public GET(request: Drash.Request, response: Drash.Response) {
    let posts = [];

    for (const [title, slug, created_at] of db.query("SELECT title, slug, created_at FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC")) {
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

class BlogPageEditor extends Drash.Resource {
  public paths = ["/blog/:slug/edit"];

  public POST(request: Drash.Request, response: Drash.Response) {
    const slug = request.pathParam("slug");
    const title = request.bodyParam<string>("title");
    let content = request.bodyParam<string>("text");

    if (!title) {
      response.status = 400;
      return response.json({"error": "Missing title"});
    }
    if (!content) {
      response.status = 400;
      return response.json({"error": "Missing content"});
    }
    content = content as string;

    const content_html = Marked.parse(content).content;

    db.query("UPDATE posts SET title = ?, content = ?, content_html = ?, updated_at = DATETIME('now') WHERE slug = ?", [title as string, content as string, content_html, slug]);

    response.json({"message": "Post updated."});
  }

  public GET(request: Drash.Request, response: Drash.Response) {
    const slug = request.pathParam("slug");

    let post = undefined;
    for (const [title, content, created_at, deleted_at] of db.query("SELECT title, content, created_at, deleted_at FROM posts WHERE slug = ?", [slug])) {
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

class BlogPage extends Drash.Resource {
  public paths = ["/blog/:slug"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const slug = request.pathParam("slug");

    let post = undefined;
    for (const [title, content_html, created_at, updated_at] of db.query("SELECT title, content_html, created_at, updated_at FROM posts WHERE slug = ? AND deleted_at IS NULL", [slug])) {
      post = {
        title,
        content_html,
        created_at,
        updated_at,
      };
    }

    if (post === undefined) {
      throw new Drash.Errors.HttpError(404, "Post not found: " + slug);
    }

    const html = response.render("blog_page.html", post) as string;
    return response.html(html);
  }
}

class Index extends Drash.Resource {
  public paths = ["/"];

  public GET(request: Drash.Request, response: Drash.Response) {
    let opts = {
      title: "Home",
      content: "Welcome to my <b>website</b>!",
    };

    const html = response.render("index.html", opts) as string;
    return response.html(html);
  }
}

class ErrorHandler extends Drash.ErrorHandler {
  public catch(
    error: Error,
    request: Request,
    response: Drash.Response,
  ): void {
    // Handle all built-in Drash errors. This means any error that Drash
    // throws internally will be handled in this block. This also means any
    // resource that throws Drash.Errors.HttpError will be handled here.
    if (error instanceof Drash.Errors.HttpError) {
      response.status = error.code;
      
      const html = response.render("error.html", {
        title: error.message,
        error,
      }) as string;
      return response.html(html);
    }

    // If the error is not of type Drash.Errors.HttpError, then default to a
    // HTTP 500 error response. This is useful if you cannot ensure that
    // third-party dependencies (e.g., some database dependency) will throw
    // an error object that can be converted to an HTTP response.
    response.status = 500;
    return response.json({
      message: "Server failed to process the request.",
    });
  }
}

const server = new Drash.Server({
  error_handler: ErrorHandler,
  hostname: "0.0.0.0",
  port: 8080,
  protocol: "http",
  resources: [Files, Index, BlogIndex, BlogPage, BlogPageEditor],
  services: [tengine, dexter],
});

server.run();

console.log(`😂 running at ${server.address}.`);