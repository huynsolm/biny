import { describe, expect, test } from "vitest";
import { buildPreviewDocument } from "@/lib/cms/preview";

describe("buildPreviewDocument", () => {
  test("embeds the html unchanged inside body", () => {
    const html = '<section class="demo-block demo-title">\n  <h2 class="demo-heading">제목</h2>\n</section>';
    const doc = buildPreviewDocument(html);
    const body = doc.slice(doc.indexOf("<body>") + "<body>".length, doc.lastIndexOf("</body>"));
    expect(body.trim()).toBe(html);
  });

  test("inlines the default sample image so the sandboxed preview does not depend on same-site loading", () => {
    const doc = buildPreviewDocument('<img class="demo-image" src="/images/cms-sample.svg" alt="x">');
    expect(doc).not.toContain('src="/images/cms-sample.svg"');
    expect(doc).toContain('src="data:image/svg+xml,');
    expect(doc).toContain('alt="x"');
  });

  test("leaves other image sources untouched", () => {
    const doc = buildPreviewDocument('<img src="https://example.com/a.png" alt="">');
    expect(doc).toContain('src="https://example.com/a.png"');
    expect(doc).not.toContain("data:image/svg+xml");
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
