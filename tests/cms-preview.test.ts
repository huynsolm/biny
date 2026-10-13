import { describe, expect, test } from "vitest";
import { buildPreviewDocument } from "@/lib/cms/preview";

describe("buildPreviewDocument", () => {
  test("embeds the html unchanged inside body", () => {
    const html = '<section class="demo-block demo-title">\n  <h2 class="demo-heading">제목</h2>\n</section>';
    const doc = buildPreviewDocument(html);
    const body = doc.slice(doc.indexOf("<body>") + "<body>".length, doc.lastIndexOf("</body>"));
    expect(body.trim()).toBe(html);
  });

  test("contains no script element", () => {
    expect(buildPreviewDocument("<p>x</p>").toLowerCase()).not.toContain("<script");
  });

  test("declares doctype, lang ko and charset", () => {
    const doc = buildPreviewDocument("");
    expect(doc.startsWith("<!doctype html>")).toBe(true);
    expect(doc).toContain('<html lang="ko">');
    expect(doc).toContain('<meta charset="utf-8">');
  });
});
