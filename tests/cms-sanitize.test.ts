import { describe, expect, test } from "vitest";
import { sanitizeInline } from "@/lib/cms/sanitize";

// 결과에 남은 "<"는 반드시 허용된 태그의 시작이어야 한다. 이스케이프 누락, 깨진 태그, 쪼개진 태그를 한 번에 잡는다.
function expectOnlyAllowedTags(out: string) {
  expect(out).not.toMatch(/<(?!\/?(em|strong|b|i)>|br>)/);
  expect(out).not.toMatch(/<script/i);
}

describe("sanitizeInline", () => {
  test("keeps allowed tags", () => {
    const input = "<em>a</em><strong>b</strong><b>c</b><i>d</i>";
    expect(sanitizeInline(input)).toBe(input);
  });

  test("normalizes br variants to <br>", () => {
    expect(sanitizeInline("a<br>b<br/>c<br />d<BR>e")).toBe("a<br>b<br>c<br>d<br>e");
  });

  test("is case-insensitive for allowed tags", () => {
    expect(sanitizeInline("<EM>x</EM><Strong>y</STRONG>")).toBe("<em>x</em><strong>y</strong>");
  });

  test("escapes tags with attributes", () => {
    const cases = [
      '<em onclick="x">y</em>',
      "<img src=x onerror=alert(1)>",
      '<a href="javascript:x">link</a>',
      '<b style="x">z</b>',
      "<br  />",
    ];
    for (const input of cases) {
      const out = sanitizeInline(input);
      expectOnlyAllowedTags(out);
      expect(out, input).toContain("&lt;");
    }
    expect(sanitizeInline('<em onclick="x">y</em>')).toBe("&lt;em onclick=&quot;x&quot;&gt;y</em>");
  });

  test("escapes script and style", () => {
    const out = sanitizeInline("<script>alert(1)</script><style>p{}</style>");
    expectOnlyAllowedTags(out);
    expect(out).toBe("&lt;script&gt;alert(1)&lt;/script&gt;&lt;style&gt;p{}&lt;/style&gt;");
  });

  test("escapes split and unclosed tags", () => {
    expect(sanitizeInline("<<em>x")).toBe("&lt;<em>x");
    expect(sanitizeInline("a <em")).toBe("a &lt;em");
    expect(sanitizeInline("a </em")).toBe("a &lt;/em");
    expect(sanitizeInline("<em>open")).toBe("<em>open");
    for (const input of ["<<em>x", "a <em", "a </em", "<<<strong>", "</>", "<>"]) {
      expectOnlyAllowedTags(sanitizeInline(input));
    }
  });

  test("escapes ampersand and quotes", () => {
    expect(sanitizeInline("&nbsp;")).toBe("&amp;nbsp;");
    expect(sanitizeInline(`"a" & 'b'`)).toBe("&quot;a&quot; &amp; &#39;b&#39;");
  });

  test("leaves plain text", () => {
    expect(sanitizeInline("제목을 입력해 보세요")).toBe("제목을 입력해 보세요");
    expect(sanitizeInline("")).toBe("");
  });

  test("never lets an event handler survive as a tag", () => {
    const out = sanitizeInline('<img src=x onerror="alert(1)"><em onmouseover=x>t</em><svg onload=x>');
    expectOnlyAllowedTags(out);
    expect(out).not.toMatch(/<[^>]*onerror=/i);
  });
});
