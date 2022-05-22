import { Drash } from "../deps.ts";
import { db } from "../db.ts";
import ProtectedResource from "./protected_resource.ts";

export default class BlogRescue extends ProtectedResource {
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