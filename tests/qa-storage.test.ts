import { describe, expect, test } from "vitest";
import { NAME_MAX, NOTE_MAX, createSampleState, setStatus, type QaState } from "@/lib/qa/state";
import { STORAGE_KEY, parseStored, serialize } from "@/lib/qa/storage";

const sample = createSampleState();

const withPages = (pages: unknown[], version: unknown = 1) => JSON.stringify({ version, pages });
const page = (over: Record<string, unknown> = {}) => ({
  id: "a",
  name: "A",
  note: "",
  statuses: {},
  ...over,
});

describe("storage", () => {
  test("uses the versioned key", () => {
    expect(STORAGE_KEY).toBe("qa-dashboard:v1");
  });

  test("serialize then parseStored round-trips a state", () => {
    const state: QaState = setStatus(sample, "sample-main", "img-alt", "pass");
    const parsed = parseStored(serialize(state));
    expect(parsed.result).toBe("ok");
    expect(parsed.state).toEqual(state);
  });

  test("parseStored(null) returns the sample state with result empty", () => {
    expect(parseStored(null)).toEqual({ state: sample, result: "empty" });
  });

  test("parseStored rejects malformed JSON", () => {
    expect(parseStored("{")).toEqual({ state: sample, result: "invalid" });
  });

  test("parseStored rejects a different version", () => {
    expect(parseStored(withPages([page()], 2)).result).toBe("invalid");
  });

  test("parseStored rejects an unknown status value", () => {
    expect(parseStored(withPages([page({ statuses: { "img-alt": "done" } })])).result).toBe("invalid");
  });

  test("parseStored rejects duplicate page ids", () => {
    expect(parseStored(withPages([page(), page()])).result).toBe("invalid");
  });

  test("parseStored rejects more than 20 pages", () => {
    const pages = Array.from({ length: 21 }, (_, i) => page({ id: `id-${i}` }));
    expect(parseStored(withPages(pages)).result).toBe("invalid");
  });

  test("parseStored rejects a page with an empty name or non-string note", () => {
    expect(parseStored(withPages([page({ name: "" })])).result).toBe("invalid");
    expect(parseStored(withPages([page({ name: "   " })])).result).toBe("invalid");
    expect(parseStored(withPages([page({ note: 5 })])).result).toBe("invalid");
  });

  test("parseStored drops status keys that are not in CHECKLIST", () => {
    const parsed = parseStored(withPages([page({ statuses: { "img-alt": "pass", ghost: "pass" } })]));
    expect(parsed.result).toBe("ok");
    expect(parsed.state.pages[0].statuses).toEqual({ "img-alt": "pass" });
  });

  test("parseStored caps an over-long name and note instead of rejecting", () => {
    const parsed = parseStored(
      withPages([page({ name: "n".repeat(NAME_MAX + 5), note: "m".repeat(NOTE_MAX + 5) })]),
    );
    expect(parsed.result).toBe("ok");
    expect(parsed.state.pages[0].name).toBe("n".repeat(NAME_MAX));
    expect(parsed.state.pages[0].note).toBe("m".repeat(NOTE_MAX));
  });

  test("parseStored rejects non-object JSON", () => {
    for (const raw of ["[]", "42", "null", '"x"']) {
      expect(parseStored(raw).result).toBe("invalid");
    }
  });
});
