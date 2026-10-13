import { describe, expect, test } from "vitest";
import { CHECKLIST } from "@/lib/qa/checklist";
import type { ItemStatus } from "@/lib/qa/checklist";
import {
  MAX_PAGES,
  NAME_MAX,
  NOTE_MAX,
  addPage,
  createSampleState,
  getStatus,
  isPublishable,
  removePage,
  setNote,
  setStatus,
  summarize,
  type QaPage,
  type QaState,
} from "@/lib/qa/state";

const allWith = (status: ItemStatus): Record<string, ItemStatus> =>
  Object.fromEntries(CHECKLIST.map((item) => [item.id, status]));

const pageWith = (statuses: Record<string, ItemStatus>): QaPage => ({
  id: "p",
  name: "p",
  note: "",
  statuses,
});

describe("sample state", () => {
  test("createSampleState has 3 pages, all items todo, none publishable", () => {
    const state = createSampleState();
    expect(state.version).toBe(1);
    expect(state.pages.map((p) => p.id)).toEqual(["sample-main", "sample-consult", "sample-location"]);
    for (const page of state.pages) {
      for (const item of CHECKLIST) expect(getStatus(page, item.id)).toBe("todo");
      expect(isPublishable(page)).toBe(false);
    }
  });

  test("getStatus returns todo for an unknown item id", () => {
    expect(getStatus(pageWith({}), "no-such-item")).toBe("todo");
  });
});

describe("setStatus", () => {
  test("changes only the target page and item", () => {
    const before = createSampleState();
    const after = setStatus(before, "sample-consult", "img-alt", "pass");

    expect(getStatus(after.pages[1], "img-alt")).toBe("pass");
    expect(getStatus(after.pages[1], "links")).toBe("todo");
    expect(getStatus(after.pages[0], "img-alt")).toBe("todo");
    expect(getStatus(before.pages[1], "img-alt")).toBe("todo");
  });
});

describe("isPublishable", () => {
  test("true when every item is pass or na", () => {
    const statuses = allWith("pass");
    statuses["links"] = "na";
    expect(isPublishable(pageWith(statuses))).toBe(true);
  });

  test("false with one fail", () => {
    const statuses = allWith("pass");
    statuses["links"] = "fail";
    expect(isPublishable(pageWith(statuses))).toBe(false);
  });

  test("false with one todo", () => {
    const statuses = allWith("pass");
    delete statuses["links"];
    expect(isPublishable(pageWith(statuses))).toBe(false);
  });
});

describe("summarize", () => {
  test("counts total, publishable and the selected page's statuses", () => {
    let state = createSampleState();
    for (const item of CHECKLIST) state = setStatus(state, "sample-main", item.id, "pass");
    state = setStatus(state, "sample-consult", "img-alt", "fail");
    state = setStatus(state, "sample-consult", "links", "na");

    expect(summarize(state, "sample-consult")).toEqual({
      total: 3,
      publishable: 1,
      selected: { pass: 0, fail: 1, todo: CHECKLIST.length - 2, na: 1 },
    });
  });

  test("returns selected null for null or unknown id", () => {
    const state = createSampleState();
    expect(summarize(state, null).selected).toBeNull();
    expect(summarize(state, "nope").selected).toBeNull();
  });

  test("on zero pages returns total 0, publishable 0, selected null", () => {
    const empty: QaState = { version: 1, pages: [] };
    expect(summarize(empty, "x")).toEqual({ total: 0, publishable: 0, selected: null });
  });
});

describe("addPage / removePage / setNote", () => {
  test("addPage trims and caps the name at 40 chars", () => {
    const state = addPage(createSampleState(), `  ${"가".repeat(NAME_MAX + 10)}  `, "new");
    const added = state.pages[state.pages.length - 1];
    expect(added.id).toBe("new");
    expect(added.name).toBe("가".repeat(NAME_MAX));
    expect(added.statuses).toEqual({});
  });

  test("addPage rejects empty and whitespace-only names", () => {
    const state = createSampleState();
    expect(addPage(state, "", "a")).toBe(state);
    expect(addPage(state, "   ", "a")).toBe(state);
  });

  test("addPage stops at 20 pages and rejects a duplicate id", () => {
    let state: QaState = { version: 1, pages: [] };
    for (let i = 0; i < MAX_PAGES; i++) state = addPage(state, `page ${i}`, `id-${i}`);
    expect(state.pages).toHaveLength(MAX_PAGES);
    expect(addPage(state, "one more", "id-new")).toBe(state);

    const small = createSampleState();
    expect(addPage(small, "dup", "sample-main")).toBe(small);
  });

  test("setNote caps the note at 200 chars", () => {
    const state = setNote(createSampleState(), "sample-main", "a".repeat(NOTE_MAX + 50));
    expect(state.pages[0].note).toBe("a".repeat(NOTE_MAX));
  });

  test("removePage removes only the target page", () => {
    const state = removePage(createSampleState(), "sample-consult");
    expect(state.pages.map((p) => p.id)).toEqual(["sample-main", "sample-location"]);
  });
});
