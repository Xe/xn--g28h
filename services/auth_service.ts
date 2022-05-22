import { Drash, jose } from "../deps.ts";
import { getKeys } from "../db.ts";

class AuthenticationService extends Drash.Service {
  /**
   * Run the following code before a resource is hit.
   *
   * @param request - The incoming request from the client.
   * @param response - The response to send back to the client (if needed).
   */
  public async runBeforeResource(
    request: Drash.Request,
    response: Drash.Response,
  ) {
    const cookie = request.getCookie("jwt");

    if (!cookie) {
        response.status = 307;
        response.headers.set("Location", "/admin/login");
        return response.html("<script>window.location.href='/admin/login';</script>");
    }

    const { publicKey } = await getKeys();
    await jose.jwtVerify(
      cookie,
      publicKey,
      {
        issuer: "xn--g28h.login",
        audience: "xn--g28h.blog",
        algorithms: ["ES256"],
      },
    );
  }
}

export default new AuthenticationService();
