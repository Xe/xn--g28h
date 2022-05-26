import { g, r } from "./xeact.js";

r(() => {
  const submit = g("submit");
  submit.onclick = async () => {
    const editor = g("editor");
    const text = editor.value;
    const title = g("title").value;
    const slug = g("slug").value;
    const draft = g("draft").checked;

    const resp = await fetch("/admin/blog/" + slug + "/edit", {
      method: "POST",
      body: JSON.stringify({ text, title, draft }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (resp.status != 200) {
      alert("Error: " + resp.status);
    } else {
      //window.location.href = "/admin/blog/" + slug + "/edit";
    }
  };
});
