import assert from "node:assert/strict";
import test from "node:test";

test("renders Sayyar production metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();

  assert.match(html, /<html(?=[^>]*\blang=["']ar["'])(?=[^>]*\bdir=["']rtl["'])[^>]*>/i);
  assert.match(html, /<title>سيّار \| Sayyar<\/title>/i);
  assert.match(
    html,
    /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']منصة لمقارنة وحجز مركبات التأجير من شركاء موثوقين في المملكة العربية السعودية\.["'])[^>]*>/i,
  );
  assert.doesNotMatch(html, /\bcodex-preview\b/i);
});
