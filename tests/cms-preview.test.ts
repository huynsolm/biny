import { describe, expect, test } from "vitest";
import { BASE_CSS, buildPreviewDocument } from "@/lib/cms/preview";

describe("buildPreviewDocument", () => {
  test("embeds the html unchanged inside body", () => {
    const html = '<section class="demo-block demo-type01">\n  <p class="demo-title">제목</p>\n</section>';
    const doc = buildPreviewDocument(html, "");
    const body = doc.slice(doc.indexOf("<body>") + "<body>".length, doc.lastIndexOf("</body>"));
    expect(body.trim()).toBe(html);
  });

  test("includes the base css and the given css", () => {
    const doc = buildPreviewDocument("<p>x</p>", ".demo-type99 { color: red; }");
    expect(doc).toContain(BASE_CSS.trim().slice(0, 20));
    expect(doc).toContain(".demo-type99 { color: red; }");
    expect(doc.indexOf(BASE_CSS.trim().slice(0, 20))).toBeLessThan(doc.indexOf(".demo-type99"));
  });

  test("replaces both sample sources with data URIs so the sandboxed preview does not depend on same-site loading", () => {
    const doc = buildPreviewDocument(
      '<img src="/images/cms-sample.svg" alt="a"><img src="/images/cms-sample-m.svg" alt="b">',
      "",
    );
    expect(doc).not.toContain('src="/images/cms-sample.svg"');
    expect(doc).not.toContain('src="/images/cms-sample-m.svg"');
    expect(doc.match(/src="data:image\/svg\+xml,/g)).toHaveLength(2);
    expect(doc).toContain('alt="a"');
    expect(doc).toContain('alt="b"');
  });

  test("uses different pictures for the pc and mobile samples", () => {
    const pc = buildPreviewDocument('<img src="/images/cms-sample.svg">', "");
    const mobile = buildPreviewDocument('<img src="/images/cms-sample-m.svg">', "");
    const pick = (doc: string) => doc.match(/src="(data:[^"]+)"/)?.[1];
    expect(pick(pc)).toBeDefined();
    expect(pick(mobile)).toBeDefined();
    expect(pick(pc)).not.toBe(pick(mobile));
  });

  test("leaves other image sources untouched", () => {
    const doc = buildPreviewDocument('<img src="https://example.com/a.png" alt="">', "");
    expect(doc).toContain('src="https://example.com/a.png"');
    expect(doc).not.toContain("data:image/svg+xml");
  });

  test("contains no script element", () => {
    expect(buildPreviewDocument("<p>x</p>", ".a{}").toLowerCase()).not.toContain("<script");
  });

  test("declares doctype, lang ko and charset", () => {
    const doc = buildPreviewDocument("", "");
    expect(doc.startsWith("<!doctype html>")).toBe(true);
    expect(doc).toContain('<html lang="ko">');
    expect(doc).toContain('<meta charset="utf-8">');
  });

  test("the base css implements the Bootstrap class names the original markup uses (lg = 992px)", () => {
    for (const token of [".row", ".col-6", ".col-lg-6", ".col-lg-auto", ".d-none", ".d-block", ".d-lg-block", ".d-lg-none", ".img-fluid", ".w-100"]) {
      expect(BASE_CSS, token).toContain(token);
    }
    expect(BASE_CSS).toContain("min-width: 992px");
  });
});
