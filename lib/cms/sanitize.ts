import { escapeHtml } from "./html";

// 이스케이프된 허용 태그: <em> <strong> <b> <i> (여는 태그와 닫는 태그, 속성 없음).
const ALLOWED_PAIRED = /&lt;(\/?)(em|strong|b|i)&gt;/gi;
// <br>, <br/>, <br /> 만 허용한다(속성이나 다른 공백이 붙으면 글자로 남는다).
const ALLOWED_BR = /&lt;br(?: ?\/)?&gt;/gi;

// 제목과 본문에 쓰는 "허용 인라인 HTML". 먼저 전부 이스케이프한 뒤, 허용 목록의 태그만 원래대로 되돌린다.
// 되돌리는 대상이 이미 이스케이프된 문자열의 정확한 패턴뿐이라서, 허용 밖의 태그와 속성은 항상 글자로 보인다.
export function sanitizeInline(value: string): string {
  return escapeHtml(value)
    .replace(ALLOWED_PAIRED, (_, slash: string, tag: string) => `<${slash}${tag.toLowerCase()}>`)
    .replace(ALLOWED_BR, "<br>");
}
