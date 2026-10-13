import { describe, expect, test } from "vitest";
import {
  COMPONENT_TYPES,
  DEFAULT_VALUES,
  LIMITS,
  MAX_CARDS,
  MIN_CARDS,
  clampCards,
  renderHtml,
  type Card,
  type CmsValues,
} from "@/lib/cms/components";

const values = (over: Partial<CmsValues> = {}): CmsValues => ({
  title: "제목",
  description: "설명",
  imageSrc: "/images/cms-sample.svg",
  imageAlt: "샘플",
  cards: [
    { title: "카드1", description: "설명1" },
    { title: "카드2", description: "설명2" },
  ],
  ...over,
});

describe("COMPONENT_TYPES", () => {
  test("has exactly 3 types with the specified fields", () => {
    expect(COMPONENT_TYPES.map((t) => t.id)).toEqual(["title", "media", "cards"]);
    expect(COMPONENT_TYPES.find((t) => t.id === "title")?.fields).toEqual(["title", "description"]);
    expect(COMPONENT_TYPES.find((t) => t.id === "media")?.fields).toEqual([
      "imageSrc",
      "imageAlt",
      "title",
      "description",
    ]);
    expect(COMPONENT_TYPES.find((t) => t.id === "cards")?.fields).toEqual(["title", "cards"]);
  });

  test("DEFAULT_VALUES has the minimum number of cards", () => {
    expect(DEFAULT_VALUES.cards).toHaveLength(MIN_CARDS);
  });
});

describe("renderHtml title", () => {
  test("exact markup for title and description", () => {
    expect(renderHtml("title", values())).toBe(
      [
        '<section class="demo-block demo-title">',
        '  <h2 class="demo-heading">제목</h2>',
        '  <p class="demo-desc">설명</p>',
        "</section>",
      ].join("\n"),
    );
  });

  test("omits empty title and description elements", () => {
    const onlyTitle = renderHtml("title", values({ description: "   " }));
    expect(onlyTitle).toContain("<h2");
    expect(onlyTitle).not.toContain("<p");
    expect(renderHtml("title", values({ title: "", description: "" }))).toBe(
      '<section class="demo-block demo-title">\n</section>',
    );
  });
});

describe("renderHtml media", () => {
  test("exact markup", () => {
    expect(renderHtml("media", values())).toBe(
      [
        '<section class="demo-block demo-media">',
        '  <img class="demo-image" src="/images/cms-sample.svg" alt="샘플">',
        '  <div class="demo-body">',
        '    <h2 class="demo-heading">제목</h2>',
        '    <p class="demo-desc">설명</p>',
        "  </div>",
        "</section>",
      ].join("\n"),
    );
  });

  test("uses the default image for an unsafe src", () => {
    const html = renderHtml("media", values({ imageSrc: "javascript:alert(1)" }));
    expect(html).toContain('src="/images/cms-sample.svg"');
    expect(html).not.toContain("javascript:");
  });

  test("empty alt renders alt=\"\"", () => {
    expect(renderHtml("media", values({ imageAlt: "" }))).toContain('alt="">');
  });
});

describe("renderHtml cards", () => {
  test("exact markup for 2 cards", () => {
    expect(renderHtml("cards", values())).toBe(
      [
        '<section class="demo-block demo-cards">',
        '  <h2 class="demo-heading">제목</h2>',
        '  <ul class="demo-card-list">',
        '    <li class="demo-card">',
        '      <h3 class="demo-card-title">카드1</h3>',
        '      <p class="demo-card-desc">설명1</p>',
        "    </li>",
        '    <li class="demo-card">',
        '      <h3 class="demo-card-title">카드2</h3>',
        '      <p class="demo-card-desc">설명2</p>',
        "    </li>",
        "  </ul>",
        "</section>",
      ].join("\n"),
    );
  });

  test("renders 4 cards and ignores a 5th", () => {
    const cards: Card[] = Array.from({ length: 5 }, (_, i) => ({ title: `c${i}`, description: "d" }));
    const html = renderHtml("cards", values({ cards }));
    expect(html.match(/<li class="demo-card">/g)).toHaveLength(MAX_CARDS);
    expect(html).not.toContain("c4");
  });

  test("keeps an empty card's li but drops its empty elements", () => {
    const html = renderHtml("cards", values({ cards: [{ title: "", description: "" }, { title: "x", description: "" }] }));
    expect(html).toContain('<li class="demo-card">\n    </li>');
    expect(html.match(/demo-card-title/g)).toHaveLength(1);
  });
});

describe("clampCards", () => {
  test("pads to 2 and truncates to 4 without mutating input", () => {
    const one: Card[] = [{ title: "a", description: "b" }];
    expect(clampCards(one)).toEqual([{ title: "a", description: "b" }, { title: "", description: "" }]);
    expect(one).toHaveLength(1);

    const six: Card[] = Array.from({ length: 6 }, (_, i) => ({ title: `${i}`, description: "" }));
    expect(clampCards(six).map((c) => c.title)).toEqual(["0", "1", "2", "3"]);
    expect(six).toHaveLength(6);
    expect(clampCards([])).toHaveLength(2);
  });
});

describe("renderHtml safety and limits", () => {
  const evil = '<script>alert(1)</script></style>"x"';

  test("escapes script, closing style tags and quotes in every field", () => {
    const card = { title: evil, description: evil };
    const v = values({ title: evil, description: evil, imageAlt: evil, imageSrc: evil, cards: [card, card] });
    for (const type of ["title", "media", "cards"] as const) {
      const html = renderHtml(type, v);
      expect(html, type).not.toContain("<script");
      expect(html, type).not.toContain("</style>");
      expect(html, type).toContain("&lt;script&gt;");
    }
  });

  test("caps every field at its limit", () => {
    const long = (n: number) => "가".repeat(n + 10);
    const html = renderHtml(
      "media",
      values({ title: long(LIMITS.title), description: long(LIMITS.description), imageAlt: long(LIMITS.imageAlt) }),
    );
    expect(html).toContain(`>${"가".repeat(LIMITS.title)}<`);
    expect(html).toContain(`>${"가".repeat(LIMITS.description)}<`);
    expect(html).toContain(`alt="${"가".repeat(LIMITS.imageAlt)}"`);

    const cards = renderHtml(
      "cards",
      values({ cards: [{ title: long(LIMITS.cardTitle), description: long(LIMITS.cardDescription) }, { title: "", description: "" }] }),
    );
    expect(cards).toContain(`>${"가".repeat(LIMITS.cardTitle)}<`);
    expect(cards).toContain(`>${"가".repeat(LIMITS.cardDescription)}<`);
  });

  test("caps the image src at its limit before validating it", () => {
    const longPath = `/${"a".repeat(LIMITS.imageSrc + 20)}`;
    const html = renderHtml("media", values({ imageSrc: longPath }));
    expect(html).toContain(`src="/${"a".repeat(LIMITS.imageSrc - 1)}"`);
  });

  test("output contains only demo- classes", () => {
    for (const type of ["title", "media", "cards"] as const) {
      const classes = [...renderHtml(type, values()).matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(" "));
      expect(classes.length).toBeGreaterThan(0);
      for (const c of classes) expect(c.startsWith("demo-")).toBe(true);
    }
  });
});
