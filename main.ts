import { dexter, Drash, tengine } from "./deps.ts";

// Resources
import AdminIndex from "./resources/admin_index.ts";
import AdminLogin from "./resources/admin_login.ts";
import BlogDelete from "./resources/blog_delete.ts";
import BlogRescue from "./resources/blog_rescue.ts";
import BlogAdminIndex from "./resources/blog_admin_index.ts";
import BlogEdit from "./resources/blog_edit.ts";
import BlogIndex from "./resources/blog_index.ts";
import BlogPage from "./resources/blog_page.ts";
import BlogCreate from "./resources/blog_create.ts";
import Files from "./resources/files.ts";
import PagesIndex from "./resources/pages_index.ts";

import ErrorHandler from "./error_handler.ts";

const server = new Drash.Server({
  error_handler: ErrorHandler,
  hostname: "",
  port: 8080,
  protocol: "http",
  resources: [
    Files,
    PagesIndex,
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
