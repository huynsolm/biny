import { describe, expect, test } from "vitest";
import { renderHtml } from "@/lib/cms/format";
import { CMS_TYPES, getType } from "@/lib/cms/registry";
import { normalizeValues } from "@/lib/cms/schema";

// 레지스트리 전체를 돌며 검사하는 일반 테스트다. 타입이 늘어도 자동으로 적용된다.
// 원본 마크업으로 바꾼 타입의 id. 작업마다 늘리고, 마지막 작업에서 모든 타입이 들어 있는지 확인한다.
export const CONVERTED = new Set<string>(["type01", "type02", "type03", "type04", "type05", "type06", "type07", "type09", "type10", "type11", "type12", "type13", "type14", "type15"]);

describe("registry", () => {
  test("ids and numbers are unique and ordered", () => {
    const ids = CMS_TYPES.map((t) => t.id);
    const numbers = CMS_TYPES.map((t) => t.number);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(numbers).toEqual([...numbers].sort((a, b) => Number(a) - Number(b)));
    for (const type of CMS_TYPES) {
      expect(type.id).toBe(`type${type.number}`);
      expect(type.number).toMatch(/^\d{2}$/);
      expect(type.label.startsWith(`타입 ${type.number} · `)).toBe(true);
    }
  });

  test("never contains type 08", () => {
    expect(CMS_TYPES.map((t) => t.number)).not.toContain("08");
    expect(getType("type08")).toBeUndefined();
  });

  test("getType finds a type by id", () => {
    expect(getType("type01")?.number).toBe("01");
    expect(getType("nope")).toBeUndefined();
  });

  test("every type's defaults survive normalizeValues unchanged", () => {
    for (const type of CMS_TYPES) {
      expect(normalizeValues(type.fields, type.defaults), type.id).toEqual(type.defaults);
    }
  });

  test("every type renders without throwing with defaults", () => {
    for (const type of CMS_TYPES) {
      expect(() => renderHtml(type, type.defaults), type.id).not.toThrow();
      expect(renderHtml(type, type.defaults).length, type.id).toBeGreaterThan(0);
    }
  });

  test("rendered defaults of every type are clean, and converted types use the original markup", () => {
    for (const type of CMS_TYPES) {
      const html = renderHtml(type, type.defaults);
      expect(html, type.id).not.toContain("fxfile");
      expect(html, type.id).not.toContain("://");
      expect(html.toLowerCase(), type.id).not.toContain("<script");
      expect(html, type.id).not.toContain("<link");
      expect(html.startsWith("<section"), type.id).toBe(true);
      if (!CONVERTED.has(type.id)) continue;
      expect(html.startsWith(`<section class="cms ${type.id}`), type.id).toBe(true);
      expect(html, type.id).not.toContain("demo-");
    }
  });

  test("every converted type scopes its css to its own type class and uses no demo- names", () => {
    for (const type of CMS_TYPES) {
      if (!CONVERTED.has(type.id)) continue;
      expect(type.css, type.id).toContain(`.${type.id}`);
      expect(type.css, type.id).not.toContain("demo-");
    }
  });

  test("rendering twice gives the same source", () => {
    for (const type of CMS_TYPES) {
      expect(renderHtml(type, type.defaults)).toBe(renderHtml(type, type.defaults));
    }
  });
});
