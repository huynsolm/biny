import { describe, expect, test } from "vitest";
import { renderHtml } from "@/lib/cms/format";
import { getType } from "@/lib/cms/registry";
import type { Values } from "@/lib/cms/schema";

function type(id: string) {
  const found = getType(id);
  if (!found) throw new Error(`type ${id} is not registered`);
  return found;
}

// class 속성에서 해당 토큰을 가진 요소의 개수를 센다.
function count(html: string, token: string): number {
  return [...html.matchAll(/class="([^"]*)"/g)].filter((m) => m[1].split(/\s+/).includes(token)).length;
}

function render(id: string, patch: Values = {}): string {
  const t = type(id);
  return renderHtml(t, { ...t.defaults, ...patch });
}

const listLength = (id: string, key: string) => (type(id).defaults[key] as Values[]).length;

describe("type 16", () => {
  test("renders a pc image, a mobile hexagon and a two column list with icons", () => {
    const html = render("type16");
    expect(html).toContain('class="demo-block demo-type16"');
    expect(count(html, "demo-pc-only")).toBe(1);
    expect(count(html, "demo-hexagon")).toBe(1);
    expect(count(html, "demo-mobile-only")).toBe(1);
    expect(count(html, "demo-column-list")).toBe(1);
    expect(count(html, "demo-icon")).toBe(listLength("type16", "contents"));
  });

  test("the hexagon text is plain and an empty pc image is omitted", () => {
    const html = render("type16", { imageTit: "<em>x</em>", imagePc: "" });
    expect(html).toContain("&lt;em&gt;x&lt;/em&gt;");
    expect(count(html, "demo-pc-only")).toBe(0);
    expect(count(html, "demo-hexagon")).toBe(1);
  });

  test("an empty icon is omitted and the text is rich", () => {
    const html = render("type16", { contents: [{ tit: "t", text: "<em>ok</em><script>x</script>", icon: "" }] });
    expect(count(html, "demo-icon")).toBe(0);
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 17", () => {
  test("renders a row list item per content", () => {
    const html = render("type17");
    expect(html).toContain('class="demo-block demo-type17"');
    expect(count(html, "demo-row-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type17", "contents"));
  });

  test("the title width select maps to a modifier and unknown values fall back to auto", () => {
    expect(count(render("type17", { titleWidth: "auto" }), "demo-title-auto")).toBe(1);
    expect(count(render("type17", { titleWidth: "wide" }), "demo-title-wide")).toBe(1);
    const html = render("type17", { titleWidth: "<x>" });
    expect(count(html, "demo-title-auto")).toBe(1);
    expect(count(html, "demo-title-wide")).toBe(0);
  });

  test("the title is plain and the text is rich", () => {
    const html = render("type17", { contents: [{ tit: "<em>t</em>", text: "<em>ok</em>" }] });
    expect(html).toContain("&lt;em&gt;t&lt;/em&gt;");
    expect(html).toContain("<em>ok</em>");
  });
});

describe("type 18", () => {
  test("renders an image list item per content", () => {
    const html = render("type18");
    expect(html).toContain('class="demo-block demo-type18"');
    expect(count(html, "demo-img-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type18", "contents"));
    expect(count(html, "demo-visual-text")).toBe(listLength("type18", "contents"));
  });

  test("the text style select maps to a modifier and unknown values fall back to plain", () => {
    expect(count(render("type18", { textStyle: "plain" }), "demo-text-plain")).toBe(1);
    expect(count(render("type18", { textStyle: "framed" }), "demo-text-framed")).toBe(1);
    const html = render("type18", { textStyle: "x" });
    expect(count(html, "demo-text-plain")).toBe(1);
    expect(count(html, "demo-text-framed")).toBe(0);
  });

  test("omits empty number, title and text", () => {
    const html = render("type18", { contents: [{ image: "", imageMobile: "", num: "", tit: "", text: "" }] });
    expect(count(html, "demo-eyebrow")).toBe(1); // 머리글의 작은 글만 남는다
    expect(count(html, "demo-pc-only")).toBe(0);
  });

  test("all three text fields are rich", () => {
    const html = render("type18", { contents: [{ image: "", imageMobile: "", num: "<em>1</em>", tit: "<em>t</em>", text: "<em>x</em><script>y</script>" }] });
    expect(html).toContain("<em>1</em>");
    expect(html).toContain("<em>t</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 19", () => {
  test("renders a hexagon per item", () => {
    const html = render("type19");
    expect(html).toContain('class="demo-block demo-type19"');
    expect(count(html, "demo-hexagon")).toBe(listLength("type19", "contents"));
    expect(count(html, "demo-figure-text")).toBe(listLength("type19", "contents"));
  });

  test("the number is plain and the text is rich", () => {
    const html = render("type19", { contents: [{ num: "<b>1</b>", text: "<em>ok</em><script>x</script>" }] });
    expect(html).toContain("&lt;b&gt;1&lt;/b&gt;");
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 20", () => {
  test("renders an image beside a box with a heading and a border list", () => {
    const html = render("type20");
    expect(html).toContain('class="demo-block demo-type20"');
    expect(count(html, "demo-visual")).toBe(1);
    expect(count(html, "demo-em-box")).toBe(1);
    expect(count(html, "demo-border-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type20", "contents"));
  });

  test("the box heading uses the small and big text fields", () => {
    const html = render("type20", { smTit: "작은 글 확인", tit: "큰 글 확인" });
    expect(html).toContain("작은 글 확인");
    expect(html).toContain("큰 글 확인");
  });

  test("border list texts are rich and empty ones are omitted", () => {
    const html = render("type20", { contents: [{ text: "<em>ok</em><script>x</script>" }, { text: "" }] });
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
    expect(count(html, "demo-border-list") === 1).toBe(true);
  });

  test("an empty big title does not leave an empty paragraph", () => {
    const html = render("type20", { title: [{ small: "작은", big: "" }] });
    expect(html).not.toContain('<p class="demo-title"></p>');
  });
});

describe("type 21", () => {
  test("renders a left aligned header, an image and a border list", () => {
    const html = render("type21");
    expect(html).toContain('class="demo-block demo-type21"');
    expect(count(html, "demo-left")).toBe(1);
    expect(count(html, "demo-visual")).toBe(1);
    expect(count(html, "demo-border-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type21", "contents"));
  });

  test("escapes script in a list text", () => {
    const html = render("type21", { contents: [{ text: "<script>alert(1)</script>" }] });
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("type 22", () => {
  test("renders an image list with an item per content", () => {
    const html = render("type22");
    expect(html).toContain('class="demo-block demo-type22"');
    expect(count(html, "demo-img-list")).toBe(1);
    expect(count(html, "demo-visual-text")).toBe(listLength("type22", "contents"));
  });

  test("shows the sub list only when there are sub texts, and omits an empty title", () => {
    const base = { image: "", imageMobile: "" };
    const withSub = render("type22", { contents: [{ ...base, title: "제목", subtext: [{ text: "a" }, { text: "b" }] }] });
    expect(count(withSub, "demo-unstyled-list")).toBe(1);
    const without = render("type22", { contents: [{ ...base, title: "", subtext: [] }] });
    expect(count(without, "demo-unstyled-list")).toBe(0);
    expect(without).not.toContain("demo-title\"></p>");
  });

  test("the title is rich and the sub texts are plain", () => {
    const html = render("type22", { contents: [{ image: "", imageMobile: "", title: "<em>t</em><script>x</script>", subtext: [{ text: "<em>s</em>" }] }] });
    expect(html).toContain("<em>t</em>");
    expect(html).toContain("&lt;em&gt;s&lt;/em&gt;");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  test("keeps the sub list within the limit", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ text: `s${i}` }));
    const html = render("type22", { contents: [{ image: "", imageMobile: "", title: "t", subtext: many }] });
    expect(html.match(/<li>s\d+<\/li>/g)?.length ?? 0).toBeLessThanOrEqual(8);
  });
});

describe("type 23", () => {
  test("renders a centered text above one image pair", () => {
    const html = render("type23");
    expect(html).toContain('class="demo-block demo-type23"');
    expect(count(html, "demo-center")).toBe(1);
    expect(count(html, "demo-visual")).toBe(1);
  });

  test("omits the text box when the text is empty", () => {
    expect(count(render("type23", { text: "" }), "demo-center")).toBe(0);
  });

  test("the text is rich and an empty big title leaves no empty paragraph", () => {
    const html = render("type23", { text: "<em>ok</em><script>x</script>", title: [{ small: "작은", big: "" }] });
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).not.toContain('<p class="demo-title"></p>');
  });
});

describe("type 24", () => {
  test("renders an image above a numbered list", () => {
    const html = render("type24");
    expect(html).toContain('class="demo-block demo-type24"');
    expect(count(html, "demo-visual")).toBe(1);
    expect(count(html, "demo-ordered-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type24", "contents"));
  });

  test("omits an empty title or text and keeps rich markup", () => {
    const html = render("type24", { contents: [{ tit: "", text: "<em>ok</em><script>x</script>" }] });
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).not.toContain('<p class="demo-title"></p>');
  });
});

describe("type 25", () => {
  test("renders a column list with an item per content", () => {
    const html = render("type25");
    expect(html).toContain('class="demo-block demo-type25"');
    expect(count(html, "demo-column-list")).toBe(1);
    expect(count(html, "demo-visual")).toBe(listLength("type25", "contents"));
  });

  test("the per-row select maps to the column modifier", () => {
    expect(count(render("type25", { perRow: "3" }), "demo-cols-3")).toBe(1);
    expect(count(render("type25", { perRow: "4" }), "demo-cols-4")).toBe(1);
  });

  test("an unknown per-row value falls back to four columns", () => {
    const html = render("type25", { perRow: "7" });
    expect(count(html, "demo-cols-4")).toBe(1);
    expect(html).not.toContain("demo-cols-7");
  });

  test("title and text are rich and empty ones are omitted", () => {
    const html = render("type25", { contents: [{ image: "", imageMobile: "", title: "<em>t</em>", text: "<script>x</script>" }, { image: "", imageMobile: "", title: "", text: "" }] });
    expect(html).toContain("<em>t</em>");
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).not.toContain('<p class="demo-title"></p>');
  });
});

describe("type 26", () => {
  const cell = (value: string, extra: Record<string, unknown> = {}) => ({ value, colspan: 1, rowspan: 1, hidden: false, ...extra });
  const table = (rows: ReturnType<typeof cell>[][], headers = [[cell("머리글")]], colWidths = ["auto"]) => ({ headers, rows, colWidths });
  const renderTable = (t: unknown, extra: Values = {}) => render("type26", { table: t as never, ...extra });

  test("renders a nested table with colgroup, header and body", () => {
    const html = render("type26");
    expect(html).toContain('class="demo-block demo-type26"');
    expect(html).toContain('class="demo-table"');
    for (const tag of ["<table", "<colgroup", "<thead", "<tbody"]) expect(html, tag).toContain(tag);
    expect(html.match(/<col /g)?.length).toBe(3);
  });

  test("uses th for header cells and the first body column, td for the rest", () => {
    const html = renderTable(table([[cell("행"), cell("값")]], [[cell("구분"), cell("항목")]], ["auto", "auto"]));
    expect(html).toContain('<th scope="col">구분</th>');
    expect(html).toContain('<th scope="row">행</th>');
    expect(html).toContain("<td>값</td>");
  });

  test("renders colspan and rowspan attributes only when above 1", () => {
    const html = renderTable(table([[cell("a", { colspan: 2, rowspan: 2 }), cell("b"), cell("c")], [cell("d"), cell("e"), cell("f")]], [[cell("h1"), cell("h2"), cell("h3")]], ["auto", "auto", "auto"]));
    expect(html).toMatch(/colSpan="2"/i);
    expect(html).toMatch(/rowSpan="2"/i);
    expect(html.match(/colSpan=/gi)?.length).toBe(1);
  });

  test("omits cells hidden by a merge", () => {
    const html = renderTable(table([[cell("a", { colspan: 3 }), cell("hidden1"), cell("hidden2")]], [[cell("h1"), cell("h2"), cell("h3")]], ["auto", "auto", "auto"]));
    expect(html).not.toContain("hidden1");
    expect(html).not.toContain("hidden2");
  });

  test("never trusts a hidden flag that has no merge behind it", () => {
    const html = renderTable(table([[cell("a"), cell("shown", { hidden: true })]], [[cell("h1"), cell("h2")]], ["auto", "auto"]));
    expect(html).toContain("shown");
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
    expect(count(render("type26", { text: "" }), "demo-description-box")).toBe(0);
    const html = render("type26", { text: "<em>ok</em><script>x</script>" });
    expect(count(html, "demo-description-box")).toBe(1);
    expect(html).toContain("<em>ok</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  test("the formatted source nests the table rows on separate lines", () => {
    const html = render("type26");
    expect(html).toMatch(/\n\s+<thead>\n\s+<tr>\n\s+<th scope="col">/);
    expect(html).toMatch(/\n\s+<tbody>\n\s+<tr>/);
  });
});
