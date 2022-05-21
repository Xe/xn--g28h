import { dexter, Drash } from "./deps.ts";

class Files extends Drash.Resource {
  paths = ["/static/.*"];

  public GET(request: Drash.Request, response: Drash.Response) {
    const path = new URL(request.url).pathname;
    return response.file(`.${path}`); // response.file("./favicon.ico")
  }
}

const server = new Drash.Server({
  hostname: "0.0.0.0",
  port: 8080,
  protocol: "http",
  resources: [Files],
  services: [dexter],
});

server.run();

console.log(`Server running at ${server.address}.`);