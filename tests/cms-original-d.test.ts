import { describe, expect, test } from "vitest";
import { count, listLength, noImages, render } from "./cms-helpers";

// 원본 CMS 도구와 같은 HTML을 만드는지 검사한다(타입 22~26).

describe("type 22 (original markup)", () => {
  test("renders a four column image list", () => {
    const html = render("type22");
    const n = listLength("type22", "contents");
    expect(html).toContain('<section class="cms type22">');
    expect(html).toContain('<ul class="cms-img-list text-bottom text-type-2 row">');
    expect(html.match(/<li class="cms-list-item col-6 col-lg-3">/g)).toHaveLength(n);
    expect(count(html, "cms-visual")).toBe(n);
    expect(count(html, "cms-visual-text")).toBe(n);
    expect(html).toContain('<ul class="list-unstyled">');
    expect(html).not.toContain("demo-");
  });

  test("a mobile image needs the PC image, and empty titles and sub lists are omitted", () => {
    const only = render("type22", { contents: [{ image: "", imageMobile: "/images/x.jpg", title: "", subtext: [] }] });
    expect(only).not.toContain("<img");
    expect(count(only, "cms-title")).toBe(1);
    expect(only).not.toContain("list-unstyled");
  });
});

describe("type 23 (original markup)", () => {
  test("renders a centered text and an image", () => {
    const html = render("type23");
    expect(html).toContain('<section class="cms type23">');
    expect(html).toContain('<div class="cms-description-box text-center">');
    expect(html).toContain('<div class="cms-visual">');
    expect(html).not.toContain("demo-");
  });

  test("omits the text box when empty and hides an empty big header", () => {
    const html = render("type23", { text: "", title: [{ small: "작은", big: "" }] });
    expect(html).not.toContain("text-center");
    expect(html).not.toContain("cms-title");
  });

  test("a mobile image needs the PC image", () => {
    expect(render("type23", { image: "", imageMobile: "/images/x.jpg" })).not.toContain("<img");
  });

  test("the text is rich", () => {
    const html = render("type23", { text: "<em>ok</em><script>x</script>" });
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 24 (original markup)", () => {
  test("renders the image above an ordered list", () => {
    const html = render("type24");
    expect(html).toContain('<section class="cms type24 type-bg bg-color-2">');
    expect(html).toContain('<div class="cms-list-wrap cms-desktop-rs-only">');
    expect(html).toContain('<ol class="cms-ordered-list">');
    expect(html.match(/<li class="cms-list-item">/g)).toHaveLength(listLength("type24", "contents"));
    expect(html).not.toContain("demo-");
  });

  test("the mobile image of type 24 does not need the PC image", () => {
    const html = render("type24", { image: "", imageMobile: "/images/x.jpg" });
    expect(html).toContain('class="w-100 d-block d-lg-none"');
    expect(html).not.toContain("d-none d-lg-block");
  });

  test("omits empty title and text", () => {
    const html = render("type24", { title: [{ small: "", big: "b" }], contents: [{ tit: "", text: "" }] });
    expect(count(html, "cms-description")).toBe(0);
    expect(count(html, "cms-title")).toBe(1);
  });
});

describe("type 25 (original markup)", () => {
  test("renders a column list with the original select classes", () => {
    const html = render("type25");
    const n = listLength("type25", "contents");
    expect(html).toContain('<section class="cms type25 type-bg">');
    expect(html).toContain('<ul class="cms-column-list text-type-2 row">');
    expect(html.match(/<li class="cms-list-item col-6 col-lg-3">/g)).toHaveLength(n);
    expect(html).toContain('alt="" class="img-fluid d-none d-lg-block"/>');
    expect(html).not.toContain("demo-");
  });

  test("the three column variant uses col-lg-4 and a w-100 PC image", () => {
    const html = render("type25", { perRow: "col-lg-4" });
    expect(html).toContain('<li class="cms-list-item col-6 col-lg-4">');
    expect(html).toContain('alt="" class="w-100 d-none d-lg-block"/>');
  });

  test("an unknown select value falls back to col-lg-3", () => {
    const html = render("type25", { perRow: '"><script>x</script>' });
    expect(html).toContain('<li class="cms-list-item col-6 col-lg-3">');
    expect(html).not.toContain("<script");
  });

  test("a mobile image needs the PC image, and empty texts are omitted", () => {
    const html = render("type25", { title: [{ small: "", big: "b" }], contents: [{ image: "", imageMobile: "/images/x.jpg", title: "", text: "" }] });
    expect(html).not.toContain("<img");
    expect(count(html, "cms-description")).toBe(0);
    expect(count(html, "cms-title")).toBe(1);
    expect(render("type25", { contents: [{ ...noImages, title: "<em>t</em><script>x</script>", text: "" }] }).toLowerCase()).not.toContain("<script");
  });
});

describe("type 26 (original markup)", () => {
  const cell = (value: string, extra: Record<string, unknown> = {}) => ({ value, colspan: 1, rowspan: 1, hidden: false, ...extra });
  const table = (rows: ReturnType<typeof cell>[][], headers = [[cell("머리글")]], colWidths = ["auto"]) => ({ headers, rows, colWidths });
  const renderTable = (t: unknown, extra = {}) => render("type26", { table: t as never, ...extra });

  test("renders a table with the original classes, colgroup, header and body", () => {
    const html = render("type26");
    expect(html).toContain('<section class="cms type26">');
    expect(html).toContain('<div class="cms-table-wrap">');
    expect(html).toContain('<table class="cms-table">');
    for (const tag of ["<colgroup", "<thead", "<tbody"]) expect(html, tag).toContain(tag);
    expect(html.match(/<col /g)?.length).toBe(3);
    expect(html).not.toContain("demo-");
    expect(html).not.toContain("scope=");
  });

  test("uses th for header cells and the first body column, td for the rest", () => {
    const html = renderTable(table([[cell("행"), cell("값")]], [[cell("구분"), cell("항목")]], ["auto", "auto"]));
    expect(html).toContain("<th>구분</th>");
    expect(html).toContain("<th>행</th>");
    expect(html).toContain("<td>값</td>");
  });

  test("renders colspan and rowspan attributes only when above 1", () => {
    const html = renderTable(table([[cell("a", { colspan: 2, rowspan: 2 }), cell("b"), cell("c")], [cell("d"), cell("e"), cell("f")]], [[cell("h1"), cell("h2"), cell("h3")]], ["auto", "auto", "auto"]));
    expect(html).toMatch(/colSpan="2"/i);
    expect(html).toMatch(/rowSpan="2"/i);
    expect(html.match(/colSpan=/gi)?.length).toBe(1);
  });

  test("omits cells hidden by a merge, but never trusts a hidden flag without a merge", () => {
    const merged = renderTable(table([[cell("a", { colspan: 3 }), cell("hidden1"), cell("hidden2")]], [[cell("h1"), cell("h2"), cell("h3")]], ["auto", "auto", "auto"]));
    expect(merged).not.toContain("hidden1");
    const lone = renderTable(table([[cell("a"), cell("shown", { hidden: true })]], [[cell("h1"), cell("h2")]], ["auto", "auto"]));
    expect(lone).toContain("shown");
  });

  test("escapes script and tags in cells", () => {
    const html = renderTable(table([[cell("<script>alert(1)</script>"), cell("<em>x</em>")]], [[cell("<img src=x onerror=1>"), cell("h")]], ["auto", "auto"]));
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).not.toContain("<em>");
    expect(html).not.toMatch(/<img[^>]*onerror/i);
    expect(html).toContain("&lt;script&gt;");
  });

  test("applies safe column widths and drops unsafe ones", () => {
    const html = renderTable(table([[cell("a"), cell("b")]], [[cell("h1"), cell("h2")]], ["30%", "expression(alert(1))"]));
    expect(html).toContain("width:30%");
    expect(html).not.toContain("expression");
    expect(html).toContain("width:auto");
  });

  test("shows the intro text only when it is not empty, and it is rich", () => {
    expect(count(render("type26", { text: "" }), "cms-description-box")).toBe(0);
    const html = render("type26", { text: "<em>ok</em><script>x</script>" });
    expect(count(html, "cms-description-box")).toBe(1);
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  test("the formatted source nests the table rows on separate lines", () => {
    const html = render("type26");
    expect(html).toMatch(/\n\s+<thead>\n\s+<tr>\n\s+<th>/);
    expect(html).toMatch(/\n\s+<tbody>\n\s+<tr>/);
  });
});
