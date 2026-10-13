import { describe, expect, test } from "vitest";
import { renderHtml } from "@/lib/cms/format";
import { LIMITS } from "@/lib/cms/schema";
import { type01 } from "@/lib/cms/types/type01";

const withValues = (patch: Record<string, string>) => ({ ...type01.defaults, ...patch });

describe("renderHtml (type 01, original markup)", () => {
  test("renders the same markup as the original type 01", () => {
    const html = renderHtml(type01, type01.defaults);
    const expected = [
      '<section class="cms type01">',
      '  <div class="cms-inner">',
      '    <div class="cms-header">',
      '      <p class="cms-thin-title">제목을 입력해 보세요</p>',
      "    </div>",
      '    <div class="cms-visual">',
      '      <img src="/images/cms-sample.svg" alt="" class="img-fluid d-none d-lg-block"/>',
      '      <img src="/images/cms-sample-m.svg" alt="" class="w-100 d-block d-lg-none"/>',
      "    </div>",
      '    <div class="cms-description-box">',
      '      <p class="cms-description larger">입력한 내용이 HTML 소스와 미리보기에 바로 반영돼요.</p>',
      "    </div>",
      "  </div>",
      "</section>",
    ].join("\n");
    expect(html).toBe(expected);
  });

  test("uses no demo- classes", () => {
    expect(renderHtml(type01, type01.defaults)).not.toContain("demo-");
  });

  test("escapes script in a rich field and keeps allowed tags", () => {
    const html = renderHtml(type01, withValues({ title: "<em>x</em><script>alert(1)</script>" }));
    expect(html).toContain("<em>x</em>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  test("escapes event handlers and unknown tags in the description", () => {
    const html = renderHtml(type01, withValues({ description: '<img src=x onerror="alert(1)"><a href="javascript:x">l</a>' }));
    expect(html).not.toMatch(/<img[^>]*onerror/i);
    expect(html).not.toMatch(/<a[ >]/i);
    expect(html).toContain("&lt;img src=x onerror=");
  });

  test("applies limits", () => {
    const html = renderHtml(type01, withValues({ title: "가".repeat(1000) }));
    expect(html).toContain("가".repeat(LIMITS.rich));
    expect(html).not.toContain("가".repeat(LIMITS.rich + 1));
  });

  test("uses the sample images only for the defaults", () => {
    const html = renderHtml(type01, type01.defaults);
    expect(html).toContain('src="/images/cms-sample.svg"');
    expect(html).toContain('src="/images/cms-sample-m.svg"');
    expect(html).not.toContain("://");
  });

  test("an unsafe image src falls back to the matching sample", () => {
    const html = renderHtml(type01, withValues({ image: "javascript:alert(1)", imageMobile: "http://evil.example/a.png" }));
    expect(html).toContain('src="/images/cms-sample.svg"');
    expect(html).toContain('src="/images/cms-sample-m.svg"');
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("evil.example");
  });

  test("keeps a valid https image and omits an empty one", () => {
    const html = renderHtml(type01, withValues({ image: "https://example.com/a.png", imageMobile: "" }));
    expect(html).toContain('src="https://example.com/a.png"');
    expect(html).not.toContain("d-lg-none");
  });

  test("does not leak React resource hints such as <link rel=preload> into the source", () => {
    const html = renderHtml(type01, type01.defaults);
    expect(html).not.toContain("<link");
    expect(html).not.toContain("preload");
    expect(html.startsWith("<section")).toBe(true);
  });

  test("has no trailing newline", () => {
    expect(renderHtml(type01, type01.defaults).endsWith("\n")).toBe(false);
  });
});
