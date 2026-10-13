import { describe, expect, test } from "vitest";
import { renderHtml } from "@/lib/cms/format";
import { getType } from "@/lib/cms/registry";
import type { Values } from "@/lib/cms/schema";

// 원본 CMS 도구와 같은 HTML을 만드는지 검사한다(클래스 이름, 요소 중첩, 도형 SVG, 조건부 요소).

function type(id: string) {
  const found = getType(id);
  if (!found) throw new Error(`type ${id} is not registered`);
  return found;
}

// class 속성에 해당 토큰이 있는 요소의 개수.
function count(html: string, token: string): number {
  return [...html.matchAll(/class="([^"]*)"/g)].filter((m) => m[1].split(/\s+/).includes(token)).length;
}

function render(id: string, patch: Values = {}): string {
  const t = type(id);
  return renderHtml(t, { ...t.defaults, ...patch });
}

const listLength = (id: string, key: string) => (type(id).defaults[key] as Values[]).length;
const noImages = { image: "", imageMobile: "" };

describe("type 02 (original markup)", () => {
  test("root, header and list use the original class strings", () => {
    const html = render("type02");
    expect(html).toContain('<section class="cms type02 type-bg">');
    expect(html).toContain('<div class="cms-header top-border">');
    expect(html).toContain('<p class="cms-eyebrow">작은 제목 </p>'); // 원본은 작은 글 뒤에 공백이 하나 붙는다
    expect(html).toContain('<p class="cms-title">제목을 입력해 보세요</p>');
    expect(html).toContain('<ol class="cms-figure-list text-type-1 row justify-content-center">');
    expect(html).not.toContain("demo-");
  });

  test("renders a pentagon svg figure per item exactly as the original", () => {
    const html = render("type02");
    const n = listLength("type02", "items");
    expect(count(html, "cms-list-item")).toBe(n);
    expect(html.match(/<li class="cms-list-item col-6 col-lg-4">/g)).toHaveLength(n);
    expect(html.match(/<div class="cms-figure pentagon">/g)).toHaveLength(n);
    expect(html.match(/<svg class="cms-figure-svg" width="286" height="274" viewBox="0 0 286 274">/g)).toHaveLength(n);
    expect(html.match(/<g transform="translate\(-378 -1390\)">/g)).toHaveLength(n);
    expect(html.match(/<path id="path" class="cls-1" d="M513\.454,1398\.61L390\.626,1488\.2/g)).toHaveLength(n);
    expect(count(html, "cms-figure-text")).toBe(n);
    expect(count(html, "cms-description-box")).toBe(n);
  });

  test("omits the small title when it is empty", () => {
    const html = render("type02", { title: [{ small: "", big: "큰 제목" }] });
    expect(html).toContain('<p class="cms-title">큰 제목</p>');
    expect(html).not.toContain('<p class="cms-eyebrow">작은');
  });

  test("keeps allowed tags in the description and escapes script", () => {
    const html = render("type02", { items: [{ stit: "a", text: "b", description: "<em>x</em><script>alert(1)</script>" }] });
    expect(html).toContain("<em>x</em>");
    expect(html).toContain("&lt;script&gt;");
    expect(html.toLowerCase()).not.toContain("<script");
  });
});

describe("type 03 (original markup)", () => {
  test("renders the zigzag tile list with the original classes", () => {
    const html = render("type03");
    expect(html).toContain('<section class="cms type03">');
    expect(html).toContain('<ol class="cms-tile-list array-zigzag text-type-1 ">'); // 원본은 끝에 공백이 남는다
    expect(html.match(/<li class="cms-list-item row align-items-center">/g)).toHaveLength(listLength("type03", "contents"));
    expect(html).toContain('<div class="cms-visual col-lg-6">');
    expect(html).toContain('<div class="cms-description-box col-lg-6">');
    expect(html).toContain('<div class="cms-box-inner">');
    expect(html).toContain('<p class="cms-eyebrow type-number">01</p>');
    expect(html).not.toContain("demo-");
  });

  test("uses the original image classes", () => {
    const html = render("type03");
    expect(html).toContain('alt="" class="img-fluid d-none d-lg-block"/>');
    expect(html).toContain('alt="" class="img-fluid d-block d-lg-none"/>');
  });

  test("the layout select adds the original reverse class only for reverse", () => {
    expect(render("type03", { layout: "reverse" })).toContain('<ol class="cms-tile-list array-zigzag text-type-1 reverse">');
    expect(render("type03", { layout: "" })).toContain('text-type-1 ">');
  });

  test("an unknown layout value does not reach the markup", () => {
    const html = render("type03", { layout: '"><script>alert(1)</script>' });
    expect(html).not.toContain("<script");
    expect(html).toContain('text-type-1 ">');
  });

  test("the item title is a rich field", () => {
    const html = render("type03", { contents: [{ num: "01", tit: "<em>강조</em><script>x</script>", text: "t", ...noImages }] });
    expect(html).toContain("<em>강조</em>");
    expect(html).toContain("&lt;script&gt;");
    expect(html.toLowerCase()).not.toContain("<script");
  });

  test("omits empty images", () => {
    const html = render("type03", { contents: [{ num: "01", tit: "t", text: "t", ...noImages }] });
    expect(html).not.toContain("d-lg-block");
    expect(html).not.toContain("d-lg-none");
  });
});

describe("type 04 (original markup)", () => {
  test("renders a tile list with the between-arrow class", () => {
    const html = render("type04");
    expect(html).toContain('<section class="cms type04">');
    expect(html).toContain('<ol class="cms-tile-list between-arrow text-type-2">');
    expect(html.match(/<li class="cms-list-item row align-items-center">/g)).toHaveLength(listLength("type04", "contents"));
    expect(html).toContain('<div class="cms-visual col-lg-6">');
    expect(html).toContain('<div class="cms-description-box col-lg-6">');
    expect(html).toContain('<p class="cms-eyebrow">01</p>');
    expect(html).not.toContain("demo-");
  });

  test("the item title is plain text", () => {
    const html = render("type04", { contents: [{ num: "01", tit: "<em>x</em>", text: "t", ...noImages }] });
    expect(html).not.toContain("<em>");
    expect(html).toContain("&lt;em&gt;x&lt;/em&gt;");
  });
});

describe("type 05 (original markup)", () => {
  test("renders the title and one image pair with the original classes", () => {
    const html = render("type05");
    expect(html).toContain('<section class="cms type05 type-bg bg-color-1">');
    expect(html).toContain('<div class="cms-visual">');
    expect(html).toContain('alt="" class="img-fluid d-none d-lg-block"/>');
    expect(html).toContain('alt="" class="w-100 d-block d-lg-none"/>');
    expect(html).not.toContain("demo-");
  });

  test("omits empty images", () => {
    const html = render("type05", noImages);
    expect(html).not.toContain("<img");
  });
});

describe("type 06 (original markup)", () => {
  test("renders the dark column list with the original classes", () => {
    const html = render("type06");
    const n = listLength("type06", "contents");
    expect(html).toContain('<section class="cms type06 type-bg bg-image-1 text-white">');
    expect(html).toContain('<ul class="cms-column-list item-bg-box text-type-1 row">');
    expect(html.match(/<li class="cms-list-item col-6 col-lg-3">/g)).toHaveLength(n);
    expect(count(html, "cms-inner-box")).toBe(n);
    expect(count(html, "cms-icon")).toBe(n);
    expect(html).toContain('alt="" class="d-none d-lg-block"/>');
    expect(html).toContain('alt="" class="d-block d-lg-none"/>');
    expect(html).not.toContain("demo-");
  });

  test("shows the bullet list only for items that have sub texts", () => {
    const base = { text: "a", ...noImages };
    const withSub = render("type06", { contents: [{ ...base, subtext: [{ text: "x" }, { text: "y" }] }] });
    expect(withSub).toContain('<ul class="cms-bullet-list no-margin">');
    expect(withSub.match(/<li class="cms-list-item cms-description">/g)).toHaveLength(2);
    expect(withSub).toContain("<strong>a</strong>");
    const without = render("type06", { contents: [{ ...base, subtext: [] }] });
    expect(without).not.toContain("cms-bullet-list");
    expect(without).not.toContain("<strong>");
  });

  test("keeps the nested list within the sub item limit", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ text: `s${i}` }));
    const html = render("type06", { contents: [{ text: "a", ...noImages, subtext: many }] });
    expect(html.match(/<li class="cms-list-item cms-description">/g)?.length ?? 0).toBeLessThanOrEqual(8);
  });
});

describe("type 07 (original markup)", () => {
  test("renders an image beside a bullet list with the original classes", () => {
    const html = render("type07");
    expect(html).toContain('<section class="cms type07 type-bg bg-color-3">');
    expect(html).toContain('<div class="cms-column-wrap box-type row">');
    expect(html).toContain('<div class="cms-visual col-12 col-lg-6">');
    expect(html).toContain('<div class="cms-list-wrap col-12 col-lg-6">');
    expect(html).toContain('<ul class="cms-bullet-list list-style-1 cms-spread-list">');
    expect(html.match(/<li class="cms-list-item">/g)).toHaveLength(listLength("type07", "subtext"));
    expect(html).toContain('alt="" class="img-fluid d-none d-lg-block"/>');
    expect(html).toContain('alt="" class="w-100 d-block d-lg-none"/>');
    expect(html).not.toContain("demo-");
  });

  test("escapes script in a bullet", () => {
    const html = render("type07", { subtext: [{ text: "<script>alert(1)</script>" }] });
    expect(html.toLowerCase()).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });
});
