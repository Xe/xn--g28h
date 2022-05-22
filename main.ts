import { dexter, Drash, tengine } from "./deps.ts";
import AdminIndex from "./resources/admin_index.ts";
import AdminLogin from "./resources/admin_login.ts";
import BlogDelete from "./resources/blog_delete.ts";
import BlogRescue from "./resources/blog_rescue.ts";
import BlogAdminIndex from "./resources/blog_admin_index.ts";
import BlogEdit from "./resources/blog_edit.ts";
import BlogIndex from "./resources/blog_index.ts";
import BlogPage from "./resources/blog_page.ts";
import BlogCreate from "./resources/blog_create.ts";

class Files extends Drash.Resource {
  paths = ["/static/.*"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const path = new URL(request.url).pathname;
    return response.file(`.${path}`); // response.file("./favicon.ico")
  }
}

class Index extends Drash.Resource {
  public paths = ["/"];

  public GET(_request: Drash.Request, response: Drash.Response) {
    const opts = {
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
    _request: Request,
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
  hostname: "",
  port: 8080,
  protocol: "http",
  resources: [
    Files,
    Index,
    AdminLogin,
    AdminIndex,
    BlogDelete,
    BlogRescue,
    BlogAdminIndex,
    BlogEdit,
    BlogIndex,
    BlogPage,
    BlogCreate,
  ],
  services: [tengine, dexter],
});

server.run();

console.log(`😂 running at ${server.address}.`);
