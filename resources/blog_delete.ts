import { Drash } from "../deps.ts";
import { db } from "../db.ts";
import ProtectedResource from "./protected_resource.ts";

export default class BlogDelete extends ProtectedResource {
    public paths = ["/admin/blog/:slug/delete"];

    public GET(request: Drash.Request, response: Drash.Response) {
        const slug = request.pathParam("slug");
        if (!slug) {
            response.status = 400;
            return response.text("need slug");
        }

        db.query("UPDATE posts SET deleted_at=DATETIME('now') WHERE slug = ?", [slug]);

        response.status = 403;
        response.headers.set("Location", "/admin/blog");
        return response.html("<script>window.location.href='/admin/blog';</script>");
    }
}