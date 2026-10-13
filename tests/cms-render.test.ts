import { describe, expect, test } from "vitest";
import { renderHtml } from "@/lib/cms/format";
import { LIMITS } from "@/lib/cms/schema";
import { type01 } from "@/lib/cms/types/type01";

const withValues = (patch: Record<string, string>) => ({ ...type01.defaults, ...patch });

describe("renderHtml (type 01)", () => {
  test("renders defaults with only demo- classes and the type class", () => {
    const html = renderHtml(type01, type01.defaults);
    expect(html).toContain('class="demo-block demo-type01"');
    const tokens = [...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/));
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) expect(token, token).toMatch(/^demo-/);
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
    expect(html).not.toContain("demo-mobile-only");
  });

  test("the pc and mobile images use the switch classes", () => {
    const html = renderHtml(type01, type01.defaults);
    expect(html).toContain("demo-pc-only");
    expect(html).toContain("demo-mobile-only");
  });

  test("does not leak React resource hints such as <link rel=preload> into the source", () => {
    const html = renderHtml(type01, type01.defaults);
    expect(html).not.toContain("<link");
    expect(html).not.toContain("preload");
    expect(html.startsWith("<section")).toBe(true);
  });

  test("formats the source over several lines without a trailing newline", () => {
    const html = renderHtml(type01, type01.defaults);
    expect(html.split("\n").length).toBeGreaterThan(3);
    expect(html.endsWith("\n")).toBe(false);
  });
});
