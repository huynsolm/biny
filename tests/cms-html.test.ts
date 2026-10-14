import { describe, expect, test } from "vitest";
import {
  DEFAULT_IMAGE_SRC,
  DEFAULT_MOBILE_IMAGE_SRC,
  escapeHtml,
  IMAGE_DATA_MAX,
  safeImageSrc,
} from "@/lib/cms/html";

describe("escapeHtml", () => {
  test("converts & < > \" '", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;",
    );
  });

  test("leaves plain Korean text unchanged", () => {
    expect(escapeHtml("제목을 입력해 보세요")).toBe("제목을 입력해 보세요");
  });

  test("neutralizes a script tag", () => {
    expect(escapeHtml("<script>alert(1)</script>")).not.toContain("<script");
  });
});

describe("safeImageSrc", () => {
  test("accepts a root-relative path and an https URL", () => {
    expect(safeImageSrc("/images/a.svg")).toBe("/images/a.svg");
    expect(safeImageSrc("https://example.com/a.png")).toBe("https://example.com/a.png");
  });

  test("trims surrounding whitespace", () => {
    expect(safeImageSrc("  /images/a.svg ")).toBe("/images/a.svg");
  });

  test("rejects unsafe or malformed values", () => {
    const bad = [
      "",
      "javascript:alert(1)",
      "data:image/svg+xml;base64,AAAA",
      "http://example.com/a.png",
      "//evil.example/a.png",
      "/\\evil.example",
      "/a b.png",
      "https://",
      "/a\u0000.png",
    ];
    for (const value of bad) expect(safeImageSrc(value), JSON.stringify(value)).toBe(DEFAULT_IMAGE_SRC);
  });
});

describe("default images", () => {
  test("DEFAULT_MOBILE_IMAGE_SRC is the mobile sample path", () => {
    expect(DEFAULT_MOBILE_IMAGE_SRC).toBe("/images/cms-sample-m.svg");
  });

  test("safeImageSrc uses the given fallback", () => {
    expect(safeImageSrc("javascript:x", DEFAULT_MOBILE_IMAGE_SRC)).toBe(DEFAULT_MOBILE_IMAGE_SRC);
    expect(safeImageSrc("/images/a.svg", DEFAULT_MOBILE_IMAGE_SRC)).toBe("/images/a.svg");
  });
});

describe("safeImageSrc with an attached file", () => {
  const png = "data:image/png;base64,iVBORw0KGgo=";

  test("accepts raster data URLs made from an attached file", () => {
    for (const type of ["png", "jpeg", "webp", "gif"]) {
      const value = `data:image/${type};base64,AAAA`;
      expect(safeImageSrc(value), type).toBe(value);
    }
    expect(safeImageSrc(png)).toBe(png);
  });

  test("still rejects svg, html and malformed data URLs", () => {
    const bad = [
      "data:image/svg+xml;base64,AAAA",
      "data:text/html;base64,AAAA",
      "data:image/png,AAAA",
      "data:image/png;base64,AA AA",
      'data:image/png;base64,AAAA"onerror="x',
      "data:image/png;base64,",
      "DATA:image/png;base64,AAAA",
    ];
    for (const value of bad) expect(safeImageSrc(value), value).toBe(DEFAULT_IMAGE_SRC);
  });

  test("rejects a data URL above the size limit", () => {
    const big = `data:image/png;base64,${"A".repeat(IMAGE_DATA_MAX)}`;
    expect(safeImageSrc(big)).toBe(DEFAULT_IMAGE_SRC);
  });
});
