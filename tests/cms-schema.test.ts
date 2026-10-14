import { describe, expect, test } from "vitest";
import {
  LIMITS,
  addListItem,
  emptyItem,
  normalizeValues,
  removeListItem,
  setAt,
  type Field,
  type ListField,
  type Values,
} from "@/lib/cms/schema";

const subs: ListField = {
  kind: "list",
  key: "subs",
  label: "하위",
  itemLabel: "하위 항목",
  min: 0,
  max: 2,
  fields: [{ kind: "text", key: "t", label: "글" }],
};

const contents: ListField = {
  kind: "list",
  key: "contents",
  label: "목록",
  itemLabel: "항목",
  min: 1,
  max: 3,
  fields: [
    { kind: "text", key: "small", label: "작은 글" },
    { kind: "text", key: "big", label: "큰 글" },
    subs,
  ],
};

const fields: Field[] = [
  { kind: "text", key: "title", label: "제목" },
  { kind: "rich", key: "desc", label: "설명" },
  { kind: "image", key: "image", label: "PC 이미지" },
  {
    kind: "select",
    key: "cols",
    label: "칸 수",
    options: [
      { value: "2", label: "2칸" },
      { value: "3", label: "3칸" },
    ],
  },
  contents,
];

const item = (small: string, subTexts: string[] = []): Values => ({
  small,
  big: "",
  subs: subTexts.map((t) => ({ t })),
});

describe("normalizeValues", () => {
  test("caps text, titlePart and rich at their limits", () => {
    const out = normalizeValues(fields, {
      title: "가".repeat(500),
      desc: "나".repeat(2000),
      image: "/".padEnd(500, "a"),
      cols: "2",
      contents: [{ small: "다".repeat(200), big: "라".repeat(200), subs: [{ t: "마".repeat(500) }] }],
    });
    expect((out.title as string).length).toBe(LIMITS.text);
    expect((out.desc as string).length).toBe(LIMITS.rich);
    expect((out.image as string).length).toBe(LIMITS.image);
    const first = (out.contents as Values[])[0];
    expect((first.small as string).length).toBe(LIMITS.titlePart);
    expect((first.big as string).length).toBe(LIMITS.titlePart);
    expect(((first.subs as Values[])[0].t as string).length).toBe(LIMITS.text);
  });

  test("drops keys not in the definition", () => {
    const out = normalizeValues(fields, {
      title: "a",
      extra: "x",
      contents: [{ small: "s", big: "b", subs: [], hidden: "y" }],
    });
    expect(Object.keys(out).sort()).toEqual(["cols", "contents", "desc", "image", "title"]);
    expect(Object.keys((out.contents as Values[])[0]).sort()).toEqual(["big", "small", "subs"]);
  });

  test("fills missing strings with empty strings", () => {
    const out = normalizeValues(fields, {});
    expect(out.title).toBe("");
    expect(out.desc).toBe("");
    expect(out.image).toBe("");
    expect(out.cols).toBe("");
  });

  test("keeps a select value only when it is an option", () => {
    expect(normalizeValues(fields, { cols: "3" }).cols).toBe("3");
    expect(normalizeValues(fields, { cols: "9" }).cols).toBe("");
    expect(normalizeValues(fields, { cols: "<script>" }).cols).toBe("");
  });

  test("clamps a list to max and pads to min, including nested lists", () => {
    const many = Array.from({ length: 6 }, (_, i) => item(`s${i}`, ["a", "b", "c", "d"]));
    const out = normalizeValues(fields, { contents: many });
    const list = out.contents as Values[];
    expect(list).toHaveLength(3);
    expect(list[0].subs as Values[]).toHaveLength(2);

    const padded = normalizeValues(fields, { contents: [] });
    expect(padded.contents as Values[]).toHaveLength(1);
    expect((padded.contents as Values[])[0]).toEqual({ small: "", big: "", subs: [] });

    expect(normalizeValues(fields, {}).contents as Values[]).toHaveLength(1);
  });

  test("never exceeds the global list limits even if the definition allows more", () => {
    const wide: ListField = { ...contents, max: 100, fields: [{ ...subs, max: 100 }] };
    const out = normalizeValues(
      [wide],
      { contents: Array.from({ length: 30 }, () => ({ subs: Array.from({ length: 30 }, () => ({ t: "x" })) })) },
    );
    const list = out.contents as Values[];
    expect(list).toHaveLength(LIMITS.listItems);
    expect(list[0].subs as Values[]).toHaveLength(LIMITS.subItems);
  });

  test("treats wrong types as empty", () => {
    const out = normalizeValues(fields, {
      title: 42 as unknown as string,
      contents: "no" as unknown as Values[],
    });
    expect(out.title).toBe("");
    expect(out.contents as Values[]).toHaveLength(1);
  });

  test("does not mutate its input", () => {
    const input: Values = { title: "t", contents: [item("a", ["x", "y", "z"])] };
    const copy = structuredClone(input);
    normalizeValues(fields, input);
    expect(input).toEqual(copy);
  });
});

describe("emptyItem", () => {
  test("builds an item with empty strings and padded nested lists", () => {
    expect(emptyItem(contents)).toEqual({ small: "", big: "", subs: [] });
    const needsSub: ListField = { ...contents, fields: [{ ...subs, min: 1 }] };
    expect(emptyItem(needsSub)).toEqual({ subs: [{ t: "" }] });
  });
});

describe("setAt", () => {
  test("updates a nested path immutably", () => {
    const values: Values = { title: "t", contents: [item("a"), item("b")] };
    const next = setAt(values, ["contents", 0, "small"], "changed");
    expect(((next.contents as Values[])[0]).small).toBe("changed");
    expect(((values.contents as Values[])[0]).small).toBe("a");
    expect(next).not.toBe(values);
    expect((next.contents as Values[])[1]).toBe((values.contents as Values[])[1]);
  });

  test("updates a top-level key", () => {
    const values: Values = { title: "t" };
    expect(setAt(values, ["title"], "u")).toEqual({ title: "u" });
    expect(values.title).toBe("t");
  });

  test("returns the same object when the path does not exist", () => {
    const values: Values = { title: "t" };
    expect(setAt(values, ["contents", 3, "small"], "x")).toBe(values);
  });
});

describe("addListItem", () => {
  test("is a no-op at max", () => {
    const values: Values = { contents: [item("a"), item("b"), item("c")] };
    expect(addListItem(values, ["contents"], contents)).toBe(values);
  });

  test("adds an empty item below max", () => {
    const values: Values = { contents: [item("a")] };
    const next = addListItem(values, ["contents"], contents);
    expect(next.contents as Values[]).toHaveLength(2);
    expect((next.contents as Values[])[1]).toEqual(emptyItem(contents));
    expect(values.contents as Values[]).toHaveLength(1);
  });

  test("follows the same rule in a nested list", () => {
    const full: Values = { contents: [item("a", ["x", "y"])] };
    expect(addListItem(full, ["contents", 0, "subs"], subs)).toBe(full);
    const room: Values = { contents: [item("a", ["x"])] };
    const next = addListItem(room, ["contents", 0, "subs"], subs);
    expect(((next.contents as Values[])[0].subs as Values[])).toHaveLength(2);
  });
});

describe("removeListItem", () => {
  test("is a no-op at min", () => {
    const values: Values = { contents: [item("a")] };
    expect(removeListItem(values, ["contents"], 0, contents)).toBe(values);
  });

  test("removes below min and keeps order", () => {
    const values: Values = { contents: [item("a"), item("b"), item("c")] };
    const next = removeListItem(values, ["contents"], 1, contents);
    expect((next.contents as Values[]).map((i) => i.small)).toEqual(["a", "c"]);
    expect(values.contents as Values[]).toHaveLength(3);
  });

  test("ignores an out-of-range index", () => {
    const values: Values = { contents: [item("a"), item("b")] };
    expect(removeListItem(values, ["contents"], 5, contents)).toBe(values);
    expect(removeListItem(values, ["contents"], -1, contents)).toBe(values);
  });

  test("follows the same rule in a nested list (min 0)", () => {
    const values: Values = { contents: [item("a", ["x"])] };
    const next = removeListItem(values, ["contents", 0, "subs"], 0, subs);
    expect(((next.contents as Values[])[0].subs as Values[])).toHaveLength(0);
  });
});

describe("normalizeValues with an attached image", () => {
  const fields: Field[] = [{ kind: "image", key: "image", label: "PC 이미지" }];

  test("keeps a data URL that fits the data limit, even though it is longer than a path", () => {
    const value = `data:image/png;base64,${"A".repeat(LIMITS.image * 5)}`;
    expect(normalizeValues(fields, { image: value }).image).toBe(value);
  });

  test("drops a data URL above the data limit instead of cutting it in the middle", () => {
    const value = `data:image/png;base64,${"A".repeat(LIMITS.imageData)}`;
    expect(normalizeValues(fields, { image: value }).image).toBe("");
  });

  test("still cuts an ordinary long value at the path limit", () => {
    expect((normalizeValues(fields, { image: "/".padEnd(500, "a") }).image as string).length).toBe(LIMITS.image);
  });
});
