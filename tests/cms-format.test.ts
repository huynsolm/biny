import { describe, expect, test } from "vitest";
import { formatHtml } from "@/lib/cms/format";

describe("formatHtml", () => {
  test("keeps inline content on one line", () => {
    expect(formatHtml("<p>가<em>나</em>다</p>")).toBe("<p>가<em>나</em>다</p>");
  });

  test("indents nested blocks", () => {
    expect(formatHtml("<div><p>a</p><p>b</p></div>")).toBe("<div>\n  <p>a</p>\n  <p>b</p>\n</div>");
  });

  test("indents each nesting level by two spaces", () => {
    expect(formatHtml("<section><div><p>a</p></div></section>")).toBe(
      "<section>\n  <div>\n    <p>a</p>\n  </div>\n</section>",
    );
  });

  test("keeps br inside a paragraph on the same line", () => {
    expect(formatHtml("<p>a<br>b<br/>c</p>")).toBe("<p>a<br>b<br/>c</p>");
  });

  test("puts void img on its own line", () => {
    expect(formatHtml('<div><img src="x" alt="y"/></div>')).toBe('<div>\n  <img src="x" alt="y"/>\n</div>');
    expect(formatHtml('<div><img src="a"/><img src="b"/></div>')).toBe(
      '<div>\n  <img src="a"/>\n  <img src="b"/>\n</div>',
    );
  });

  test("empty element stays on one line", () => {
    expect(formatHtml("<div></div>")).toBe("<div></div>");
    expect(formatHtml("<div><div></div></div>")).toBe("<div>\n  <div></div>\n</div>");
  });

  test("puts text on its own line when mixed with block children", () => {
    expect(formatHtml("<div>t<p>x</p></div>")).toBe("<div>\n  t\n  <p>x</p>\n</div>");
  });

  test("handles inline inside inline", () => {
    expect(formatHtml("<p><em><strong>a</strong></em></p>")).toBe("<p><em><strong>a</strong></em></p>");
  });

  test("keeps inline siblings of block children on their own lines", () => {
    expect(formatHtml("<div><span>s</span><p>x</p></div>")).toBe("<div>\n  <span>s</span>\n  <p>x</p>\n</div>");
  });

  test("formats lists", () => {
    expect(formatHtml("<ul><li>a</li><li>b<em>c</em></li></ul>")).toBe(
      "<ul>\n  <li>a</li>\n  <li>b<em>c</em></li>\n</ul>",
    );
  });

  test("keeps attributes and entities untouched", () => {
    const html = '<p class="demo-x" title="a &gt; b">&lt;tag&gt; &amp; text</p>';
    expect(formatHtml(html)).toBe(html);
  });

  test("returns empty string for empty input", () => {
    expect(formatHtml("")).toBe("");
  });

  test("has no trailing newline", () => {
    expect(formatHtml("<div><p>a</p></div>").endsWith("\n")).toBe(false);
    expect(formatHtml("<p>a</p>").endsWith("\n")).toBe(false);
  });

  test("is stable: formatting twice gives the same result", () => {
    const once = formatHtml("<div><p>a<em>b</em></p><ul><li>x</li></ul></div>");
    expect(formatHtml(once.replace(/\n\s*/g, ""))).toBe(once);
  });

  test("tolerates a long text without breaking it", () => {
    const text = "가".repeat(500);
    expect(formatHtml(`<p>${text}</p>`)).toBe(`<p>${text}</p>`);
  });
});
