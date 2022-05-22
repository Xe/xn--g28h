import { Drash } from "../deps.ts";

export default class PagesIndex extends Drash.Resource {
  public paths = ["/"];

  public GET(_request: Drash.Request, response: Drash.Response) {
    const opts = {
      title: "Home",
      content: "Welcome to my <b>website</b>! I haven't configured a home page with 😂 yet, but I'm sure you'll find something interesting if you dig around my <a href='/blog'>blog</a>.",
    };

    const html = response.render("index.html", opts) as string;
    return response.html(html);
  }
}