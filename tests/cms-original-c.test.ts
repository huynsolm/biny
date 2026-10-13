import { describe, expect, test } from "vitest";
import { count, listLength, noImages, render } from "./cms-helpers";

// 원본 CMS 도구와 같은 HTML을 만드는지 검사한다(타입 16~21).

describe("type 16 (original markup)", () => {
  test("renders the PC image, the mobile hexagon and a two column list", () => {
    const html = render("type16");
    const n = listLength("type16", "contents");
    expect(html).toContain('<section class="cms type16">');
    expect(html).toContain('<div class="cms-visual">');
    expect(html).toContain('alt="" class="img-fluid d-none d-lg-block"/>');
    expect(html).toContain('<div class="cms-figure hexagon d-block d-lg-none">');
    expect(html).toContain('<svg class="cms-figure-svg" width="276" height="244" viewBox="0 0 276 244">');
    expect(html).toContain('<div class="cms-figure-text">');
    expect(html).toContain('<div class="cms-list-wrap cms-desktop-rs-only">');
    expect(html).toContain('<ul class="cms-column-list text-type-1 row">');
    expect(html.match(/<li class="cms-list-item col-6">/g)).toHaveLength(n);
    expect(count(html, "cms-icon")).toBe(n);
    expect(html).not.toContain("demo-");
  });

  test("omits the PC image and the icon images when their addresses are empty", () => {
    const html = render("type16", { imagePc: "", contents: [{ tit: "t", text: "x", icon: "" }] });
    expect(html).not.toContain("<img");
  });

  test("the mobile hexagon text is plain and the description is rich", () => {
    const html = render("type16", {
      imageTit: "<b>x</b>",
      contents: [{ tit: "t", text: "<em>ok</em><script>x</script>", icon: "" }],
    });
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 17 (original markup)", () => {
  test("renders a row list with the original classes", () => {
    const html = render("type17");
    const n = listLength("type17", "contents");
    expect(html).toContain('<section class="cms type17">');
    expect(html).toContain('<ol class="cms-row-list text-type-1">');
    expect(html.match(/<div class="cms-description-box row">/g)).toHaveLength(n);
    expect(html.match(/<p class="cms-title col-auto">/g)).toHaveLength(n);
    expect(html.match(/<p class="cms-description col"/g)).toHaveLength(n);
    expect(html).not.toContain("demo-");
  });

  test("the select uses the original values and an unknown value falls back to col-auto", () => {
    expect(render("type17", { titleWidth: "col-2" })).toContain('<p class="cms-title col-2">');
    const html = render("type17", { titleWidth: '"><script>x</script>' });
    expect(html).toContain('<p class="cms-title col-auto">');
    expect(html).not.toContain("<script");
  });
});

describe("type 18 (original markup)", () => {
  test("renders the image list, keeping the original double space in the class", () => {
    const html = render("type18");
    const n = listLength("type18", "contents");
    expect(html).toContain('<section class="cms type18">');
    expect(html).toContain('<ol class="cms-img-list  text-type-1 row">');
    expect(html.match(/<li class="cms-list-item col-6 col-lg-4">/g)).toHaveLength(n);
    expect(count(html, "cms-visual")).toBe(n);
    expect(count(html, "cms-visual-text")).toBe(n);
    expect(html).toContain('alt="" class="img-fluid d-none d-lg-block"/>');
    expect(html).toContain('alt="" class="w-100 d-block d-lg-none"/>');
    expect(html).not.toContain("demo-");
  });

  test("the select uses the original text types", () => {
    expect(render("type18", { textStyle: "text-type-3" })).toContain('<ol class="cms-img-list  text-type-3 row">');
    expect(render("type18", { textStyle: "nope" })).toContain('<ol class="cms-img-list  text-type-1 row">');
  });

  test("a mobile image needs the PC image, as in the original", () => {
    const only = render("type18", { contents: [{ image: "", imageMobile: "/images/x.jpg", num: "1", tit: "t", text: "x" }] });
    expect(only).not.toContain("<img");
  });

  test("omits empty texts and keeps allowed tags", () => {
    const html = render("type18", { title: [{ small: "", big: "b" }], contents: [{ ...noImages, num: "", tit: "<em>t</em><script>x</script>", text: "" }] });
    expect(html).not.toContain("cms-eyebrow");
    expect(html).not.toContain("cms-description");
    expect(html).toContain("<em>t</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 19 (original markup)", () => {
  test("renders hexagons with a number and a text", () => {
    const html = render("type19");
    const n = listLength("type19", "contents");
    expect(html).toContain('<section class="cms type19">');
    expect(html).toContain('<ol class="cms-figure-list item-between-border text-type-2 row justify-content-left">');
    expect(html.match(/<li class="cms-list-item col-6 col-lg">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-figure hexagon">/g)).toHaveLength(n);
    expect(html.match(/<svg class="cms-figure-svg" width="276" height="244" viewBox="0 0 276 244">/g)).toHaveLength(n);
    expect(count(html, "cms-figure-text")).toBe(n);
    expect(html).not.toContain("demo-");
  });
});

describe("type 20 (original markup)", () => {
  test("renders the image beside the box and the border list", () => {
    const html = render("type20");
    const n = listLength("type20", "contents");
    expect(html).toContain('<section class="cms type20">');
    expect(html).toContain('<div class="cms-column-wrap box-type row align-items-lg-end">');
    expect(html).toContain('<div class="cms-visual col-4 col-lg-3">');
    expect(html).toContain('<div class="cms-box col-8 col-lg-9">');
    expect(html).toContain('<div class="cms-description-box em-box-2">');
    expect(html).toContain('<ul class="cms-border-list text-type-1 row">');
    expect(html.match(/<li class="cms-list-item col-6 col-lg-3">/g)).toHaveLength(n);
    expect(html).not.toContain("demo-");
  });

  test("hides the big header text when it is empty", () => {
    const html = render("type20", { title: [{ small: "작은", big: "" }] });
    expect(html).toContain("cms-eyebrow");
    expect(html).not.toMatch(/<div class="cms-header top-border">[\s\S]*cms-title[\s\S]*<div class="cms-column-wrap/);
  });

  test("a mobile image needs the PC image", () => {
    const html = render("type20", { image: "", imageMobile: "/images/x.jpg" });
    expect(html).not.toContain("<img");
  });
});

describe("type 21 (original markup)", () => {
  test("renders a left header and the border list beside the image", () => {
    const html = render("type21");
    const n = listLength("type21", "contents");
    expect(html).toContain('<section class="cms type21">');
    expect(html).toContain('<div class="cms-header top-border left-type">');
    expect(html).toContain('<div class="cms-visual col-12 col-lg-5">');
    expect(html).toContain('<div class="cms-box col-12 col-lg-7">');
    expect(html).toContain('<ul class="cms-border-list text-type-2 row">');
    expect(html.match(/<li class="cms-list-item col-6 col-lg-auto">/g)).toHaveLength(n);
    expect(html).not.toContain("demo-");
  });

  test("escapes script in the list text", () => {
    const html = render("type21", { contents: [{ text: "<em>x</em><script>alert(1)</script>" }] });
    expect(html).toContain("<em>x</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});
