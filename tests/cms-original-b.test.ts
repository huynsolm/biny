import { describe, expect, test } from "vitest";
import { count, listLength, noImages, render } from "./cms-helpers";

// 원본 CMS 도구와 같은 HTML을 만드는지 검사한다(타입 09~15).

describe("type 09 (original markup)", () => {
  test("renders a check list with the original classes and svg", () => {
    const html = render("type09");
    const n = listLength("type09", "contents");
    expect(html).toContain('<section class="cms type09 type-bg">');
    expect(html).toContain('<ul class="cms-column-list item-bg-box text-type-3 row justify-content-start">');
    expect(html.match(/<li class="cms-list-item col-6">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-inner-box row">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-figure check col-auto">/g)).toHaveLength(n);
    expect(html.match(/<svg class="cms-figure-svg" width="40" height="40" viewBox="0 0 40 40">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-description-box col">/g)).toHaveLength(n);
    expect(html).not.toContain("demo-");
  });

  test("the per-row select uses the original column classes", () => {
    for (const value of ["col-12", "col-6", "col-4"]) {
      expect(render("type09", { perRow: value }), value).toContain(`<li class="cms-list-item ${value}">`);
    }
  });

  test("an unknown per-row value falls back to the original default col-12", () => {
    const html = render("type09", { perRow: '"><script>x</script>' });
    expect(html).toContain('<li class="cms-list-item col-12">');
    expect(html).not.toContain("<script");
  });

  test("keeps allowed tags in the text and escapes script", () => {
    const html = render("type09", { contents: [{ text: "<em>x</em><script>alert(1)</script>" }] });
    expect(html).toContain("<em>x</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 10 (original markup)", () => {
  test("renders one image pair above the hexagon list with the original classes", () => {
    const html = render("type10");
    const n = listLength("type10", "contents");
    expect(html).toContain('<section class="cms type10">');
    expect(html.match(/<div class="cms-visual mobile-expanded">/g)).toHaveLength(1);
    expect(html).toContain('<ol class="cms-figure-list text-type-1">');
    expect(html.match(/<div class="row align-items-center">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-figure hexagon col-lg-auto">/g)).toHaveLength(n);
    expect(html.match(/<svg class="cms-figure-svg" width="276" height="244" viewBox="0 0 276 244">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-description-box col-lg">/g)).toHaveLength(n);
    expect(count(html, "cms-figure-text")).toBe(n);
    expect(html).not.toContain("demo-");
  });

  test("shows the border list only for items that have sub texts", () => {
    const item = { num: "1", title: "t", sTitle: "s", text: "x" };
    const withSub = render("type10", { contents: [{ ...item, subtext: [{ text: "a" }, { text: "b" }] }] });
    expect(withSub).toContain('<ul class="cms-border-list text-type-2 row">');
    expect(withSub.match(/<li class="cms-list-item col-6 col-lg-auto">/g)).toHaveLength(2);
    const without = render("type10", { contents: [{ ...item, subtext: [] }] });
    expect(without).not.toContain("cms-border-list");
  });

  test("the item text is rich, the other fields are plain", () => {
    const html = render("type10", {
      contents: [{ num: "<b>1</b>", title: "<em>t</em>", sTitle: "s", text: "<em>ok</em><script>x</script>", subtext: [] }],
    });
    expect(html).toContain("<em>ok</em>");
    expect(html).toContain("&lt;b&gt;1&lt;/b&gt;");
    expect(html).toContain("&lt;em&gt;t&lt;/em&gt;");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  test("keeps the nested list within the sub item limit", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ text: `s${i}` }));
    const html = render("type10", { contents: [{ num: "1", title: "t", sTitle: "s", text: "x", subtext: many }] });
    expect(html.match(/<li class="cms-list-item col-6 col-lg-auto">/g)?.length ?? 0).toBeLessThanOrEqual(8);
  });
});

describe("type 11 (original markup)", () => {
  test("renders a dark bullet list with the original classes", () => {
    const html = render("type11");
    expect(html).toContain('<section class="cms type11 type-bg bg-image-2 text-white">');
    expect(html).toContain('<ul class="cms-bullet-list list-bg-box">');
    expect(html.match(/<li class="cms-list-item">/g)).toHaveLength(listLength("type11", "contents"));
    expect(html).not.toContain("demo-");
  });

  test("escapes script in the text", () => {
    const html = render("type11", { contents: [{ text: "<script>alert(1)</script>" }] });
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("type 12 (original markup)", () => {
  test("renders a dark three column list with icons", () => {
    const html = render("type12");
    const n = listLength("type12", "contents");
    expect(html).toContain('<section class="cms type12 type-bg bg-image-2 text-white">');
    expect(html).toContain('<ul class="cms-column-list item-bg-box text-type-1 row">');
    expect(html.match(/<li class="cms-list-item col-12 col-lg-4">/g)).toHaveLength(n);
    expect(count(html, "cms-inner-box")).toBe(n);
    expect(count(html, "cms-icon")).toBe(n);
    expect(html).toContain('alt="" class="d-none d-lg-block"/>');
    expect(html).toContain('alt="" class="d-block d-lg-none"/>');
    expect(html).not.toContain("demo-");
  });

  test("omits empty icon images", () => {
    const html = render("type12", { contents: [{ text: "a", ...noImages }] });
    expect(html).not.toContain("<img");
  });
});

describe("type 13 (original markup)", () => {
  test("renders table rows with a number cell, a text cell and a check mark", () => {
    const html = render("type13");
    const n = listLength("type13", "contents");
    expect(html).toContain('<section class="cms type13 type-bg">');
    expect(html).toContain('<ul class="cms-table-list">');
    expect(html.match(/<div class="cms-inner-box row">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-fixed-cell cms-description-box col-auto">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-description-box col">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-fixed-cell col-auto">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-figure check">/g)).toHaveLength(n);
    expect(html.match(/<svg class="cms-figure-svg" width="18" height="14" viewBox="0 0 18 14">/g)).toHaveLength(n);
    expect(html).not.toContain("demo-");
  });

  test("shows the bottom box only when the bottom text is not empty", () => {
    expect(render("type13", { bottomText: "마무리 문구" })).toContain('<div class="cms-description-box em-box">');
    expect(render("type13", { bottomText: "" })).not.toContain("em-box");
  });

  test("the bottom text is rich", () => {
    const html = render("type13", { bottomText: "<em>강조</em><script>x</script>" });
    expect(html).toContain("<em>강조</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 14 (original markup)", () => {
  test("renders the same table rows as type 13 without the bottom box", () => {
    const html = render("type14");
    expect(html).toContain('<section class="cms type14">');
    expect(html).toContain('<ul class="cms-table-list">');
    expect(html.match(/<div class="cms-inner-box row">/g)).toHaveLength(listLength("type14", "contents"));
    expect(html).not.toContain("em-box");
    expect(html).not.toContain("demo-");
  });
});

describe("type 15 (original markup)", () => {
  test("renders a column list with an image per item", () => {
    const html = render("type15");
    expect(html).toContain('<section class="cms type15">');
    expect(html).toContain('<ul class="cms-column-list text-type-1 row">');
    expect(html.match(/<li class="cms-list-item col-12 col-lg-4">/g)).toHaveLength(listLength("type15", "contents"));
    expect(count(html, "cms-visual")).toBe(listLength("type15", "contents"));
    expect(html).toContain('alt="" class="img-fluid d-none d-lg-block"/>');
    expect(html).toContain('alt="" class="w-100 d-block d-lg-none"/>');
    expect(html).not.toContain("demo-");
  });

  test("shows a bullet list when there are sub texts, otherwise the paragraph", () => {
    const base = { tit: "t", ...noImages };
    const withSub = render("type15", { contents: [{ ...base, text: "본문 문단", subtext: [{ text: "x" }] }] });
    expect(withSub).toContain('<ul class="cms-bullet-list no-margin">');
    expect(withSub).not.toContain("본문 문단");
    const without = render("type15", { contents: [{ ...base, text: "본문 문단", subtext: [] }] });
    expect(without).not.toContain("cms-bullet-list");
    expect(without).toContain('<p class="cms-description">본문 문단</p>');
  });
});
