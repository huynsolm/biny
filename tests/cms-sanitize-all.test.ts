import { describe, expect, test } from "vitest";
import { renderHtml } from "@/lib/cms/format";
import { CMS_TYPES } from "@/lib/cms/registry";
import type { Field, Values } from "@/lib/cms/schema";

// 모든 타입의 모든 rich 필드(목록 안 포함)에 공격 입력을 넣어도 실행 가능한 HTML이 나오지 않는지 훑는다.
const PAYLOAD = '<em>ok</em><script>alert(1)</script><img src=x onerror=alert(1)><b onclick="x">t</b>';

function attack(fields: Field[], base: Values): Values {
  const out: Values = { ...base };
  for (const field of fields) {
    if (field.kind === "rich") out[field.key] = PAYLOAD;
    else if (field.kind === "list" && Array.isArray(base[field.key])) {
      out[field.key] = (base[field.key] as Values[]).map((item) => attack(field.fields, item));
    }
  }
  return out;
}

const hasRich = (fields: Field[]): boolean =>
  fields.some((f) => f.kind === "rich" || (f.kind === "list" && hasRich(f.fields)));

describe("every rich field", () => {
  test("keeps only the allowed inline tags in every type", () => {
    for (const type of CMS_TYPES) {
      const html = renderHtml(type, attack(type.fields, type.defaults));
      expect(html.toLowerCase(), type.id).not.toContain("<script");
      expect(html, type.id).not.toMatch(/<img[^>]*onerror/i);
      expect(html, type.id).not.toMatch(/<[a-z][^>]*\sonclick=/i);
      if (hasRich(type.fields)) expect(html, type.id).toContain("<em>ok</em>");
    }
  });
});
