export const DEFAULT_IMAGE_SRC = "/images/cms-sample.svg";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// 입력값이 마크업으로 해석되지 않게 한다. 한 번의 치환으로 처리하므로 이미 바꾼 문자를 다시 바꾸지 않는다.
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

// 공백, 백슬래시, 제어문자가 있으면 브라우저가 주소를 다르게 해석할 수 있어서 모두 거부한다.
const UNSAFE_CHARS = /[\s\\\u0000-\u001f\u007f]/;

// 이 사이트 안의 경로(/로 시작, //는 제외)나 https 주소만 허용한다. 그 밖의 값은 기본 이미지로 바꾼다.
export function safeImageSrc(value: string): string {
  const src = value.trim();
  if (UNSAFE_CHARS.test(src)) return DEFAULT_IMAGE_SRC;
  const isLocalPath = src.startsWith("/") && !src.startsWith("//");
  const isHttps = src.startsWith("https://") && src.length > "https://".length;
  return isLocalPath || isHttps ? src : DEFAULT_IMAGE_SRC;
}
