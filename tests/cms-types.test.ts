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

describe("type 02", () => {
  test("renders the block, a figure per item and the description boxes", () => {
    const html = render("type02");
    expect(html).toContain('class="demo-block demo-type02"');
    expect(count(html, "demo-list-item")).toBe(listLength("type02", "items"));
    expect(count(html, "demo-figure")).toBe(listLength("type02", "items"));
    expect(count(html, "demo-figure-text")).toBe(listLength("type02", "items"));
    expect(count(html, "demo-description-box")).toBe(listLength("type02", "items"));
  });

  test("keeps allowed tags in the description and escapes script", () => {
    const html = render("type02", { items: [{ stit: "a", text: "b", description: "<em>x</em><script>alert(1)</script>" }] });
    expect(html).toContain("<em>x</em>");
    expect(html).toContain("&lt;script&gt;");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  test("omits the small title when it is empty", () => {
    const html = render("type02", { title: [{ small: "", big: "큰 제목" }] });
    expect(html).toContain("큰 제목");
    expect(count(html, "demo-eyebrow")).toBe(listLength("type02", "items")); // 항목 안의 작은 글만 남는다
  });
});

describe("type 03", () => {
  test("renders a zigzag tile list with an item per content", () => {
    const html = render("type03");
    expect(html).toContain('class="demo-block demo-type03"');
    expect(count(html, "demo-tile-list")).toBe(1);
    expect(count(html, "demo-zigzag")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type03", "contents"));
    expect(count(html, "demo-visual")).toBe(listLength("type03", "contents"));
  });

  test("the layout select adds the reverse modifier only for reverse", () => {
    expect(count(render("type03", { layout: "normal" }), "demo-reverse")).toBe(0);
    expect(count(render("type03", { layout: "reverse" }), "demo-reverse")).toBe(1);
  });

  test("an unknown layout value does not reach the markup", () => {
    const html = render("type03", { layout: '"><script>alert(1)</script>' });
    expect(html).not.toContain("<script");
    expect(count(html, "demo-reverse")).toBe(0);
  });

  test("the item title is a rich field", () => {
    const html = render("type03", { contents: [{ num: "01", tit: "<em>강조</em><script>x</script>", text: "t", image: "", imageMobile: "" }] });
    expect(html).toContain("<em>강조</em>");
    expect(html).toContain("&lt;script&gt;");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 04", () => {
  test("renders a tile list with arrows between items", () => {
    const html = render("type04");
    expect(html).toContain('class="demo-block demo-type04"');
    expect(count(html, "demo-tile-list")).toBe(1);
    expect(count(html, "demo-arrows")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type04", "contents"));
  });

  test("the item title is plain text (tags are shown as text)", () => {
    const html = render("type04", { contents: [{ num: "01", tit: "<em>x</em>", text: "t", image: "", imageMobile: "" }] });
    expect(html).not.toContain("<em>");
    expect(html).toContain("&lt;em&gt;x&lt;/em&gt;");
  });
});

describe("type 05", () => {
  test("renders a title and one image pair", () => {
    const html = render("type05");
    expect(html).toContain('class="demo-block demo-type05"');
    expect(count(html, "demo-visual")).toBe(1);
    expect(count(html, "demo-pc-only")).toBe(1);
    expect(count(html, "demo-mobile-only")).toBe(1);
  });

  test("omits an empty image", () => {
    const html = render("type05", { image: "", imageMobile: "" });
    expect(count(html, "demo-pc-only")).toBe(0);
    expect(count(html, "demo-mobile-only")).toBe(0);
  });
});

describe("type 06", () => {
  test("renders a column list with an icon per item", () => {
    const html = render("type06");
    expect(html).toContain('class="demo-block demo-type06"');
    expect(count(html, "demo-column-list")).toBe(1);
    expect(count(html, "demo-inner-box")).toBe(listLength("type06", "contents"));
    expect(count(html, "demo-icon")).toBe(listLength("type06", "contents"));
  });

  test("shows a bullet list only for items that have sub texts", () => {
    const withSub = render("type06", { contents: [{ text: "a", image: "", imageMobile: "", subtext: [{ text: "x" }, { text: "y" }] }] });
    expect(count(withSub, "demo-bullet-list")).toBe(1);
    expect(withSub).toContain("<strong>a</strong>");
    const withoutSub = render("type06", { contents: [{ text: "a", image: "", imageMobile: "", subtext: [] }] });
    expect(count(withoutSub, "demo-bullet-list")).toBe(0);
    expect(withoutSub).not.toContain("<strong>");
  });

  test("keeps the nested list within the sub item limit", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ text: `s${i}` }));
    const html = render("type06", { contents: [{ text: "a", image: "", imageMobile: "", subtext: many }] });
    expect(html.match(/<li class="demo-list-item demo-desc">/g)?.length ?? 0).toBeLessThanOrEqual(8);
  });
});

describe("type 07", () => {
  test("renders an image beside a bullet list", () => {
    const html = render("type07");
    expect(html).toContain('class="demo-block demo-type07"');
    expect(count(html, "demo-visual")).toBe(1);
    expect(count(html, "demo-bullet-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type07", "subtext"));
  });

  test("escapes script in a bullet", () => {
    const html = render("type07", { subtext: [{ text: "<script>alert(1)</script>" }] });
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("type 09", () => {
  test("renders a check list item per content", () => {
    const html = render("type09");
    expect(html).toContain('class="demo-block demo-type09"');
    expect(count(html, "demo-column-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type09", "contents"));
    expect(count(html, "demo-check")).toBe(listLength("type09", "contents"));
  });

  test("the per-row select maps to the column modifier", () => {
    for (const n of ["1", "2", "3"]) {
      const html = render("type09", { perRow: n });
      expect(count(html, `demo-cols-${n}`), n).toBe(1);
    }
  });

  test("an unknown per-row value falls back to one column", () => {
    const html = render("type09", { perRow: "9" });
    expect(count(html, "demo-cols-1")).toBe(1);
    expect(html).not.toContain("demo-cols-9");
  });

  test("keeps allowed tags in the text and escapes script", () => {
    const html = render("type09", { contents: [{ text: "<em>x</em><script>alert(1)</script>" }] });
    expect(html).toContain("<em>x</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 10", () => {
  test("renders one image pair above the hexagon list", () => {
    const html = render("type10");
    expect(html).toContain('class="demo-block demo-type10"');
    expect(count(html, "demo-visual")).toBe(1);
    expect(count(html, "demo-hexagon")).toBe(listLength("type10", "contents"));
    expect(count(html, "demo-figure-text")).toBe(listLength("type10", "contents"));
  });

  test("shows the border list only for items that have sub texts", () => {
    const item = { num: "1", title: "t", sTitle: "s", text: "x" };
    expect(count(render("type10", { contents: [{ ...item, subtext: [{ text: "a" }, { text: "b" }] }] }), "demo-border-list")).toBe(1);
    expect(count(render("type10", { contents: [{ ...item, subtext: [] }] }), "demo-border-list")).toBe(0);
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
    expect(count(html, "demo-list-item")).toBeLessThanOrEqual(1 + 8); // 항목 1개 + 하위 8개
  });
});

describe("type 11", () => {
  test("renders a bullet list with an item per content", () => {
    const html = render("type11");
    expect(html).toContain('class="demo-block demo-type11"');
    expect(count(html, "demo-bullet-list")).toBe(1);
    expect(count(html, "demo-list-item")).toBe(listLength("type11", "contents"));
  });

  test("escapes script in the text", () => {
    const html = render("type11", { contents: [{ text: "<script>alert(1)</script>" }] });
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("type 12", () => {
  test("renders a column list with an icon per item", () => {
    const html = render("type12");
    expect(html).toContain('class="demo-block demo-type12"');
    expect(count(html, "demo-column-list")).toBe(1);
    expect(count(html, "demo-icon")).toBe(listLength("type12", "contents"));
    expect(count(html, "demo-inner-box")).toBe(listLength("type12", "contents"));
  });

  test("omits empty icon images", () => {
    const html = render("type12", { contents: [{ text: "a", image: "", imageMobile: "" }] });
    expect(count(html, "demo-pc-only")).toBe(0);
    expect(count(html, "demo-mobile-only")).toBe(0);
  });
});

describe("type 13", () => {
  test("renders a table list row per content with a check mark", () => {
    const html = render("type13");
    expect(html).toContain('class="demo-block demo-type13"');
    expect(count(html, "demo-table-list")).toBe(1);
    expect(count(html, "demo-inner-box")).toBe(listLength("type13", "contents"));
    expect(count(html, "demo-check")).toBe(listLength("type13", "contents"));
    expect(count(html, "demo-fixed-cell")).toBe(listLength("type13", "contents") * 2);
  });

  test("shows the bottom box only when the bottom text is not empty", () => {
    expect(count(render("type13", { bottomText: "마무리 문구" }), "demo-em-box")).toBe(1);
    expect(count(render("type13", { bottomText: "" }), "demo-em-box")).toBe(0);
  });

  test("the bottom text is rich", () => {
    const html = render("type13", { bottomText: "<em>강조</em><script>x</script>" });
    expect(html).toContain("<em>강조</em>");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 14", () => {
  test("renders a table list like type 13 without the bottom box", () => {
    const html = render("type14");
    expect(html).toContain('class="demo-block demo-type14"');
    expect(count(html, "demo-table-list")).toBe(1);
    expect(count(html, "demo-inner-box")).toBe(listLength("type14", "contents"));
    expect(count(html, "demo-em-box")).toBe(0);
  });
});

describe("type 15", () => {
  test("renders a column list with an image per item", () => {
    const html = render("type15");
    expect(html).toContain('class="demo-block demo-type15"');
    expect(count(html, "demo-column-list")).toBe(1);
    expect(count(html, "demo-visual")).toBe(listLength("type15", "contents"));
  });

  test("shows a bullet list when there are sub texts, otherwise the paragraph", () => {
    const base = { tit: "t", image: "", imageMobile: "" };
    const withSub = render("type15", { contents: [{ ...base, text: "본문 문단", subtext: [{ text: "x" }] }] });
    expect(count(withSub, "demo-bullet-list")).toBe(1);
    expect(withSub).not.toContain("본문 문단");
    const without = render("type15", { contents: [{ ...base, text: "본문 문단", subtext: [] }] });
    expect(count(without, "demo-bullet-list")).toBe(0);
    expect(without).toContain("본문 문단");
  });
});

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
